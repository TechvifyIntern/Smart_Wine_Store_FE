"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserCog, Edit, Save, UserX } from "lucide-react";
import { User, Mail, Phone, Calendar, MapPin, Award, Coins, Shield } from "lucide-react";
import PageHeader from "@/components/discount-events/PageHeader";
import { useToast } from "@/hooks/use-toast";
import userManagementRepository from "@/api/userManagementRepository";
import { api } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import {
    editAccountSchema,
    type EditAccountFormData,
} from "@/validations/accounts/accountSchema";

export default function AccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const accountId = parseInt(params.id as string);
    const { toast } = useToast();

    // State management for account data
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State management - start in edit mode if edit=true in URL
    const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [actionReason, setActionReason] = useState('');

    // Form management
    const {
        register,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
        getValues,
    } = useForm<EditAccountFormData>({
        resolver: zodResolver(editAccountSchema),
    });

    // Watch form values
    const roleID = watch("RoleID");

    // Fetch account data on component mount
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                setLoading(true);
                const accountData = await userManagementRepository.getUserById(accountId);
                setAccount(accountData);
                setError(null);
            } catch (err) {
                console.error("Error fetching account:", err);
                setError(err instanceof Error ? err.message : "Failed to load account data");
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, [accountId]);

    // Initialize form when account changes or edit mode toggles
    useEffect(() => {
        if (account && isEditing) {
            setValue("UserName", account.UserName);
            setValue("Email", account.Email);
            setValue("PhoneNumber", account.PhoneNumber);
            setValue("Birthday", account.Birthday);
            setValue("RoleID", account.RoleID);
            setValue("TierID", account.TierID);
            setValue("StatusID", account.StatusID);
            setValue("StreetAddress", account.StreetAddress);
            setValue("Ward", account.Ward);
            setValue("Province", account.Province);
        }
    }, [account, isEditing, setValue]);

    // Helper data
    const roles = [
        { id: 1, name: "Admin" },
        { id: 2, name: "Seller" },
        { id: 3, name: "Customer" },
    ];

    const tiers = [
        { id: 1, name: "Bronze" },
        { id: 2, name: "Silver" },
        { id: 3, name: "Gold" },
    ];

    const statuses = [
        { id: 1, name: "Active" },
        { id: 2, name: "Banned" },
        { id: 3, name: "Pending" },
    ];

    // Event handlers
    const handleEditToggle = () => {
        if (isEditing) {
            // Switching to save mode
            setShowSaveDialog(true);
        } else {
            // Switching to edit mode
            setIsEditing(true);
        }
    };

    const handleSaveConfirm = async () => {
        if (!account) return;

        try {
            // In a real app, this would be an API call
            const formData = getValues();
            console.log("Saving account data:", formData);

            // Update the local account data (in a real app, this would come from the API response)
            account.UserName = formData.UserName;
            account.Email = formData.Email;
            account.PhoneNumber = formData.PhoneNumber;
            account.Birthday = formData.Birthday;
            account.RoleID = formData.RoleID;
            account.RoleName = roles.find(r => r.id === formData.RoleID)?.name || account.RoleName;
            account.TierID = formData.TierID;
            account.TierName = tiers.find(t => t.id === formData.TierID)?.name || account.TierName;
            account.StatusID = formData.StatusID;
            account.StatusName = statuses.find(s => s.id === formData.StatusID)?.name || account.StatusName;
            account.StreetAddress = formData.StreetAddress || '';
            account.Ward = formData.Ward || '';
            account.Province = formData.Province || '';

            setIsEditing(false);
            setShowSaveDialog(false);
            reset();
        } catch (error) {
            console.error("Error saving account:", error);
        }
    };

    const handleSaveCancel = () => {
        setShowSaveDialog(false);
    };

    const isActive = account?.StatusID === 1;
    const targetStatus = isActive ? 2 : 1; // If active (1), set to inactive (2); if inactive, set to active (1)
    const actionText = isActive ? 'inactive' : 'active';

    const handleStatusChangeClick = () => {
        setShowStatusDialog(true);
    };

    const handleStatusChangeConfirm = async () => {
        if (!account) return;

        try {
            // Call API to update status
            const response = await api.put(`/user-management/${account.UserID}/status`, {
                StatusID: targetStatus,
                Reason: actionReason
            });

            // Update local state
            account.StatusID = targetStatus;
            account.StatusName = targetStatus === 1 ? "Active" : "Banned";

            setShowStatusDialog(false);
            setActionReason('');

            toast({
                title: `Account ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}d Successfully`,
                description: `The account ${account.UserName} has been successfully ${actionText}d.`,
            });

            // Refetch account data to ensure consistency
            const updatedAccount = await userManagementRepository.getUserById(accountId);
            setAccount(updatedAccount);

        } catch (error) {
            console.error("Error updating account status:", error);
            toast({
                title: `Failed to ${actionText} account`,
                description: error instanceof Error ? error.message : `An error occurred while trying to ${actionText} the account.`,
                variant: "destructive",
            });
        }
    };

    const handleStatusChangeCancel = () => {
        setShowStatusDialog(false);
        setActionReason('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        reset();
    };

    // Handle loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#ad8d5e] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading account data...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Account</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Accounts
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Handle account not found
    if (!account) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The requested account could not be found.</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Accounts
                    </button>
                </div>
            </div>
        );
    }

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
        <div>
            <PageHeader
                title="Account Detail"
                icon={UserCog}
                iconColor="text-black"
            />

            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Accounts
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#ad8d5e] to-[#8b735e] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-[#ad8d5e]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Account Details
                                </h1>
                                <p className="text-white/90">
                                    Detailed information for <span className="font-medium">{account.UserName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleEditToggle}
                                disabled={isSubmitting}
                                className="bg-white text-[#ad8d5e] hover:bg-gray-50 border border-white/20"
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Sửa
                                    </>
                                )}
                            </Button>
                            {isEditing && (
                                <Button
                                    onClick={handleCancelEdit}
                                    variant="outline"
                                    disabled={isSubmitting}
                                    className="bg-transparent text-white border-white/20 hover:bg-white/10"
                                >
                                    Hủy
                                </Button>
                            )}
                            <Button
                                onClick={handleStatusChangeClick}
                                disabled={isSubmitting || isEditing}
                                className={isActive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                            >
                                {isActive ? (
                                    <>
                                        <UserX className="w-4 h-4 mr-2" />
                                        Inactive
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-4 h-4 mr-2" />
                                        Active
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-8">
                        {/* User Info Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">User Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">#</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">User ID</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">#{account.UserID}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">User Name</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("UserName")}
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.UserName ? "border-red-500" : ""}`}
                                                />
                                                {errors.UserName && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.UserName.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{account.UserName}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("Email")}
                                                    type="email"
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.Email ? "border-red-500" : ""}`}
                                                />
                                                {errors.Email && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.Email.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100 break-all">{account.Email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Phone</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("PhoneNumber")}
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.PhoneNumber ? "border-red-500" : ""}`}
                                                />
                                                {errors.PhoneNumber && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.PhoneNumber.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{account.PhoneNumber}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Birthday</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("Birthday")}
                                                    type="date"
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.Birthday ? "border-red-500" : ""}`}
                                                />
                                                {errors.Birthday && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.Birthday.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{formatDate(account.Birthday)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Role</p>
                                        {isEditing ? (
                                            <div>
                                                <Select
                                                    value={roleID?.toString()}
                                                    onValueChange={(value) => setValue("RoleID", parseInt(value))}
                                                >
                                                    <SelectTrigger className="bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-600 border-gray-200 dark:border-slate-500">
                                                        {roles.map((role) => (
                                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(account.RoleName)}`}>
                                                {account.RoleName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Membership & Points Card */}
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-yellow-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Membership & Points</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
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
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Current Points</p>
                                        <p className="font-bold text-green-600 dark:text-green-400 text-lg">{(account.Point ?? 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Min Points Required</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{account.MinimumPoint?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
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
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Address Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Street Address</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("StreetAddress")}
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.StreetAddress ? "border-red-500" : ""}`}
                                                />
                                                {errors.StreetAddress && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.StreetAddress.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{account.StreetAddress || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                        <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Ward</p>
                                            {isEditing ? (
                                                <div>
                                                    <Input
                                                        {...register("Ward")}
                                                        className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.Ward ? "border-red-500" : ""}`}
                                                    />
                                                    {errors.Ward && (
                                                        <p className="text-xs text-red-500 mt-1">{errors.Ward.message}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="font-medium text-gray-900 dark:text-slate-100">{account.Ward || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                        <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Province</p>
                                            {isEditing ? (
                                                <div>
                                                    <Input
                                                        {...register("Province")}
                                                        className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.Province ? "border-red-500" : ""}`}
                                                    />
                                                    {errors.Province && (
                                                        <p className="text-xs text-red-500 mt-1">{errors.Province.message}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="font-medium text-gray-900 dark:text-slate-100">{account.Province || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Confirmation Dialog */}
            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            Xác nhận lưu thay đổi
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Bạn có muốn lưu thông tin thay đổi không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleSaveCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Huỷ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSaveConfirm}
                            disabled={isSubmitting}
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                        >
                            {isSubmitting ? "Đang lưu..." : "Đồng ý"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Status Change Confirmation Dialog */}
            <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            {isActive ? 'Inactive người dùng' : 'Active người dùng'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400 mb-4">
                            Bạn có muốn {actionText} người dùng <strong className="text-gray-900 dark:text-slate-100">{account?.UserName}</strong> không?
                        </AlertDialogDescription>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                                    Lý do {actionText}
                                </label>
                                <Input
                                    id="reason"
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                    placeholder={`Nhập lý do ${actionText} tài khoản...`}
                                    className="w-full bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500"
                                />
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleStatusChangeCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Huỷ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleStatusChangeConfirm}
                            disabled={!actionReason.trim() || isSubmitting}
                            className={isActive ? "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50" : "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"}
                        >
                            {isSubmitting ? "Đang xử lý..." : (isActive ? "Inactive" : "Active")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
