"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserCog, Edit, Save, UserX } from "lucide-react";
import { User, Mail, Phone, Calendar, MapPin, Award, Coins, Shield, Loader2 } from "lucide-react";
import PageHeader from "@/components/discount-events/PageHeader";
import { useToast } from "@/hooks/use-toast";
import userManagementRepository from "@/api/userManagementRepository";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    // State for account data and loading
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State management - start in edit mode if edit=true in URL
    const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showInactiveDialog, setShowInactiveDialog] = useState(false);

    // Form management
    const {
        register,
        handleSubmit,
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
    const tierID = watch("TierID");
    const statusID = watch("StatusID");

    // Fetch account data on component mount
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const accountData = await userManagementRepository.getUserById(accountId);
                setAccount(accountData);
            } catch (err) {
                console.error('Error fetching account:', err);
                setError('Failed to load account details');
                toast({
                    title: "Error",
                    description: "Failed to load account details. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (accountId) {
            fetchAccount();
        }
    }, [accountId, toast]);

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
            const formData = getValues();

            // Transform phone number to international format if it starts with 0
            let phoneNumber = formData.PhoneNumber;
            if (phoneNumber.startsWith('0')) {
                // Remove leading 0 and prepend +84
                phoneNumber = '+84' + phoneNumber.substring(1);
            }

            // Prepare the data for API call
            const updateData = {
                UserName: formData.UserName,
                Email: formData.Email,
                PhoneNumber: phoneNumber,
                Birthday: formData.Birthday,
                RoleID: formData.RoleID,
                TierID: formData.TierID,
                StatusID: formData.StatusID,
                StreetAddress: formData.StreetAddress || '',
                Ward: formData.Ward || '',
                Province: formData.Province || '',
            };

            console.log("Updating account:", { accountId, updateData });

            // Call the API to update user
            const response = await userManagementRepository.updateUser(accountId, updateData);
            console.log("Update response:", response);

            // Update local state with the new data
            const updatedAccount = {
                ...account,
                ...updateData,
                RoleName: roles.find(r => r.id === formData.RoleID)?.name || account.RoleName,
                TierName: tiers.find(t => t.id === formData.TierID)?.name || account.TierName,
                StatusName: statuses.find(s => s.id === formData.StatusID)?.name || account.StatusName,
            };

            setAccount(updatedAccount);

            setIsEditing(false);
            setShowSaveDialog(false);
            reset();

            toast({
                title: "Success",
                description: "Account updated successfully",
            });
        } catch (error: any) {
            console.error("Error saving account:", error);
            // Extract more detailed error information
            const errorMessage = error.message || "Failed to update account";
            const statusCode = error.response?.status;
            const errorData = error.response?.data;

            console.error("Detailed error info:", {
                message: errorMessage,
                statusCode,
                errorData,
                fullError: error
            });

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleSaveCancel = () => {
        setShowSaveDialog(false);
    };

    const handleStatusChangeClick = () => {
        setShowInactiveDialog(true);
    };

    const handleStatusChangeConfirm = async () => {
        if (!account) return;

        try {
            const isCurrentlyActive = account.StatusID === 1;
            const newStatusId = isCurrentlyActive ? 2 : 1; // 2 = Banned, 1 = Active
            const newStatusName = isCurrentlyActive ? "Banned" : "Active";

            console.log(`Changing account status for ${account.UserID} from ${account.StatusName} to ${newStatusName}`);

            // Call the API to update user status
            const reason = newStatusId === 2 ? "Violation of terms and conditions" : undefined;
            await userManagementRepository.updateUserStatus(account.UserID, newStatusId, reason);

            // Update local state
            setAccount({
                ...account,
                StatusID: newStatusId,
                StatusName: newStatusName,
            });

            setShowInactiveDialog(false);

            toast({
                title: "Success",
                description: `Account status updated to ${newStatusName}`,
            });
        } catch (error: any) {
            console.error("Error updating account status:", error);
            const errorMessage = error.message || "Failed to update account status";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleStatusChangeCancel = () => {
        setShowInactiveDialog(false);
    };

    // Helper functions for status change UI
    const getStatusChangeButtonText = () => {
        if (!account) return "Change Status";
        return account.StatusID === 1 ? "Inactive" : "Active";
    };

    const getStatusChangeButtonColor = () => {
        if (!account) return "bg-red-600 hover:bg-red-700";
        return account.StatusID === 1 ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700";
    };

    const getStatusChangeDialogTitle = () => {
        if (!account) return "Change Status";
        return account.StatusID === 1 ? "Inactive người dùng" : "Active người dùng";
    };

    const getStatusChangeDialogDescription = () => {
        if (!account) return "";
        const action = account.StatusID === 1 ? "inactive" : "active";
        return `Bạn có muốn ${action} người dùng <strong class="text-gray-900 dark:text-slate-100">${account.UserName}</strong> không?`;
    };

    const getNextStatusName = () => {
        if (!account) return "";
        return account.StatusID === 1 ? "Banned" : "Active";
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        reset();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ad8d5e] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Account Details</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch the account information.</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Account</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
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

    // Account not found
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
                                    <span className="font-medium">{account.UserName}</span> • {account.RoleName}
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
                                className={`text-white ${getStatusChangeButtonColor()}`}
                            >
                                <UserX className="w-4 h-4 mr-2" />
                                {getStatusChangeButtonText()}
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
                                        <p className="font-bold text-green-600 dark:text-green-400 text-lg">{account.Point.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Min Points Required</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{account.MinimumPoint.toLocaleString()}</p>
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
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{account.StreetAddress}</p>
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
                                                <p className="font-medium text-gray-900 dark:text-slate-100">{account.Ward}</p>
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
                                                <p className="font-medium text-gray-900 dark:text-slate-100">{account.Province}</p>
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
            <AlertDialog open={showInactiveDialog} onOpenChange={setShowInactiveDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            {getStatusChangeDialogTitle()}
                        </AlertDialogTitle>
                        <AlertDialogDescription
                            className="text-gray-600 dark:text-slate-400"
                            dangerouslySetInnerHTML={{ __html: getStatusChangeDialogDescription() }}
                        />
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
                            disabled={isSubmitting}
                            className={`${getStatusChangeButtonColor().replace('bg-', 'bg-').replace('hover:bg-', 'hover:bg-')} text-white`}
                        >
                            {isSubmitting ? "Đang xử lý..." : "Đồng ý"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
