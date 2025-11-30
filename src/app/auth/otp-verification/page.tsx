import { Suspense } from "react";
import PageClient from "./PageClient";
import { Spinner } from "@/components/ui/spinner";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      }
    >
      <PageClient />
    </Suspense>
  );
}
