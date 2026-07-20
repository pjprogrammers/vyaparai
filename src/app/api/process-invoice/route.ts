import { NextResponse } from "next/server";
import { getAdmin, verifyRequest } from "@/lib/firebase/admin";
import { parseInvoiceWithGemini } from "@/lib/ai/gemini";
import { extractText } from "@/lib/ai/ocr";
import {
  adjustInventory,
  saveInvoice,
  saveExpense,
} from "@/lib/db";
import { todayISO } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { businessId, fileUrl, rawText } = await request.json();
    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    if (businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Get text: either already-extracted OCR text or run OCR on a file URL
    const text = rawText ?? (fileUrl ? await extractText(fileUrl) : "");
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 2. Gemini -> structured, Zod-validated JSON
    const parsed = await parseInvoiceWithGemini(text);

    // 3. Validate business exists
    const { db } = getAdmin();
    const biz = await db.collection("businesses").doc(businessId).get();
    if (!biz.exists) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // 4. Persist invoice
    const invoiceId = `inv_${Date.now()}`;
    const invoice: Invoice = {
      invoiceId,
      supplier: parsed.supplier,
      items: parsed.items,
      amount: parsed.total,
      gst: parsed.gst,
      date: parsed.date,
      businessId,
      paid: false,
      storageUrl: fileUrl ?? undefined,
    };
    await saveInvoice(invoice);

    // 5. Auto-update inventory (add stock) + trigger expense record
    await adjustInventory(
      businessId,
      parsed.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      "add",
    );
    await saveExpense({
      expenseId: `exp_${Date.now()}`,
      category: `Purchase - ${parsed.supplier}`,
      amount: parsed.total,
      date: parsed.date || todayISO(),
      businessId,
    });

    return NextResponse.json({ ok: true, invoice });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
