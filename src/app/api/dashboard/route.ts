import { NextResponse } from "next/server";
import {
  getSales,
  getInvoices,
  getExpenses,
  getProducts,
  getUnpaidInvoices,
  getInsights,
} from "@/lib/db";
import { computePredictions, needsReorder, predictionToAlert } from "@/lib/ai/prediction";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  const [sales, invoices, expenses, products, unpaid, insights] = await Promise.all([
    getSales(businessId),
    getInvoices(businessId),
    getExpenses(businessId),
    getProducts(businessId),
    getUnpaidInvoices(businessId),
    getInsights(businessId),
  ]);

  const todaysSales = sales.reduce((s, d) => s + (d.amount ?? 0), 0);
  const totalRevenue = sales.reduce((s, d) => s + (d.amount ?? 0), 0);
  const totalExpenses = expenses.reduce((s, d) => s + (d.amount ?? 0), 0);
  const profit = totalRevenue - totalExpenses;
  const pendingAmount = unpaid.reduce((s, d) => s + (d.amount ?? 0), 0);
  const lowStock = products.filter((p) => p.quantity <= (p.minimumStock ?? 10));

  const predictions = await computePredictions(businessId);
  const alerts = predictions.filter(needsReorder).map(predictionToAlert);

  // Monthly revenue series for forecasting chart.
  const byMonth = new Map<string, number>();
  for (const s of sales) {
    const m = s.date.slice(0, 7);
    byMonth.set(m, (byMonth.get(m) ?? 0) + s.amount);
  }
  const salesSeries = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));

  return NextResponse.json({
    todaysSales,
    totalRevenue,
    totalExpenses,
    profit,
    pendingAmount,
    invoiceCount: invoices.length,
    lowStockCount: lowStock.length,
    alertCount: alerts.length,
    products,
    insights,
    predictions,
    alerts,
    salesSeries,
  });
}
