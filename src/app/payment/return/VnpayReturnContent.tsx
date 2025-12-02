"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FIELD_ORDER: { key: string; label: string }[] = [
  { key: "status_text", label: "Payment Status" },
  { key: "vnp_Amount", label: "Amount" },
  { key: "vnp_TxnRef", label: "Order Code" },
  { key: "vnp_TransactionNo", label: "VNPAY Transaction ID" },
  { key: "vnp_OrderInfo", label: "Order Information" },
  { key: "vnp_PayDate", label: "Payment Time" },
];

const VNPAY_STATUS_MAP: Record<
  string,
  { title: string; description: string; success: boolean }
> = {
  "00": {
    title: "Payment Successful",
    description: "Your transaction has been processed successfully.",
    success: true,
  },
  "07": {
    title: "Suspicious Transaction",
    description: "Potential fraud detected. Please contact support.",
    success: false,
  },
  "09": {
    title: "Payment Failed",
    description: "Card/account is not registered for Internet Banking.",
    success: false,
  },
  "10": {
    title: "Payment Failed",
    description: "Incorrect card/account details entered repeatedly.",
    success: false,
  },
  "11": {
    title: "Payment Timeout",
    description: "Payment timed out. Please retry.",
    success: false,
  },
  "12": {
    title: "Payment Failed",
    description: "Your card/account has been locked.",
    success: false,
  },
  "13": {
    title: "Payment Failed",
    description: "Incorrect OTP entered.",
    success: false,
  },
  "24": {
    title: "Payment Cancelled",
    description: "You cancelled the payment.",
    success: false,
  },
  "51": {
    title: "Insufficient Balance",
    description: "Your account does not have enough balance.",
    success: false,
  },
  "65": {
    title: "Daily Limit Reached",
    description: "Transaction exceeds daily limit.",
    success: false,
  },
  "75": {
    title: "Bank Maintenance",
    description: "Your bank is currently under maintenance.",
    success: false,
  },
  "79": {
    title: "Payment Failed",
    description: "Too many incorrect password attempts.",
    success: false,
  },
  "99": {
    title: "Unknown Error",
    description: "An unexpected error occurred.",
    success: false,
  },
};

// Convert VNPAY timestamp
function formatVnpTimestamp(str: string) {
  if (!str || str.length !== 14) return str;
  const y = str.substring(0, 4);
  const m = str.substring(4, 6);
  const d = str.substring(6, 8);
  const h = str.substring(8, 10);
  const min = str.substring(10, 12);
  const s = str.substring(12, 14);
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
}

export default function VnpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    const collected: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      collected[key] = value;
    });

    const statusCode = collected["vnp_TransactionStatus"];
    const statusInfo = VNPAY_STATUS_MAP[statusCode] || {
      title: "Unknown Status",
      description: "Unable to determine payment result.",
      success: false,
    };

    collected["status_text"] = statusInfo.title;

    setData(collected);
  }, [searchParams]);

  const statusCode = data["vnp_TransactionStatus"];
  const statusInfo =
    VNPAY_STATUS_MAP[statusCode] ??
    ({ title: "Unknown Status", description: "...", success: false } as any);

  const isSuccess = statusInfo.success;

  const amount = data["vnp_Amount"] ? Number(data["vnp_Amount"]) / 100 : 0;

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        VNPAY Payment Summary
      </h1>

      <Alert
        className={`mb-6 ${isSuccess ? "border-green-500" : "border-red-500"}`}
      >
        <AlertTitle className="text-lg font-semibold">
          {statusInfo.title} {isSuccess ? "🎉" : "❌"}
        </AlertTitle>
        <AlertDescription>{statusInfo.description}</AlertDescription>
      </Alert>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Payment Details</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="mt-4 space-y-4">
          {FIELD_ORDER.map(({ key, label }) => {
            if (!data[key]) return null;

            const value =
              key === "vnp_Amount"
                ? `${amount.toLocaleString()} VND`
                : key === "vnp_PayDate"
                  ? formatVnpTimestamp(data[key])
                  : data[key];

            return (
              <div
                key={key}
                className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
              >
                <span className="font-medium text-muted-foreground">
                  {label}
                </span>
                <Badge className="px-3 py-1 text-sm">{value}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={() => router.push("/profile")}
        >
          View Your Order Status
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
