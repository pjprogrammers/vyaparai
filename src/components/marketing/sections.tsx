"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-medium text-yellow-400">
              AI Employee for Your Business
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Build{" "}
            <span className="text-gradient-yellow">Smarter</span>
            <br />
            Businesses
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Automate invoices, inventory, customer support, and business insights
            with AI. From document to decision in seconds.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth"
              className="group relative rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 text-sm font-semibold text-black shadow-lg shadow-yellow-500/20 transition-all hover:from-yellow-300 hover:to-amber-400 hover:shadow-yellow-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Start Free
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-neutral-300 transition-all hover:border-white/20 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Explore Features
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { title: "Documents to AI", desc: "Upload a bill, get structured data." },
              { title: "Auto Inventory", desc: "Stock updates from every invoice." },
              { title: "AI Insights", desc: "Proactive recommendations." },
            ].map((f) => (
              <div
                key={f.title}
                className="glass-dark rounded-xl px-5 py-4 text-left"
              >
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-xs text-neutral-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
            Scroll to explore
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="text-neutral-600"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="8"
              cy="8"
              r="2"
              fill="currentColor"
              animate={{ cy: [8, 14, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

export function OCRSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
                OCR Engine
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Every document,{" "}
                <span className="text-gradient-yellow">understood</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">
                Upload any supplier bill, invoice, or receipt. Our OCR + AI pipeline
                extracts every field, line item, and tax detail automatically.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Multi-language support including Hindi, Tamil, Telugu",
                  "GST invoice parsing with HSN/SAC codes",
                  "Handwritten and printed text recognition",
                  "Structured JSON output ready for your database",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                    <span className="text-sm text-neutral-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass-dark-elevated rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="text-xs text-neutral-500">OCR Processing</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Vendor Name", value: "Reliance Fresh Pvt Ltd", status: "done" },
                  { label: "Invoice #", value: "INV-2024-0847", status: "done" },
                  { label: "GSTIN", value: "27AABCR1234M1Z5", status: "done" },
                  { label: "Total Amount", value: "₹47,832.50", status: "done" },
                  { label: "HSN Code", value: "1006 (Rice)", status: "done" },
                  { label: "Tax Breakdown", value: "CGST 9% + SGST 9%", status: "processing" },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-xs text-neutral-500">{field.label}</span>
                    <span className="text-sm font-medium text-white">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function InventorySection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="glass-dark-elevated rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-neutral-500">Inventory Dashboard</span>
                <span className="text-xs text-yellow-400">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Items", value: "2,847", change: "+12%" },
                  { label: "Low Stock", value: "23", change: "-5" },
                  { label: "Categories", value: "156", change: "+8" },
                  { label: "Value", value: "₹12.4L", change: "+18%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className="text-xs text-neutral-500">{stat.label}</div>
                    <div className="mt-1 text-2xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 text-xs text-yellow-400">{stat.change}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { name: "Basmati Rice 10kg", stock: 78, bar: "w-[78%]" },
                  { name: "Toor Dal 5kg", stock: 12, bar: "w-[12%]" },
                  { name: "Sunflower Oil 1L", stock: 45, bar: "w-[45%]" },
                ].map((item) => (
                  <div key={item.name} className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{item.name}</span>
                      <span className={`text-xs ${item.stock < 20 ? "text-red-400" : "text-yellow-400"}`}>
                        {item.stock} units
                      </span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${item.stock < 20 ? "bg-red-400" : "bg-yellow-400"} ${item.bar}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
                Smart Inventory
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Stock that{" "}
                <span className="text-gradient-yellow">manages itself</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">
                Every invoice automatically updates your inventory. AI predicts
                reorder points, detects anomalies, and alerts you before stockouts.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: "01", title: "Auto Updates", desc: "Invoices flow into stock levels" },
                  { icon: "02", title: "Predictions", desc: "AI forecasts demand patterns" },
                  { icon: "03", title: "Alerts", desc: "Low stock notifications via WhatsApp" },
                  { icon: "04", title: "Analytics", desc: "Turnover, margins, trends" },
                ].map((f) => (
                  <div key={f.icon} className="glass-dark rounded-xl p-4">
                    <div className="text-xs font-bold text-yellow-400">{f.icon}</div>
                    <div className="mt-2 text-sm font-semibold text-white">{f.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AnalyticsSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="text-center">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
              Business Intelligence
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Decisions backed by{" "}
              <span className="text-gradient-yellow">data</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
              Real-time analytics from your sales, expenses, and inventory.
              AI-generated insights that actually help you grow.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Revenue Trends",
                value: "₹8.4L",
                change: "+23% this quarter",
                chart: [30, 45, 35, 50, 42, 65, 58, 72, 68, 80, 75, 85],
              },
              {
                title: "Expense Breakdown",
                value: "₹3.2L",
                change: "Raw materials: 45%",
                chart: [60, 55, 50, 48, 45, 42, 40, 38, 36, 35, 34, 32],
              },
              {
                title: "Profit Margin",
                value: "34.2%",
                change: "+5.1% vs last month",
                chart: [25, 28, 30, 27, 32, 35, 33, 38, 36, 40, 38, 42],
              },
            ].map((card) => (
              <div key={card.title} className="glass-dark-elevated rounded-2xl p-6">
                <div className="text-xs text-neutral-500">{card.title}</div>
                <div className="mt-2 text-3xl font-bold text-white">{card.value}</div>
                <div className="mt-1 text-xs text-yellow-400">{card.change}</div>
                <div className="mt-6 flex items-end gap-1 h-20">
                  {card.chart.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-yellow-400/30 transition-all hover:bg-yellow-400/50"
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 glass-dark-elevated rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-yellow-400">
                  <path d="M10 2L12.09 7.26L18 8.27L14 12.14L14.81 18.02L10 15.27L5.19 18.02L6 12.14L2 8.27L7.91 7.26L10 2Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Insight</div>
                <div className="text-sm text-neutral-400">
                  Raw material costs increased 12% this month. Consider negotiating
                  with alternate suppliers or adjusting pricing for Q2.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AIBrainSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="text-center">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
              AI Engine
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The brain behind{" "}
              <span className="text-gradient-yellow">your business</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
              Powered by Gemini 2.5 Flash. Understands your documents,
              predicts your needs, and recommends actions.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Document Understanding",
                desc: "Invoice, receipt, purchase order. Every document type parsed with structure.",
                visual: (
                  <div className="flex gap-2">
                    {["PDF", "IMG", "CSV"].map((t) => (
                      <div key={t} className="rounded-lg bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                        {t}
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                title: "Predictive Analytics",
                desc: "Revenue forecasts, demand prediction, cash flow projections.",
                visual: (
                  <div className="flex items-end gap-1 h-12">
                    {[40, 55, 45, 70, 60, 80, 75, 90].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-yellow-400/40" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                ),
              },
              {
                title: "Smart Recommendations",
                desc: "Actionable insights from your business data, not just charts.",
                visual: (
                  <div className="space-y-2">
                    {["Reorder Toor Dal", "Review pricing", "Check supplier"].map((r) => (
                      <div key={r} className="flex items-center gap-2 text-xs text-neutral-400">
                        <div className="h-1 w-1 rounded-full bg-yellow-400" />
                        {r}
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map((card) => (
              <div key={card.title} className="glass-dark-elevated rounded-2xl p-6">
                <div className="text-sm font-semibold text-white">{card.title}</div>
                <div className="mt-2 text-sm text-neutral-500">{card.desc}</div>
                <div className="mt-4">{card.visual}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AutomationSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
                Workflow Engine
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Every task,{" "}
                <span className="text-gradient-yellow">connected</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">
                Invoice processing, inventory updates, GST filing, report
                generation. One continuous workflow, zero manual steps.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass-dark-elevated rounded-2xl p-6">
              <div className="space-y-4">
                {[
                  { step: "01", title: "Upload Document", desc: "Photo or PDF of any bill", active: true },
                  { step: "02", title: "AI Extracts Data", desc: "OCR + Gemini processes in seconds", active: true },
                  { step: "03", title: "Inventory Updates", desc: "Stock levels adjust automatically", active: true },
                  { step: "04", title: "GST Compliance", desc: "Tax calculations and filing prep", active: false },
                  { step: "05", title: "Reports Generated", desc: "P&L, balance sheet, cash flow", active: false },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          item.active
                            ? "bg-yellow-500 text-black"
                            : "border border-white/10 text-neutral-500"
                        }`}
                      >
                        {item.step}
                      </div>
                      {i < 4 && (
                        <div className="mt-1 h-6 w-px bg-white/10" />
                      )}
                    </div>
                    <div className="pt-1">
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-neutral-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="text-center">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
              Simple Pricing
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Start free,{" "}
              <span className="text-gradient-yellow">scale when ready</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
              No hidden fees. No per-user pricing. Pay only for what you use.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "For small shops getting started",
                features: ["5 invoices/month", "Basic inventory", "AI insights", "Email support"],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Growth",
                price: "₹999",
                period: "/month",
                desc: "For growing businesses",
                features: [
                  "Unlimited invoices",
                  "Full inventory AI",
                  "Predictive analytics",
                  "GST automation",
                  "Priority support",
                  "API access",
                ],
                cta: "Start Free Trial",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large operations",
                features: [
                  "Everything in Growth",
                  "Multi-location",
                  "Custom integrations",
                  "Dedicated support",
                  "SLA guarantee",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`glass-dark-elevated rounded-2xl p-6 ${
                  plan.highlighted ? "ring-1 ring-yellow-500/30" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-semibold text-white">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-neutral-500">{plan.period}</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-neutral-500">{plan.desc}</div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-yellow-400">
                        <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`mt-6 block rounded-xl py-3 text-center text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400"
                      : "border border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative flex min-h-[80dvh] items-center">
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to automate{" "}
            <span className="text-gradient-yellow">your business?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400">
            Join Indian MSMEs already using VyaparAI to save hours every week.
            Start free, no credit card required.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth"
              className="group relative rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-10 py-4 text-sm font-semibold text-black shadow-lg shadow-yellow-500/20 transition-all hover:from-yellow-300 hover:to-amber-400 hover:shadow-yellow-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Start Free Now
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-white/10 px-10 py-4 text-sm font-semibold text-neutral-300 transition-all hover:border-white/20 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Learn More
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
