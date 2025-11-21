"use client";

import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { discountOrders, DiscountOrder } from "@/data/discount_order";
import PageHeader from "@/components/discounts/PageHeader";
import OrdersTable from "@/components/discount-orders/OrdersTable";
import Pagination from "@/components/admin/pagination/Pagination";
import OrdersToolbar from "@/components/discount-orders/OrdersToolbar";
import { CreateDiscountOrder } from "@/components/discount-orders/(modal)/CreateDiscountOrder";
import { DeleteConfirmDialog } from "@/components/discount-orders/(modal)/DeleteConfirmDialog";

export default function DiscountOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<DiscountOrder | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<DiscountOrder | null>(null);

    // Format date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Format currency (VND)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    // Filter orders based on search term (by discount value or minimum order value)
    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) {
            return discountOrders;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        // TODO: Replace with API call when ready
        // Example:
        // const response = await fetch(`/api/discount-orders/search?q=${encodeURIComponent(searchTerm)}`);
        // return await response.json();

        return discountOrders.filter((order) => {
            const discountStr = order.DiscountValue.toString();
            const minValueStr = order.MinimumOrderValue.toString();
            return discountStr.includes(lowerSearchTerm) || minValueStr.includes(lowerSearchTerm);
        });
    }, [searchTerm]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    // Action handlers
    const handleView = (id: number) => {
        console.log("View order:", id);
        // TODO: Implement view logic
    };

    const handleEdit = (id: number) => {
        const order = discountOrders.find((o) => o.DiscountOrderID === id);
        if (order) {
            setSelectedOrder(order);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        const order = discountOrders.find((o) => o.DiscountOrderID === id);
        if (order) {
            setOrderToDelete(order);
            setIsDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (orderToDelete) {
            console.log("Delete order:", orderToDelete.DiscountOrderID);
            // TODO: Implement API call to delete order discount
            // Example:
            // await fetch(`/api/discount-orders/${orderToDelete.DiscountOrderID}`, {
            //   method: 'DELETE',
            // });

            alert(`Order discount ${orderToDelete.DiscountValue}% deleted successfully!`);
            setIsDeleteDialogOpen(false);
            setOrderToDelete(null);
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

    const handleCreateOrder = async (data: Omit<DiscountOrder, "DiscountOrderID">) => {
        console.log("Creating new order discount:", data);
        // TODO: Implement API call to create order discount
        // Example:
        // await fetch('/api/discount-orders', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert("Order discount created successfully!");
    };

    const handleUpdateOrder = async (id: number, data: Omit<DiscountOrder, "DiscountOrderID">) => {
        console.log(`Updating order discount ${id}:`, data);
        // TODO: Implement API call to update order discount
        // Example:
        // await fetch(`/api/discount-orders/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert(`Order discount ${id} updated successfully!`);
    };

    return (
        <div>
            <PageHeader
                title="Discount Orders"
                icon={ShoppingCart}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            <OrdersToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by discount or minimum order value..."
                onCreateOrder={handleCreateOrder}
                createButtonLabel="Create Order Discount"
            />

            {/* Orders Table */}
            <OrdersTable
                orders={currentOrders}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                emptyMessage={searchTerm ? `No order discounts found matching "${searchTerm}"` : "No order discounts found"}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Edit Order Modal */}
            <CreateDiscountOrder
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                mode="edit"
                order={selectedOrder}
                onUpdate={handleUpdateOrder}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                order={orderToDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
