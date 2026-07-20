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
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  minimumStock: number;
  unit?: string;
  businessId: string;
  // moving average daily usage (computed by prediction engine)
  avgDailyUsage?: number;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
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
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  total: number;
  paymentMethod: string;
  date: string;
  storageUrl?: string;
}
