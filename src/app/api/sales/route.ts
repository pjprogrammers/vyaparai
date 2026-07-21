import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import {
  saveSale,
  getSales,
  adjustInventory,
  upsertCustomerOnSale,
  createNotification,
  logAuditEvent,
} from "@/lib/db";
import { saleInputSchema } from "@/lib/ai/schemas";
import type { Sale } from "@/lib/types";

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
    const sales = await getSales(businessId);
    return NextResponse.json({ sales });
  } catch {
    return NextResponse.json({ sales: [] });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const validation = saleInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 },
      );
    }
    const data = validation.data;
    if (data.businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const saleId = `sale_${Date.now()}`;
    const sale: Sale = {
      saleId,
      customer: data.customer,
      items: data.items,
      amount: data.amount,
      date: data.date,
      businessId: data.businessId,
      paymentMethod: data.paymentMethod,
    };

    // 1. Save the sale
    await saveSale(sale);

    // 2. Deduct inventory
    await adjustInventory(
      data.businessId,
      data.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      "subtract",
      saleId,
    );

    // 3. Upsert customer record
    const customerId = await upsertCustomerOnSale(data.businessId, data.customer, data.amount);

    // 4. Notification
    await createNotification({
      businessId: data.businessId,
      type: "sale_recorded",
      title: "Sale Recorded",
      message: `₹${data.amount} sale to ${data.customer} (${data.items.length} items).`,
      actionUrl: "/dashboard",
    });

    // 5. Audit log
    await logAuditEvent({
      businessId: data.businessId,
      action: "sale_created",
      entityType: "sale",
      entityId: saleId,
      details: `Amount: ₹${data.amount}, Customer: ${data.customer}`,
      performedBy: auth.uid,
    });

    return NextResponse.json({ ok: true, sale: { ...sale, customerId } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
