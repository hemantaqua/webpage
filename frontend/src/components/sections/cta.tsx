import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="bg-blue-800">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center text-white md:py-20">
        <h1 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Ready to Start Your Project?</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-100 md:text-lg">
          Let&apos;s discuss how our solutions can help you achieve your goals. Contact us today for a free
          consultation.
        </p>
        <Button asChild size="lg" className="mt-6 bg-green-600 text-white hover:bg-green-500">
          <a href="#contact">Contact Us Now</a>
        </Button>
      </div>
    </section>
  )
}
