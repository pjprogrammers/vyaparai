"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";

export function CustomerAssistant({ businessId }: { businessId: string }) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<{ messageId: string; draftResponse: string; inventoryCheck: string } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "sent">("idle");
  const [message, setMessage] = useState("");
  const { getIdToken } = useAuth();

  async function handleDraft() {
    if (!query) return;
    setStatus("loading");
    setMessage("Checking inventory + drafting reply…");
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/customer-message", {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "draft", businessId, query, customer: "WhatsApp User", channel: "whatsapp" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDraft({ messageId: data.message.messageId, draftResponse: data.message.draftResponse, inventoryCheck: data.message.inventoryCheck });
      setStatus("ready");
      setMessage("");
    } catch (e) {
      setStatus("idle");
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  async function decide(approve: boolean) {
    if (!draft) return;
    const token = await getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch("/api/customer-message", {
      method: "POST",
      headers,
      body: JSON.stringify({ action: approve ? "approve" : "reject", messageId: draft.messageId }),
    });
    await res.json();
    if (res.ok) {
      setStatus("sent");
      setMessage(approve ? "✅ Reply approved and sent to customer." : "Reply rejected.");
      setDraft(null);
      setQuery("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Do you have Aashirvaad Atta?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleDraft} disabled={!query || status === "loading"}>
            {status === "loading" ? "…" : "Ask"}
          </Button>
        </div>

        {draft && (
          <div className="space-y-3 rounded-xl border border-slate-200 p-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Inventory Check (grounding)</p>
              <p className="whitespace-pre-line text-sm text-slate-600">{draft.inventoryCheck}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">AI Draft (awaits approval)</p>
              <p className="whitespace-pre-line rounded-lg bg-indigo-50 p-2 text-sm text-slate-800">
                {draft.draftResponse}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => decide(true)} className="bg-emerald-600 hover:bg-emerald-500">Approve & Send</Button>
              <Button onClick={() => decide(false)} variant="outline">Reject</Button>
            </div>
          </div>
        )}

        {message && <p className="text-sm text-slate-500">{message}</p>}
      </CardContent>
    </Card>
  );
}
