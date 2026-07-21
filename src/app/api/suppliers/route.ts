import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import { getSuppliers, saveSupplier, deleteSupplier } from "@/lib/db";
import type { Supplier } from "@/lib/types";

export async function GET(request: Request) {
  try {
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
    const suppliers = await getSuppliers(businessId);
    return NextResponse.json({ suppliers });
  } catch {
    return NextResponse.json({ suppliers: [] });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { businessId, name, phone, email, address } = body;
    if (!businessId || businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Supplier name is required" }, { status: 400 });
    }

    const supplierId = `sup_${Date.now()}`;
    const supplier: Supplier = {
      supplierId,
      businessId,
      name: name.trim(),
      phone: phone || undefined,
      email: email || undefined,
      address: address || undefined,
      createdAt: new Date().toISOString(),
    };
    await saveSupplier(supplier);
    return NextResponse.json({ ok: true, supplier });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get("supplierId");
    if (!supplierId) {
      return NextResponse.json({ error: "supplierId required" }, { status: 400 });
    }
    await deleteSupplier(supplierId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
