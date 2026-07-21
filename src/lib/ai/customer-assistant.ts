import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProducts, findCustomerByName, getSalesByCustomer } from "@/lib/db";

const MODEL = "gemini-2.5-flash";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: MODEL });
}

export interface CustomerDraft {
  inventoryCheck: string;
  customerHistory: string;
  draftResponse: string;
}

export async function draftCustomerReply(
  businessId: string,
  query: string,
): Promise<CustomerDraft> {
  const products = await getProducts(businessId);

  // 1 + 2. Inventory check (grounding) — never answer from memory.
  const mentions = products.filter((p) =>
    query.toLowerCase().includes(p.name.toLowerCase()),
  );
  const inventoryCheck = mentions.length
    ? mentions
        .map((p) => `${p.name}: ${p.quantity} available @ ₹${p.price}`)
        .join("\n")
    : "No matching product found in inventory.";

  // 3. Customer history lookup — find if the customer is known.
  const customerMatch = query.match(/(?:customer|buyer|mr|mrs|ms|sir|madam)\s+(.+)/i);
  let customerHistory = "No customer history found.";
  let customerName = "";
  if (customerMatch) {
    customerName = customerMatch[1].trim().split(/\s+/).slice(0, 2).join(" ");
  } else {
    // Try extracting a capitalized name from the query
    const words = query.split(/\s+/);
    for (const w of words) {
      if (/^[A-Z][a-z]+$/.test(w) && !["Hi", "Hello", "Dear", "Yes", "No", "The", "Can", "What", "When", "Where", "How", "Please", "Thanks"].includes(w)) {
        customerName = w;
        break;
      }
    }
  }

  if (customerName) {
    const customer = await findCustomerByName(businessId, customerName);
    if (customer) {
      const sales = await getSalesByCustomer(businessId, customer.customerId);
      const totalSpent = customer.totalPurchases;
      const outstanding = customer.outstandingBalance;
      const recentSales = sales.slice(0, 3).map((s) => `${s.date}: ₹${s.amount}`).join(", ");
      customerHistory = `Customer: ${customer.name} | Total purchases: ₹${totalSpent} | Outstanding: ₹${outstanding} | Last purchase: ${customer.lastPurchaseDate ?? "N/A"}${recentSales ? ` | Recent sales: ${recentSales}` : ""}`;
    }
  }

  // 4. Business rules: only answer about in-stock items, with price + delivery note.
  const inStock = mentions.filter((p) => p.quantity > 0);
  const ruleContext = inStock.length
    ? `The customer is asking about IN-STOCK items. Provide price and mention delivery is available.`
    : `The requested item is not in stock. Politely say it is currently unavailable and offer to notify when back.`;

  // 5. AI response (grounded, no hallucination)
  const prompt = `You are the customer assistant for an Indian shop owner.
Use ONLY the inventory and customer facts below. Do not invent products, prices, or stock.
${ruleContext}

INVENTORY FACTS:
${inventoryCheck}

CUSTOMER HISTORY:
${customerHistory}

CUSTOMER MESSAGE:
${query}

Write a short, friendly reply (2-3 sentences). If a product is available, state it is available, its price, and that delivery is available. If we have customer history, you may acknowledge them as a valued customer.`;

  const result = await getModel().generateContent(prompt);
  const draftResponse = (await result.response).text().trim();

  return { inventoryCheck, customerHistory, draftResponse };
}
