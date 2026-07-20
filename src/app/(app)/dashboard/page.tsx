"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvoiceUploader } from "@/components/invoice-uploader";
import { ExpenseUploader } from "@/components/expense-uploader";
import { CustomerAssistant } from "@/components/customer-assistant";
import { InvoiceGenerator } from "@/components/invoice-generator";
import { SalesForecastChart } from "@/components/sales-forecast-chart";
import { formatCurrency } from "@/lib/utils";
import type { Insight, Product, StockPrediction } from "@/lib/types";

interface DashData {
  todaysSales: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  pendingAmount: number;
  invoiceCount: number;
  lowStockCount: number;
  alertCount: number;
  products: Product[];
  insights: Insight[];
  predictions: StockPrediction[];
  alerts: string[];
  salesSeries: { month: string; revenue: number }[];
}

const DEMO_BUSINESS = "biz_demo";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<DashData | null>(null);
  const [businessName, setBusinessName] = useState("ABC Kirana Store");

  const businessId = user?.uid ? `biz_${user.uid}` : DEMO_BUSINESS;

  useEffect(() => {
    if (loading) return;
    fetch(`/api/dashboard?businessId=${businessId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null));
  }, [businessId, loading]);

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Good Morning, {user?.displayName?.split(" ")[0] ?? "Raj"}! 👋
            </h1>
            <p className="text-sm text-slate-500">Your Business Summary</p>
          </div>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            {businessName}
          </span>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Today's Sales" value={formatCurrency(data?.todaysSales ?? 0)} trend="↑ 12%" />
          <Stat label="Profit" value={formatCurrency(data?.profit ?? 0)} trend="" />
          <Stat label="Low Stock" value={String(data?.lowStockCount ?? 0)} trend="⚠" warn={(data?.lowStockCount ?? 0) > 0} />
          <Stat label="Pending Payments" value={formatCurrency(data?.pendingAmount ?? 0)} trend="" warn={(data?.pendingAmount ?? 0) > 0} />
          <Stat label="AI Alerts" value={String(data?.alertCount ?? 0)} trend="" warn={(data?.alertCount ?? 0) > 0} />
          <Stat label="Invoices" value={String(data?.invoiceCount ?? 0)} trend="" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InvoiceUploader businessId={businessId} />
          <ExpenseUploader businessId={businessId} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Stock Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!data || data.alerts.length === 0 ? (
                <p className="text-sm text-slate-500">No low-stock alerts. Stock healthy.</p>
              ) : (
                data.alerts.map((a, i) => (
                  <div key={i} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    {a}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!data || data.products.length === 0 ? (
                <p className="text-sm text-slate-500">No products yet. Upload an invoice to populate stock.</p>
              ) : (
                data.products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{p.name}</span>
                    <span className="font-medium text-slate-900">
                      {p.quantity}
                      {p.quantity <= (p.minimumStock ?? 10) && (
                        <Badge className="ml-2 bg-amber-100 text-amber-700">low</Badge>
                      )}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI Business Insights</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await fetch("/api/ai-insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ businessId }),
                  });
                  fetch(`/api/dashboard?businessId=${businessId}`)
                    .then((r) => (r.ok ? r.json() : null))
                    .then((d) => d && setData(d));
                }}
              >
                Generate
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {!data || data.insights.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No insights yet. Click Generate to run the AI Insights engine.
                </p>
              ) : (
                data.insights.map((i) => (
                  <p key={i.insightId} className="whitespace-pre-line text-sm text-slate-600">
                    {i.message}
                  </p>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              {data && data.salesSeries.length > 0 ? (
                <SalesForecastChart
                  data={data.salesSeries}
                  prediction={
                    data.salesSeries.length > 0
                      ? {
                          month: "Next",
                          revenue: Math.round(
                            data.salesSeries[data.salesSeries.length - 1].revenue * 1.12,
                          ),
                        }
                      : null
                  }
                />
              ) : (
                <p className="text-sm text-slate-500">Add sales to see the forecast trend.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CustomerAssistant businessId={businessId} />
          <InvoiceGenerator
            businessId={businessId}
            business={{
              businessId,
              name: businessName,
              category: "Grocery Store",
              gst: "29ABCDE1234F1Z5",
              address: "MG Road, Bengaluru",
              currency: "₹",
              language: "English",
              owner: user?.uid ?? "demo",
              createdAt: new Date().toISOString(),
            }}
          />
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, trend, warn }: { label: string; value: string; trend?: string; warn?: boolean }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${warn ? "text-amber-600" : "text-slate-900"}`}>{value}</p>
      {trend && <p className="text-xs text-emerald-600">{trend}</p>}
    </Card>
  );
}
