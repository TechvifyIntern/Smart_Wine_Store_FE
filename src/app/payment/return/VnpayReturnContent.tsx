"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FIELD_ORDER = [
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
  "24": {
    title: "Payment Cancelled",
    description: "You cancelled the payment.",
    success: false,
  },
  "02": {
    title: "Bank Declined Transaction",
    description: "The payment was not completed.",
    success: false,
  },
  "99": {
    title: "Unknown Error",
    description: "An unexpected error occurred.",
    success: false,
  },
};

function formatVnpTimestamp(str: string) {
  if (!str || str.length !== 14) return str;
  return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)} ${str.slice(8, 10)}:${str.slice(10, 12)}:${str.slice(12)}`;
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

    // LẤY MÃ CHÍNH XÁC CỦA VNPAY
    const responseCode = collected["vnp_ResponseCode"];
    const statusInfo = VNPAY_STATUS_MAP[responseCode] ||
      VNPAY_STATUS_MAP[collected["vnp_TransactionStatus"]] || {
        title: "Unknown Status",
        description: "Unable to determine payment result.",
        success: false,
      };

    collected["status_text"] = statusInfo.title;
    setData(collected);
  }, [searchParams]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="container mx-auto mt-20 text-center text-gray-600">
        <p>No payment data found.</p>
      </div>
    );
  }

  const amount = data["vnp_Amount"]
    ? (Number(data["vnp_Amount"]) / 100).toLocaleString()
    : "0";

  const responseCode = data["vnp_ResponseCode"];
  const statusInfo = VNPAY_STATUS_MAP[responseCode] ||
    VNPAY_STATUS_MAP[data["vnp_TransactionStatus"]] || {
      title: "Unknown Status",
      description: "...",
      success: false,
    };

  const isSuccess = statusInfo.success;

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
                ? `${amount} VND`
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
