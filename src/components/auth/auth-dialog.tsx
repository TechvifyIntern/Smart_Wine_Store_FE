"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Phone, Calendar, Eye, EyeOff, Check } from "lucide-react";
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
  otpSchema,
  type SignInInput,
  type SignUpInput,
  type ForgotPasswordInput,
  type OtpInput,
} from "@/validations/auth";
import { useAppStore } from "@/store/auth";
import { signIn, signUp, verifyOtp, resendOtp } from "@/services/auth/api";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type AuthMode = "signin" | "signup" | "forgot" | "otp";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
}: AuthDialogProps) {
  const { setTokens } = useAppStore();
  const { t } = useLocale();

  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      UserName: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      PhoneNumber: "+84",
      Birthday: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
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
          message: t("auth.signInDialog.errors.invalidCredentials"),
        });
      } else {
        signInForm.setError("root", {
          type: "manual",
          message: t("auth.signInDialog.errors.unexpectedError"),
        });
      }
    }
  };

  const onSignUpSubmit = async (data: SignUpInput) => {
    try {
      const apiData = { ...data, RoleID: data.RoleID || 3 };
      await signUp(apiData);
      setEmailForOtp(data.Email);
      onModeChange("otp");
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (error.response?.status === 409) {
        signUpForm.setError("root", {
          type: "manual",
          message: t("auth.signUpDialog.errors.emailExists"),
        });
      } else {
        signUpForm.setError("root", {
          type: "manual",
          message: error.response?.data?.message || t("auth.signUpDialog.errors.unexpectedError"),
        });
      }
    }
  };

  const onOtpSubmit = async (data: OtpInput) => {
    try {
      const { accessToken, refreshToken } = await verifyOtp(emailForOtp, data.otp);
      setTokens(accessToken, refreshToken);
      onOpenChange(false);
      otpForm.reset();
      signUpForm.reset();
    } catch (error: any) {
      console.error("OTP verification error:", error);
      otpForm.setError("root", {
        type: "manual",
        message: "Invalid OTP. Please try again.",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(emailForOtp);
      // Optionally, show a success message to the user
      console.log("OTP resent successfully");
    } catch (error) {
      console.error("Resend OTP error:", error);
      // Optionally, show an error message
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
    signInForm.reset();
    onModeChange("forgot");
  };

  const handleModeChange = (newMode: AuthMode) => {
    signInForm.reset();
    signUpForm.reset();
    forgotPasswordForm.reset();
    otpForm.reset();
    onModeChange(newMode);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      signInForm.reset();
      signUpForm.reset();
      forgotPasswordForm.reset();
      otpForm.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto! ">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "signin"
              ? t("auth.signInDialog.title")
              : mode === "signup"
                ? t("auth.signUpDialog.title")
                : mode === "otp"
                  ? "Verify your email"
                  : t("auth.forgotPasswordDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? t("auth.signInDialog.description")
              : mode === "signup"
                ? t("auth.signUpDialog.description")
                : mode === "otp"
                  ? "We've sent a 6-digit code to your email. Please enter it below."
                  : t("auth.forgotPasswordDialog.description")}
          </DialogDescription>
        </DialogHeader>

        {mode === "otp" && (
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-red-500">{otpForm.formState.errors.otp.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">Verify</Button>
            {otpForm.formState.errors.root && (
              <p className="text-sm text-red-500 text-center">{otpForm.formState.errors.root.message}</p>
            )}
            <div className="text-center text-sm">
              Didn't receive the code?{" "}
              <button type="button" onClick={handleResendOtp} className="text-primary hover:underline">
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {mode === "signin" && (
          <form
            onSubmit={signInForm.handleSubmit(onSignInSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t("auth.signInDialog.emailLabel")}
              </Label>
              <Input
                id="identifier"
                type="email"
                placeholder={t("auth.signInDialog.emailPlaceholder")}
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
                {t("auth.signInDialog.passwordLabel")}
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showSignInPassword ? "text" : "password"}
                  placeholder={t("auth.signInDialog.passwordPlaceholder")}
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
                  {t("auth.signInDialog.rememberMe")}
                </Label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                {t("auth.signInDialog.forgotPassword")}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? t("auth.signInDialog.processing") : t("auth.signInDialog.signInButton")}
            </Button>
            {signInForm.formState.errors.root && (
              <p className="text-sm text-red-500 text-center">
                {signInForm.formState.errors.root.message}
              </p>
            )}
          </form>
        )}

        {mode === "signup" && (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="UserName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("auth.signUpDialog.fullNameLabel")}
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
                {t("auth.signUpDialog.emailLabel")}
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
                {t("auth.signUpDialog.passwordLabel")}
              </Label>

              <div className="relative">
                <Input
                  id="Password"
                  type={showSignUpPassword ? "text" : "password"}
                  placeholder={t("auth.signUpDialog.passwordPlaceholder")}
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
              <Label htmlFor="ConfirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t("auth.signUpDialog.confirmPasswordLabel")}
              </Label>

              <div className="relative">
                <Input
                  id="ConfirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.signUpDialog.passwordPlaceholder")}
                  {...signUpForm.register("ConfirmPassword")}
                  className={`${signUpForm.formState.errors.ConfirmPassword ? "border-red-500" : ""} pr-20`}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {signUpForm.watch("Password") &&
                    signUpForm.watch("ConfirmPassword") &&
                    signUpForm.watch("Password") === signUpForm.watch("ConfirmPassword") &&
                    !signUpForm.formState.errors.ConfirmPassword && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {signUpForm.formState.errors.ConfirmPassword && (
                <p className="text-sm text-red-500">
                  {signUpForm.formState.errors.ConfirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="PhoneNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t("auth.signUpDialog.phoneLabel")}
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
                {t("auth.signUpDialog.birthdayLabel")}
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
                ? t("auth.signUpDialog.processing")
                : t("auth.signUpDialog.createButton")}
            </Button>
            {signUpForm.formState.errors.root && (
              <p className="text-sm text-red-500 text-center">
                {signUpForm.formState.errors.root.message}
              </p>
            )}
          </form>
        )}

        {mode === "forgot" && (
          <form
            onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t("auth.forgotPasswordDialog.emailLabel")}
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
                ? t("auth.forgotPasswordDialog.processing")
                : t("auth.forgotPasswordDialog.sendButton")}
            </Button>
          </form>
        )}

        <div className="border-t pt-4">
          {mode === "forgot" ? (
            <p className="text-sm text-muted-foreground text-center">
              {t("auth.forgotPasswordDialog.rememberPassword")}{" "}
              <button
                onClick={() => handleModeChange("signin")}
                className="text-primary hover:underline font-medium"
              >
                {t("auth.forgotPasswordDialog.backToSignIn")}
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              {mode === "signin"
                ? t("auth.signInDialog.noAccount")
                : t("auth.signUpDialog.haveAccount")}{" "}
              <button
                onClick={() =>
                  handleModeChange(mode === "signin" ? "signup" : "signin")
                }
                className="text-primary hover:underline font-medium"
              >
                {mode === "signin" ? t("auth.signInDialog.signUpLink") : t("auth.signUpDialog.signInLink")}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog >
  );
}
