import { Suspense } from "react";
import PageClient from "./PageClient";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mt-28">Loading products...</div>
      }
    >
      <PageClient />
    </Suspense>
  );
}
