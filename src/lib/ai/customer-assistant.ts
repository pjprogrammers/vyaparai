import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProducts } from "@/lib/db";

const MODEL = "gemini-2.5-flash";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: MODEL });
}

export interface CustomerDraft {
  inventoryCheck: string;
  draftResponse: string;
}

// Workflow:
// Customer Message -> Inventory Check -> Business Rules -> AI Response -> Owner Approval -> Send
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

  // 3. Business rules: only answer about in-stock items, with price + delivery note.
  const inStock = mentions.filter((p) => p.quantity > 0);
  const ruleContext = inStock.length
    ? `The customer is asking about IN-STOCK items. Provide price and mention delivery is available.`
    : `The requested item is not in stock. Politely say it is currently unavailable and offer to notify when back.`;

  // 4. AI response (grounded, no hallucination)
  const prompt = `You are the customer assistant for an Indian shop owner.
Use ONLY the inventory facts below. Do not invent products, prices, or stock.
${ruleContext}

INVENTORY FACTS:
${inventoryCheck}

CUSTOMER MESSAGE:
${query}

Write a short, friendly reply (2-3 sentences). If a product is available, state it is available, its price, and that delivery is available.`;

  const result = await getModel().generateContent(prompt);
  const draftResponse = (await result.response).text().trim();

  // 5. Owner approval happens in the UI — this function only returns a draft.
  return { inventoryCheck, draftResponse };
}
