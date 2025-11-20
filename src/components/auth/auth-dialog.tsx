"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  type SignInInput,
  type SignUpInput,
  type ForgotPasswordInput,
} from "@/validations/auth";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "signin" | "signup" | "forgot";
  onModeChange: (mode: "signin" | "signup" | "forgot") => void;
}

export function AuthDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
}: AuthDialogProps) {
  // Sign In Form
  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      birthday: "",
    },
  });

  // Forgot Password Form
  const forgotPasswordForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSignInSubmit = async (data: SignInInput) => {
    try {
      console.log("[v0] Sign in submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onOpenChange(false);
      signInForm.reset();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const onSignUpSubmit = async (data: SignUpInput) => {
    try {
      console.log("[v0] Sign up submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onOpenChange(false);
      signUpForm.reset();
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordInput) => {
    try {
      console.log("[v0] Forgot password submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onOpenChange(false);
      forgotPasswordForm.reset();
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  const handleForgotPassword = () => {
    console.log("[v0] Forgot password clicked");
    signInForm.reset();
    onModeChange("forgot");
  };

  const handleModeChange = (newMode: "signin" | "signup" | "forgot") => {
    signInForm.reset();
    signUpForm.reset();
    forgotPasswordForm.reset();
    onModeChange(newMode);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      signInForm.reset();
      signUpForm.reset();
      forgotPasswordForm.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto! ">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "signin"
              ? "Sign In"
              : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Enter your credentials to access your account"
              : mode === "signup"
                ? "Join us to unlock exclusive wine experiences"
                : "Enter your email address and we'll send you a link to reset your password"}
          </DialogDescription>
        </DialogHeader>

        {/* Sign In Form */}
        {mode === "signin" && (
          <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...signInForm.register("email")}
                className={signInForm.formState.errors.email ? "border-red-500" : ""}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-red-500">{signInForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...signInForm.register("password")}
                className={signInForm.formState.errors.password ? "border-red-500" : ""}
              />
              {signInForm.formState.errors.password && (
                <p className="text-sm text-red-500">{signInForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={signInForm.watch("rememberMe")}
                  onCheckedChange={(checked) => {
                    signInForm.setValue("rememberMe", checked === true);
                  }}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? "Processing..." : "Sign In"}
            </Button>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === "signup" && (
          <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                {...signUpForm.register("name")}
                className={signUpForm.formState.errors.name ? "border-red-500" : ""}
              />
              {signUpForm.formState.errors.name && (
                <p className="text-sm text-red-500">{signUpForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...signUpForm.register("email")}
                className={signUpForm.formState.errors.email ? "border-red-500" : ""}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-red-500">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...signUpForm.register("password")}
                className={signUpForm.formState.errors.password ? "border-red-500" : ""}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-red-500">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...signUpForm.register("confirmPassword")}
                className={signUpForm.formState.errors.confirmPassword ? "border-red-500" : ""}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                {...signUpForm.register("phone")}
                className={signUpForm.formState.errors.phone ? "border-red-500" : ""}
              />
              {signUpForm.formState.errors.phone && (
                <p className="text-sm text-red-500">{signUpForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Birthday
              </Label>
              <Input
                id="birthday"
                type="date"
                {...signUpForm.register("birthday")}
                max={new Date().toISOString().split('T')[0]}
                className={signUpForm.formState.errors.birthday ? "border-red-500" : ""}
              />
              {signUpForm.formState.errors.birthday && (
                <p className="text-sm text-red-500">{signUpForm.formState.errors.birthday.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={signUpForm.formState.isSubmitting}
            >
              {signUpForm.formState.isSubmitting ? "Processing..." : "Create Account"}
            </Button>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === "forgot" && (
          <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...forgotPasswordForm.register("email")}
                className={forgotPasswordForm.formState.errors.email ? "border-red-500" : ""}
              />
              {forgotPasswordForm.formState.errors.email && (
                <p className="text-sm text-red-500">{forgotPasswordForm.formState.errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={forgotPasswordForm.formState.isSubmitting}
            >
              {forgotPasswordForm.formState.isSubmitting ? "Processing..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="border-t pt-4">
          {mode === "forgot" ? (
            <p className="text-sm text-muted-foreground text-center">
              Remember your password?{" "}
              <button
                onClick={() => handleModeChange("signin")}
                className="text-primary hover:underline font-medium"
              >
                Back to Sign In
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() =>
                  handleModeChange(mode === "signin" ? "signup" : "signin")
                }
                className="text-primary hover:underline font-medium"
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
