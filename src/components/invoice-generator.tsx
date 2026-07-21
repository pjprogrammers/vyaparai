"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { InvoicePdf } from "@/components/invoice-pdf";
import { computeInvoiceTotals } from "@/lib/invoice";
import { generateUpiQrDataUrl } from "@/lib/qr";
import type { Business, GeneratedInvoice, InvoiceItem } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";

interface LineItem {
  name: string;
  quantity: number;
  price: number;
  hsn: string;
  discount: number;
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
  const [items, setItems] = useState<LineItem[]>([
    { name: "", quantity: 1, price: 0, hsn: "", discount: 0 },
  ]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [previewInvoice, setPreviewInvoice] = useState<{
    invoice: GeneratedInvoice;
    qrUrl: string;
  } | null>(null);
  const { getIdToken } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  async function handleGenerate() {
    setStatus("working");
    setMessage("");
    const clean: InvoiceItem[] = items
      .filter((i) => i.name.trim())
      .map((i) => ({
        name: i.name,
        quantity: Number(i.quantity),
        price: Number(i.price),
        hsn: i.hsn || undefined,
        discount: i.discount || undefined,
      }));
    if (!customer || clean.length === 0) {
      setStatus("idle");
      setMessage("Add a customer name and at least one item.");
      return;
    }
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/generate-invoice", {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId, customer, items: clean, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      const { subtotal, discount, gst, total } = computeInvoiceTotals(clean);
      const invoiceData: GeneratedInvoice = {
        invoiceId: data.invoice.invoiceId,
        businessId,
        customer,
        items: clean,
        subtotal,
        gst,
        total,
        discount,
        paymentMethod,
        date: new Date().toISOString().split("T")[0],
      };

      let qrUrl = "";
      try {
        if (business.upiId || business.gst) {
          qrUrl = await generateUpiQrDataUrl(business.upiId || business.gst, total, business.name);
        }
      } catch {
        // QR generation failed — proceed without it
      }

      setPreviewInvoice({ invoice: invoiceData, qrUrl });

      const blob = await pdf(
        <InvoicePdf business={business} invoice={invoiceData} qrCodeUrl={qrUrl} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoice.invoiceId}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);

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
          <div key={i} className="grid grid-cols-[1fr_70px_80px_80px_70px_32px] gap-2 items-center">
            <Input placeholder="Item name" value={it.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
            <Input placeholder="HSN" value={it.hsn} onChange={(e) => updateItem(i, { hsn: e.target.value })} />
            <Input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} />
            <Input type="number" placeholder="Rate" value={it.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} />
            <Input type="number" placeholder="Disc." value={it.discount || ""} onChange={(e) => updateItem(i, { discount: Number(e.target.value) })} />
            <Button variant="outline" size="sm" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}>×</Button>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={() => setItems((p) => [...p, { name: "", quantity: 1, price: 0, hsn: "", discount: 0 }])}
        >
          + Add item
        </Button>

        <Button onClick={handleGenerate} disabled={status === "working"} className="w-full">
          {status === "working" ? "Generating PDF…" : "Generate & Download Invoice"}
        </Button>

        {message && <p className="text-sm text-slate-400">{message}</p>}

        {previewInvoice && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">PDF Preview</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const el = printRef.current;
                  if (!el) return;
                  const win = window.open("", "_blank");
                  if (!win) return;
                  win.document.write(`<html><head><title>Invoice</title></head><body style="margin:0">`);
                  win.document.write(el.innerHTML);
                  win.document.write("</body></html>");
                  win.document.close();
                  win.print();
                }}
              >
                Print
              </Button>
            </div>
            <div ref={printRef} className="border rounded-lg overflow-hidden" style={{ height: 600 }}>
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                <InvoicePdf
                  business={business}
                  invoice={previewInvoice.invoice}
                  qrCodeUrl={previewInvoice.qrUrl}
                />
              </PDFViewer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
