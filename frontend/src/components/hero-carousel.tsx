"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import type { CarouselApi } from "@/components/ui/carousel" // Corrected import

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import irrigationImage from "@/assets/images/farmer_hero_slider.png"
import waterImage from "@/assets/images/water_supply_hero_slider.png"
import solarImage from "@/assets/images/solar_panels_hero_slider.png"

type Slide = {
  key: string
  title: string
  subtitle: string
  cta: string
  href: string
  imageUrl: any
}

const slides: Slide[] = [
  {
    key: "drip-irrigation-kit",
    title: "Drip Irrigation Kit 50m",
    subtitle: "Complete irrigation solution for efficient water distribution and optimal crop growth.",
    cta: "View Product",
    href: "/products/drip-irrigation-kit-50m",
    imageUrl: irrigationImage,
  },
  {
    key: "pv-junction-box",
    title: "PV Junction Box IP68",
    subtitle: "Weather-resistant electrical connection box for reliable solar panel installations.",
    cta: "View Product",
    href: "/products/pv-junction-box-ip68",
    imageUrl: solarImage,
  },
  {
    key: "water-level-controller",
    title: "Auto Water Level Controller Sensors",
    subtitle: "Smart automation system for precise water level monitoring and control.",
    cta: "View Product",
    href: "/products/auto-water-level-controller-sensors",
    imageUrl: waterImage,
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section 
      aria-label="Featured products" 
      className="relative"
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.key} className="p-0">
              <div
                className="relative flex min-h-screen items-center justify-center"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={index === 0} // Load the first image eagerly
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60" />
                <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
                  <h1 className="text-balance text-4xl font-bold text-white md:text-5xl lg:text-6xl">{slide.title}</h1>
                  <p className="text-pretty max-w-3xl text-base leading-relaxed text-slate-100 md:text-lg">
                    {slide.subtitle}
                  </p>
                  <Button asChild size="lg">
                    <Link href={slide.href}>{slide.cta}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-6 left-4 z-20 hidden md:block">
          <CarouselPrevious className="static border-0 bg-white/80 text-slate-900 hover:bg-white" />
        </div>
        <div className="absolute bottom-6 right-4 z-20 hidden md:block">
          <CarouselNext className="static border-0 bg-white/80 text-slate-900 hover:bg-white" />
        </div>
        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  current === i ? "bg-white" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  )
}