import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500">
                <span className="text-sm font-bold text-black">V</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                VyaparAI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              AI-powered business automation assistant for Indian MSMEs. Automate
              invoices, inventory, and business decisions.
            </p>
            <div className="mt-6 flex gap-4">
              {["X", "GH", "LI"].map((s) => (
                <div
                  key={s}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs text-neutral-500 transition-colors hover:border-yellow-500/30 hover:text-yellow-400"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: [
                { href: "/features", label: "Features" },
                { href: "/features/ai-invoice-processing", label: "AI Invoicing" },
                { href: "/features/inventory-ai", label: "Inventory AI" },
                { href: "/features/business-insights", label: "Insights" },
              ],
            },
            {
              title: "Solutions",
              links: [
                { href: "/solutions/kirana-store", label: "Kirana Stores" },
                { href: "/solutions/pharmacy", label: "Pharmacies" },
                { href: "/solutions/retail-business", label: "Retail" },
              ],
            },
            {
              title: "Company",
              links: [
                { href: "/about", label: "About" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-neutral-600">
              &copy; {new Date().getFullYear()} VyaparAI. All rights reserved.
            </p>
            <p className="text-xs text-neutral-600">
              Built for Indian businesses.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
