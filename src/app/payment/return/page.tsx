import { Suspense } from "react";
import VnpayReturnContent from "./VnpayReturnContent";
import { Spinner } from "@/components/ui/spinner";

export default function VnpayReturnPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    }>
      <VnpayReturnContent />
    </Suspense>
  );
}