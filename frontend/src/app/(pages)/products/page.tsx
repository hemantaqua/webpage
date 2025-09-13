"use client"

import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Zap, Wrench, Gauge, ArrowRight, Phone, Image as ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getCategories, getProducts } from "@/lib/api"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon_url?: string
}

interface Product {
  id: number
  category_id: number
  name: string
  slug: string
  description: string
  images: string[]
  videos: string[]
  sku?: string
  featured: boolean
}

const categoryIcons = {
  'irrigation-systems': Droplets,
  'water-distribution': Wrench,
  'solar-solutions': Zap,
  'water-level-controller': Gauge,
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({})
  const [activeSection, setActiveSection] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          getCategories(),
        ])
        
        if (categoriesData) {
          // Define the desired order for categories
          const categoryOrder = ['irrigation-systems', 'water-distribution', 'solar-solutions', 'water-level-controller']
          
          // Sort categories according to the desired order
          const sortedCategories = categoryOrder
            .map(slug => categoriesData.find((cat: Category) => cat.slug === slug))
            .filter(Boolean) as Category[]
          
          setCategories(sortedCategories)
          setActiveSection(sortedCategories[0]?.slug || "")
          
          // Fetch products for each category
          const productsPromises = sortedCategories.map(async (category: Category) => {
            const products = await getProducts(category.slug)
            return { categorySlug: category.slug, products: products || [] }
          })
          
          const productsResults = await Promise.all(productsPromises)
          const productsMap: Record<string, Product[]> = {}
          
          productsResults.forEach(({ categorySlug, products }) => {
            productsMap[categorySlug] = products
          })
          
          setProductsByCategory(productsMap)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Scroll helpers for anchor navigation (accounts for sticky navbar ~64px)
  const scrollWithOffset = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return false
    const y = el.getBoundingClientRect().top + window.scrollY - 64
    window.scrollTo({ top: y, behavior: "smooth" })
    return true
  }
  
  const scrollToTargetReliably = (id: string) => {
    const start = performance.now()
    const attempt = () => {
      if (scrollWithOffset(id)) {
        history.replaceState(null, "", `#${id}`)
        return
      }
      if (performance.now() - start < 3000) requestAnimationFrame(attempt)
    }
    requestAnimationFrame(attempt)
  }
  
  // Simple wrapper used by sidebar buttons
  const scrollToSection = (sectionId: string) => {
    scrollToTargetReliably(sectionId)
  }
  
  useEffect(() => {
    if (!categories.length) return
    const hash = decodeURIComponent(window.location.hash.replace("#", ""))
    const params = new URLSearchParams(window.location.search)
    const section = hash || params.get("section") || ""
    if (section) requestAnimationFrame(() => scrollToTargetReliably(section))
  }, [categories])

  // Handle hash changes (e.g., clicking navbar while on page)
  useEffect(() => {
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.replace("#", ""))
      if (id) scrollWithOffset(id)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Track section in view for sidebar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(cat.slug))
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(categories[i].slug)
          break
        }
      }
    }

    if (categories.length > 0) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [categories])

  const getCoverImage = (product: Product): string | null => {
    return product.images && product.images.length > 0 ? product.images[0] : null
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-800 border-t-transparent mx-auto mb-4" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-16 z-10 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Categories</h2>
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || Wrench
              return (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.slug)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeSection === category.slug
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content shifted to the right of the fixed sidebar */}
      <main className="ml-64">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 px-6 py-16 md:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold text-slate-900 md:text-5xl">Our Products</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our comprehensive range of water management and solar energy solutions designed to meet your
              agricultural and residential needs.
            </p>
          </div>
        </section>

        {/* Product Categories */}
        {categories.map((category, categoryIndex) => {
          const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || Wrench
          const products = productsByCategory[category.slug] || []
          
          return (
            <section
              key={category.id}
              id={category.slug}
              className={`px-6 py-16 md:px-12 ${categoryIndex % 2 === 0 ? "bg-white" : "bg-slate-50"} scroll-mt-24`}
            >
              <div className="mx-auto max-w-6xl">
                {/* Category Header */}
                <div className="mb-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Icon className="h-8 w-8 text-blue-800" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{category.name}</h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">{category.description}</p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                      const coverImage = getCoverImage(product)
                      return (
                        <Link key={product.id} href={`/products/${product.slug}`}>
                          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                            <CardHeader className="p-0">
                              <div className="aspect-square overflow-hidden rounded-t-lg bg-slate-100">
                                {coverImage ? (
                                  <img
                                    src={coverImage}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <ImageIcon className="h-12 w-12" />
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <CardTitle className="text-xl text-slate-900 text-center">{product.name}</CardTitle>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No products available in this category yet.</p>
                  </div>
                )}
              </div>
            </section>
          )
        })}

        {/* CTA Section - modern rounded rectangle, does not touch sidebar */}
        <section className="px-6 py-16 md:px-12 relative z-20">
          <div className="mx-auto max-w-6xl">
            <div className="bg-blue-800 rounded-3xl px-8 py-16 text-white">
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Water Management?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Contact our experts today to find the perfect solution for your specific needs and get a customized
                  quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                    <Link href="/contact">
                      Get Free Consultation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-800 bg-transparent"
                  >
                    <Link href="/contact">
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Ensure footer sits above sidebar visually if overlapping */}
      <div className="relative z-20">
        <SiteFooter />
      </div>
    </>
  )
}