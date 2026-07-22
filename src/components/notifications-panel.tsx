"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { Bell, CheckCheck } from "lucide-react";
import type { Notification } from "@/lib/types";

export function NotificationsPanel({ businessId }: { businessId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getIdToken } = useAuth();

  async function fetchNotifications() {
    setLoading(true);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch(`/api/notifications?businessId=${businessId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchNotifications();
  }, [businessId]);

  async function markAllRead() {
    const token = await getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.authorization = `Bearer ${token}`;
    await fetch("/api/notifications", {
      method: "POST",
      headers,
      body: JSON.stringify({ businessId, action: "mark_all_read" }),
    });
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function getIcon(type: Notification["type"]) {
    switch (type) {
      case "low_stock": return "📦";
      case "invoice_processed": return "📄";
      case "expense_added": return "💸";
      case "forecast_ready": return "📊";
      case "ai_recommendation": return "🤖";
      case "pending_payment": return "⚠️";
      case "sale_recorded": return "💰";
      default: return "📌";
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 text-xs">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-1 h-3 w-3" /> Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2 max-h-80 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : notifications.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Bell className="h-4 w-4" /> No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`rounded-lg border p-3 text-sm ${
                n.read
                  ? "border-white/10 bg-white/5"
                  : "border-yellow-400/30 bg-yellow-500/10"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-base">{getIcon(n.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-white">{n.title}</p>
                  <p className="text-slate-300">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
