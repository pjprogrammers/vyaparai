import { getAdmin } from "@/lib/firebase/admin";
import type {
  Business,
  CustomerMessage,
  Expense,
  GeneratedInvoice,
  Insight,
  Invoice,
  Product,
  Sale,
  UserProfile,
} from "@/lib/types";

// ---- Users ----
export async function upsertUser(profile: UserProfile) {
  const { db } = getAdmin();
  await db.collection("users").doc(profile.uid).set(profile, { merge: true });
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  const { db } = getAdmin();
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? (doc.data() as UserProfile) : null;
}

// ---- Businesses ----
export async function createBusiness(b: Business) {
  const { db } = getAdmin();
  await db.collection("businesses").doc(b.businessId).set(b);
}

export async function getBusiness(businessId: string): Promise<Business | null> {
  const { db } = getAdmin();
  const doc = await db.collection("businesses").doc(businessId).get();
  return doc.exists ? (doc.data() as Business) : null;
}

// ---- Products / Inventory ----
export async function getProducts(businessId: string): Promise<Product[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("products")
    .where("businessId", "==", businessId)
    .get();
  return snap.docs.map((d) => d.data() as Product);
}

export async function adjustInventory(
  businessId: string,
  items: { name: string; quantity: number; price?: number }[],
  mode: "add" | "subtract",
) {
  const { db } = getAdmin();
  const batch = db.batch();
  for (const item of items) {
    const q = await db
      .collection("products")
      .where("businessId", "==", businessId)
      .where("name", "==", item.name)
      .limit(1)
      .get();
    const delta = mode === "add" ? item.quantity : -item.quantity;
    if (q.empty) {
      const ref = db.collection("products").doc();
      batch.set(ref, {
        id: ref.id,
        name: item.name,
        quantity: Math.max(0, delta),
        price: item.price ?? 0,
        minimumStock: 10,
        businessId,
      });
    } else {
      const ref = q.docs[0].ref;
      const current = q.docs[0].data() as Product;
      batch.update(ref, { quantity: Math.max(0, current.quantity + delta) });
    }
  }
  await batch.commit();
}

// ---- Invoices ----
export async function saveInvoice(inv: Invoice) {
  const { db } = getAdmin();
  await db.collection("invoices").doc(inv.invoiceId).set(inv);
}

// ---- Sales ----
export async function saveSale(sale: Sale) {
  const { db } = getAdmin();
  await db.collection("sales").doc(sale.saleId).set(sale);
}

// ---- Expenses ----
export async function saveExpense(exp: Expense) {
  const { db } = getAdmin();
  await db.collection("expenses").doc(exp.expenseId).set(exp);
}

// ---- Insights ----
export async function saveInsight(insight: Insight) {
  const { db } = getAdmin();
  await db.collection("insights").doc(insight.insightId).set(insight);
}

export async function getInsights(businessId: string): Promise<Insight[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("insights")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();
  return snap.docs.map((d) => d.data() as Insight);
}

// ---- Sales ----
export async function getSales(businessId: string): Promise<Sale[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("sales")
    .where("businessId", "==", businessId)
    .orderBy("date", "asc")
    .get();
  return snap.docs.map((d) => d.data() as Sale);
}

export async function getInvoices(businessId: string): Promise<Invoice[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("invoices")
    .where("businessId", "==", businessId)
    .get();
  return snap.docs.map((d) => d.data() as Invoice);
}

export async function getExpenses(businessId: string): Promise<Expense[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("expenses")
    .where("businessId", "==", businessId)
    .get();
  return snap.docs.map((d) => d.data() as Expense);
}

export async function getUnpaidInvoices(businessId: string): Promise<Invoice[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("invoices")
    .where("businessId", "==", businessId)
    .where("paid", "==", false)
    .get();
  return snap.docs.map((d) => d.data() as Invoice);
}

export async function updateInvoice(invoiceId: string, data: Partial<Invoice>) {
  const { db } = getAdmin();
  await db.collection("invoices").doc(invoiceId).update(data);
}

// Preferred supplier for a product = supplier who most recently supplied it.
export async function getPreferredSupplier(
  businessId: string,
  productName: string,
): Promise<string | null> {
  const { db } = getAdmin();
  const snap = await db
    .collection("invoices")
    .where("businessId", "==", businessId)
    .orderBy("date", "desc")
    .get();
  for (const doc of snap.docs) {
    const inv = doc.data() as Invoice;
    if (inv.items.some((i) => i.name.toLowerCase() === productName.toLowerCase())) {
      return inv.supplier;
    }
  }
  return null;
}

// Average daily usage of a product from the last 30 days of sales.
export async function getAvgDailyUsage(
  businessId: string,
  productName: string,
): Promise<number> {
  const { db } = getAdmin();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const snap = await db
    .collection("sales")
    .where("businessId", "==", businessId)
    .where("date", ">=", since)
    .get();
  let total = 0;
  const days = new Set<string>();
  for (const doc of snap.docs) {
    const sale = doc.data() as Sale;
    days.add(sale.date);
    for (const item of sale.items) {
      if (item.name.toLowerCase() === productName.toLowerCase()) {
        total += item.quantity;
      }
    }
  }
  const dayCount = Math.max(1, days.size);
  return total / dayCount;
}

// ---- Customer AI Assistant ----
export async function saveCustomerMessage(msg: CustomerMessage) {
  const { db } = getAdmin();
  await db.collection("customerMessages").doc(msg.messageId).set(msg);
}

export async function getPendingMessages(businessId: string): Promise<CustomerMessage[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("customerMessages")
    .where("businessId", "==", businessId)
    .where("status", "==", "pending_approval")
    .get();
  return snap.docs.map((d) => d.data() as CustomerMessage);
}

export async function updateCustomerMessage(
  messageId: string,
  data: Partial<CustomerMessage>,
) {
  const { db } = getAdmin();
  await db.collection("customerMessages").doc(messageId).update(data);
}

// ---- Generated (customer) Invoices ----
export async function saveGeneratedInvoice(inv: GeneratedInvoice) {
  const { db } = getAdmin();
  await db.collection("generatedInvoices").doc(inv.invoiceId).set(inv);
}
