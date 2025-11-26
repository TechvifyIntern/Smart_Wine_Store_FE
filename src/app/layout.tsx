"use client";

import type { Metadata } from "next";
import { useState } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Jost } from "next/font/google";
import AuthInitializer from "@/components/auth/AuthInitializer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose what you need
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" suppressHydrationWarning className={jost.className}>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthInitializer>{children}</AuthInitializer>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
