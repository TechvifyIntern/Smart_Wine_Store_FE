"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DiscountEvent } from "@/data/discount_event";
import discountEventsRepository from "@/api/discountEventsRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import EventsTable from "@/components/discount-events/EventsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import EventsToolbar from "@/components/discount-events/EventsToolbar";
import { CreateDiscountEvent } from "@/components/discount-events/(modal)/CreateDiscountEvent";
import { DeleteConfirmDialog } from "@/components/discount-events/(modal)/DeleteConfirmDialog";
import { toast } from "sonner";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<DiscountEvent | null>(null);
    const [selectedEventStatus, setSelectedEventStatus] = useState<string>("");
    const [eventToDelete, setEventToDelete] = useState<DiscountEvent | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [discountEvents, setDiscountEvents] = useState<DiscountEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch discount events from API
    const loadDiscountEvents = async () => {
        try {
            setIsLoading(true);
            const response = await discountEventsRepository.getDiscountEvents();
            if (response.success && response.data) {
                console.log('Loaded discount events:', response.data);
                setDiscountEvents(response.data as any);
            } else {
                console.error('Failed to load discount events:', response.message);
            }
        } catch (err) {
            console.error('Error loading discount events:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDiscountEvents();
    }, []);

    // Reload data when page becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadDiscountEvents();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Get status based on dates
    const getEventStatus = (timeStart: string, timeEnd: string) => {
        const now = new Date();
        const start = new Date(timeStart);
        const end = new Date(timeEnd);

        if (now < start) return "Scheduled";
        if (now > end) return "Expired";
        return "Active";
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Filter events based on search term and filters
    const filteredEvents = useMemo(() => {
        console.log('Filtering events. Total events:', discountEvents.length);
        console.log('Search term:', searchTerm);
        console.log('Selected statuses:', selectedStatuses);
        console.log('Date range:', { dateFrom, dateTo });

        let events = discountEvents;

        // Search filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            events = events.filter((event) =>
                event.EventName.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // Status filter
        if (selectedStatuses.length > 0) {
            events = events.filter((event) => {
                const status = getEventStatus(event.TimeStart, event.TimeEnd);
                const statusId = status === "Active" ? 1 : status === "Scheduled" ? 2 : 3;
                return selectedStatuses.includes(statusId);
            });
        }

        // Date range filter (on TimeStart)
        if (dateFrom || dateTo) {
            events = events.filter((event) => {
                const eventDate = new Date(event.TimeStart);
                const fromDate = dateFrom ? new Date(dateFrom) : null;
                const toDate = dateTo ? new Date(dateTo + "T23:59:59") : null; // Include end of day

                if (fromDate && eventDate < fromDate) return false;
                if (toDate && eventDate > toDate) return false;
                return true;
            });
        }

        console.log('Filtered events:', events.length);
        return events;
    }, [searchTerm, selectedStatuses, dateFrom, dateTo, discountEvents]);

    // Handler for applying filters
    const handleApplyFilters = (filters: { statuses: number[]; dateFrom: string; dateTo: string }) => {
        setSelectedStatuses(filters.statuses);
        setDateFrom(filters.dateFrom);
        setDateTo(filters.dateTo);
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, endIndex);

    // Action handlers
    const handleView = (id: number) => {
        console.log("View event:", id);
        // TODO: Implement view logic
    };

    const handleEdit = (id: number) => {
        const event = discountEvents.find((e) => e.DiscountEventID === id);
        if (event) {
            const status = getEventStatus(event.TimeStart, event.TimeEnd);

            // Only allow edit for Scheduled and Active events
            if (status === "Expired") {
                alert("Cannot edit expired events!");
                return;
            }

            setSelectedEvent(event);
            setSelectedEventStatus(status);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        const event = discountEvents.find((e) => e.DiscountEventID === id);
        if (event) {
            const status = getEventStatus(event.TimeStart, event.TimeEnd);

            // Prevent deletion of Active events
            if (status === "Active") {
                alert("Cannot delete active events! Please wait until the event expires or edit the end date.");
                return;
            }

            // Prevent deletion of Expired events
            if (status === "Expired") {
                alert("Cannot delete expired events!");
                return;
            }

            // Only Scheduled events can be deleted - show confirmation dialog
            if (status === "Scheduled") {
                setEventToDelete(event);
                setIsDeleteDialogOpen(true);
            }
        }
    };

    const handleConfirmDelete = () => {
        if (eventToDelete) {
            console.log("Delete event:", eventToDelete.DiscountEventID);
            // TODO: Implement API call to delete event
            // Example:
            // await fetch(`/api/discount-events/${eventToDelete.DiscountEventID}`, {
            //   method: 'DELETE',
            // });

            alert(`Event "${eventToDelete.EventName}" deleted successfully!`);
            setIsDeleteDialogOpen(false);
            setEventToDelete(null);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const handleCreateEvent = async (data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">) => {
        try {
            const response = await discountEventsRepository.createDiscountEvent({
                EventName: data.EventName,
                DiscountPercentage: data.DiscountValue ?? 0,
                StartDate: data.TimeStart,
                EndDate: data.TimeEnd,
                Description: data.Description,
                isActive: true
            });

            if (response.success) {
                toast.success("Event created successfully!");
                // Reload the list to show the new event
                await loadDiscountEvents();
            } else {
                toast.error(response.message || "Failed to create event");
            }
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error("An error occurred while creating the event");
        }
    };

    const handleUpdateEvent = async (id: number, data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">) => {
        console.log(`Updating event ${id}:`, data);
        // TODO: Implement API call to update event
        // Example:
        // await fetch(`/api/discount-events/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert(`Event ${id} updated successfully!`);
    };

    return (
        <div>
            <PageHeader
                title="Discount Events"
                icon={Calendar}
                iconColor="text-black"
            />

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading discount events...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Toolbar with Search and Create Button */}
                    <EventsToolbar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        searchPlaceholder="Search by event name..."
                        onCreateEvent={handleCreateEvent}
                        createButtonLabel="Create Event"
                        selectedStatuses={selectedStatuses}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onApplyFilters={handleApplyFilters}
                    />

                    {/* Events Table */}
                    <EventsTable
                        events={currentEvents}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getEventStatus={getEventStatus}
                        formatDate={formatDate}
                        emptyMessage={searchTerm ? `No events found matching "${searchTerm}"` : "No events found"}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredEvents.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </>
            )}

            {/* Edit Event Modal */}
            <CreateDiscountEvent
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                mode="edit"
                event={selectedEvent}
                eventStatus={selectedEventStatus}
                onUpdate={handleUpdateEvent}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                event={eventToDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
