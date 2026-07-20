import { GoogleGenerativeAI } from "@google/generative-ai";
import { invoiceSchema, extractInvoicePrompt, type ParsedInvoice } from "./schemas";

const MODEL = "gemini-2.5-flash";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: MODEL });
}

function extractJson(raw: string): unknown {
  let jsonStr = raw.trim();
  // Strip markdown code fences if present
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  const jsonStart = jsonStr.indexOf("{");
  const jsonEnd = jsonStr.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Gemini did not return valid JSON");
  }
  const slice = jsonStr.slice(jsonStart, jsonEnd + 1);
  try {
    return JSON.parse(slice);
  } catch {
    throw new Error("Failed to parse JSON from Gemini response");
  }
}

export async function parseInvoiceWithGemini(text: string): Promise<ParsedInvoice> {
  const model = getModel();
  const result = await model.generateContent(extractInvoicePrompt + "\n\n" + text);
  const response = await result.response;
  const raw = response.text();

  const parsed = extractJson(raw);
  return invoiceSchema.parse(parsed);
}

export async function generateInsights(input: {
  salesSummary: string;
  inventorySummary: string;
  expenseSummary: string;
}): Promise<string> {
  const model = getModel();
  const prompt = `You are a business analyst for a small Indian business.
Analyze the data and return 3 concise, actionable insights. Each insight on a new line.
Be specific and reference numbers. Avoid generic advice.

SALES:
${input.salesSummary}

INVENTORY:
${input.inventorySummary}

EXPENSES:
${input.expenseSummary}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function forecastSales(history: string): Promise<string> {
  const model = getModel();
  const prompt = `You are a sales forecasting assistant for an Indian MSME.
Given the past monthly revenue below, predict next month's expected revenue
and briefly explain the trend. Return concise text with a clear number.

${history}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

const extractExpensePrompt = `You are an expense classifier for an Indian business.
Extract structured data from the bill text and return ONLY valid JSON:

{
  "category": string,   // e.g. Utilities, Transport, Rent, Salaries, Supplies, Other
  "amount": number,
  "date": "YYYY-MM-DD"
}

Rules: amount must be numeric. If date missing use today.
No prose, no markdown.

Bill text:
`;

export async function parseExpenseWithGemini(text: string): Promise<{
  category: string;
  amount: number;
  date: string;
}> {
  const model = getModel();
  const result = await model.generateContent(extractExpensePrompt + "\n\n" + text);
  const raw = (await result.response).text();
  const parsed = extractJson(raw) as { category?: unknown; amount?: unknown; date?: unknown };
  return {
    category: String(parsed.category ?? "Other"),
    amount: Number(parsed.amount ?? 0),
    date: String(parsed.date ?? new Date().toISOString().split("T")[0]),
  };
}

