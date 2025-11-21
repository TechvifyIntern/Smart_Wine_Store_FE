import React from "react";
import Image from "next/image";
import { userOrders } from "@/data/profile";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RecentOrders: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "In Transit":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-card/40 rounded-lg shadow border border-border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Recent Orders</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {userOrders.map((order) => (
          <div
            key={order.id}
            className="p-6 flex items-center justify-between hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-4">
              <Image
                src={order.image || "/placeholder.svg"}
                alt={order.product}
                width={64}
                height={64}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <p className="font-semibold">{order.product}</p>
                <p className="text-sm">
                  {order.id} • {order.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-semibold">{order.total}</p>
                <span
                  className={`text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
      <div className="p-6">
        <Button variant="outline" className="w-full">
          View All Orders
        </Button>
      </div>
    </div>
  );
};
