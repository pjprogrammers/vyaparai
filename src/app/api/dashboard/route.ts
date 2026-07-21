import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import {
  getSales,
  getInvoices,
  getExpenses,
  getProducts,
  getUnpaidInvoices,
  getInsights,
  getCustomers,
  getNotifications,
  getUnreadNotificationCount,
  getBusiness,
} from "@/lib/db";
import { computePredictions, needsReorder, predictionToAlert } from "@/lib/ai/prediction";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    if (businessId === "biz_demo") {
      return buildDashboardResponse(businessId);
    }

    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return buildDashboardResponse(businessId);
  } catch {
    return NextResponse.json(emptyDashboard());
  }
}

function emptyDashboard() {
  return {
    business: null,
    todaysSales: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    pendingAmount: 0,
    invoiceCount: 0,
    lowStockCount: 0,
    alertCount: 0,
    customerCount: 0,
    unreadNotifications: 0,
    products: [],
    insights: [],
    predictions: [],
    alerts: [],
    salesSeries: [],
    notifications: [],
    recentSales: [],
    recentExpenses: [],
  };
}

async function buildDashboardResponse(businessId: string) {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [business, sales, invoices, expenses, products, unpaid, insights, customers, notifications, unreadCount] =
      await Promise.all([
        getBusiness(businessId),
        getSales(businessId),
        getInvoices(businessId),
        getExpenses(businessId),
        getProducts(businessId),
        getUnpaidInvoices(businessId),
        getInsights(businessId),
        getCustomers(businessId),
        getNotifications(businessId, 10),
        getUnreadNotificationCount(businessId),
      ]);

    const todaysSales = sales
      .filter((s) => s.date === today)
      .reduce((s, d) => s + (d.amount ?? 0), 0);
    const totalRevenue = sales.reduce((s, d) => s + (d.amount ?? 0), 0);
    const totalExpenses = expenses.reduce((s, d) => s + (d.amount ?? 0), 0);
    const profit = totalRevenue - totalExpenses;
    const pendingAmount = unpaid.reduce((s, d) => s + (d.amount ?? 0), 0);
    const lowStock = products.filter((p) => p.quantity <= (p.minimumStock ?? 10));

    const predictions = await computePredictions(businessId);
    const alerts = predictions.filter(needsReorder).map(predictionToAlert);

    // Monthly revenue series for forecasting chart
    const byMonth = new Map<string, number>();
    for (const s of sales) {
      const m = s.date.slice(0, 7);
      byMonth.set(m, (byMonth.get(m) ?? 0) + s.amount);
    }
    const salesSeries = Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));

    // Recent sales and expenses for dashboard feed
    const recentSales = sales.slice(-5).reverse();
    const recentExpenses = expenses.slice(-5).reverse();

    return NextResponse.json({
      business,
      todaysSales,
      totalRevenue,
      totalExpenses,
      profit,
      pendingAmount,
      invoiceCount: invoices.length,
      lowStockCount: lowStock.length,
      alertCount: alerts.length,
      customerCount: customers.length,
      unreadNotifications: unreadCount,
      products,
      insights,
      predictions,
      alerts,
      salesSeries,
      notifications,
      recentSales,
      recentExpenses,
    });
  } catch {
    return NextResponse.json(emptyDashboard());
  }
}
