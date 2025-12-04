"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { DiscountOrder } from "@/data/discount_order";
import discountOrdersRepository from "@/api/discountOrdersRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import OrdersTable from "@/components/discount-orders/OrdersTable";
import Pagination from "@/components/admin/pagination/Pagination";
import OrdersToolbar from "@/components/discount-orders/OrdersToolbar";
import { CreateDiscountOrder } from "@/components/discount-orders/(modal)/CreateDiscountOrder";
import { DeleteConfirmDialog } from "@/components/discount-orders/(modal)/DeleteConfirmDialog";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function DiscountOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DiscountOrder | null>(
    null
  );
  const [orderToDelete, setOrderToDelete] = useState<DiscountOrder | null>(
    null
  );
  const [discountOrders, setDiscountOrders] = useState<DiscountOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch discount orders from API
  const loadDiscountOrders = async () => {
    try {
      setIsLoading(true);
      const response = await discountOrdersRepository.getDiscountOrders();
      if (response.success && response.data) {
        setDiscountOrders(response.data as any);
      } else {
        console.error("Failed to load discount orders:", response.message);
      }
    } catch (err) {
      console.error("Error loading discount orders:", err);
      toast({
        title: "Loading failed",
        description: "Failed to load discount orders",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiscountOrders();
  }, []);

  // Reload data when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDiscountOrders();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
      const minValueStr = order.MinimumOrderValue
        ? order.MinimumOrderValue.toString()
        : "";
      return (
        discountStr.includes(lowerSearchTerm) ||
        minValueStr.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, discountOrders]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Action handlers
  const handleView = (id: number) => {
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
      // TODO: Implement API call to delete order discount
      // Example:
      // await fetch(`/api/discount-orders/${orderToDelete.DiscountOrderID}`, {
      //   method: 'DELETE',
      // });

      alert(
        `Order discount ${orderToDelete.DiscountValue}% deleted successfully!`
      );
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

  const handleCreateOrder = async (
    data: Omit<DiscountOrder, "DiscountOrderID">
  ) => {
    try {
      const response = await discountOrdersRepository.createDiscountOrder({
        DiscountValue: data.DiscountValue || 0,
        MinimumOrderValue: data.MinimumOrderValue || 0,
      });

      if (response.success) {
        toast({
          title: "Order created",
          description: "Order discount created successfully!",
        });
        await loadDiscountOrders();
      } else {
        toast({
          title: "Create failed",
          description: "Failed to create order discount",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating order discount:", error);
      toast({
        title: "Create failed",
        description: "An error occurred while creating the order discount",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async (
    id: number,
    data: Omit<DiscountOrder, "DiscountOrderID">
  ) => {
    try {
      const response = await discountOrdersRepository.updateDiscountOrder(id, {
        DiscountValue: data.DiscountValue,
        MinimumOrderValue: data.MinimumOrderValue,
      });

      if (response.success) {
        toast({
          title: "Order updated",
          description: "Order discount updated successfully!",
        });
        await loadDiscountOrders();
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update order discount",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order discount:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the order discount",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Discount Orders"
        icon={ShoppingCart}
        iconColor="text-black"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
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
            emptyMessage={
              searchTerm
                ? `No order discounts found matching "${searchTerm}"`
                : "No order discounts found"
            }
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
        </>
      )}

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
