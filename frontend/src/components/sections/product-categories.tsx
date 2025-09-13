import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import irrigationImage from "@/assets/images/irrigation_product_category_face_homepage.png"
import waterImage from "@/assets/images/water_supply_category_face_homepage.png"
import solarImage from "@/assets/images/solar_product_category_face_homepage.png"
import waterLevelImage from "@/assets/images/Water_Level_Controller_homepage.jpg"

const categories = [
  {
    slug: "irrigation-systems",
    title: "Irrigation Systems",
    desc: "From drip irrigation to advanced sprinkler systems, we provide precision solutions to maximize your yields while conserving water. Our products are designed for durability and efficiency in any agricultural setting.",
    img: irrigationImage,
  },
  {
    slug: "water-distribution",
    title: "Water Distribution",
    desc: "We offer a complete range of PVC and HDPE pipe networks, engineered for longevity and peak performance. Our solutions are ideal for municipal, industrial, and agricultural water management.",
    img: waterImage,
  },
  {
    slug: "solar-solutions",
    title: "Solar Components",
    desc: "Harness the power of the sun with our reliable solar modules, inverters, and mounting structures. We provide the essential components for robust and efficient clean energy projects of any scale.",
    img: solarImage,
  },
  {
    slug: "water-level-controller",
    title: "Water Level Controllers",
    desc: "Automate and protect your water systems with intelligent controllers and sensors that prevent dry runs, overflow, and wastage—built for reliability in residential and agricultural use.",
    img: waterLevelImage,
  },
]

export function ProductCategories() {
  return (
    <section className="bg-slate-50/70">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="mb-10 text-center text-3xl font-semibold text-slate-900 md:mb-12 md:text-4xl">
          Our Core Solutions
        </h2>

        <div className="flex flex-col gap-12">
          {categories.map((category, index) => (
            <div
              key={category.slug}
              className="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl md:grid-cols-5 md:gap-12"
            >
              {/* Image Section */}
              <div className={`relative h-64 md:col-span-2 md:h-full ${index % 2 === 1 ? "md:order-last" : ""}`}>
                <Image
                  src={category.img}
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col p-8 md:col-span-3">
                <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{category.desc}</p>
                <div className="mt-6">
                  <Button asChild size="lg">
                  <Link href={{ pathname: "/products", query: { section: category.slug } }} scroll={false}>View Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}