"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { discountEvents, DiscountEvent } from "@/data/discount_event";
import PageHeader from "@/components/discounts/PageHeader";
import EventsTable from "@/components/discounts/EventsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import EventsToolbar from "@/components/discounts/EventsToolbar";
import { CreateDiscountEvent } from "@/components/discounts/(modal)/CreateDiscountEvent";
import { DeleteConfirmDialog } from "@/components/discounts/(modal)/DeleteConfirmDialog";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<DiscountEvent | null>(null);
    const [selectedEventStatus, setSelectedEventStatus] = useState<string>("");
    const [eventToDelete, setEventToDelete] = useState<DiscountEvent | null>(null);

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

    // Filter events based on search term (EventName only)
    const filteredEvents = useMemo(() => {
        if (!searchTerm.trim()) {
            return discountEvents;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        // TODO: Replace with API call when ready
        // Example:
        // const response = await fetch(`/api/discount-events/search?name=${encodeURIComponent(searchTerm)}`);
        // return await response.json();

        return discountEvents.filter((event) =>
            event.EventName.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm]);

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
        console.log("Creating new event:", data);
        // TODO: Implement API call to create event
        // Example:
        // await fetch('/api/discount-events', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert("Event created successfully!");
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

            {/* Toolbar with Search and Create Button */}
            <EventsToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by event name..."
                onCreateEvent={handleCreateEvent}
                createButtonLabel="Create Event"
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
