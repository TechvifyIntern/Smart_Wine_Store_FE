"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect, useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { User, Pencil, Check } from "lucide-react";
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
            setUploadedImageUrl(""); // Reset image when modal closes
        }
    }, [open]);

    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
        reset,
        setValue,
        watch,
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        mode: 'onBlur',
        defaultValues: {
            UserName: "",
            Email: "",
            PhoneNumber: "",
            Birthday: "",
            RoleID: 3,
            Password: "",
            ConfirmPassword: "",
            ImageURL: "",
        },
    });

    const roleID = watch("RoleID");

    const onSubmit = async (data: CreateAccountFormData) => {
        try {
            const formDataWithImage = {
                ...data,
                ImageURL: uploadedImageUrl || data.ImageURL || "",
            };
            await onCreate(formDataWithImage);
            onOpenChange(false);
            reset();
            setUploadedImageUrl("");
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
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center space-y-4">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Avatar (Optional)
                                </Label>
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                                        {uploadedImageUrl ? (
                                            <img
                                                src={uploadedImageUrl}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-500" />
                                        )}
                                    </div>
                                    <CldUploadWidget
                                        uploadPreset="wine_store_accounts"
                                        onSuccess={(result: any) => {
                                            if (result?.info?.secure_url) {
                                                setUploadedImageUrl(result.info.secure_url);
                                                setValue("ImageURL", result.info.secure_url);
                                            }
                                        }}
                                        onError={(error: any) => {
                                            console.error("Upload error:", error);
                                            alert("Failed to upload image. Please check your Cloudinary upload preset configuration.");
                                        }}
                                        options={{
                                            maxFiles: 1,
                                            resourceType: "image",
                                            folder: "wine-store/accounts",
                                            clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                                            maxFileSize: 5000000, // 5MB
                                        }}
                                    >
                                        {({ open }: { open: () => void }) => (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => open()}
                                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#ad8d5e] hover:bg-[#8c6b3e] p-0"
                                            >
                                                <Pencil className="w-4 h-4 text-white" />
                                            </Button>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>

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
                                {errors.UserName && touchedFields.UserName && (
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
                                    {errors.Email && touchedFields.Email && (
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
                                    {errors.PhoneNumber && touchedFields.PhoneNumber && (
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
                                {errors.Birthday && touchedFields.Birthday && (
                                    <p className="text-sm text-red-500">{errors.Birthday.message}</p>
                                )}
                            </div>

                            {/* Role */}
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

                            {/* Password & Confirm Password */}
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
                                    {errors.Password && touchedFields.Password && (
                                        <p className="text-sm text-red-500">{errors.Password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ConfirmPassword" className="text-sm font-medium text-gray-900!">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="ConfirmPassword"
                                            type="password"
                                            placeholder="Confirm your password"
                                            {...register("ConfirmPassword")}
                                            className={`bg-white! border-gray-300! text-gray-900! ${errors.ConfirmPassword ? "border-red-500!" : ""} ${touchedFields.ConfirmPassword && watch("ConfirmPassword") && watch("Password") === watch("ConfirmPassword") && !errors.ConfirmPassword ? "pr-10" : ""}`}
                                        />
                                        {touchedFields.ConfirmPassword && watch("ConfirmPassword") && watch("Password") === watch("ConfirmPassword") && !errors.ConfirmPassword && (
                                            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.ConfirmPassword && touchedFields.ConfirmPassword && (
                                        <p className="text-sm text-red-500">{errors.ConfirmPassword.message}</p>
                                    )}
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
