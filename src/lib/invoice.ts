import type { InvoiceItem } from "@/lib/types";

export const GST_RATE = 0.18; // 18% GST

export function computeInvoiceTotals(items: InvoiceItem[]) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  return { subtotal, gst, total };
}
