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

interface DeleteAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
    onConfirm: () => void;
}

export function DeleteAccountDialog({
    open,
    onOpenChange,
    account,
    onConfirm,
}: DeleteAccountDialogProps) {
    if (!account) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white! border-gray-200!">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900!">
                        Delete Account?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600!">
                        Do you really want to delete the account for{" "}
                        <strong className="text-gray-900">&quot;{account.UserName}&quot;</strong>?
                        <br />
                        <br />
                        <span className="text-sm">
                            <strong>Email:</strong> {account.Email}
                            <br />
                            <strong>Role:</strong> {account.RoleName}
                        </span>
                        <br />
                        <br />
                        <span className="text-red-600 font-medium">
                            This action cannot be undone. All data associated with this account will be permanently deleted.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
