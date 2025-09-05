import { Leaf, Shield, Cog, UserRound } from "lucide-react"

const items = [
  {
    icon: Leaf,
    title: "Eco-Friendly Solutions",
    desc: "Sustainable products designed to minimize environmental impact.",
  },
  {
    icon: Shield,
    title: "Unmatched Quality",
    desc: "Durable materials and rigorous testing for long-term reliability.",
  },
  { icon: Cog, title: "Technical Expertise", desc: "Experienced professionals guiding you from design to deployment." },
  { icon: UserRound, title: "Customer Focused", desc: "Responsive support and tailored solutions for your needs." },
]

export function Advantage() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <h2 className="mb-10 text-center text-3xl font-semibold text-slate-900 md:text-4xl">
          The Hemant Aqua Advantage
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-800">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
