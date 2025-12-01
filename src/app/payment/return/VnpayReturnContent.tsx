"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const REQUIRED_FIELDS: Record<string, string> = {
  vnp_TransactionStatus: "Status",
  vnp_Amount: "Amount",
  vnp_OrderInfo: "Order Info",
  vnp_TxnRef: "Order Code",
  vnp_TransactionNo: "VNPAY Trans ID",
  vnp_PayDate: "Payment Time",
};

function decodeVnpDate(timeString: string) {
  if (!timeString || timeString.length !== 14) return timeString;

  const year = timeString.substring(0, 4);
  const month = timeString.substring(4, 6);
  const day = timeString.substring(6, 8);
  const hour = timeString.substring(8, 10);
  const minute = timeString.substring(10, 12);
  const second = timeString.substring(12, 14);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

export default function VnpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [paymentData, setPaymentData] = useState<Record<string, string>>({});

  useEffect(() => {
    const extracted: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (REQUIRED_FIELDS[key]) {
        extracted[key] = value;
      }
    });

    setPaymentData(extracted);
  }, [searchParams]);

  const isSuccess = paymentData["vnp_TransactionStatus"] === "00";
  const amount = paymentData["vnp_Amount"]
    ? Number(paymentData["vnp_Amount"]) / 100
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        VNPAY Payment Summary
      </h1>

      {Object.keys(paymentData).length > 0 ? (
        <>
          <Alert
            className={`mb-6 ${
              isSuccess ? "border-green-500" : "border-red-500"
            }`}
          >
            <AlertTitle className="text-lg font-semibold">
              {isSuccess ? "Payment Successful 🎉" : "Payment Failed ❌"}
            </AlertTitle>
            <AlertDescription>
              {isSuccess
                ? "Your transaction has been completed successfully."
                : "Your payment could not be processed. Please try again or contact support."}
            </AlertDescription>
          </Alert>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Payment Details</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="mt-4 space-y-4">
              {paymentData["vnp_Amount"] && (
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <div className="font-medium text-muted-foreground">
                    Amount
                  </div>
                  <Badge className="px-3 py-1 text-sm font-semibold">
                    {amount.toLocaleString()} VND
                  </Badge>
                </div>
              )}

              {Object.entries(paymentData).map(([key, value]) =>
                key === "vnp_Amount" ? null : (
                  <div
                    key={key}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
                  >
                    <span className="font-medium text-muted-foreground">
                      {REQUIRED_FIELDS[key]}
                    </span>
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                      {key === "vnp_PayDate" ? decodeVnpDate(value) : value}
                    </Badge>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              className="flex items-center gap-2"
              onClick={() => router.push("/profile")}
            >
              Go to Profile to View Order Status
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground">
          No payment details found.
        </div>
      )}
    </div>
  );
}
