import type { InvoiceItem } from "@/lib/types";

export const GST_RATE = 0.18; // 18% GST
export const CGST_RATE = GST_RATE / 2; // 9% CGST
export const SGST_RATE = GST_RATE / 2; // 9% SGST

export function computeInvoiceTotals(items: InvoiceItem[]) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const itemDiscount = items.reduce((s, i) => s + (i.discount ?? 0), 0);
  const afterDiscount = Math.max(0, subtotal - itemDiscount);
  const cgst = Math.round(afterDiscount * CGST_RATE);
  const sgst = Math.round(afterDiscount * SGST_RATE);
  const gst = cgst + sgst;
  const total = afterDiscount + gst;
  return { subtotal, discount: itemDiscount, cgst, sgst, gst, total };
}
