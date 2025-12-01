"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/validations/auth/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { resetPassword } from "@/services/auth/api";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: token || "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      form.setError("root", { message: "Token is missing." });
      return;
    }
    try {
      await resetPassword(data);
      toast({
        title: "Success",
        description:
          "Your password has been reset successfully. Please sign in.",
      });
      router.push("/"); // Redirect to home or login page
    } catch (error: any) {
      console.error("Reset password error:", error);
      form.setError("root", {
        message:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  if (!token) {
    return (
      <div className="text-red-500">
        Invalid password reset link. Token is missing.
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-sm p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            {...form.register("newPassword")}
            className={
              form.formState.errors.newPassword ? "border-red-500" : ""
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-primary"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...form.register("confirmPassword")}
            className={
              form.formState.errors.confirmPassword ? "border-red-500" : ""
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-primary"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>
      {form.formState.errors.root && (
        <p className="text-sm text-red-500 text-center">
          {form.formState.errors.root.message}
        </p>
      )}
    </form>
  );
}
