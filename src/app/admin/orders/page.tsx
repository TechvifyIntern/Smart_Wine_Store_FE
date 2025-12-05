"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Download, ClipboardList, Filter } from "lucide-react";
import ordersRepository, { Order } from "@/api/ordersRepository";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/discount-events/PageHeader";
import Pagination from "@/components/admin/pagination/Pagination";
import { useLocale } from "@/contexts/LocaleContext";
import { Spinner } from "@/components/ui/spinner";
import { createPdfWithVietnameseText, downloadPdf } from "@/utils/pdf-utils";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all"); // all, pending, done
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersRepository.getOrders();
      if (response.success && response.data) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status text from StatusID
  const getStatusText = (statusID: number): string => {
    const statusMap: Record<number, string> = {
      1: t("admin.orders.status.pending"),
      2: t("admin.orders.status.paid"),
      3: t("admin.orders.status.shipped"),
      4: t("admin.orders.status.completed"),
      5: t("admin.orders.status.cancelled"),
      6: t("admin.orders.status.failed"),
    };
    return statusMap[statusID] || t("admin.orders.status.pending");
  };

  // Helper function to get payment method text
  const getPaymentMethodText = (paymentMethodID: number): string => {
    const paymentMap: Record<number, string> = {
      1: "COD",
      2: "VNPay",
    };
    return paymentMap[paymentMethodID] || "N/A";
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

  const filteredOrders = orders.filter((order) => {
    const statusText = getStatusText(order.StatusID);
    const address = getFormattedAddress(order);

    // Apply status filter
    if (statusFilter === "pending" && order.StatusID !== 1) {
      return false;
    }
    if (statusFilter === "done" && order.StatusID !== 4) {
      // 4 = Delivered
      return false;
    }

    // Apply search filter
    return (
      order.OrderID.toString().includes(searchTerm) ||
      statusText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(currentOrders.map((order) => order.OrderID));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleRowClick = (orderId: number, e: React.MouseEvent) => {
    // Prevent navigation if clicking on checkbox
    if ((e.target as HTMLElement).closest("[data-checkbox]")) {
      return;
    }
    // Use window.location for clean navigation without RSC params
    window.location.href = `/admin/orders/${orderId}`;
  };

  const handleExportPDFs = async () => {
    const ordersToExport =
      selectedOrders.length > 0 ? selectedOrders : orders.map((o) => o.OrderID);

    for (const orderId of ordersToExport) {
      const order = orders.find((o) => o.OrderID === orderId);
      if (order) {
        try {
          const pdfBytes = await createPdfWithVietnameseText(order);
          downloadPdf(pdfBytes, `invoice-${order.OrderID}.pdf`);
        } catch (error) {
          console.error(`Error generating PDF for order ${orderId}:`, error);
        }
      }
    }
  };

  const getStatusColor = (statusID: number) => {
    const statusMap: Record<number, string> = {
      1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", // Pending
      2: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", // Paid
      3: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", // Shipped
      4: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", // Completed
      5: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", // Cancelled
      6: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", // Failed
    };
    return (
      statusMap[statusID] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("admin.orders.title")}
        icon={ClipboardList}
        iconColor="text-black"
      />

      {/* Toolbar with Search and Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={t("admin.orders.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`${statusFilter !== "all"
                  ? "bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white border-[#ad8d5e]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${statusFilter === "all"
                    ? "bg-[#ad8d5e] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {t("admin.orders.filterStatus.all") || "All Status"}
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("pending");
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${statusFilter === "pending"
                    ? "bg-[#ad8d5e] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {t("admin.orders.filterStatus.pending") || "Pending"}
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("done");
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${statusFilter === "done"
                    ? "bg-[#ad8d5e] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {t("admin.orders.filterStatus.done") || "Done (Delivered)"}
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleExportPDFs}
            className="dark:bg-[#7C653E] flex items-center justify-center gap-2 h-10 px-4 py-2 text-white font-medium rounded-full"
          >
            <Download className="w-4 h-4" />
            {t("admin.orders.exportButton")}
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <Checkbox
                    checked={
                      selectedOrders.length === currentOrders.length &&
                      currentOrders.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    data-checkbox
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("admin.orders.tableHeaders.orderId")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("admin.orders.tableHeaders.customerId")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("admin.orders.tableHeaders.totalAmount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("admin.orders.tableHeaders.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("admin.orders.tableHeaders.createdAt")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchTerm
                      ? t("admin.orders.noOrdersSearch")
                      : t("admin.orders.noOrders")}
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr
                    key={order.OrderID}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={(e) => handleRowClick(order.OrderID, e)}
                    title={t("admin.orders.clickToViewDetails")}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" data-checkbox>
                      <Checkbox
                        checked={selectedOrders.includes(order.OrderID)}
                        onCheckedChange={(checked) =>
                          handleSelectOrder(order.OrderID, checked as boolean)
                        }
                        data-checkbox
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.OrderID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.UserID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      {order.FinalTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.StatusID
                        )}`}
                      >
                        {getStatusText(order.StatusID)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.CreatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
