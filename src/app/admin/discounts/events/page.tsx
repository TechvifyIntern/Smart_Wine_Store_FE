"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { discountEvents } from "@/data/discount_event";
import PageHeader from "@/components/discounts/PageHeader";
import SearchBar from "@/components/discounts/SearchBar";
import EventsTable from "@/components/discounts/EventsTable";
import Pagination from "@/components/discounts/Pagination";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    // Filter events based on search term
    const filteredEvents = useMemo(() => {
        return discountEvents.filter(
            (event) =>
                event.EventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.Description.toLowerCase().includes(searchTerm.toLowerCase())
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
        console.log("Edit event:", id);
        // TODO: Implement edit logic
    };

    const handleDelete = (id: number) => {
        console.log("Delete event:", id);
        // TODO: Implement delete logic
    };

    const handleCreate = () => {
        console.log("Create new event");
        // TODO: Implement create logic
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <div>
            <PageHeader
                title="Discount Events"
                icon={Calendar}
                iconColor="text-blue-600"
            />

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onCreateClick={handleCreate}
                placeholder="Search events by event name..."
                createButtonText="Create Event"
            />

            {/* Events Table */}
            <EventsTable
                events={currentEvents}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getEventStatus={getEventStatus}
                formatDate={formatDate}
                emptyMessage="No events found"
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
        </div>
    );
}
