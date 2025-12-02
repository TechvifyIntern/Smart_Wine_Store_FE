import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { Nunito } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { Chatbot } from "@/components/chatbot/Chatbot";
import AuthInitializer from "@/components/auth/AuthInitializer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "WINEICY",
  description:
    "Discover refined wines with exceptional craftsmanship and taste",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/logo-public.png", type: "image/svg+xml" },
      { url: "/logo-public.png" },
    ],
    shortcut: "/logo-public.png",
    apple: "/logo-public.png",
  },
};
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // choose what you need
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={nunito.className}>
      <body>
        <QueryProvider>
          <LocaleProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ScrollToTop />
              <AuthInitializer>{children}</AuthInitializer>
              <Toaster />
              <Sonner />
              <Chatbot />
            </ThemeProvider>
          </LocaleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
