"use client";

import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/contexts/LocaleContext";

interface OtpVerificationProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: string;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
}

export function OtpVerification({
    open,
    onOpenChange,
    email,
    onVerify,
    onResend,
}: OtpVerificationProps) {
    const { t } = useLocale();
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const [error, setError] = useState<string>("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!open) {
            setTimeLeft(120);
            return;
        }

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
    }, [open, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            setError(t("auth.otpVerification.errors.enterAllDigits"));
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            await onVerify(otpString);
            setOtp(["", "", "", "", "", ""]);
            setTimeLeft(120);
        } catch (err: any) {
            setError(err.message || t("auth.otpVerification.errors.invalidOTP"));
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        try {
            await onResend();
            setTimeLeft(120);
            setOtp(["", "", "", "", "", ""]);
            setError("");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message || t("auth.otpVerification.errors.resendFailed"));
        }
    };

    useEffect(() => {
        if (open) {
            setOtp(["", "", "", "", "", ""]);
            setError("");
            setTimeLeft(120);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {t("auth.otpVerification.title")}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {t("auth.otpVerification.description")}
                        <br />
                        <span className="font-semibold text-foreground">{email}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-center text-muted-foreground">
                            {t("auth.otpVerification.enterCode")}
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
                                    className={`w-12 h-12 text-center text-xl font-semibold ${error ? "border-red-500" : ""
                                        }`}
                                    disabled={isVerifying || timeLeft === 0}
                                />
                            ))}
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                    </div>

                    <div className="text-center">
                        <div
                            className={`text-2xl font-bold ${timeLeft <= 30 ? "text-red-500" : "text-primary"
                                }`}
                        >
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {timeLeft > 0
                                ? t("auth.otpVerification.timeRemaining")
                                : t("auth.otpVerification.codeExpired")}
                        </p>
                    </div>

                    <Button
                        onClick={handleVerify}
                        disabled={
                            isVerifying || otp.some((d) => !d) || timeLeft === 0
                        }
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        {isVerifying ? t("auth.otpVerification.verifying") : t("auth.otpVerification.verifyButton")}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            {t("auth.otpVerification.didntReceive")}{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timeLeft > 0}
                                className={`font-semibold ${timeLeft > 0
                                    ? "text-muted-foreground cursor-not-allowed"
                                    : "text-primary hover:underline"
                                    }`}
                            >
                                {t("auth.otpVerification.resendOTP")}
                            </button>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
