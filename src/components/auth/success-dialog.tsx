"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/contexts/LocaleContext";

interface SuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    message?: string;
    onContinue?: () => void;
    autoCloseDelay?: number;
}

export function SuccessDialog({
    open,
    onOpenChange,
    title = "Registration Successful!",
    message = "Your account has been created successfully. Welcome to WINEICY!",
    onContinue,
    autoCloseDelay,
}: SuccessDialogProps) {
    const { t } = useLocale();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (open) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);

            if (autoCloseDelay) {
                const closeTimer = setTimeout(() => {
                    onOpenChange(false);
                }, autoCloseDelay);
                return () => {
                    clearTimeout(timer);
                    clearTimeout(closeTimer);
                };
            }

            return () => clearTimeout(timer);
        }
    }, [open, autoCloseDelay, onOpenChange]);

    const handleContinue = () => {
        if (onContinue) {
            onContinue();
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-4">
                    <div className="flex justify-center relative">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping opacity-75">
                                <div className="w-24 h-24 rounded-full bg-green-500/20" />
                            </div>

                            <div className="relative w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-scale-in">
                                <CheckCircle2 className="w-16 h-16 text-green-500 animate-check" />
                            </div>

                            {showConfetti && (
                                <>
                                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-sparkle-1" />
                                    <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-yellow-400 animate-sparkle-2" />
                                    <Sparkles className="absolute top-1/2 -right-4 w-4 h-4 text-yellow-400 animate-sparkle-3" />
                                    <Sparkles className="absolute top-1/2 -left-4 w-4 h-4 text-yellow-400 animate-sparkle-4" />
                                </>
                            )}
                        </div>
                    </div>

                    <DialogTitle className="text-2xl font-bold text-center text-green-600">
                        {title || t("auth.successDialog.title")}
                    </DialogTitle>

                    <DialogDescription className="text-center text-base">
                        {message || t("auth.successDialog.message")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 pt-4">
                    <Button
                        onClick={handleContinue}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                        {t("auth.successDialog.continueButton")}
                    </Button>

                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="w-full"
                    >
                        {t("auth.successDialog.closeButton")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
