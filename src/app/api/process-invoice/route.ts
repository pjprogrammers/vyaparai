import { NextResponse } from "next/server";
import { getAdmin, verifyRequest } from "@/lib/firebase/admin";
import { parseInvoiceWithGemini } from "@/lib/ai/gemini";
import { extractText } from "@/lib/ai/ocr";
import {
  adjustInventory,
  saveInvoice,
  saveExpense,
  checkDuplicateInvoice,
  createNotification,
  logAuditEvent,
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

    const text = rawText ?? (fileUrl ? await extractText(fileUrl) : "");
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const parsed = await parseInvoiceWithGemini(text);

    const { db } = getAdmin();
    const biz = await db.collection("businesses").doc(businessId).get();
    if (!biz.exists) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Duplicate detection
    const isDuplicate = await checkDuplicateInvoice(
      businessId,
      parsed.supplier,
      parsed.date,
      parsed.total,
    );

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

    await adjustInventory(
      businessId,
      parsed.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      "add",
      invoiceId,
    );
    await saveExpense({
      expenseId: `exp_${Date.now()}`,
      category: `Purchase - ${parsed.supplier}`,
      amount: parsed.total,
      date: parsed.date || todayISO(),
      businessId,
    });

    // Notifications
    await createNotification({
      businessId,
      type: "invoice_processed",
      title: "Invoice Processed",
      message: `Invoice from ${parsed.supplier} — ₹${parsed.total} (${parsed.items.length} items).${isDuplicate ? " ⚠ Possible duplicate." : ""}`,
      actionUrl: "/dashboard",
    });

    if (isDuplicate) {
      await createNotification({
        businessId,
        type: "pending_payment",
        title: "Possible Duplicate Invoice",
        message: `An invoice from ${parsed.supplier} on ${parsed.date} for ₹${parsed.total} looks similar to a previous one. Please verify.`,
        actionUrl: "/dashboard",
      });
    }

    // Audit log
    await logAuditEvent({
      businessId,
      action: "invoice_processed",
      entityType: "invoice",
      entityId: invoiceId,
      details: `Supplier: ${parsed.supplier}, Amount: ₹${parsed.total}, Items: ${parsed.items.length}${isDuplicate ? " [DUPLICATE SUSPECTED]" : ""}`,
      performedBy: auth.uid,
    });

    return NextResponse.json({ ok: true, invoice, isDuplicate });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const safe = msg.includes("Gemini")
      ? "Failed to parse invoice data. Please try again."
      : msg.includes("Firestore")
        ? "A database error occurred. Please try again."
        : msg.length > 120
          ? "An unexpected error occurred."
          : msg;
    return NextResponse.json({ error: safe }, { status: 500 });
  }
}
