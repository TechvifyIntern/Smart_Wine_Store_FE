import { HeroSlider } from "@/components/homepage/HeroSlider";
import { CollectionsContainer } from "@/components/homepage/collections";
import { Statistics } from "@/components/homepage/statistics";
import { Testimonial } from "@/components/homepage/testimonial";
import { Newsletter } from "@/components/newsletter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Parallax from "@/components/homepage/parallax";

export default function Home() {
  return (
    <main className="bg-background">
      <Header />
      <HeroSlider />
      <CollectionsContainer />
      <Statistics />
      <Parallax />
      <Testimonial />
      <Newsletter />
      <Footer />
    </main>
  );
}
