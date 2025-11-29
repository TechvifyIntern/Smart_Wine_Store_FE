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
import { Account } from "@/data/accounts";

interface StatusChangeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
    newStatusId: number;
    onConfirm: () => void;
}

export function StatusChangeDialog({
    open,
    onOpenChange,
    account,
    newStatusId,
    onConfirm,
}: StatusChangeDialogProps) {
    if (!account) return null;

    const currentStatus = account.StatusID === 1 ? "Active" : "Inactive";
    const newStatus = newStatusId === 1 ? "Active" : "Inactive";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white! border-gray-200!">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900!">
                        Change Account Status?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600!">
                        Are you sure you want to change the status of{" "}
                        <strong className="text-gray-900">&ldquo;{account.UserName}&rdquo;</strong>?
                        <br />
                        <br />
                        <span className="text-sm">
                            <strong>Current Status:</strong> {currentStatus}
                            <br />
                            <strong>New Status:</strong> {newStatus}
                            <br />
                            <strong>Email:</strong> {account.Email}
                            <br />
                            <strong>Role:</strong> {account.RoleName}
                        </span>
                        <br />
                        <br />
                        <span className="text-blue-600 font-medium">
                            This will update the account status immediately.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Change Status
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
