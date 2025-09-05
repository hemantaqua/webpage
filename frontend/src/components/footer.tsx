export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <div className="text-lg font-semibold text-white">Hemant Aqua Solutions</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Delivering sustainable water and energy solutions with a commitment to quality, innovation, and customer
            success.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#irrigation" className="hover:underline">
                Products
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Our Solutions</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#irrigation" className="hover:underline">
                Irrigation
              </a>
            </li>
            <li>
              <a href="#water-distribution" className="hover:underline">
                Water Distribution
              </a>
            </li>
            <li>
              <a href="#solar" className="hover:underline">
                Solar
              </a>
            </li>
          </ul>
        </div>

        <div id="contact">
          <div className="text-sm font-semibold text-white">Contact Us</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>123 Greenfield Park, Pune, IN</li>
            <li>Email: info@hemantaqua.com</li>
            <li>Phone: +91 98765 43210</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-400 md:px-6">
          © 2025 Hemant Aqua Solutions. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
