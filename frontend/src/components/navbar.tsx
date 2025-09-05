"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-balance text-lg font-semibold text-slate-900">
          Hemant Aqua Solutions
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Home
          </Link>

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
              Products
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="#irrigation">Irrigation Systems</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#water-distribution">Water Distribution</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#solar">Solar Components</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="#about" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            About Us
          </Link>
          <Link href="#contact" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Contact
          </Link>
        </div>

        <div className="ml-4 flex items-center gap-3">
          <Button asChild className="bg-blue-800 text-white hover:bg-blue-700">
            <Link href="#contact">Get a Quote</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
