"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Download } from "lucide-react";
import ordersRepository, { Order } from "@/api/ordersRepository";
import { useAppStore } from "@/store/auth";
import { Spinner } from "@/components/ui/spinner";
import { getOrderPermissions } from "@/lib/permissions";
import jsPDF from "jspdf";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAppStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const permissions = getOrderPermissions(user?.roleId);
    const orderId = parseInt(params.id as string);

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ordersRepository.getOrderById(orderId);
            if (response.success) {
                setOrder(response.data);
            } else {
                console.error("Failed to fetch order:", response.message);
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            alert("Failed to load order");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        // Always fetch order, don't check permissions first
        // This allows the page to load even if user state is delayed
        fetchOrder();
    }, [fetchOrder]);

    // Helper function to get status text from StatusID
    const getStatusText = (statusID: number): string => {
        const statusMap: Record<number, string> = {
            1: "pending",
            2: "processing",
            3: "shipped",
            4: "delivered",
            5: "cancelled",
        };
        return statusMap[statusID] || "unknown";
    };

    // Helper function to get status ID from status text
    const getStatusId = (statusText: string): number => {
        const statusMap: Record<string, number> = {
            pending: 1,
            processing: 2,
            shipped: 3,
            delivered: 4,
            cancelled: 5,
        };
        return statusMap[statusText] || 1;
    };

    // Helper function to format address
    const getFormattedAddress = (order: Order): string => {
        const parts = [
            order.OrderStreetAddress,
            order.OrderWard,
            order.OrderProvince,
        ].filter(Boolean);
        return parts.join(", ");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!order || !permissions.canEdit) return;

        try {
            setSaving(true);
            const formData = new FormData(e.currentTarget);

            await ordersRepository.updateOrder(orderId, {
                StatusID: getStatusId(formData.get("Status") as string),
            });

            alert("Order updated successfully!");
            router.push("/admin/orders");
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Failed to update order");
        } finally {
            setSaving(false);
        }
    };

    const handleExportPDF = () => {
        if (!order) return;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text(`Order Invoice #${order.OrderID}`, 20, 30);

        // Order Information
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.OrderID}`, 20, 50);
        doc.text(`Customer ID: ${order.UserID}`, 20, 60);
        doc.text(`Customer Name: ${order.UserName || "N/A"}`, 20, 70);
        doc.text(`Email: ${order.Email || "N/A"}`, 20, 80);
        doc.text(`Status: ${getStatusText(order.StatusID)}`, 20, 90);
        doc.text(
            `Order Date: ${new Date(order.CreatedAt).toLocaleDateString()}`,
            20,
            100
        );
        doc.text(`Total Amount: $${order.FinalTotal.toFixed(2)}`, 20, 110);

        // Shipping Address
        doc.text("Shipping Address:", 20, 130);
        const address = getFormattedAddress(order);
        const addressLines = doc.splitTextToSize(address, 170);
        doc.text(addressLines, 20, 140);

        // Order Items
        let yPosition = 160;
        doc.text("Order Items:", 20, yPosition);
        yPosition += 10;

        if (order.Details && order.Details.length > 0) {
            order.Details.forEach((detail, index) => {
                if (yPosition > 270) {
                    // Check if we need a new page
                    doc.addPage();
                    yPosition = 30;
                }

                doc.text(`${index + 1}. ${detail.ProductName}`, 20, yPosition);
                doc.text(
                    `Quantity: ${detail.Quantity} × $${detail.UnitPrice.toFixed(2)} = $${detail.FinalItemPrice.toFixed(2)}`,
                    30,
                    yPosition + 8
                );
                yPosition += 20;
            });
        }

        // Save the PDF
        doc.save(`order-${order.OrderID}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Order not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/admin/orders")}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Order Details #{order.OrderID}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            View and manage order information
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => handleExportPDF()}
                    className="flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </Button>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order ID */}
                        <div>
                            <Label>Order ID</Label>
                            <Input value={order.OrderID} disabled className="mt-2" />
                        </div>

                        {/* Customer ID */}
                        <div>
                            <Label>Customer ID</Label>
                            <Input value={order.UserID} disabled className="mt-2" />
                        </div>

                        {/* Total Amount */}
                        <div>
                            <Label>Total Amount</Label>
                            <Input
                                value={`$${order.FinalTotal.toFixed(2)}`}
                                disabled
                                className="mt-2"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="Status">Status</Label>
                            <select
                                id="Status"
                                name="Status"
                                defaultValue={getStatusText(order.StatusID)}
                                disabled={!permissions.canEdit}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <Label>Payment Method</Label>
                            <Input value="N/A" disabled className="mt-2" />
                        </div>

                        {/* Created At */}
                        <div>
                            <Label>Created At</Label>
                            <Input
                                value={new Date(order.CreatedAt).toLocaleString()}
                                disabled
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Customer Name</Label>
                            <Input
                                value={order.UserName || "N/A"}
                                disabled
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input value={order.Email || "N/A"} disabled className="mt-2" />
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <Label>Shipping Address</Label>
                        <textarea
                            value={getFormattedAddress(order)}
                            disabled
                            rows={3}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    {/* Order Details */}
                    {order.Details && order.Details.length > 0 && (
                        <div>
                            <Label>Order Items</Label>
                            <div className="mt-2 space-y-2">
                                {order.Details.map((detail, index) => (
                                    <div
                                        key={detail.DetailID}
                                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{detail.ProductName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Quantity: {detail.Quantity} × $
                                                    {detail.UnitPrice.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                ${detail.FinalItemPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {permissions.canEdit && (
                    <div className="flex gap-4">
                        <Button type="submit" disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/orders")}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
