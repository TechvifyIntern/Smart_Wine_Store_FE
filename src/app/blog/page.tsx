import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import BlogClient from "./BlogClient";

export default function BlogPage() {
    return (
        <main className="bg-background min-h-screen">
            <Header />
            <BlogClient />
            <Footer />
        </main>
    );
}
