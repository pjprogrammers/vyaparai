"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500">
              <span className="text-sm font-bold text-black">V</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              VyaparAI
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {[
              { href: "/features", label: "Features" },
              { href: "/solutions", label: "Solutions" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/auth"
              className="rounded-lg px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/auth"
              className="rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-semibold text-black transition-all hover:from-yellow-300 hover:to-amber-400 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              Start Free
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileOpen ? (
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/5 bg-black/90 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {[
                { href: "/features", label: "Features" },
                { href: "/solutions", label: "Solutions" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/5 pt-4">
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-center text-sm font-semibold text-black"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/60 backdrop-blur-xl" />
    </nav>
  );
}
