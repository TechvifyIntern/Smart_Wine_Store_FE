"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DiscountOrder } from "@/data/discount_order";
import { formatCurrency } from "@/lib/utils";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: DiscountOrder | null;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  order,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white! border-gray-200! rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900! flex items-center gap-2">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Confirm Delete Order Discount
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600! pt-2">
            Are you sure you want to delete this order discount tier?
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Discount:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {order.DiscountValue}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Minimum Order:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(order.MinimumOrderValue)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-red-600 font-medium">
              This action cannot be undone. Customers will no longer receive
              this discount tier.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4 sm:gap-2">
          <AlertDialogCancel className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100! ">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Discount
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
