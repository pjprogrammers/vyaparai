"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { ShoppingCart } from "lucide-react";

interface LineItem {
  name: string;
  quantity: number;
  price: number;
}

export function SalesRecorder({ businessId }: { businessId: string }) {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState<LineItem[]>([{ name: "", quantity: 1, price: 0 }]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const { getIdToken } = useAuth();

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  async function handleRecord() {
    const clean: LineItem[] = items.filter((i) => i.name.trim());
    if (!customer || clean.length === 0) {
      setMessage("Add a customer name and at least one item.");
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/sales", {
        method: "POST",
        headers,
        body: JSON.stringify({
          businessId,
          customer,
          items: clean,
          amount: total,
          date: new Date().toISOString().split("T")[0],
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setStatus("done");
      setMessage(`Sale of ₹${total} to ${customer} recorded. Inventory updated.`);
      setCustomer("");
      setItems([{ name: "", quantity: 1, price: 0 }]);
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4" /> Record Sale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <Input placeholder="Payment method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
        </div>

        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Item" value={it.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
            <Input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} className="w-20" />
            <Input type="number" placeholder="Price" value={it.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} className="w-24" />
            <Button variant="outline" size="sm" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}>×</Button>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setItems((p) => [...p, { name: "", quantity: 1, price: 0 }])}>
            + Add item
          </Button>
          <p className="text-sm font-semibold text-white">Total: ₹{total.toLocaleString("en-IN")}</p>
        </div>

        <Button onClick={handleRecord} disabled={status === "saving"} className="w-full">
          {status === "saving" ? "Recording…" : "Record Sale"}
        </Button>

        {message && (
          <p className={status === "error" ? "text-sm text-red-400" : "text-sm text-emerald-400"}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
