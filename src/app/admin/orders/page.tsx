"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Download, ClipboardList, Filter } from "lucide-react";
import ordersRepository, { Order } from "@/api/ordersRepository";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import PageHeader from "@/components/discount-events/PageHeader";
import Pagination from "@/components/admin/pagination/Pagination";
import { useLocale } from "@/contexts/LocaleContext";
import { Spinner } from "@/components/ui/spinner";

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
      2: t("admin.orders.status.processing"),
      3: t("admin.orders.status.shipped"),
      4: t("admin.orders.status.delivered"),
      5: t("admin.orders.status.cancelled"),
    };
    return statusMap[statusID] || t("admin.orders.status.pending");
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

  const handleExportPDFs = () => {
    const ordersToExport =
      selectedOrders.length > 0 ? selectedOrders : orders.map((o) => o.OrderID);

    ordersToExport.forEach((orderId) => {
      const order = orders.find((o) => o.OrderID === orderId);
      if (order) {
        exportSingleOrderPDF(order);
      }
    });
  };

  const exportSingleOrderPDF = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Color palette based on the page theme
    const primaryColor = [124, 101, 62]; // #7C653E - brown/gold
    const secondaryColor = [139, 115, 85]; // lighter brown
    const accentColor = [184, 134, 11]; // gold
    const lightBg = [250, 248, 245]; // cream background
    const darkText = [51, 51, 51]; // dark gray

    // Helper function to add centered text
    const addCenteredText = (
      text: string,
      fontSize: number,
      y: number,
      color: number[] = darkText
    ) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Helper function to add left-right aligned text
    const addLeftRightText = (
      leftText: string,
      rightText: string,
      y: number,
      fontSize: number = 10,
      color: number[] = darkText
    ) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(leftText, 20, y);
      const rightTextWidth = doc.getTextWidth(rightText);
      doc.text(rightText, pageWidth - 20 - rightTextWidth, y);
    };

    // Background gradient effect
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Top accent bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 8, "F");

    yPosition = 25;

    // Header - Company Info with modern styling
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(28);
    doc.text("🍷 SMART WINE STORE", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Premium Wine Collection & Events", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "123 Wine Street, Vineyard City, VC 12345",
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 5;
    doc.text(
      "Phone: (555) 123-4567 | Email: info@smartwinestore.com",
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Decorative line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 20;

    // Invoice Title with modern styling
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, yPosition - 8, pageWidth - 40, 16, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`INVOICE #${order.OrderID}`, pageWidth / 2, yPosition + 2, {
      align: "center",
    });
    yPosition += 25;

    // Order Details Box with modern styling
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(20, yPosition, pageWidth - 40, 55, "FD");
    yPosition += 12;

    // Order Information with icons
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    addLeftRightText("🆔 Order ID:", `#${order.OrderID}`, yPosition);
    yPosition += 9;
    addLeftRightText(
      "📅 Order Date:",
      new Date(order.CreatedAt).toLocaleDateString(),
      yPosition
    );
    yPosition += 9;
    addLeftRightText(
      "📊 Status:",
      getStatusText(order.StatusID).toUpperCase(),
      yPosition
    );
    yPosition += 9;
    addLeftRightText("💳 Payment:", "Credit Card", yPosition);
    yPosition += 20;

    // Customer Information Box
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("👤 CUSTOMER INFORMATION", 25, yPosition);
    yPosition += 15;

    doc.setFillColor(248, 248, 248);
    doc.rect(20, yPosition - 5, pageWidth - 40, 25, "F");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(20, yPosition - 5, pageWidth - 40, 25);

    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`ID: ${order.UserID}`, 25, yPosition + 2);
    doc.text(`Name: ${order.UserName || "N/A"}`, 25, yPosition + 9);
    doc.text(`Email: ${order.Email || "N/A"}`, 25, yPosition + 16);
    yPosition += 30;

    // Shipping Address Box
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("📍 SHIPPING ADDRESS", 25, yPosition);
    yPosition += 15;

    doc.setFillColor(248, 248, 248);
    doc.rect(20, yPosition - 5, pageWidth - 40, 20, "F");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(20, yPosition - 5, pageWidth - 40, 20);

    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const address = getFormattedAddress(order);
    const addressLines = doc.splitTextToSize(address, 160);
    doc.text(addressLines, 25, yPosition + 2);
    yPosition += Math.max(25, addressLines.length * 6 + 10);

    // Order Items Table
    if (order.Details && order.Details.length > 0) {
      // Check if we need a new page
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      // Table Header with modern styling
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(20, yPosition - 5, pageWidth - 40, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("🛒 ORDER ITEMS", 25, yPosition + 3);
      yPosition += 18;

      // Table Header Row
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(20, yPosition - 5, pageWidth - 40, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("#", 25, yPosition + 2);
      doc.text("Product", 40, yPosition + 2);
      doc.text("Qty", 135, yPosition + 2);
      doc.text("Unit Price", 150, yPosition + 2);
      doc.text("Total", 180, yPosition + 2);
      yPosition += 15;

      // Table Rows
      doc.setFont("helvetica", "normal");
      order.Details.forEach((detail, index) => {
        if (yPosition > 250) {
          // Check if we need a new page
          doc.addPage();
          yPosition = 30;

          // Redraw table header on new page
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(20, yPosition - 5, pageWidth - 40, 15, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("🛒 ORDER ITEMS (continued)", 25, yPosition + 3);
          yPosition += 18;

          doc.setFillColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          doc.rect(20, yPosition - 5, pageWidth - 40, 12, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text("#", 25, yPosition + 2);
          doc.text("Product", 40, yPosition + 2);
          doc.text("Qty", 135, yPosition + 2);
          doc.text("Unit Price", 150, yPosition + 2);
          doc.text("Total", 180, yPosition + 2);
          yPosition += 15;
          doc.setFont("helvetica", "normal");
        }

        // Row background (modern alternating)
        if (index % 2 === 0) {
          doc.setFillColor(252, 252, 252);
        } else {
          doc.setFillColor(245, 245, 245);
        }
        doc.rect(20, yPosition - 5, pageWidth - 40, 12, "F");

        // Row border
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.1);
        doc.rect(20, yPosition - 5, pageWidth - 40, 12);

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(9);
        doc.text(`${index + 1}`, 25, yPosition + 2);

        // Product name (truncate if too long)
        const productName =
          detail.ProductName.length > 25
            ? detail.ProductName.substring(0, 22) + "..."
            : detail.ProductName;
        doc.text(productName, 40, yPosition + 2);

        doc.text(`${detail.Quantity}`, 140, yPosition + 2);
        doc.text(`$${detail.UnitPrice.toFixed(2)}`, 155, yPosition + 2);
        doc.text(`$${detail.FinalItemPrice.toFixed(2)}`, 180, yPosition + 2);

        yPosition += 12;
      });

      // Total Section with modern styling
      yPosition += 5;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(120, yPosition, 70, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`TOTAL: $${order.FinalTotal.toFixed(2)}`, 155, yPosition + 10, {
        align: "center",
      });
      yPosition += 25;
    }

    // Footer with modern styling
    const footerY = pageHeight - 35;

    // Footer background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, footerY - 5, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    addCenteredText(
      "🎉 Thank you for choosing Smart Wine Store!",
      10,
      footerY + 5,
      [255, 255, 255]
    );
    addCenteredText(
      "For questions about this order, please contact us at info@smartwinestore.com",
      8,
      footerY + 12,
      [255, 255, 255]
    );
    addCenteredText(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      7,
      footerY + 18,
      [255, 255, 255]
    );

    // Bottom accent
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, pageHeight - 3, pageWidth, 3, "F");

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Save the PDF
    doc.save(`order-invoice-${order.OrderID}.pdf`);
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      statusMap[status.toLowerCase()] ||
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
                className={`${
                  statusFilter !== "all"
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
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === "all"
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
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === "pending"
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
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === "done"
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
                  {t("admin.orders.tableHeaders.paymentMethod")}
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
                      ${order.FinalTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          getStatusText(order.StatusID)
                        )}`}
                      >
                        {getStatusText(order.StatusID)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      N/A
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
