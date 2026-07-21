"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { computeInvoiceTotals } from "@/lib/invoice";
import type { Business, GeneratedInvoice, InvoiceItem } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, color: "#0f172a" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  headerLeft: { width: "60%" },
  headerRight: { width: "40%", alignItems: "flex-end" },
  bizName: { fontSize: 18, fontWeight: 700 },
  meta: { fontSize: 9, color: "#64748b" },
  title: { fontSize: 14, fontWeight: 700, marginVertical: 8 },
  row: {
    flexDirection: "row",
    borderBottom: "1pt solid #e2e8f0",
    paddingVertical: 6,
  },
  th: { fontWeight: 700, fontSize: 9, color: "#475569" },
  thItem: { width: "32%" },
  thHsn: { width: "12%" },
  thQty: { width: "10%" },
  thRate: { width: "14%" },
  thDiscount: { width: "12%" },
  thAmount: { width: "20%", textAlign: "right" },
  td: { fontSize: 10 },
  tdItem: { width: "32%" },
  tdHsn: { width: "12%", fontSize: 9 },
  tdQty: { width: "10%" },
  tdRate: { width: "14%" },
  tdDiscount: { width: "12%" },
  tdAmount: { width: "20%", textAlign: "right" },
  totals: { marginTop: 12, alignSelf: "flex-end", width: 240 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  grandLabel: { fontWeight: 700, fontSize: 13 },
  grandValue: { fontWeight: 700, fontSize: 13 },
  taxRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 1 },
  footer: { marginTop: 24, fontSize: 9, color: "#94a3b8", textAlign: "center" },
  qrSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
  },
  qrLabel: { fontSize: 8, color: "#94a3b8", marginTop: 4 },
  signatureSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sigBlock: { width: "40%", textAlign: "center" },
  sigLine: { borderTopWidth: 1, borderTopColor: "#cbd5e1", marginTop: 40, paddingTop: 4 },
  sigLabel: { fontSize: 8, color: "#94a3b8" },
});

function formatNum(n: number) {
  return n.toLocaleString("en-IN");
}

export function InvoicePdf({
  business,
  invoice,
  qrCodeUrl,
}: {
  business: Business;
  invoice: GeneratedInvoice;
  qrCodeUrl?: string;
}) {
  const items: InvoiceItem[] = invoice.items;
  const { subtotal, discount, cgst, sgst, total } = computeInvoiceTotals(items);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {business.logoUrl ? (
              <Image src={business.logoUrl} style={{ width: 40, height: 40, marginBottom: 4 }} />
            ) : null}
            <Text style={styles.bizName}>{business.name}</Text>
            <Text style={styles.meta}>{business.address}</Text>
            {business.phone ? <Text style={styles.meta}>Phone: {business.phone}</Text> : null}
            {business.email ? <Text style={styles.meta}>Email: {business.email}</Text> : null}
            {business.gst ? <Text style={styles.meta}>GSTIN: {business.gst}</Text> : null}
          </View>
          <View style={styles.headerRight}>
            <Text style={{ ...styles.meta, fontWeight: 700, fontSize: 11 }}>TAX INVOICE</Text>
            <Text style={styles.meta}>Invoice #: {invoice.invoiceId}</Text>
            <Text style={styles.meta}>Date: {invoice.date}</Text>
            <Text style={styles.meta}>Bill to: {invoice.customer}</Text>
            {invoice.paymentMethod ? <Text style={styles.meta}>Payment: {invoice.paymentMethod}</Text> : null}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={{ ...styles.th, ...styles.thItem }}>Item</Text>
          <Text style={{ ...styles.th, ...styles.thHsn }}>HSN</Text>
          <Text style={{ ...styles.th, ...styles.thQty }}>Qty</Text>
          <Text style={{ ...styles.th, ...styles.thRate }}>Rate</Text>
          <Text style={{ ...styles.th, ...styles.thDiscount }}>Disc.</Text>
          <Text style={{ ...styles.th, ...styles.thAmount }}>Amount</Text>
        </View>
        {items.map((it, idx) => (
          <View style={styles.row} key={idx}>
            <Text style={{ ...styles.td, ...styles.tdItem }}>{it.name}</Text>
            <Text style={{ ...styles.td, ...styles.tdHsn }}>{it.hsn ?? "—"}</Text>
            <Text style={{ ...styles.td, ...styles.tdQty }}>{it.quantity}</Text>
            <Text style={{ ...styles.td, ...styles.tdRate }}>₹{formatNum(it.price)}</Text>
            <Text style={{ ...styles.td, ...styles.tdDiscount }}>
              {it.discount ? `-₹${formatNum(it.discount)}` : "—"}
            </Text>
            <Text style={{ ...styles.td, ...styles.tdAmount }}>
              ₹{formatNum(it.quantity * it.price - (it.discount ?? 0))}
            </Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>₹{formatNum(subtotal)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text>Discount</Text>
              <Text>-₹{formatNum(discount)}</Text>
            </View>
          )}
          <View style={styles.taxRow}>
            <Text>CGST (9%)</Text>
            <Text>₹{formatNum(cgst)}</Text>
          </View>
          <View style={styles.taxRow}>
            <Text>SGST (9%)</Text>
            <Text>₹{formatNum(sgst)}</Text>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: "#e2e8f0", marginVertical: 4 }} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>₹{formatNum(total)}</Text>
          </View>
        </View>

        {qrCodeUrl ? (
          <View style={styles.qrSection}>
            <View>
              <Text style={styles.meta}>Scan to pay via UPI</Text>
              {business.upiId ? <Text style={styles.qrLabel}>UPI: {business.upiId}</Text> : null}
            </View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={qrCodeUrl} style={{ width: 100, height: 100 }} />
          </View>
        ) : null}

        <View style={styles.signatureSection}>
          <View style={styles.sigBlock}>
            <Text style={styles.meta}>Customer Signature</Text>
            <View style={styles.sigLine} />
          </View>
          <View style={styles.sigBlock}>
            <Text style={styles.meta}>Authorized Signatory</Text>
            <View style={styles.sigLine} />
          </View>
        </View>

        <Text style={styles.footer}>Generated by VyaparAI — AI Employee for Your Business</Text>
      </Page>
    </Document>
  );
}
