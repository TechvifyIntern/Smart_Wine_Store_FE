import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ContactClient from "./ContactClient";

export default function ContactPage() {
    return (
        <main className="bg-background min-h-screen">
            <Header />
            <ContactClient />
            <Footer />
        </main>
    );
}
