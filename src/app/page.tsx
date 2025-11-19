import { Hero } from "@/components/homepage/hero";
import { Collections } from "@/components/homepage/collections";
import { Statistics } from "@/components/homepage/statistics";
import { Testimonial } from "@/components/homepage/testimonial";
import { Newsletter } from "@/components/newsletter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background">
      <Header />
      <Hero />
      <Collections />
      <Statistics />
      <Testimonial />
      <Newsletter />
      <Footer />
    </main>
  );
}
