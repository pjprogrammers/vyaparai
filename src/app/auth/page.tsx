"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { setupBusinessAction } from "@/app/actions/setup";
import type { BusinessCategory } from "@/lib/types";

const CATEGORIES: BusinessCategory[] = [
  "Grocery Store",
  "Pharmacy",
  "Restaurant",
  "Manufacturer",
  "Other",
];

export default function AuthPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Business setup (shown after signup)
  const [setupOpen, setSetupOpen] = useState(false);
  const [biz, setBiz] = useState({
    name: "",
    category: "Grocery Store" as BusinessCategory,
    gst: "",
    address: "",
    currency: "₹",
    language: "English",
  });

  async function handleEmail() {
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      setSetupOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Auth failed");
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle();
      setSetupOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Auth failed");
    }
  }

  async function completeSetup() {
    if (!user) return;
    await setupBusinessAction({
      uid: user.uid,
      email: user.email ?? email,
      displayName: user.displayName ?? "",
      business: biz,
    });
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <Card className="w-full max-w-md">
        <CardTitle>{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
        <CardContent className="space-y-4">
          <button
            onClick={handleGoogle}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" /> or <div className="h-px flex-1 bg-slate-200" />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleEmail}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            {mode === "login" ? "Login" : "Sign up"}
          </button>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-center text-sm text-indigo-600"
          >
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Login"}
          </button>

          {setupOpen && (
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <p className="text-sm font-semibold text-slate-700">Business Setup</p>
              <input
                placeholder="Business Name"
                value={biz.name}
                onChange={(e) => setBiz({ ...biz, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
              <select
                value={biz.category}
                onChange={(e) => setBiz({ ...biz, category: e.target.value as BusinessCategory })}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                placeholder="GST Number"
                value={biz.gst}
                onChange={(e) => setBiz({ ...biz, gst: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
              <input
                placeholder="Address"
                value={biz.address}
                onChange={(e) => setBiz({ ...biz, address: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
              <button
                onClick={completeSetup}
                disabled={!biz.name}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                Finish & Enter Dashboard
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
