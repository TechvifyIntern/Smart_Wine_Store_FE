"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/contexts/LocaleContext";

export default function OtpVerificationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLocale();
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [error, setError] = useState<string>("");
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const email = searchParams.get("email") || "";

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleVerify = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError(t("auth.otpVerification.errors.enterAllDigits") || "Please enter all 6 digits");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            // TODO: Implement OTP verification logic
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            // On success, redirect to success page or dashboard
            router.push("/profile");
        } catch (err: any) {
            setError(err.message || (t("auth.otpVerification.errors.invalidOTP") || "Invalid OTP"));
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            // TODO: Implement resend OTP logic
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            setTimeLeft(600);
            setOtp(["", "", "", "", "", ""]);
            setError("");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message || (t("auth.otpVerification.errors.resendFailed") || "Failed to resend OTP"));
        } finally {
            setIsResending(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setTimeLeft(600);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("common.back") || "Back"}
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t("auth.otpVerification.title") || "Verify Your Email"}
                    </h1>
                    <p className="text-gray-600">
                        {t("auth.otpVerification.description") || "We've sent a verification code to"}
                        <br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-center text-gray-600 mb-4">
                            {t("auth.otpVerification.enterCode") || "Enter the 6-digit code"}
                        </p>
                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-12 text-center text-xl font-semibold border-2 ${error ? "border-red-500" : "border-gray-300 focus:border-primary"
                                        } rounded-lg`}
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
                        )}
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                        <div
                            className={`text-3xl font-bold ${timeLeft <= 60 ? "text-red-500" : "text-primary"
                                }`}
                        >
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {timeLeft > 0
                                ? (t("auth.otpVerification.timeRemaining") || "Time remaining")
                                : (t("auth.otpVerification.codeExpired") || "Code expired")}
                        </p>
                    </div>

                    {/* Verify Button */}
                    <Button
                        onClick={handleVerify}
                        disabled={
                            isVerifying || otp.some((d) => !d) || timeLeft === 0
                        }
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold"
                    >
                        {isVerifying
                            ? (t("auth.otpVerification.verifying") || "Verifying...")
                            : (t("auth.otpVerification.verifyButton") || "Verify")}
                    </Button>

                    {/* Resend Button */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            {t("auth.otpVerification.didntReceive") || "Didn't receive the code?"}{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timeLeft > 0 || isResending}
                                className={`font-semibold ${timeLeft > 0
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-primary hover:underline"
                                    }`}
                            >
                                {isResending
                                    ? (t("auth.otpVerification.resending") || "Resending...")
                                    : (t("auth.otpVerification.resendOTP") || "Resend")}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
