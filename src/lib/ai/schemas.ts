import { z } from "zod";

export const invoiceItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().positive(),
  price: z.coerce.number().nonnegative(),
});

export const invoiceSchema = z.object({
  supplier: z.string().min(1),
  items: z.array(invoiceItemSchema).min(1),
  gst: z.coerce.number().nonnegative().default(0),
  total: z.coerce.number().nonnegative(),
  date: z.string().min(1),
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
  "total": number
}

Rules:
- quantity and price must be numeric.
- "total" is the grand total including GST.
- Identify product names precisely (e.g. "Rice 50kg" -> name "Rice", note weight in name if ambiguous).
- If a field is missing, use 0 for numbers and "" for strings.

Invoice text:
`;
