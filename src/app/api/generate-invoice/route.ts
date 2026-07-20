import { NextResponse } from "next/server";
import { saveGeneratedInvoice } from "@/lib/db";
import { computeInvoiceTotals } from "@/lib/invoice";
import type { GeneratedInvoice, InvoiceItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { businessId, customer, items, paymentMethod } = await request.json();
    if (!businessId || !customer || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "businessId, customer and items required" },
        { status: 400 },
      );
    }
    const { subtotal, gst, total } = computeInvoiceTotals(items as InvoiceItem[]);
    const invoiceId = `gen_${Date.now()}`;
    const inv: GeneratedInvoice = {
      invoiceId,
      businessId,
      customer,
      items: items as InvoiceItem[],
      subtotal,
      gst,
      total,
      paymentMethod: paymentMethod || "Cash",
      date: new Date().toISOString().split("T")[0],
    };
    await saveGeneratedInvoice(inv);
    return NextResponse.json({ ok: true, invoice: inv });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
