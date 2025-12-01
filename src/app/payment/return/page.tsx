import { Suspense } from "react";
import VnpayReturnContent from "./VnpayReturnContent";

export default function VnpayReturnPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <VnpayReturnContent />
    </Suspense>
  );
}