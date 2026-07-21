import { NextResponse } from "next/server";
import { getAdmin, verifyRequest } from "@/lib/firebase/admin";
import { forecastSales } from "@/lib/ai/gemini";

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
    const snap = await db
      .collection("sales")
      .where("businessId", "==", businessId)
      .orderBy("date", "asc")
      .get();
    if (snap.empty) {
      return NextResponse.json({
        ok: true,
        prediction: "Not enough sales data yet. Start recording sales to get forecasts.",
      });
    }
    const history = snap.docs.map((d) => `${d.data().date}: ₹${d.data().amount}`).join("\n");
    const prediction = await forecastSales(history);
    return NextResponse.json({ ok: true, prediction });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
