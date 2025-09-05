import { Navbar } from "@/components/navbar";
import { HeroCarousel } from "@/components/hero-carousel";
import { CompanyIntro } from "@/components/sections/company-intro";
import { ProductCategories } from "@/components/sections/product-categories";
import { VideoWithQuote } from "@/components/sections/video-with-quote";
import { Advantage } from "@/components/sections/advantage";
import { CTA } from "@/components/sections/cta";
import { SiteFooter } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />
        <CompanyIntro />
        <ProductCategories />
        <VideoWithQuote />
        <Advantage />
        <CTA />
      </main>
      <SiteFooter />
    </>
  )
}