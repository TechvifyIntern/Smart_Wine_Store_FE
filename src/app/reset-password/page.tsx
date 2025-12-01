"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
        style={{
          backgroundImage: "url('/sample-1.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}
