"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pdf } from "@react-pdf/renderer";
import { InvoicePdf } from "@/components/invoice-pdf";
import { computeInvoiceTotals } from "@/lib/invoice";
import type { Business, InvoiceItem } from "@/lib/types";

interface LineItem {
  name: string;
  quantity: number;
  price: number;
}

export function InvoiceGenerator({
  businessId,
  business,
}: {
  businessId: string;
  business: Business;
}) {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState<LineItem[]>([{ name: "", quantity: 1, price: 0 }]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  async function handleGenerate() {
    setStatus("working");
    setMessage("");
    const clean: InvoiceItem[] = items
      .filter((i) => i.name.trim())
      .map((i) => ({ name: i.name, quantity: Number(i.quantity), price: Number(i.price) }));
    if (!customer || clean.length === 0) {
      setStatus("idle");
      setMessage("Add a customer name and at least one item.");
      return;
    }
    try {
      const res = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, customer, items: clean, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      const { subtotal, gst, total } = computeInvoiceTotals(clean);
      const blob = await pdf(
        <InvoicePdf
          business={business}
          invoice={{
            invoiceId: data.invoice.invoiceId,
            businessId,
            customer,
            items: clean,
            subtotal,
            gst,
            total,
            paymentMethod,
            date: new Date().toISOString().split("T")[0],
          }}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoice.invoiceId}.pdf`;
      a.click();
      setStatus("done");
      setMessage(`Invoice ${data.invoice.invoiceId} generated (₹${total}). Downloaded.`);
    } catch (e) {
      setStatus("idle");
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Invoice Generator</CardTitle>
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
            <Button variant="outline" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}>×</Button>
          </div>
        ))}

        <Button variant="outline" onClick={() => setItems((p) => [...p, { name: "", quantity: 1, price: 0 }])}>
          + Add item
        </Button>

        <Button onClick={handleGenerate} disabled={status === "working"} className="w-full">
          {status === "working" ? "Generating PDF…" : "Generate & Download Invoice"}
        </Button>

        {message && <p className="text-sm text-slate-500">{message}</p>}
      </CardContent>
    </Card>
  );
}
