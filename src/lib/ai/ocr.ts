import { invoiceSchema, type ParsedInvoice } from "./schemas";

// Free, client-side OCR via Tesseract.js
export async function ocrWithTesseract(fileUrl: string): Promise<string> {
  const { default: Tesseract } = await import("tesseract.js");
  const worker = await Tesseract.createWorker("eng");
  try {
    const ret = await worker.recognize(fileUrl);
    return ret.data.text;
  } finally {
    await worker.terminate();
  }
}

// Stub for Google Cloud Vision (requires API key + billing)
export async function ocrWithVision(_fileUrl: string): Promise<string> {
  throw new Error("Google Cloud Vision OCR is not configured in MVP. Set OCR_PROVIDER=tesseract.");
}

export async function extractText(fileUrl: string): Promise<string> {
  const provider = process.env.OCR_PROVIDER ?? "tesseract";
  if (provider === "vision") return ocrWithVision(fileUrl);
  return ocrWithTesseract(fileUrl);
}

export async function parseInvoiceJson(text: string): Promise<ParsedInvoice> {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Failed to parse invoice JSON — the OCR output was not valid JSON.");
  }
  return invoiceSchema.parse(json);
}
