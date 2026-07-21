import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import { extractText } from "@/lib/ai/ocr";
import { parseExpenseWithGemini } from "@/lib/ai/gemini";
import { saveExpense, createNotification, logAuditEvent } from "@/lib/db";
import { todayISO } from "@/lib/utils";
import { expenseSchema } from "@/lib/ai/schemas";
import type { Expense } from "@/lib/types";

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

    const raw = await parseExpenseWithGemini(text);
    const validated = expenseSchema.parse(raw);
    const expense: Expense = {
      expenseId: `exp_${Date.now()}`,
      category: validated.category,
      amount: validated.amount,
      date: validated.date || todayISO(),
      businessId,
      storageUrl: fileUrl ?? undefined,
    };
    await saveExpense(expense);

    await createNotification({
      businessId,
      type: "expense_added",
      title: "Expense Logged",
      message: `${validated.category}: ₹${validated.amount} on ${validated.date}`,
      actionUrl: "/dashboard",
    });

    await logAuditEvent({
      businessId,
      action: "expense_created",
      entityType: "expense",
      entityId: expense.expenseId,
      details: `Category: ${validated.category}, Amount: ₹${validated.amount}`,
      performedBy: auth.uid,
    });

    return NextResponse.json({ ok: true, expense });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
