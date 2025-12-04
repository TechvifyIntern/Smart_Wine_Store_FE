import React, { useState } from "react";
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface RecentOrdersProps {
  userOrders: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ userOrders }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const INITIAL_ITEMS = 3;

  const getStatusString = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Pending";
      case 2:
        return "Delivered";
      case 3:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "text-yellow-600"; // Pending
      case 2:
        return "text-green-600"; // Delivered
      case 3:
        return "text-red-600"; // Cancelled
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleViewAllOrders = () => {
    setShowAllOrders(true);
    setCurrentPage(1);
  };

  const handleShowLessOrders = () => {
    setShowAllOrders(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(userOrders.length / ITEMS_PER_PAGE);

  const displayedOrders = showAllOrders
    ? userOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : userOrders.slice(0, INITIAL_ITEMS);

  return (
    <>
      <div className="bg-card/40 rounded-lg shadow border border-border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {displayedOrders.length > 0 ? (
            displayedOrders.map((order) => (
              <div
                key={order.OrderID}
                className="p-6 flex items-center justify-between hover:bg-muted transition-all cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">
                      {order.Details.length > 0
                        ? order.Details[0].ProductName +
                          (order.Details.length > 1
                            ? ` and ${order.Details.length - 1} more`
                            : "")
                        : "No products"}
                    </p>
                    <p className="text-sm">
                      Order #{order.OrderID} • {formatDate(order.CreatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(order.FinalTotal)}
                    </p>
                    <span
                      className={`text-sm font-medium ${getStatusColor(order.StatusID)}`}
                    >
                      {getStatusString(order.StatusID)}
                    </span>
                  </div>
                  <ChevronRightIcon size={20} />
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No orders found.
            </div>
          )}
        </div>
        <div className="p-6 flex justify-between items-center">
          {!showAllOrders && userOrders.length > INITIAL_ITEMS && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewAllOrders}
            >
              View All Orders ({userOrders.length})
            </Button>
          )}

          {showAllOrders && (
            <div className="flex w-full justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-2" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next <ChevronRightIcon size={16} className="ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleShowLessOrders}
                className="ml-4"
              >
                Show Less
              </Button>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Order Details - #{selectedOrder.OrderID}
              </DialogTitle>
              <DialogDescription>
                Details for your order placed on{" "}
                {formatDate(selectedOrder.CreatedAt)}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <p>
                <strong>Total:</strong>{" "}
                {formatCurrency(selectedOrder.FinalTotal)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusColor(selectedOrder.StatusID)}>
                  {getStatusString(selectedOrder.StatusID)}
                </span>
              </p>
              {selectedOrder.Details.length &&
                selectedOrder.Details.length > 0 && (
                  <p>
                    <strong>Discount:</strong>{" "}
                    {formatCurrency(selectedOrder.DiscountEventValue)}
                  </p>
                )}
              {selectedOrder.Details.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Products:</h4>
                  {selectedOrder.Details.map((detail) => (
                    <div key={detail.DetailID} className="border-t pt-2">
                      <p className="font-medium">{detail.ProductName}</p>
                      <p className="text-sm">
                        Quantity: {detail.Quantity} | Unit Price:{" "}
                        {formatCurrency(detail.UnitPrice)} | Final Item Price:{" "}
                        {formatCurrency(detail.FinalItemPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
