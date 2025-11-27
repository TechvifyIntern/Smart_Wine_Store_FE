import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import EventsClient from "./EventsClient";

export default function EventsPage() {
    return (
        <main className="bg-background min-h-screen">
            <Header />
            <EventsClient />
            <Footer />
        </main>
    );
}
