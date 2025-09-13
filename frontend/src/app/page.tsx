import { Navbar } from "@/components/navbar";
import { HeroCarousel } from "@/components/hero-carousel";
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
        <VideoWithQuote />
        <ProductCategories />
        <HeroCarousel />
        <Advantage />
        <CTA />
      </main>
      <SiteFooter />
    </>
  )
}