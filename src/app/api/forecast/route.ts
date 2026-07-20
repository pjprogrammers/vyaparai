import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase/admin";
import { forecastSales } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const { businessId } = await request.json();
    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    const { db } = getAdmin();
    const snap = await db
      .collection("sales")
      .where("businessId", "==", businessId)
      .orderBy("date", "asc")
      .get();
    const history = snap.docs.map((d) => `${d.data().date}: ₹${d.data().amount}`).join("\n");
    const prediction = await forecastSales(history || "No sales history yet");
    return NextResponse.json({ ok: true, prediction });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
