import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Jost } from "next/font/google";
import AuthInitializer from "@/components/auth/AuthInitializer";

export const metadata: Metadata = {
  title: "WINEICY",
  description:
    "Discover refined wines with exceptional craftsmanship and taste",
  generator: "v0.app",
  // icons: {
  //   icon: [
  //     {
  //       url: "/icon-light-32x32.png",
  //       media: "(prefers-color-scheme: light)",
  //     },
  //     {
  //       url: "/icon-dark-32x32.png",
  //       media: "(prefers-color-scheme: dark)",
  //     },
  //     {
  //       url: "/icon.svg",
  //       type: "image/svg+xml",
  //     },
  //   ],
  //   apple: "/apple-icon.png",
  // },
};
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose what you need
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jost.className}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
