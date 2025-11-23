"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Account } from "@/data/accounts";

interface AccountDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
}

export function AccountDetailModal({
    open,
    onOpenChange,
    account,
}: AccountDetailModalProps) {
    if (!account) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white! border-gray-200!">
                <DialogHeader>
                    <DialogTitle className="text-gray-900! text-xl">
                        Account Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        Complete information for {account.UserName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* User Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900! border-b pb-2">
                            User Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500! mb-1">User ID</p>
                                <p className="text-sm font-medium text-gray-900!">#{account.UserID}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">User Name</p>
                                <p className="text-sm font-medium text-gray-900!">{account.UserName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Email</p>
                                <p className="text-sm font-medium text-gray-900!">{account.Email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Phone Number</p>
                                <p className="text-sm font-medium text-gray-900!">{account.PhoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Birthday</p>
                                <p className="text-sm font-medium text-gray-900!">{formatDate(account.Birthday)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Role</p>
                                <p className="text-sm font-medium text-gray-900!">{account.RoleName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tier & Points Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900! border-b pb-2">
                            Membership & Points
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Tier Name</p>
                                <p className="text-sm font-medium text-gray-900!">{account.TierName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Minimum Points Required</p>
                                <p className="text-sm font-medium text-gray-900!">{account.MinimumPoint.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Current Points</p>
                                <p className="text-sm font-semibold text-green-600!">{account.Point.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Account Status</p>
                                <p className="text-sm font-medium text-gray-900!">{account.StatusName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900! border-b pb-2">
                            Address Information
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500! mb-1">Street Address</p>
                                <p className="text-sm font-medium text-gray-900!">{account.StreetAddress}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500! mb-1">Ward</p>
                                    <p className="text-sm font-medium text-gray-900!">{account.Ward}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500! mb-1">Province</p>
                                    <p className="text-sm font-medium text-gray-900!">{account.Province}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
