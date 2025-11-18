import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Heritage } from "@/components/heritage";
import { Featured } from "@/components/featured";
import { Collections } from "@/components/collections";
import { Experience } from "@/components/experience";
import { Events } from "@/components/events";
import { Statistics } from "@/components/statistics";
import { Testimonial } from "@/components/testimonial";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-background">
      <Header />
      <Hero />
      {/* <Heritage /> */}
      {/* <Featured /> */}
      <Collections />
      <Statistics />
      {/* <Experience /> */}
      {/* <Events /> */}
      <Testimonial />
      <Newsletter />
      <Footer />
    </main>
  );
}
