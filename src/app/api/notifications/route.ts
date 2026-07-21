import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/db";

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

    const [notifications, unreadCount] = await Promise.all([
      getNotifications(businessId),
      getUnreadNotificationCount(businessId),
    ]);
    return NextResponse.json({ notifications, unreadCount });
  } catch {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { businessId, action, notificationId } = await request.json();
    if (!businessId || businessId !== `biz_${auth.uid}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "mark_read" && notificationId) {
      await markNotificationRead(notificationId);
      return NextResponse.json({ ok: true });
    }
    if (action === "mark_all_read") {
      await markAllNotificationsRead(businessId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
