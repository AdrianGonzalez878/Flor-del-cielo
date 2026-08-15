import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { BestSellers } from "@/components/home/BestSellers";
import { BrandInfoSection } from "@/components/home/BrandInfoSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CraftProcess } from "@/components/home/CraftProcess";
import { HerbalCollection } from "@/components/home/HerbalCollection";
import { Hero } from "@/components/home/Hero";
import { HomeCategoryShowcase } from "@/components/home/HomeCategoryShowcase";
import { HomeClosing } from "@/components/home/HomeClosing";
import { IngredientsPhilosophy } from "@/components/home/IngredientsPhilosophy";
import { NewArrivals } from "@/components/home/NewArrivals";
import { QuizTeaser } from "@/components/home/QuizTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getHomeCarouselProducts } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const carousels = await getHomeCarouselProducts();

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <BenefitsStrip />
        <CategoryGrid />
        <BestSellers products={carousels.bestsellers} />
        <HomeCategoryShowcase
          soaps={carousels.soaps}
          shampoos={carousels.shampoos}
        />
        <CraftProcess />
        <HerbalCollection products={carousels.herbal} />
        <BrandInfoSection />
        <IngredientsPhilosophy />
        <NewArrivals products={carousels.latest} />
        <Testimonials />
        <QuizTeaser />
        <HomeClosing />
      </main>
      <Footer />
    </>
  );
}
