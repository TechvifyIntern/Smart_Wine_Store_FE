"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import ordersRepository from "@/api/ordersRepository";

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        setIsLoading(true);
        const response = await ordersRepository.getOrders();
        if (response.success && response.data && Array.isArray(response.data)) {
          // Sort by CreatedAt descending and take first 10
          const sortedOrders = response.data
            .sort((a: any, b: any) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
            .slice(0, 10);
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error('Error loading recent orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecentOrders();
  }, []);
  const getStatusText = (statusID: number): string => {
    const statusMap: Record<number, string> = {
      1: "Pending",
      2: "Processing",
      3: "Shipped",
      4: "Delivered",
      5: "Cancelled",
    };
    return statusMap[statusID] || "Unknown";
  };

  const getStatusColor = (statusID: number) => {
    const statusText = getStatusText(statusID);
    switch (statusText) {
      case "Delivered":
        return "bg-[#00B69B]/30 text-[#00B69B] dark:bg-[#00B69B]/15 dark:text-[#00B69B]/70";
      case "Pending":
        return "bg-[#6226EF]/30 text-[#6226EF] dark:bg-[#6226EF]/15 dark:text-[#6226EF]/70";
      case "Cancelled":
        return "bg-[#EF3826]/30 text-[#EF3826] dark:bg-[#EF3826]/15 dark:text-[#EF3826]/70";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
    }
  };

  const getFormattedAddress = (order: any): string => {
    const parts = [order.OrderStreetAddress, order.OrderWard, order.OrderProvince].filter(Boolean);
    return parts.join(", ") || 'N/A';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return `₫${amount.toLocaleString("vi-VN")}`;
  };

  return (
    <Card className="rounded-xl shadow-sm border-[#F2F2F2] dark:border-slate-800/50 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Shipping Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[110px]">Date</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.OrderID}>
                    <TableCell className="font-medium">#{order.OrderID}</TableCell>
                    <TableCell>User #{order.UserID}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{getFormattedAddress(order)}</TableCell>
                    <TableCell className="text-right">
                      {formatAmount(order.FinalTotal)}
                    </TableCell>
                    <TableCell>{formatDate(order.CreatedAt)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={`w-[85px] justify-center ${getStatusColor(order.StatusID)}`}
                      >
                        {getStatusText(order.StatusID)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
