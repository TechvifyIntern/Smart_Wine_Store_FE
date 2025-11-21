"use client";

import React, { useState } from "react";
import { Lock, Eye, Trash2 } from "lucide-react";
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

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Validation Error",
        description: "All password fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Validation Error",
        description: "New password and confirm password don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });

    setPasswordData({ current: "", new: "", confirm: "" });
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
        onOpenChange={setIsPasswordDialogOpen}
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
              <Label htmlFor="current-password" className="mb-2">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current: e.target.value })
                }
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="mb-2">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="mb-2">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm: e.target.value })
                }
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>Change Password</Button>
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
