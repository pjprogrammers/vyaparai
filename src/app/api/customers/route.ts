import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import {
  getCustomers,
  saveCustomer,
  getCustomer,
  findCustomerByName,
  getSalesByCustomer,
} from "@/lib/db";
import { customerSchema } from "@/lib/ai/schemas";
import type { Customer } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const customerId = searchParams.get("customerId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    if (businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (customerId) {
      const customer = await getCustomer(customerId);
      if (!customer || customer.businessId !== businessId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const sales = await getSalesByCustomer(businessId, customerId);
      return NextResponse.json({ customer, sales });
    }

    const customers = await getCustomers(businessId);
    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ customers: [] });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { businessId } = body;
    if (!businessId || businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const validation = customerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 },
      );
    }

    const existing = await findCustomerByName(businessId, validation.data.name);
    if (existing) {
      return NextResponse.json({ error: "Customer already exists" }, { status: 409 });
    }

    const customerId = `cust_${Date.now()}`;
    const customer: Customer = {
      customerId,
      businessId,
      name: validation.data.name,
      phone: validation.data.phone || undefined,
      email: validation.data.email || undefined,
      address: validation.data.address || undefined,
      totalPurchases: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString(),
    };
    await saveCustomer(customer);
    return NextResponse.json({ ok: true, customer });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
