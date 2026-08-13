import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { BestSellers } from "@/components/home/BestSellers";
import { BrandInfoSection } from "@/components/home/BrandInfoSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { HomeCategoryShowcase } from "@/components/home/HomeCategoryShowcase";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <BenefitsStrip />
        <CategoryGrid />
        <BestSellers />
        <NewArrivals />
        <BrandInfoSection />
        <HomeCategoryShowcase />
        <Testimonials />
        <EventsSection />
      </main>
      <Footer />
    </>
  );
}
