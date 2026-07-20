import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import { extractText } from "@/lib/ai/ocr";
import { parseExpenseWithGemini } from "@/lib/ai/gemini";
import { saveExpense } from "@/lib/db";
import { todayISO } from "@/lib/utils";
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

    const parsed = await parseExpenseWithGemini(text);
    const expense: Expense = {
      expenseId: `exp_${Date.now()}`,
      category: parsed.category,
      amount: parsed.amount,
      date: parsed.date || todayISO(),
      businessId,
      storageUrl: fileUrl ?? undefined,
    };
    await saveExpense(expense);

    return NextResponse.json({ ok: true, expense });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
