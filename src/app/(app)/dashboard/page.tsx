"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvoiceUploader } from "@/components/invoice-uploader";
import { ExpenseUploader } from "@/components/expense-uploader";
import { CustomerAssistant } from "@/components/customer-assistant";
import { InvoiceGenerator } from "@/components/invoice-generator";
import { SalesForecastChart } from "@/components/sales-forecast-chart";
import { NotificationsPanel } from "@/components/notifications-panel";
import { CustomerList } from "@/components/customer-list";
import { SalesRecorder } from "@/components/sales-recorder";
import { ReportsPanel } from "@/components/reports-panel";
import { SupplierList } from "@/components/supplier-list";
import { GradientOrb, GridBackground } from "@/components/3d/backgrounds";
import { formatCurrency } from "@/lib/utils";
import type { Insight, Product, Sale, Expense, StockPrediction, Notification, Business } from "@/lib/types";
import { Mail, TrendingUp, TrendingDown, IndianRupee, Package, AlertTriangle, Users, FileText } from "lucide-react";

const DashboardScene = dynamic(
  () => import("@/components/3d/dashboard-scene").then((m) => m.DashboardScene3D),
  { ssr: false },
);

interface DashData {
  business: Business | null;
  todaysSales: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  pendingAmount: number;
  invoiceCount: number;
  lowStockCount: number;
  alertCount: number;
  customerCount: number;
  unreadNotifications: number;
  products: Product[];
  insights: Insight[];
  predictions: StockPrediction[];
  alerts: string[];
  salesSeries: { month: string; revenue: number }[];
  notifications: Notification[];
  recentSales: Sale[];
  recentExpenses: Expense[];
}

const DEMO_BUSINESS = "biz_demo";

function needsEmailVerification(user: { providerData?: { providerId?: string }[]; emailVerified?: boolean } | null): boolean {
  if (!user) return false;
  const provider = user.providerData?.[0]?.providerId ?? "password";
  if (provider !== "password") return false;
  return user.emailVerified === false;
}

export default function DashboardPage() {
  const { user, loading, getIdToken, logout } = useAuth();
  const [data, setData] = useState<DashData | null>(null);

  const businessId = user?.uid ? `biz_${user.uid}` : DEMO_BUSINESS;

  useEffect(() => {
    if (loading || needsEmailVerification(user)) return;
    let alive = true;
    (async () => {
      const headers: Record<string, string> = {};
      const token = user ? await getIdToken() : null;
      if (token) headers.authorization = `Bearer ${token}`;
      try {
        const res = await fetch(`/api/dashboard?businessId=${businessId}`, { headers });
        if (res.ok && alive) {
          const d = await res.json();
          setData(d);
        }
      } catch {
        if (alive) setData(null);
      }
    })();
    return () => { alive = false; };
  }, [businessId, loading, user, getIdToken]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-10 text-center text-slate-400">Loading…</div>;
  }

  if (needsEmailVerification(user)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
              <Mail className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Verify your email</h2>
            <p className="text-sm text-slate-400">
              We sent a verification link to <strong className="text-white">{user?.email}</strong>. Please verify your email to access the dashboard.
            </p>
            <button
              onClick={async () => {
                if (user) {
                  const { sendEmailVerification } = await import("firebase/auth");
                  await sendEmailVerification(user);
                }
              }}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Resend Verification Email
            </button>
            <button
              onClick={logout}
              className="w-full text-sm text-slate-400 hover:text-white transition"
            >
              Sign out
            </button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const bizName = data?.business?.name ?? "Your Business";

  return (
    <main className="relative min-h-screen bg-slate-950 p-6 overflow-hidden">
      <DashboardScene />
      <GridBackground />
      <GradientOrb className="w-[500px] h-[500px] -top-40 -right-40" color="#6366f1" />
      <GradientOrb className="w-[400px] h-[400px] -bottom-20 -left-20" color="#818cf8" delay={2} />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good Morning, {user?.displayName?.split(" ")[0] ?? "there"}! 👋
            </h1>
            <p className="text-sm text-slate-400">Your Business Summary</p>
          </div>
          <div className="flex items-center gap-3">
            {data && data.unreadNotifications > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{data.unreadNotifications} new</Badge>
            )}
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-400">
              {bizName}
            </span>
          </div>
        </motion.header>

        {/* Stats Row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8"
        >
          {[
            { label: "Today's Sales", value: formatCurrency(data?.todaysSales ?? 0), icon: <IndianRupee className="h-4 w-4" /> },
            { label: "Total Revenue", value: formatCurrency(data?.totalRevenue ?? 0), icon: <TrendingUp className="h-4 w-4" /> },
            { label: "Total Expenses", value: formatCurrency(data?.totalExpenses ?? 0), icon: <TrendingDown className="h-4 w-4" /> },
            { label: "Net Profit", value: formatCurrency(data?.profit ?? 0), icon: <IndianRupee className="h-4 w-4" />, warn: (data?.profit ?? 0) < 0 },
            { label: "Customers", value: String(data?.customerCount ?? 0), icon: <Users className="h-4 w-4" /> },
            { label: "Low Stock", value: String(data?.lowStockCount ?? 0), icon: <AlertTriangle className="h-4 w-4" />, warn: (data?.lowStockCount ?? 0) > 0 },
            { label: "Pending", value: formatCurrency(data?.pendingAmount ?? 0), icon: <FileText className="h-4 w-4" />, warn: (data?.pendingAmount ?? 0) > 0 },
            { label: "Products", value: String(data?.products?.length ?? 0), icon: <Package className="h-4 w-4" /> },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            >
              <Card className={`p-3 border-slate-700/50 bg-slate-800/60 backdrop-blur-sm ${stat.warn ? "border-amber-500/30" : ""}`}>
                <div className="flex items-center gap-1.5">
                  <span className={stat.warn ? "text-amber-500" : "text-slate-400"}>{stat.icon}</span>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                </div>
                <p className={`mt-1 text-lg font-bold ${stat.warn ? "text-amber-400" : "text-white"}`}>{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 1: Upload + Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <InvoiceUploader businessId={businessId} />
          <ExpenseUploader businessId={businessId} />
          <NotificationsPanel businessId={businessId} />
        </motion.div>

        {/* Row 2: Sales + Inventory + Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <SalesRecorder businessId={businessId} />

          <Card className="border-slate-700/50 bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base text-white">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {!data || data.products.length === 0 ? (
                <p className="text-sm text-slate-400">No products yet. Upload an invoice to populate stock.</p>
              ) : (
                data.products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{p.name}</span>
                    <span className="font-medium text-white">
                      {p.quantity} {p.unit ?? "pcs"}
                      {p.quantity <= (p.minimumStock ?? 10) && (
                        <Badge className="ml-2 bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">low</Badge>
                      )}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <CustomerList businessId={businessId} />
        </motion.div>

        {/* Row 2b: Suppliers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6"
        >
          <SupplierList businessId={businessId} />
        </motion.div>

        {/* Row 3: AI Insights + Alerts + Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <Card className="border-slate-700/50 bg-slate-800/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-white">AI Business Insights</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={async () => {
                  const token = user ? await getIdToken() : null;
                  const authHeader: Record<string, string> = token ? { authorization: `Bearer ${token}` } : {};
                  await fetch("/api/ai-insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeader },
                    body: JSON.stringify({ businessId }),
                  });
                  fetch(`/api/dashboard?businessId=${businessId}`, { headers: authHeader })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((d) => d && setData(d));
                }}
              >
                Generate
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {!data || data.insights.length === 0 ? (
                <p className="text-sm text-slate-400">No insights yet. Click Generate to run the AI engine.</p>
              ) : (
                data.insights.map((i) => (
                  <p key={i.insightId} className="whitespace-pre-line text-sm text-slate-300">{i.message}</p>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base text-white">AI Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {!data || data.alerts.length === 0 ? (
                <p className="text-sm text-slate-400">Stock healthy. No alerts.</p>
              ) : (
                data.alerts.map((a, i) => (
                  <div key={i} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">{a}</div>
                ))
              )}
            </CardContent>
          </Card>

          <ReportsPanel businessId={businessId} />
        </motion.div>

        {/* Row 4: Charts + Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <Card className="border-slate-700/50 bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base text-white">Sales & Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {data && data.salesSeries.length > 0 ? (
                <SalesForecastChart
                  data={data.salesSeries}
                  prediction={
                    data.salesSeries.length > 0
                      ? { month: "Next", revenue: Math.round(data.salesSeries[data.salesSeries.length - 1].revenue * 1.12) }
                      : null
                  }
                />
              ) : (
                <p className="text-sm text-slate-400">Add sales to see the trend.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {(!data || (data.recentSales.length === 0 && data.recentExpenses.length === 0)) ? (
                <p className="text-sm text-slate-400">No activity yet. Record a sale or upload an invoice.</p>
              ) : (
                <>
                  {data?.recentSales.map((s) => (
                    <div key={s.saleId} className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-sm">
                      <div><span className="font-medium text-emerald-400">Sale</span><span className="text-slate-400"> to {s.customer}</span></div>
                      <span className="font-semibold text-emerald-300">+₹{s.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  {data?.recentExpenses.map((e) => (
                    <div key={e.expenseId} className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-sm">
                      <div><span className="font-medium text-red-400">Expense</span><span className="text-slate-400"> {e.category}</span></div>
                      <span className="font-semibold text-red-300">-₹{e.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 5: Customer AI + Invoice Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <CustomerAssistant businessId={businessId} />
          <InvoiceGenerator
            businessId={businessId}
            business={data?.business ?? {
              businessId,
              name: "Your Business",
              category: "Other",
              gst: "",
              address: "",
              currency: "₹",
              language: "English",
              owner: user?.uid ?? "demo",
              createdAt: new Date().toISOString(),
            }}
          />
        </motion.div>
      </div>
    </main>
  );
}
