"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DiscountOrder } from "@/data/discount_order";
import discountOrdersRepository from "@/api/discountOrdersRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import {
  ShoppingCart,
  DollarSign,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { CreateDiscountOrder } from "@/components/discount-orders/(modal)/CreateDiscountOrder";
import { DeleteConfirmDialog } from "@/components/discount-orders/(modal)/DeleteConfirmDialog";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [discountOrder, setDiscountOrder] = useState<DiscountOrder | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch discount order from API
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const response = await discountOrdersRepository.getDiscountOrders();
        if (response.success && response.data) {
          const foundOrder = (response.data as unknown as any[]).find(
            (o: any) => o.DiscountOrderID === id
          );
          setDiscountOrder(foundOrder || null);
        }
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("Failed to load order data");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (!discountOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Discount Order Not Found
          </h2>
          <p className="text-gray-600">
            The requested discount order could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Mock usage statistics (in real app, this would come from API)
  const usageStats = {
    totalUsage: Math.floor(Math.random() * 1000) + 100,
    ordersPlaced: Math.floor(Math.random() * 500) + 50,
    averageOrderValue: discountOrder.MinimumOrderValue * 1.5,
    totalSavings:
      discountOrder.MinimumOrderValue *
      0.15 *
      (Math.floor(Math.random() * 500) + 50),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDiscountColor = (discount: number) => {
    if (discount >= 25) return "text-pink-500 bg-pink-100 border-pink-200";
    if (discount >= 20)
      return "text-purple-500 bg-purple-100 border-purple-200";
    if (discount >= 10) return "text-blue-500 bg-blue-100 border-blue-200";
    return "text-cyan-500 bg-cyan-100 border-cyan-200";
  };

  const handleBack = () => {
    router.push("/admin/discounts/orders");
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
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
        toast.success(`Order discount updated successfully!`);
        // Reload the order data
        const reloadResponse =
          await discountOrdersRepository.getDiscountOrders();
        if (reloadResponse.success && reloadResponse.data) {
          const foundOrder = (reloadResponse.data as unknown as any[]).find(
            (o: any) => o.DiscountOrderID === id
          );
          setDiscountOrder(foundOrder || null);
        }
        setIsEditModalOpen(false);
      } else {
        toast.error(response.message || "Failed to update order discount");
      }
    } catch (error) {
      console.error("Error updating order discount:", error);
      toast.error("An error occurred while updating the order discount");
    }
  };

  const handleConfirmDelete = () => {
    if (!discountOrder) return;
    // TODO: Implement DELETE API call
    toast.success(`Order discount deleted successfully!`);
    setIsDeleteDialogOpen(false);
    router.push("/admin/discounts/orders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <PageHeader
              title="Discount Order Details"
              icon={ShoppingCart}
              iconColor="text-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Edit2 className="w-4 h-4" />
              <span className="font-medium">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Delete</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
                  <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    Order Discount #{discountOrder.DiscountOrderID}
                  </h1>
                  <div
                    className={`px-6 py-2 rounded-full border ${getDiscountColor(discountOrder.DiscountValue)} shadow-lg`}
                  >
                    <span className="text-2xl font-bold">
                      {discountOrder.DiscountValue}% OFF
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90 mb-4">
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Minimum Order Value
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(discountOrder.MinimumOrderValue)}
                    </p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Usage</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {usageStats.totalUsage.toLocaleString()} times
                    </p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Last Updated</span>
                    </div>
                    <p className="text-lg font-medium">
                      {formatDate(discountOrder.UpdatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Order Modal */}
        <CreateDiscountOrder
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mode="edit"
          order={discountOrder}
          onUpdate={handleUpdateOrder}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          order={discountOrder}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
