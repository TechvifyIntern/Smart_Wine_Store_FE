"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Account } from "@/data/accounts";
import { User, Mail, Phone, Calendar, MapPin, Award, Coins, Shield } from "lucide-react";

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "text-green-600 bg-green-50 border-green-200";
            case "Banned": return "text-red-600 bg-red-50 border-red-200";
            case "Pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case "Gold": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Silver": return "text-gray-600 bg-gray-50 border-gray-200";
            case "Bronze": return "text-orange-600 bg-orange-50 border-orange-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Admin": return "text-purple-600 bg-purple-50 border-purple-200";
            case "Seller": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Customer": return "text-green-600 bg-green-50 border-green-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 shadow-2xl">
                <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#ad8d5e] to-[#8b735e] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                Account Details
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-slate-400">
                                Detailed information for <span className="font-medium">{account.UserName}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 pb-4">
                    <div className="space-y-6 py-6">
                        {/* User Info Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">User Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">#</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">User ID</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">#{account.UserID}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">User Name</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{account.UserName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100 break-all">{account.Email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Phone</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{account.PhoneNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Birthday</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{formatDate(account.Birthday)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Role</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(account.RoleName)}`}>
                                            {account.RoleName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Membership & Points Card */}
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-yellow-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Membership & Points</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                                        <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Tier</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTierColor(account.TierName)}`}>
                                            {account.TierName}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Current Points</p>
                                        <p className="font-bold text-green-600 dark:text-green-400 text-lg">{account.Point.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Min Points Required</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{account.MinimumPoint.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Status</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.StatusName)}`}>
                                            {account.StatusName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-pink-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Address Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Street Address</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{account.StreetAddress}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                        <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Ward</p>
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{account.Ward}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                        <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Province</p>
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{account.Province}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 text-gray-700 dark:text-slate-300 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
