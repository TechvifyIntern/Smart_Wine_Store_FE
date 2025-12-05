"use client";

import React, { useState } from "react";
import { Lock, Eye, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod"; // Import z
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/validations/auth/passwordSchema"; // Import schema
import { changePassword } from "@/services/auth/api"; // Import API function
import { AxiosError } from "axios"; // Import AxiosError

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // New loading state

  const [passwordData, setPasswordData] = useState<ChangePasswordFormValues>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the current field as user types
    setErrors((prev) => prev.filter((err) => err.path[0] !== name));
  };

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    const parsed = changePasswordSchema.safeParse(passwordData);

    if (!parsed.success) {
      setErrors(parsed.error.issues);
      setIsChangingPassword(false);
      return;
    }

    setErrors([]); // Clear errors if validation passes

    try {
      const response = await changePassword({
        oldPassword: parsed.data.oldPassword,
        newPassword: parsed.data.newPassword,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Your password has been successfully changed.",
        });
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setIsPasswordDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("API Error - changePassword:", err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClosePasswordDialog = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors([]);
    setIsPasswordDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
    });

    // Simulate logout and redirect
    setTimeout(() => {
      router.push("/");
    }, 2000);

    setIsDeleteDialogOpen(false);
  };

  const findError = (fieldName: string) => {
    return errors.find((err) => err.path[0] === fieldName)?.message;
  };

  return (
    <div className="bg-card/40 rounded-lg shadow border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Settings</h2>
      </div>
      <div className="divide-y divide-gray-200">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Lock size={24} />
            <div>
              <h3 className="font-semibold">Password</h3>
              <p className="text-sm">Change your password</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            Update
          </Button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trash2 size={24} className="text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">Delete Account</h3>
              <p className="text-sm text-destructive">
                Permanently delete your account
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-white"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={handleClosePasswordDialog} // Use custom handler
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="oldPassword" className="mb-2">
                Current Password
              </Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className={`${findError("oldPassword") ? "border-destructive" : ""}`}
                disabled={isChangingPassword}
              />
              {findError("oldPassword") && (
                <p className="text-sm text-destructive mt-1">
                  {findError("oldPassword")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword" className="mb-2">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className={`${findError("newPassword") ? "border-destructive" : ""}`}
                disabled={isChangingPassword}
              />
              {findError("newPassword") && (
                <p className="text-sm text-destructive mt-1">
                  {findError("newPassword")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword" className="mb-2">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className={`${findError("confirmNewPassword") ? "border-destructive" : ""} pr-10`}
                  disabled={isChangingPassword}
                />
                {passwordData.confirmNewPassword.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {passwordData.confirmNewPassword ===
                    passwordData.newPassword ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
              {findError("confirmNewPassword") && (
                <p className="text-sm text-destructive mt-1">
                  {findError("confirmNewPassword")}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClosePasswordDialog}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
