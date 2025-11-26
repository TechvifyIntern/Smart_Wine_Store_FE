"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Phone, Calendar, Eye, EyeOff } from "lucide-react";
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
import { useAppStore } from "@/store/auth";
import { signIn, signUp } from "@/services/auth/api";
import { useState } from "react";

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
  const { setTokens } = useAppStore();

  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  // Sign In Form
  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      UserName: "",
      Email: "",
      Password: "",
      PhoneNumber: "+84",
      Birthday: "",
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
      const { accessToken, refreshToken } = await signIn(data);
      setTokens(accessToken, refreshToken);
      onOpenChange(false);
      signInForm.reset();
    } catch (error: any) {
      console.error("Sign in error:", error);
      if (error.response?.status === 401) {
        signInForm.setError("root", {
          type: "manual",
          message: "Invalid email or password.",
        });
      } else {
        signInForm.setError("root", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const onSignUpSubmit = async (data: SignUpInput) => {
    try {
      const { accessToken, refreshToken } = await signUp(data);
      setTokens(accessToken, refreshToken);
      signUpForm.reset();
      onOpenChange(true);
      onModeChange("signin");
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (error.response?.data?.message) {
        signUpForm.setError("root", {
          type: "manual",
          message: error.response.data.message,
        });
      } else {
        signUpForm.setError("root", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
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
          <form
            onSubmit={signInForm.handleSubmit(onSignInSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="identifier"
                type="email"
                placeholder="you@example.com"
                {...signInForm.register("identifier")}
                className={
                  signInForm.formState.errors.identifier ? "border-red-500" : ""
                }
              />
              {signInForm.formState.errors.identifier && (
                <p className="text-sm text-red-500">
                  {signInForm.formState.errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showSignInPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...signInForm.register("password")}
                  className={`${signInForm.formState.errors.password ? "border-red-500" : ""} pr-10`}
                />

                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-primary"
                >
                  {showSignInPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {signInForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {signInForm.formState.errors.password.message}
                </p>
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
            {signInForm.formState.errors.root && (
              <p className="text-sm text-red-500 text-center">
                {signInForm.formState.errors.root.message}
              </p>
            )}
          </form>
        )}

        {/* Sign Up Form */}
        {mode === "signup" && (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="UserName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="UserName"
                {...signUpForm.register("UserName")}
                className={
                  signUpForm.formState.errors.UserName ? "border-red-500" : ""
                }
              />
              {signUpForm.formState.errors.UserName && (
                <p className="text-sm text-red-500">
                  {signUpForm.formState.errors.UserName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="Email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="Email"
                type="email"
                {...signUpForm.register("Email")}
                className={
                  signUpForm.formState.errors.Email ? "border-red-500" : ""
                }
              />
              {signUpForm.formState.errors.Email && (
                <p className="text-sm text-red-500">
                  {signUpForm.formState.errors.Email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="Password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>

              <div className="relative">
                <Input
                  id="Password"
                  type={showSignUpPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...signUpForm.register("Password")}
                  className={`${signUpForm.formState.errors.Password ? "border-red-500" : ""} pr-10`}
                />

                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700
                  dark:hover:text-primary"
                >
                  {showSignUpPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {signUpForm.formState.errors.Password && (
                <p className="text-sm text-red-500">
                  {signUpForm.formState.errors.Password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="PhoneNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="PhoneNumber"
                type="tel"
                {...signUpForm.register("PhoneNumber")}
                className={
                  signUpForm.formState.errors.PhoneNumber
                    ? "border-red-500"
                    : ""
                }
              />
              {signUpForm.formState.errors.PhoneNumber && (
                <p className="text-sm text-red-500">
                  {signUpForm.formState.errors.PhoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="Birthday" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Birthday
              </Label>
              <Input
                id="Birthday"
                type="date"
                {...signUpForm.register("Birthday")}
                max={new Date().toISOString().split("T")[0]}
                className={
                  signUpForm.formState.errors.Birthday ? "border-red-500" : ""
                }
              />
              {signUpForm.formState.errors.Birthday && (
                <p className="text-sm text-red-500">
                  {signUpForm.formState.errors.Birthday.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={signUpForm.formState.isSubmitting}
            >
              {signUpForm.formState.isSubmitting
                ? "Processing..."
                : "Create Account"}
            </Button>
            {signUpForm.formState.errors.root && (
              <p className="text-sm text-red-500 text-center">
                {signUpForm.formState.errors.root.message}
              </p>
            )}
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === "forgot" && (
          <form
            onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...forgotPasswordForm.register("email")}
                className={
                  forgotPasswordForm.formState.errors.email
                    ? "border-red-500"
                    : ""
                }
              />
              {forgotPasswordForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {forgotPasswordForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={forgotPasswordForm.formState.isSubmitting}
            >
              {forgotPasswordForm.formState.isSubmitting
                ? "Processing..."
                : "Send Reset Link"}
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
