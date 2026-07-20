import { NextResponse } from "next/server";
import { draftCustomerReply } from "@/lib/ai/customer-assistant";
import {
  saveCustomerMessage,
  getPendingMessages,
  updateCustomerMessage,
} from "@/lib/db";
import type { CustomerMessage } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, businessId } = body;

    if (action === "draft") {
      const { query, customer, channel } = body;
      if (!businessId || !query) {
        return NextResponse.json({ error: "businessId and query required" }, { status: 400 });
      }
      const { inventoryCheck, draftResponse } = await draftCustomerReply(businessId, query);
      const messageId = `msg_${Date.now()}`;
      const msg: CustomerMessage = {
        messageId,
        businessId,
        customer: customer || "WhatsApp User",
        channel: channel || "whatsapp",
        query,
        inventoryCheck,
        draftResponse,
        status: "pending_approval",
        createdAt: new Date().toISOString(),
      };
      await saveCustomerMessage(msg);
      return NextResponse.json({ ok: true, message: msg });
    }

    if (action === "approve" || action === "reject") {
      const { messageId } = body;
      if (!messageId) {
        return NextResponse.json({ error: "messageId required" }, { status: 400 });
      }
      await updateCustomerMessage(messageId, {
        status: action === "approve" ? "approved" : "rejected",
      });
      return NextResponse.json({ ok: true, status: action === "approve" ? "approved" : "rejected" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }
  const messages = await getPendingMessages(businessId);
  return NextResponse.json({ messages });
}
