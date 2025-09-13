"use client"

import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, ShoppingCart, Image as ImageIcon, Play, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState, use, useRef } from "react"
import { getProductBySlug, getCategoryBySlug } from "@/lib/api"

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
  available_variants: string[]
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
}

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductBySlug(slug)
        if (productData) {
          setProduct(productData)
          const categoryData = await getCategoryBySlug(productData.category_id.toString())
          setCategory(categoryData)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Handle video play/pause events
  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  }

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-800 border-t-transparent mx-auto mb-4" />
            <p className="text-slate-600">Loading product...</p>
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }

  if (!product) {
    notFound()
  }

  // Create slideshow items: images first, then videos
  const slideshowItems = [
    ...(product.images || []).map((image, index) => ({
      type: 'image' as const,
      src: image,
      alt: `${product.name} - Image ${index + 1}`,
      key: `image-${index}`
    })),
    ...(product.videos || []).map((video, index) => ({
      type: 'video' as const,
      src: video,
      alt: `${product.name} - Video ${index + 1}`,
      key: `video-${index}`
    }))
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowItems.length) % slideshowItems.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 md:px-12">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-slate-900">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-slate-900">
                Products
              </Link>
              <span>/</span>
              <span className="text-slate-900">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-12">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Custom Image/Video Slideshow */}
                <div className="space-y-4">
                  <div className="relative">
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <CardContent className="p-0">
                        {slideshowItems.length > 0 ? (
                          <>
                            {/* Main Display */}
                            <div className="relative h-[400px] w-full">
                              {slideshowItems[currentSlide].type === 'image' ? (
                                <img
                                  src={slideshowItems[currentSlide].src}
                                  alt={slideshowItems[currentSlide].alt}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="relative h-full w-full bg-slate-900">
                                  <video
                                    ref={videoRef}
                                    src={slideshowItems[currentSlide].src}
                                    className="h-full w-full object-cover"
                                    controls
                                    preload="metadata"
                                    onPlay={handleVideoPlay}
                                    onPause={handleVideoPause}
                                  />
                                  {/* Play button overlay - only show when video is paused */}
                                  {!isVideoPlaying && (
                                    <div 
                                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                      onClick={handleVideoClick}
                                    >
                                      <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30 transition-colors">
                                        <Play className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Media Indicators Overlay - positioned above video controls */}
                              {slideshowItems.length > 1 && (
                                <div className="absolute bottom-12 inset-x-0 flex justify-center gap-2">
                                  {slideshowItems.map((item, index) => (
                                    <button
                                      key={item.key}
                                      onClick={() => goToSlide(index)}
                                      className={`transition-all duration-200 ${
                                        currentSlide === index
                                          ? 'opacity-100 drop-shadow-lg'
                                          : 'opacity-40 hover:opacity-70'
                                      }`}
                                    >
                                      {item.type === 'video' ? (
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm">
                                          <Play className="h-3 w-3 text-white fill-white" />
                                        </div>
                                      ) : (
                                        <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Navigation Arrows */}
                            {slideshowItems.length > 1 && (
                              <>
                                <button
                                  onClick={prevSlide}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
                                >
                                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                                </button>
                                <button
                                  onClick={nextSlide}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
                                >
                                  <ChevronRight className="h-5 w-5 text-slate-700" />
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="flex h-[400px] w-full items-center justify-center bg-slate-100">
                            <ImageIcon className="h-16 w-16 text-slate-400" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right: Product Name and Available Sizes */}
                <div className="space-y-6">
                  {/* Category Badge */}
                  {category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {category.name}
                    </Badge>
                  )}

                  {/* Product Name */}
                  <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{product.name}</h1>

                  {/* SKU if available */}
                  {product.sku && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">Product Code</h3>
                      <p className="text-slate-600 font-mono">{product.sku}</p>
                    </div>
                  )}

                  {/* Available Variants */}
                  {product.available_variants && product.available_variants.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">Available in:</h3>
                      <p className="text-slate-600">
                        {product.available_variants.join(' , ')}
                      </p>
                    </div>
                  )}

                  {/* Featured badge */}
                  {product.featured && (
                    <Badge className="bg-green-100 text-green-800">
                      Featured Product
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="bg-blue-800 hover:bg-blue-700">
                      <Link href="/contact">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Get Quote
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/contact">
                        <Phone className="mr-2 h-5 w-5" />
                        Call for Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">Product Details</h3>
                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <Button asChild variant="outline">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}