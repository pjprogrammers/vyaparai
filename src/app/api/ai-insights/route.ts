import { NextResponse } from "next/server";
import { getAdmin, verifyRequest } from "@/lib/firebase/admin";
import { generateInsights } from "@/lib/ai/gemini";
import { getInsights, saveInsight } from "@/lib/db";
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

    // Gather summaries
    const [salesSnap, invSnap, expSnap] = await Promise.all([
      db.collection("sales").where("businessId", "==", businessId).get(),
      db.collection("products").where("businessId", "==", businessId).get(),
      db.collection("expenses").where("businessId", "==", businessId).get(),
    ]);

    const salesSummary = salesSnap.docs
      .map((d) => `${d.data().date}: ₹${d.data().amount}`)
      .join("\n");
    const inventorySummary = invSnap.docs
      .map((d) => `${d.data().name}: ${d.data().quantity} (min ${d.data().minimumStock})`)
      .join("\n");
    const expenseSummary = expSnap.docs
      .map((d) => `${d.data().category}: ₹${d.data().amount}`)
      .join("\n");

    const message = await generateInsights({
      salesSummary: salesSummary || "No sales yet",
      inventorySummary: inventorySummary || "No inventory yet",
      expenseSummary: expenseSummary || "No expenses yet",
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

    return NextResponse.json({ ok: true, insight });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
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
  const insights = await getInsights(businessId);
  return NextResponse.json({ insights });
}
