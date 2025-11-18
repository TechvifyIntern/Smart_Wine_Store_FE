import { Header } from "@/components/header";
import "./../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
