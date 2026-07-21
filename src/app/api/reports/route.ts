import { NextResponse } from "next/server";
import { getAdmin, verifyRequest } from "@/lib/firebase/admin";
import {
  getSales,
  getExpenses,
  getProducts,
  saveReport,
} from "@/lib/db";
import { reportPeriodSchema } from "@/lib/ai/schemas";
import type { Report } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId || businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { db } = getAdmin();
    const snap = await db
      .collection("reports")
      .where("businessId", "==", businessId)
      .orderBy("generatedAt", "desc")
      .limit(20)
      .get();
    const reports = snap.docs.map((d) => d.data() as Report);
    return NextResponse.json({ reports });
  } catch {
    return NextResponse.json({ reports: [] });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { businessId, period } = await request.json();
    if (!businessId || businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validation = reportPeriodSchema.safeParse(period);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    const now = new Date();
    const periodType = validation.data;
    let startDate: string;
    let endDate: string;

    if (periodType === "daily") {
      startDate = endDate = now.toISOString().split("T")[0];
    } else if (periodType === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = weekAgo.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else if (periodType === "monthly") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      startDate = monthAgo.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      startDate = yearAgo.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
    }

    const [sales, expenses, products] = await Promise.all([
      getSales(businessId),
      getExpenses(businessId),
      getProducts(businessId),
    ]);

    const periodSales = sales.filter((s) => s.date >= startDate && s.date <= endDate);
    const periodExpenses = expenses.filter((e) => e.date >= startDate && e.date <= endDate);

    const totalRevenue = periodSales.reduce((s, d) => s + (d.amount ?? 0), 0);
    const totalExpenses = periodExpenses.reduce((s, d) => s + (d.amount ?? 0), 0);
    const profit = totalRevenue - totalExpenses;
    const inventoryValue = products.reduce((s, p) => s + p.quantity * p.price, 0);

    // Top/worst products by quantity sold
    const productSales = new Map<string, { quantity: number; revenue: number }>();
    for (const sale of periodSales) {
      for (const item of sale.items) {
        const existing = productSales.get(item.name) ?? { quantity: 0, revenue: 0 };
        productSales.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.quantity * item.price,
        });
      }
    }
    const sorted = Array.from(productSales.entries())
      .sort(([, a], [, b]) => b.revenue - a.revenue);
    const topProducts = sorted.slice(0, 5).map(([name, data]) => ({ name, ...data }));
    const worstProducts = sorted.slice(-3).reverse().map(([name, data]) => ({ name, ...data }));

    // Growth: compare with previous period
    const prevPeriodEnd = startDate;
    const prevPeriodStart = new Date(new Date(startDate).getTime() - (new Date(endDate).getTime() - new Date(startDate).getTime())).toISOString().split("T")[0];
    const prevSales = sales.filter((s) => s.date >= prevPeriodStart && s.date < prevPeriodEnd);
    const prevRevenue = prevSales.reduce((s, d) => s + (d.amount ?? 0), 0);
    const growth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    const reportId = `rpt_${Date.now()}`;
    const report: Report = {
      reportId,
      businessId,
      period: periodType,
      startDate,
      endDate,
      totalRevenue,
      totalExpenses,
      profit,
      inventoryValue,
      topProducts,
      worstProducts,
      forecast: `Based on ${periodType} trends, projected next period revenue: ₹${Math.round(totalRevenue * 1.05)}`,
      growth: Math.round(growth * 10) / 10,
      generatedAt: new Date().toISOString(),
    };
    await saveReport(report);

    return NextResponse.json({ ok: true, report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
