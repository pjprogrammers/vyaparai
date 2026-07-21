import { getAdmin } from "@/lib/firebase/admin";
import type {
  AuditLog,
  Business,
  Customer,
  CustomerMessage,
  Expense,
  GeneratedInvoice,
  Insight,
  InventoryLog,
  Invoice,
  Notification,
  Product,
  Report,
  Sale,
  Supplier,
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

export async function updateBusiness(businessId: string, data: Partial<Business>) {
  const { db } = getAdmin();
  await db.collection("businesses").doc(businessId).update(data);
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
  referenceId?: string,
) {
  const { db } = getAdmin();
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
      const newQty = Math.max(0, delta);
      await ref.set({
        id: ref.id,
        name: item.name,
        quantity: newQty,
        price: item.price ?? 0,
        minimumStock: 10,
        businessId,
      });
      await logInventoryTransaction({
        businessId,
        productId: ref.id,
        productName: item.name,
        type: mode === "add" ? "purchase" : "sale",
        quantityChange: delta,
        previousQuantity: 0,
        newQuantity: newQty,
        referenceId,
      });
    } else {
      const doc = q.docs[0];
      const current = doc.data() as Product;
      const newQty = Math.max(0, current.quantity + delta);
      await doc.ref.update({ quantity: newQty, price: item.price ?? current.price });
      await logInventoryTransaction({
        businessId,
        productId: doc.id,
        productName: item.name,
        type: mode === "add" ? "purchase" : "sale",
        quantityChange: delta,
        previousQuantity: current.quantity,
        newQuantity: newQty,
        referenceId,
      });
      if (newQty <= current.minimumStock && newQty > 0) {
        await createNotification({
          businessId,
          type: "low_stock",
          title: `Low Stock: ${item.name}`,
          message: `${item.name} has ${newQty} units left (minimum: ${current.minimumStock}). Consider reordering.`,
          actionUrl: "/dashboard",
        });
      }
    }
  }
}

// ---- Inventory Logs ----
export async function logInventoryTransaction(log: Omit<InventoryLog, "logId" | "createdAt">) {
  const { db } = getAdmin();
  const ref = db.collection("inventoryLogs").doc();
  await ref.set({
    logId: ref.id,
    ...log,
    createdAt: new Date().toISOString(),
  });
}

export async function getInventoryLogs(businessId: string, limit = 50): Promise<InventoryLog[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("inventoryLogs")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as InventoryLog);
}

// ---- Invoices ----
export async function saveInvoice(inv: Invoice) {
  const { db } = getAdmin();
  await db.collection("invoices").doc(inv.invoiceId).set(inv);
}

export async function checkDuplicateInvoice(
  businessId: string,
  supplier: string,
  date: string,
  amount: number,
): Promise<boolean> {
  const { db } = getAdmin();
  const snap = await db
    .collection("invoices")
    .where("businessId", "==", businessId)
    .where("supplier", "==", supplier)
    .where("date", "==", date)
    .where("amount", "==", amount)
    .limit(1)
    .get();
  return !snap.empty;
}

// ---- Sales ----
export async function saveSale(sale: Sale) {
  const { db } = getAdmin();
  await db.collection("sales").doc(sale.saleId).set(sale);
}

export async function getSales(businessId: string): Promise<Sale[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("sales")
    .where("businessId", "==", businessId)
    .orderBy("date", "asc")
    .get();
  return snap.docs.map((d) => d.data() as Sale);
}

export async function getSalesByCustomer(
  businessId: string,
  customerId: string,
): Promise<Sale[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("sales")
    .where("businessId", "==", businessId)
    .where("customerId", "==", customerId)
    .orderBy("date", "desc")
    .get();
  return snap.docs.map((d) => d.data() as Sale);
}

// ---- Suppliers ----
export async function saveSupplier(supplier: Supplier) {
  const { db } = getAdmin();
  await db.collection("suppliers").doc(supplier.supplierId).set(supplier);
}

export async function getSuppliers(businessId: string): Promise<Supplier[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("suppliers")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => d.data() as Supplier);
}

export async function getSupplier(supplierId: string): Promise<Supplier | null> {
  const { db } = getAdmin();
  const doc = await db.collection("suppliers").doc(supplierId).get();
  return doc.exists ? (doc.data() as Supplier) : null;
}

export async function deleteSupplier(supplierId: string) {
  const { db } = getAdmin();
  await db.collection("suppliers").doc(supplierId).delete();
}

// ---- Customers ----
export async function saveCustomer(customer: Customer) {
  const { db } = getAdmin();
  await db.collection("customers").doc(customer.customerId).set(customer);
}

export async function getCustomers(businessId: string): Promise<Customer[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("customers")
    .where("businessId", "==", businessId)
    .orderBy("totalPurchases", "desc")
    .get();
  return snap.docs.map((d) => d.data() as Customer);
}

export async function getCustomer(customerId: string): Promise<Customer | null> {
  const { db } = getAdmin();
  const doc = await db.collection("customers").doc(customerId).get();
  return doc.exists ? (doc.data() as Customer) : null;
}

export async function findCustomerByName(
  businessId: string,
  name: string,
): Promise<Customer | null> {
  const { db } = getAdmin();
  const snap = await db
    .collection("customers")
    .where("businessId", "==", businessId)
    .where("name", "==", name)
    .limit(1)
    .get();
  return snap.empty ? null : (snap.docs[0].data() as Customer);
}

export async function upsertCustomerOnSale(
  businessId: string,
  customerName: string,
  amount: number,
): Promise<string> {
  const existing = await findCustomerByName(businessId, customerName);
  const customerId = existing?.customerId ?? `cust_${Date.now()}`;
  const today = new Date().toISOString().split("T")[0];

  if (existing) {
    await saveCustomer({
      ...existing,
      totalPurchases: existing.totalPurchases + amount,
      lastPurchaseDate: today,
    });
    return customerId;
  }

  await saveCustomer({
    customerId,
    businessId,
    name: customerName,
    totalPurchases: amount,
    outstandingBalance: 0,
    lastPurchaseDate: today,
    createdAt: new Date().toISOString(),
  });
  return customerId;
}

// ---- Expenses ----
export async function saveExpense(exp: Expense) {
  const { db } = getAdmin();
  await db.collection("expenses").doc(exp.expenseId).set(exp);
}

export async function getExpenses(businessId: string): Promise<Expense[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("expenses")
    .where("businessId", "==", businessId)
    .get();
  return snap.docs.map((d) => d.data() as Expense);
}

// ---- AI Insights ----
export async function saveInsight(insight: Insight) {
  const { db } = getAdmin();
  await db.collection("aiInsights").doc(insight.insightId).set(insight);
}

export async function getInsights(businessId: string): Promise<Insight[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("aiInsights")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();
  return snap.docs.map((d) => d.data() as Insight);
}

// ---- Invoices (queries) ----
export async function getInvoices(businessId: string): Promise<Invoice[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("invoices")
    .where("businessId", "==", businessId)
    .orderBy("date", "desc")
    .get();
  return snap.docs.map((d) => d.data() as Invoice);
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
  businessId?: string,
) {
  const { db } = getAdmin();
  if (businessId) {
    const ref = db.collection("customerMessages").doc(messageId);
    const existing = await ref.get();
    if (!existing.exists) {
      throw new Error("Message not found");
    }
    if (existing.data()?.businessId !== businessId) {
      throw new Error("Forbidden");
    }
  }
  await db.collection("customerMessages").doc(messageId).update(data);
}

// ---- Generated (customer) Invoices ----
export async function saveGeneratedInvoice(inv: GeneratedInvoice) {
  const { db } = getAdmin();
  await db.collection("generatedInvoices").doc(inv.invoiceId).set(inv);
}

export async function getGeneratedInvoices(businessId: string): Promise<GeneratedInvoice[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("generatedInvoices")
    .where("businessId", "==", businessId)
    .orderBy("date", "desc")
    .get();
  return snap.docs.map((d) => d.data() as GeneratedInvoice);
}

export async function getGeneratedInvoicesByCustomer(
  businessId: string,
  customerId: string,
): Promise<GeneratedInvoice[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("generatedInvoices")
    .where("businessId", "==", businessId)
    .where("customerId", "==", customerId)
    .orderBy("date", "desc")
    .get();
  return snap.docs.map((d) => d.data() as GeneratedInvoice);
}

// ---- Product helpers ----
export async function saveProduct(product: Product) {
  const { db } = getAdmin();
  await db.collection("products").doc(product.id).set(product);
}

export async function updateProductStock(productId: string, quantity: number) {
  const { db } = getAdmin();
  await db.collection("products").doc(productId).update({ quantity });
}

// ---- Customer messages (all, not just pending) ----
export async function getCustomerMessages(businessId: string): Promise<CustomerMessage[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("customerMessages")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();
  return snap.docs.map((d) => d.data() as CustomerMessage);
}

// ---- Notifications ----
export async function createNotification(
  n: Omit<Notification, "notificationId" | "read" | "createdAt">,
) {
  const { db } = getAdmin();
  const ref = db.collection("notifications").doc();
  await ref.set({
    notificationId: ref.id,
    ...n,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function getNotifications(businessId: string, limit = 20): Promise<Notification[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("notifications")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as Notification);
}

export async function getUnreadNotificationCount(businessId: string): Promise<number> {
  const { db } = getAdmin();
  const snap = await db
    .collection("notifications")
    .where("businessId", "==", businessId)
    .where("read", "==", false)
    .get();
  return snap.size;
}

export async function markNotificationRead(notificationId: string) {
  const { db } = getAdmin();
  await db.collection("notifications").doc(notificationId).update({ read: true });
}

export async function markAllNotificationsRead(businessId: string) {
  const { db } = getAdmin();
  const snap = await db
    .collection("notifications")
    .where("businessId", "==", businessId)
    .where("read", "==", false)
    .get();
  const batch = db.batch();
  for (const doc of snap.docs) {
    batch.update(doc.ref, { read: true });
  }
  await batch.commit();
}

// ---- Audit Logs ----
export async function logAuditEvent(
  log: Omit<AuditLog, "logId" | "createdAt">,
) {
  const { db } = getAdmin();
  const ref = db.collection("auditLogs").doc();
  await ref.set({
    logId: ref.id,
    ...log,
    createdAt: new Date().toISOString(),
  });
}

export async function getAuditLogs(
  businessId: string,
  limit = 50,
): Promise<AuditLog[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("auditLogs")
    .where("businessId", "==", businessId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as AuditLog);
}

// ---- Reports ----
export async function saveReport(report: Report) {
  const { db } = getAdmin();
  await db.collection("reports").doc(report.reportId).set(report);
}

export async function getReports(businessId: string): Promise<Report[]> {
  const { db } = getAdmin();
  const snap = await db
    .collection("reports")
    .where("businessId", "==", businessId)
    .orderBy("generatedAt", "desc")
    .limit(20)
    .get();
  return snap.docs.map((d) => d.data() as Report);
}

// ---- Expense Intelligence categories ----
export const EXPENSE_CATEGORIES = [
  "Utilities",
  "Travel",
  "Food",
  "Office",
  "Marketing",
  "Salary",
  "Rent",
  "Supplies",
  "Transport",
  "Other",
] as const;
