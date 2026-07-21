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

// ---- Enhanced: Proactive Business Insights ----
export async function generateInsights(input: {
  salesSummary: string;
  inventorySummary: string;
  expenseSummary: string;
  customerSummary?: string;
  invoiceSummary?: string;
  recentInsights?: string;
}): Promise<string> {
  const model = getModel();
  const month = new Date().toLocaleString("en-IN", { month: "long" });
  const prompt = `You are a senior business analyst for a small Indian MSME.
Generate 5 proactive, actionable business insights for ${month}.

Each insight must be:
1. Specific — reference actual numbers from the data
2. Actionable — tell the owner exactly what to do
3. Prioritized — most urgent first

Analyze:
- Revenue trends and growth
- Expense patterns and optimization opportunities
- Inventory health (low stock, dead stock, overstocking)
- Customer purchase patterns and churn risk
- Supplier pricing trends
- Cash flow health
- Seasonal patterns

Format: One insight per line. Start each with an emoji indicator.
- 🔴 for critical/urgent
- 🟡 for important
- 🟢 for positive trends

SALES DATA:
${input.salesSummary}

INVENTORY DATA:
${input.inventorySummary}

EXPENSE DATA:
${input.expenseSummary}

${input.customerSummary ? `CUSTOMER DATA:\n${input.customerSummary}\n` : ""}
${input.invoiceSummary ? `RECENT INVOICES:\n${input.invoiceSummary}\n` : ""}
${input.recentInsights ? `PREVIOUS INSIGHTS (avoid repeating):\n${input.recentInsights}\n` : ""}

Return 5 concise, specific insights. No generic advice.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// ---- Enhanced: Seasonality-Aware Forecast ----
export async function forecastSales(history: string): Promise<string> {
  const model = getModel();
  const now = new Date();
  const month = now.toLocaleString("en-IN", { month: "long" });
  const quarter = `Q${Math.floor(now.getMonth() / 3) + 1}`;
  const prompt = `You are a sales forecasting expert for an Indian MSME.

Current date context: ${month} ${now.getFullYear()}, ${quarter}

Given the past monthly revenue below, provide:
1. Next month's expected revenue (specific number in ₹)
2. Next quarter's expected monthly average
3. Key trend explanation (2-3 sentences)
4. Seasonal factors affecting this business in India

Indian seasonal factors to consider:
- Festival season (Oct-Dec): Diwali, Dussehra boost retail
- Harvest season (Sep-Nov): Rural spending increases
- Summer (Mar-Jun): Cold drinks, ice cream, AC services peak
- Monsoon (Jul-Sep): Agricultural spending, travel decreases
- New Year/Republic Day (Jan): Sales bump
- Financial year end (Mar): Business purchases spike

Historical revenue (most recent first):
${history}

Return concise text with clear numbers. Start with the forecast number.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// ---- Expense classifier ----
const extractExpensePrompt = `You are an expense classifier for an Indian business.
Extract structured data from the bill text and return ONLY valid JSON:

{
  "category": string,   // One of: Utilities, Travel, Food, Office, Marketing, Salary, Rent, Supplies, Transport, Other
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
