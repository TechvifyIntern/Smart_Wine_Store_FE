"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect } from "react";
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
      document.body.style.overflow = "hidden";
      scrollRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
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

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      await onCreate(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const roleID = watch("RoleID");
  const tierID = watch("TierID");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
                    sm:max-w-[650px] max-h-[100vh]
                    bg-white border-gray-200
                    dark:bg-neutral-900 dark:border-neutral-700
                    flex flex-col
                    [&>[data-radix-dialog-body]]:px-6 [&>[data-radix-dialog-body]]:py-4
                "
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Create New Account
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Fill in the details to create a new account.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-behavior-smooth focus:outline-none scrollbar-hide"
          tabIndex={-1}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 pr-1 pb-4"
          >
            {/* User Name */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                User Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter full name"
                {...register("UserName")}
                className={`
                                    bg-white border-gray-300 text-gray-900
                                    dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                    ${errors.UserName ? "border-red-500 dark:border-red-500" : ""}
                                `}
              />
              {errors.UserName && (
                <p className="text-sm text-red-500">
                  {errors.UserName.message}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...register("Email")}
                  className={`
                                        bg-white border-gray-300 text-gray-900
                                        dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        ${errors.Email ? "border-red-500 dark:border-red-500" : ""}
                                    `}
                />
                {errors.Email && (
                  <p className="text-sm text-red-500">{errors.Email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="09xxxxxxxx"
                  {...register("PhoneNumber")}
                  className={`
                                        bg-white border-gray-300 text-gray-900
                                        dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        ${errors.PhoneNumber ? "border-red-500 dark:border-red-500" : ""}
                                    `}
                />
                {errors.PhoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.PhoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Birthday */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Birthday <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                {...register("Birthday")}
                className={`
                                    bg-white border-gray-300 text-gray-900
                                    dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                    ${errors.Birthday ? "border-red-500 dark:border-red-500" : ""}
                                `}
              />
              {errors.Birthday && (
                <p className="text-sm text-red-500">
                  {errors.Birthday.message}
                </p>
              )}
            </div>

            {/* Role + Tier */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={roleID.toString()}
                  onValueChange={(value) => setValue("RoleID", parseInt(value))}
                >
                  <SelectTrigger
                    className="
                                            bg-white border-gray-300 text-gray-900
                                            dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        "
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Tier <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={tierID.toString()}
                  onValueChange={(value) => setValue("TierID", parseInt(value))}
                >
                  <SelectTrigger
                    className="
                                            bg-white border-gray-300 text-gray-900
                                            dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        "
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                    {tiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id.toString()}>
                        {tier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Min 8 characters"
                  {...register("Password")}
                  className={`
                                        bg-white border-gray-300 text-gray-900
                                        dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        ${errors.Password ? "border-red-500 dark:border-red-500" : ""}
                                    `}
                />
                {errors.Password && (
                  <p className="text-sm text-red-500">
                    {errors.Password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  {...register("ConfirmPassword")}
                  className={`
                                        bg-white border-gray-300 text-gray-900
                                        dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        ${errors.ConfirmPassword ? "border-red-500 dark:border-red-500" : ""}
                                    `}
                />
                {errors.ConfirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.ConfirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-gray-300 dark:border-neutral-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Default Address (Optional)
              </h4>

              <div className="space-y-3">
                <Input
                  placeholder="Street Address"
                  {...register("StreetAddress")}
                  className="
                                        bg-white border-gray-300 text-gray-900
                                        dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                    "
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Ward"
                    {...register("Ward")}
                    className="
                                            bg-white border-gray-300 text-gray-900
                                            dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        "
                  />
                  <Input
                    placeholder="Province"
                    {...register("Province")}
                    className="
                                            bg-white border-gray-300 text-gray-900
                                            dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                                        "
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
            className="
                            bg-white text-gray-700 border-gray-300 hover:bg-gray-100
                            dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-600 dark:hover:bg-neutral-700
                        "
          >
            Cancel
          </Button>

          <Button
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="
                            bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white
                            dark:bg-[#c7a979] dark:hover:bg-[#b1905a]
                        "
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
