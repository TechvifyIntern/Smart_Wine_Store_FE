import { Newsletter } from "@/components/newsletter";
import "./../../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Newsletter />
      <Footer />
    </>
  );
}
