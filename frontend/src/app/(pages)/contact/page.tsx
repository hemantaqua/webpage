"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { SiteFooter as Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MessageSquare, Send } from "lucide-react"
import { submitInquiry } from "@/lib/api"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    try {
      const res = await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || undefined,
        message: formData.message,
      })
      if (res) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus("idle"), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-600 md:text-xl">
            <p>
              Ready to transform your water and energy systems? We're here to help you find the perfect sustainable
              solutions for your agricultural, residential, or commercial needs.
            </p>
            <p>
              Get in touch with our expert team today and discover how Hemant Aqua Solutions can optimize your
              operations while reducing environmental impact.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Contact Info */}
            <Card className="h-fit border border-slate-200 shadow-lg rounded-2xl bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Get in Touch</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-800 to-green-600 rounded-full"></div>
                </div>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 shadow-md">
                      <Mail className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">Email</p>
                      <a
                        href="mailto:info@hemantaquasolutions.com"
                        className="text-slate-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                      >
                        info@hemantaquasolutions.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-md">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">Phone</p>
                      <a
                        href="tel:+919876543210"
                        className="text-slate-600 hover:text-green-600 transition-colors duration-200 text-sm"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        asChild
                        className="flex-1 bg-blue-800 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-200 rounded-full py-3 shadow-md"
                      >
                        <a
                          href="mailto:info@hemantaquasolutions.com"
                          className="flex items-center justify-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email Us
                        </a>
                      </Button>

                      <Button
                        asChild
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 hover:scale-105 transition-all duration-200 rounded-full py-3 shadow-md"
                      >
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Contact Form */}
            <Card className="border border-slate-200 shadow-lg rounded-2xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Phone *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Subject Field (Optional) */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-500">
                      Subject (optional)
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief subject of your inquiry"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project requirements, questions, or how we can help you..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-800 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <p className="text-sm text-green-600 text-center">
                      Message sent successfully! We'll get back to you soon.
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}