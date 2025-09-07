"use client"

import { Navbar } from "@/components/navbar"
import { SiteFooter as Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Handshake, Lightbulb, Recycle, Users } from "lucide-react"
import { useEffect, useRef } from "react"

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)
  const valuesRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-4")
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = [heroRef, storyRef, missionRef, valuesRef]
    sections.forEach((ref) => {
      if (ref.current) {
        ref.current.classList.add("opacity-0", "translate-y-4", "transition-all", "duration-700")
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/modern-agricultural-field-with-solar-panels-and-cl.jpg')`,
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance max-w-md mx-auto">About Us</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl text-pretty">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={storyRef} className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
              explicabo.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section ref={missionRef} className="py-16 md:py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-6 mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h3>
                <p className="text-slate-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6 mx-auto">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our Vision</h3>
                <p className="text-slate-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section ref={valuesRef} className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center mb-12">
            The Principles That Guide Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-4 mx-auto transition-colors duration-200 group-hover:bg-green-600">
                <Handshake className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Integrity</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                We conduct business with honesty, transparency, and ethical practices in all our interactions.
              </p>
            </div>

            <div className="text-center group transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-4 mx-auto transition-colors duration-200 group-hover:bg-green-600">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Innovation</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                We continuously seek creative solutions and embrace new technologies to serve our customers better.
              </p>
            </div>

            <div className="text-center group transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-4 mx-auto transition-colors duration-200 group-hover:bg-green-600">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Sustainability</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                We prioritize environmental responsibility and sustainable practices in all our solutions.
              </p>
            </div>

            <div className="text-center group transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-4 mx-auto transition-colors duration-200 group-hover:bg-green-600">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Customer Commitment</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                We are dedicated to exceeding customer expectations through exceptional service and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}