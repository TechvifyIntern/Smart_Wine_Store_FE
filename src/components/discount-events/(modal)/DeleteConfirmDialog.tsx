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
import { DiscountEvent } from "@/data/discount_event";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: DiscountEvent | null;
    onConfirm: () => void;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    event,
    onConfirm,
}: DeleteConfirmDialogProps) {
    if (!event) return null;

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
                        Confirm Delete Event
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600! pt-2">
                        Are you sure you want to delete this event?
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                {event.EventName}
                            </p>
                            <p className="text-xs text-gray-600">
                                Discount: {event.DiscountValue}%
                            </p>
                        </div>
                        <p className="mt-3 text-sm text-red-600 font-medium">
                            This action cannot be undone.
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
                        Delete Event
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
