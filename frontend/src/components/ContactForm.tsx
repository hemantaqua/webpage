'use client'

import { useState } from 'react'
import { submitInquiry } from '@/lib/api'
import { Mail, Phone, User, MessageSquareText } from 'lucide-react'

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.94 11.94 0 0012.04 0C5.46 0 .11 5.35.11 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.48h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.46-8.43zM12.05 21.5h-.01a9.55 9.55 0 01-4.86-1.32l-.35-.2-3.73.98.99-3.64-.23-.37a9.54 9.54 0 01-1.47-5.01C2.39 6.69 6.74 2.34 12.04 2.34c2.54 0 4.94.99 6.74 2.78a9.48 9.48 0 012.8 6.75c0 5.3-4.35 9.63-9.53 9.63zm5.48-7.13c-.3-.16-1.76-.87-2.04-.97-.27-.1-.47-.16-.67.16-.2.31-.77.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.49-.89-.79-1.49-1.76-1.67-2.06-.17-.31-.02-.48.13-.64.14-.14.3-.36.45-.54.15-.19.2-.31.3-.52.1-.21.05-.39-.02-.55-.07-.16-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.36-.27.31-1.04 1.02-1.04 2.49 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.09 4.48.71.31 1.25.49 1.68.63.7.23 1.33.2 1.84.12.56-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.26-.2-.56-.36z" />
    </svg>
  )
}

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = new FormData(e.currentTarget)
    const payload = {
      name: (form.get('name') as string) || '',
      email: (form.get('email') as string) || '',
      phone: (form.get('phone') as string) || '',
      subject: (form.get('subject') as string) || undefined,
      message: (form.get('message') as string) || '',
    }

    try {
      const res = await submitInquiry(payload)
      if (res) {
        setStatus('success')
        e.currentTarget.reset()
      } else {
        setStatus('error')
        setErrorMsg('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
        {/* Left info card */}
        <div className="rounded-2xl border bg-white shadow-sm p-8 md:p-10 h-full">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">Get in Touch</h2>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-800 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-sm font-medium text-slate-900">Email</div>
                <a href="mailto:info@hemantaqua.com" className="text-slate-700 hover:underline">
                  info@hemantaqua.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-800 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-sm font-medium text-slate-900">Phone</div>
                <a href="tel:+919876543210" className="text-slate-700 hover:underline">
                  +91 98765 43210
                </a>
              </div>
            </li>
          </ul>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:info@hemantaqua.com"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              <span>Email Us</span>
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right form card */}
        <div className="rounded-2xl border bg-white shadow-sm p-8 md:p-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Send us a message</h2>

          {/* Success / Error states */}
          {status === 'success' && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Thank you! Your message has been sent successfully.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMsg || 'Something went wrong. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <User className="h-4 w-4 text-blue-800" aria-hidden="true" />
                Name
                <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                placeholder="Enter your name"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-800">
                  Email <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-800">
                  Phone <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Subject (optional) */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-slate-600">
                Subject <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                placeholder="What would you like to discuss?"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <MessageSquareText className="h-4 w-4 text-blue-800" aria-hidden="true" />
                Message <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                placeholder="Type your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-5 py-3 text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-70"
            >
              {status === 'submitting' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}