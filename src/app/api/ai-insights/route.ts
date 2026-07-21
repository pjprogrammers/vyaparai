import { NextResponse } from "next/server";
import { getAdmin, verifyRequest } from "@/lib/firebase/admin";
import { generateInsights } from "@/lib/ai/gemini";
import { saveInsight, getInsights, logAuditEvent } from "@/lib/db";
import type { Insight } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { businessId } = await request.json();
    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    if (businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { db } = getAdmin();

    const [salesSnap, invSnap, expSnap, customersSnap, invoicesSnap, prevInsights] =
      await Promise.all([
        db.collection("sales").where("businessId", "==", businessId).get(),
        db.collection("products").where("businessId", "==", businessId).get(),
        db.collection("expenses").where("businessId", "==", businessId).get(),
        db.collection("customers").where("businessId", "==", businessId).get(),
        db.collection("invoices").where("businessId", "==", businessId).orderBy("date", "desc").limit(10).get(),
        getInsights(businessId),
      ]);

    const salesSummary = salesSnap.docs
      .map((d) => `${d.data().date}: ₹${d.data().amount}`)
      .join("\n");
    const inventorySummary = invSnap.docs
      .map((d) => `${d.data().name}: ${d.data().quantity} units (min ${d.data().minimumStock}) @ ₹${d.data().price}`)
      .join("\n");
    const expenseSummary = expSnap.docs
      .map((d) => `${d.data().category}: ₹${d.data().amount} on ${d.data().date}`)
      .join("\n");
    const customerSummary = customersSnap.docs
      .map((d) => {
        const c = d.data();
        return `${c.name}: ${c.totalPurchases} purchases, last: ${c.lastPurchaseDate ?? "never"}`;
      })
      .join("\n");
    const invoiceSummary = invoicesSnap.docs
      .map((d) => `${d.data().supplier}: ₹${d.data().amount} on ${d.data().date}`)
      .join("\n");
    const recentInsights = prevInsights.map((i) => i.message).join("\n");

    const message = await generateInsights({
      salesSummary: salesSummary || "No sales yet",
      inventorySummary: inventorySummary || "No inventory yet",
      expenseSummary: expenseSummary || "No expenses yet",
      customerSummary: customerSummary || undefined,
      invoiceSummary: invoiceSummary || undefined,
      recentInsights: recentInsights || undefined,
    });

    const insightId = `ins_${Date.now()}`;
    const insight: Insight = {
      insightId,
      message,
      priority: "medium",
      createdAt: new Date().toISOString(),
      businessId,
    };
    await saveInsight(insight);

    await logAuditEvent({
      businessId,
      action: "insights_generated",
      entityType: "report",
      entityId: insightId,
      performedBy: auth.uid,
    });

    return NextResponse.json({ ok: true, insight });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    if (businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { db } = getAdmin();
    const insightsSnap = await db
      .collection("aiInsights")
      .where("businessId", "==", businessId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    const insights = insightsSnap.docs.map((d) => d.data() as Insight);
    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json({ insights: [] });
  }
}
