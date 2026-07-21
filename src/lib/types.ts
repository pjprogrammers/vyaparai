export type BusinessCategory =
  | "Grocery Store"
  | "Pharmacy"
  | "Restaurant"
  | "Manufacturer"
  | "Other";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  businessId: string | null;
  createdAt: string;
}

export interface Business {
  businessId: string;
  name: string;
  category: BusinessCategory;
  gst: string;
  address: string;
  currency: string;
  language: string;
  owner: string;
  createdAt: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  upiId?: string;
  bankDetails?: string;
  signatureUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  minimumStock: number;
  unit?: string;
  businessId: string;
  supplierId?: string;
  avgDailyUsage?: number;
}

export type SaleItem = InvoiceItem;

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  hsn?: string;
  discount?: number;
}

export interface Invoice {
  invoiceId: string;
  supplier: string;
  items: InvoiceItem[];
  amount: number;
  gst: number;
  date: string;
  businessId: string;
  paid: boolean;
  storageUrl?: string;
}

export interface Sale {
  saleId: string;
  customer: string;
  customerId?: string;
  items: InvoiceItem[];
  amount: number;
  date: string;
  businessId: string;
  paymentMethod?: string;
}

export interface Expense {
  expenseId: string;
  category: string;
  amount: number;
  date: string;
  businessId: string;
  storageUrl?: string;
}

export interface Insight {
  insightId: string;
  message: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  businessId: string;
}

export interface StockPrediction {
  product: string;
  currentStock: number;
  avgDailyUsage: number;
  daysUntilOut: number | null;
  recommendedOrder: number;
  preferredSupplier: string | null;
}

export interface CustomerMessage {
  messageId: string;
  businessId: string;
  customer: string;
  channel: "whatsapp" | "web";
  query: string;
  inventoryCheck: string;
  draftResponse: string;
  status: "pending_approval" | "approved" | "rejected";
  createdAt: string;
}

export interface GeneratedInvoice {
  invoiceId: string;
  businessId: string;
  customer: string;
  customerId?: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  total: number;
  discount?: number;
  paymentMethod: string;
  date: string;
  storageUrl?: string;
}

// ---- NEW: Customer Management ----
export interface Customer {
  customerId: string;
  businessId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  outstandingBalance: number;
  lastPurchaseDate?: string;
  createdAt: string;
}

// ---- NEW: Supplier ----
export interface Supplier {
  supplierId: string;
  businessId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  createdAt: string;
}

// ---- NEW: Inventory Transaction Log ----
export interface InventoryLog {
  logId: string;
  businessId: string;
  productId: string;
  productName: string;
  type: "purchase" | "sale" | "adjustment" | "return";
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  referenceId?: string;
  note?: string;
  createdAt: string;
}

// ---- NEW: Notification ----
export interface Notification {
  notificationId: string;
  businessId: string;
  type: "low_stock" | "invoice_processed" | "expense_added" | "forecast_ready" | "ai_recommendation" | "pending_payment" | "sale_recorded";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ---- NEW: Report ----
export interface Report {
  reportId: string;
  businessId: string;
  period: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  inventoryValue: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  worstProducts: { name: string; quantity: number; revenue: number }[];
  forecast: string;
  growth: number;
  generatedAt: string;
}

// ---- NEW: Audit Log ----
export interface AuditLog {
  logId: string;
  businessId: string;
  action: string;
  entityType: "invoice" | "sale" | "expense" | "product" | "customer" | "message" | "report";
  entityId: string;
  details?: string;
  performedBy: string;
  createdAt: string;
}
