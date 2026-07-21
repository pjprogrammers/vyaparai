"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  FloatingBadge,
  ScaleIn,
} from "@/components/3d/animations";
import {
  GradientOrb,
  FloatingDots,
  GridBackground,
} from "@/components/3d/backgrounds";
import {
  InvoiceIcon3D,
  ChartIcon3D,
  BoxIcon3D,
  CoinIcon3D,
  BrainIcon3D,
  ShieldIcon3D,
} from "@/components/svg/icons-3d";

const HeroScene = dynamic(
  () => import("@/components/3d/hero-scene").then((m) => m.HeroScene3D),
  { ssr: false },
);

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
        <HeroScene className="opacity-60" />
        <GradientOrb className="w-[600px] h-[600px] -top-40 -left-40" color="#6366f1" />
        <GradientOrb className="w-[500px] h-[500px] -bottom-20 -right-20" color="#818cf8" delay={2} />
        <FloatingDots count={30} />
        <GridBackground />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center">
          <FloatingBadge>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-5 py-1.5 text-sm font-medium text-indigo-300"
            >
              AI Employee for Your Business
            </motion.p>
          </FloatingBadge>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
          >
            Vyapar
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300"
          >
            An AI-powered business automation assistant for Indian MSMEs. Automate
            invoices, inventory, customer support, reports and business insights with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link
              href="/auth"
              className="group relative rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 hover:shadow-indigo-500/40"
            >
              Start Free
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition group-hover:opacity-100" />
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/50 hover:border-slate-500"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* Hero Feature Cards */}
          <StaggerContainer className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {[
              { icon: <InvoiceIcon3D className="h-12 w-12" />, t: "Documents → AI", d: "Upload a bill, get structured data instantly." },
              { icon: <BoxIcon3D className="h-12 w-12" />, t: "Inventory Automation", d: "Stock updates itself from every invoice." },
              { icon: <BrainIcon3D className="h-12 w-12" />, t: "AI Insights", d: "Proactive recommendations, not just chat." },
            ].map((f) => (
              <StaggerItem key={f.t}>
                <GlowCard className="border-slate-700/50 bg-slate-800/50 backdrop-blur-md hover:border-indigo-500/30">
                  <div className="mb-3">{f.icon}</div>
                  <h2 className="font-semibold text-white">{f.t}</h2>
                  <p className="mt-1 text-sm text-slate-400">{f.d}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="relative bg-slate-900 py-20">
        <GradientOrb className="w-[400px] h-[400px] top-0 right-0" color="#818cf8" delay={1} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white text-center">Core Capabilities</h2>
            <p className="mt-3 text-center text-slate-400">Real AI workflows, not chatbots</p>
          </AnimatedSection>

          <StaggerContainer className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/features/ai-invoice-processing", icon: <InvoiceIcon3D className="h-10 w-10" />, t: "AI Invoice Processing", d: "OCR + Gemini turns bills into structured data." },
              { href: "/features/inventory-ai", icon: <BoxIcon3D className="h-10 w-10" />, t: "Inventory AI", d: "Stock prediction and automatic updates." },
              { href: "/features/customer-ai", icon: <ChartIcon3D className="h-10 w-10" />, t: "Customer AI", d: "Grounded replies with owner approval." },
              { href: "/features/business-insights", icon: <BrainIcon3D className="h-10 w-10" />, t: "Business Insights", d: "AI recommendations from your data." },
            ].map((f) => (
              <StaggerItem key={f.href}>
                <Link href={f.href}>
                  <GlowCard className="h-full border-slate-700/50 bg-slate-800/50 hover:border-indigo-500/30">
                    <div className="mb-3">{f.icon}</div>
                    <h3 className="font-semibold text-white">{f.t}</h3>
                    <p className="mt-1 text-sm text-slate-400">{f.d}</p>
                  </GlowCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works - 3D Animated Steps */}
      <section className="relative bg-slate-950 py-20 overflow-hidden">
        <GridBackground />
        <GradientOrb className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="#6366f1" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white text-center">How VyaparAI Works</h2>
            <p className="mt-3 text-center text-slate-400">From document to decision in seconds</p>
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-4">
            {[
              { step: "01", title: "Upload a Document", desc: "Take a photo or upload a PDF of any supplier bill.", icon: <InvoiceIcon3D className="h-14 w-14" /> },
              { step: "02", title: "AI Processes", desc: "OCR extracts text, Gemini understands structure.", icon: <BrainIcon3D className="h-14 w-14" /> },
              { step: "03", title: "Auto-Update", desc: "Inventory adjusts, expenses logged automatically.", icon: <BoxIcon3D className="h-14 w-14" /> },
              { step: "04", title: "Insights & Predictions", desc: "AI recommendations and forecasts from your data.", icon: <ChartIcon3D className="h-14 w-14" /> },
            ].map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 0.15}>
                <div className="text-center">
                  <ScaleIn delay={i * 0.1}>
                    <div className="mx-auto mb-4">{s.icon}</div>
                  </ScaleIn>
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-sm font-bold text-indigo-400">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Indian Businesses */}
      <section className="relative bg-slate-900 py-20">
        <GradientOrb className="w-[400px] h-[400px] bottom-0 left-0" color="#a5b4fc" delay={2} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white text-center">Built for Indian Businesses</h2>
          </AnimatedSection>

          <StaggerContainer className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { href: "/solutions/kirana-store", t: "Kirana Stores", icon: <CoinIcon3D className="h-12 w-12" /> },
              { href: "/solutions/pharmacy", t: "Pharmacies", icon: <ShieldIcon3D className="h-12 w-12" /> },
              { href: "/solutions/retail-business", t: "Retail Businesses", icon: <ChartIcon3D className="h-12 w-12" /> },
            ].map((s) => (
              <StaggerItem key={s.href}>
                <Link href={s.href}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 px-5 py-8 text-center text-white shadow-lg shadow-indigo-500/20"
                  >
                    {s.icon}
                    <span className="font-semibold text-lg">{s.t}</span>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Security */}
      <section className="relative bg-slate-950 py-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection>
            <ShieldIcon3D className="mx-auto h-16 w-16" />
            <h2 className="mt-6 text-3xl font-bold text-white">Enterprise-Grade Security</h2>
            <p className="mt-4 text-slate-400">
              Your business data is encrypted in transit and at rest. Firebase Authentication,
              Firestore security rules, and audit logging. We never train on your documents.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-b from-indigo-950 to-slate-950 py-20">
        <GradientOrb className="w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" color="#6366f1" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white">
              Ready to Automate Your Business?
            </h2>
            <p className="mt-4 text-slate-300">
              Join Indian MSMEs already using VyaparAI to save hours every week.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/auth"
                className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
              >
                Start Free
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/50"
              >
                Learn More
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
