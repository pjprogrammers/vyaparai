import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import { getAuditLogs } from "@/lib/db";

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
    const logs = await getAuditLogs(businessId);
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ logs: [] });
  }
}
