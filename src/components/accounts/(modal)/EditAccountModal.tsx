"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Account } from "@/data/accounts";
import {
    editAccountSchema,
    type EditAccountFormData,
} from "@/validations/accounts/accountSchema";

interface EditAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
    onUpdate: (id: number, data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "Point" | "StatusName" | "StreetAddress" | "Ward" | "Province">) => void | Promise<void>;
}

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

export default function EditAccountModal({
    open,
    onOpenChange,
    account,
    onUpdate,
}: EditAccountModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<EditAccountFormData>({
        resolver: zodResolver(editAccountSchema),
    });

    const roleID = watch("RoleID");
    const tierID = watch("TierID");
    const statusID = watch("StatusID");

    useEffect(() => {
        if (account) {
            setValue("UserName", account.UserName);
            setValue("Email", account.Email);
            setValue("PhoneNumber", account.PhoneNumber);
            setValue("Birthday", account.Birthday);
            setValue("RoleID", account.RoleID);
            setValue("TierID", account.TierID);
            setValue("StatusID", account.StatusID);
        }
    }, [account, setValue]);

    const onSubmit = async (data: EditAccountFormData) => {
        if (!account) return;
        try {
            await onUpdate(account.UserID, data);
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    const handleResetPassword = () => {
        if (account) {
            // TODO: Implement password reset logic
            alert(`Password reset link will be sent to ${account.Email}`);
        }
    };

    if (!account) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white! border-gray-200!">
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">Edit Account</DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        Update account information for {account.UserName}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* User Name */}
                        <div className="space-y-2">
                            <Label htmlFor="UserName" className="text-sm font-medium text-gray-900!">
                                User Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="UserName"
                                {...register("UserName")}
                                className={`bg-white! border-gray-300! text-gray-900! ${errors.UserName ? "border-red-500!" : ""}`}
                            />
                            {errors.UserName && (
                                <p className="text-sm text-red-500">{errors.UserName.message}</p>
                            )}
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="Email" className="text-sm font-medium text-gray-900!">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="Email"
                                    type="email"
                                    {...register("Email")}
                                    className={`bg-white! border-gray-300! text-gray-900! ${errors.Email ? "border-red-500!" : ""}`}
                                />
                                {errors.Email && (
                                    <p className="text-sm text-red-500">{errors.Email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="PhoneNumber" className="text-sm font-medium text-gray-900!">
                                    Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="PhoneNumber"
                                    {...register("PhoneNumber")}
                                    className={`bg-white! border-gray-300! text-gray-900! ${errors.PhoneNumber ? "border-red-500!" : ""}`}
                                />
                                {errors.PhoneNumber && (
                                    <p className="text-sm text-red-500">{errors.PhoneNumber.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Birthday */}
                        <div className="space-y-2">
                            <Label htmlFor="Birthday" className="text-sm font-medium text-gray-900!">
                                Birthday <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="Birthday"
                                type="date"
                                {...register("Birthday")}
                                className={`bg-white! border-gray-300! text-gray-900! ${errors.Birthday ? "border-red-500!" : ""}`}
                            />
                            {errors.Birthday && (
                                <p className="text-sm text-red-500">{errors.Birthday.message}</p>
                            )}
                        </div>

                        {/* Role, Tier, Status */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Role <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={roleID?.toString()}
                                    onValueChange={(value) => setValue("RoleID", parseInt(value))}
                                >
                                    <SelectTrigger className="bg-white! border-gray-300! text-gray-900!">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white! border-gray-200!">
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Tier <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={tierID?.toString()}
                                    onValueChange={(value) => setValue("TierID", parseInt(value))}
                                >
                                    <SelectTrigger className="bg-white! border-gray-300! text-gray-900!">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white! border-gray-200!">
                                        {tiers.map((tier) => (
                                            <SelectItem key={tier.id} value={tier.id.toString()}>
                                                {tier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={statusID?.toString()}
                                    onValueChange={(value) => setValue("StatusID", parseInt(value))}
                                >
                                    <SelectTrigger className="bg-white! border-gray-300! text-gray-900!">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white! border-gray-200!">
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id.toString()}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Reset Password Section */}
                        <div className="border-t pt-4">
                            <Label className="text-sm font-medium text-gray-900! mb-2 block">
                                Password Management
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResetPassword}
                                className="w-full bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!"
                            >
                                Send Password Reset Link
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                        >
                            {isSubmitting ? "Updating..." : "Update Account"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
