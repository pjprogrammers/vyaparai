import { z } from "zod";

// ---- Invoice schemas ----
export const invoiceItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().positive(),
  price: z.coerce.number().nonnegative(),
});

export const invoiceSchema = z.object({
  supplier: z.string().min(1),
  items: z.array(invoiceItemSchema).min(1),
  gst: z.coerce.number().nonnegative().default(0),
  amount: z.coerce.number().nonnegative(),
  total: z.coerce.number().nonnegative(),
  date: z.string().min(1),
  businessId: z.string().optional(),
  paid: z.boolean().optional(),
});

export type ParsedInvoice = z.infer<typeof invoiceSchema>;

export const extractInvoicePrompt = `You are an Indian MSME invoice parser.
Extract structured data from the invoice text below and return ONLY valid JSON
with this exact shape, no prose, no markdown:

{
  "supplier": string,
  "date": "DD-MM-YYYY" or "YYYY-MM-DD",
  "items": [ { "name": string, "quantity": number, "price": number } ],
  "gst": number,
  "amount": number,
  "total": number
}

Rules:
- quantity and price must be numeric.
- "amount" and "total" are both the grand total including GST.
- Identify product names precisely (e.g. "Rice 50kg" -> name "Rice", note weight in name if ambiguous).
- If a field is missing, use 0 for numbers and "" for strings.

Invoice text:
`;

// ---- Expense schema ----
export const expenseSchema = z.object({
  category: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  date: z.string().min(1),
});

export type ParsedExpense = z.infer<typeof expenseSchema>;

// ---- Sale schema (for API input validation) ----
export const saleInputSchema = z.object({
  businessId: z.string().min(1),
  customer: z.string().min(1),
  items: z.array(invoiceItemSchema).min(1),
  amount: z.coerce.number().positive(),
  date: z.string().min(1),
  paymentMethod: z.string().optional(),
});

// ---- Insight schema (for API input validation) ----
export const insightSchema = z.object({
  insightId: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  createdAt: z.string().min(1),
  businessId: z.string().min(1),
});

// ---- Business setup schema ----
export const businessSetupSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  category: z.enum(["Grocery Store", "Pharmacy", "Restaurant", "Manufacturer", "Other"]),
  gst: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  currency: z.string().default("INR"),
  language: z.string().default("en"),
});

// ---- Customer schema ----
export const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
});

// ---- Notification type enum ----
export const notificationTypeSchema = z.enum([
  "low_stock",
  "invoice_processed",
  "expense_added",
  "forecast_ready",
  "ai_recommendation",
  "pending_payment",
  "sale_recorded",
]);

// ---- Report period enum ----
export const reportPeriodSchema = z.enum(["daily", "weekly", "monthly", "yearly"]);

// ---- Supplier schema ----
export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
});
