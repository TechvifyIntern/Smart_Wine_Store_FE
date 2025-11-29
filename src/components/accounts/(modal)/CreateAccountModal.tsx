"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect } from "react";
import type { Account } from "@/data/accounts";
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
import {
    createAccountSchema,
    type CreateAccountFormData,
} from "@/validations/accounts/accountSchema";

interface CreateAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (data: CreateAccountFormData) => void | Promise<void>;
}

const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Seller" },
    { id: 3, name: "Customer" },
];

const tiers = [
    { id: 1, name: "Bronze", minPoints: 0 },
    { id: 2, name: "Silver", minPoints: 1000 },
    { id: 3, name: "Gold", minPoints: 5000 },
];



export function CreateAccountModal({
    open,
    onOpenChange,
    onCreate,
}: CreateAccountModalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            if (scrollRef.current) {
                // Focus the scrollable area when modal opens to enable mouse wheel scrolling
                scrollRef.current.focus();
            }
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [open]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            UserName: "",
            Email: "",
            PhoneNumber: "",
            Birthday: "",
            RoleID: 3,
            TierID: 1,
            Password: "",
            ConfirmPassword: "",
            StreetAddress: "",
            Ward: "",
            Province: "",
        },
    });

    const roleID = watch("RoleID");
    const tierID = watch("TierID");

    const onSubmit = async (data: CreateAccountFormData) => {
        try {
            await onCreate(data);
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[100vh] bg-white! border-gray-200! flex flex-col [&>[data-radix-dialog-body]]:px-6 [&>[data-radix-dialog-body]]:py-4">
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">Create New Account</DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        Fill in the details to create a new account.
                    </DialogDescription>
                </DialogHeader>

                <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-behavior-smooth focus:outline-none scrollbar-hide" tabIndex={-1}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pr-1 pb-4">
                        <div className="space-y-4">
                            {/* User Name */}
                            <div className="space-y-2">
                                <Label htmlFor="UserName" className="text-sm font-medium text-gray-900!">
                                    User Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="UserName"
                                    placeholder="Enter full name"
                                    {...register("UserName")}
                                    className={`dark:bg-white! border-gray-300! text-gray-900! ${errors.UserName ? "border-red-500!" : ""}`}
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
                                        placeholder="email@example.com"
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
                                        placeholder="09xxxxxxxx"
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

                            {/* Role and Tier */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-900!">
                                        Role <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={roleID.toString()}
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
                                        value={tierID.toString()}
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
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="Password" className="text-sm font-medium text-gray-900!">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="Password"
                                        type="password"
                                        placeholder="Min 8 characters"
                                        {...register("Password")}
                                        className={`bg-white! border-gray-300! text-gray-900! ${errors.Password ? "border-red-500!" : ""}`}
                                    />
                                    {errors.Password && (
                                        <p className="text-sm text-red-500">{errors.Password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ConfirmPassword" className="text-sm font-medium text-gray-900!">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="ConfirmPassword"
                                        type="password"
                                        placeholder="Re-enter password"
                                        {...register("ConfirmPassword")}
                                        className={`bg-white! border-gray-300! text-gray-900! ${errors.ConfirmPassword ? "border-red-500!" : ""}`}
                                    />
                                    {errors.ConfirmPassword && (
                                        <p className="text-sm text-red-500">{errors.ConfirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-900! mb-3">Default Address (Optional)</h4>
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Street Address"
                                        {...register("StreetAddress")}
                                        className="bg-white! border-gray-300! text-gray-900!"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Ward"
                                            {...register("Ward")}
                                            className="bg-white! border-gray-300! text-gray-900!"
                                        />
                                        <Input
                                            placeholder="Province"
                                            {...register("Province")}
                                            className="bg-white! border-gray-300! text-gray-900!"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
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
                        onClick={handleSubmit(onSubmit)}
                        className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                    >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
