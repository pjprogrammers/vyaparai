// Seed script for the VyaparAI demo dashboard.
// Run with:  npm run seed
//
// Requires Firebase Admin credentials (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY)
// in .env.local. For the live demo without admin creds, the dashboard falls back
// to an empty but fully-functional state.

import { initAdmin } from "../src/lib/firebase/admin";
import {
  createBusiness,
  adjustInventory,
  saveSale,
  saveExpense,
  saveInvoice,
} from "../src/lib/db";

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

async function main() {
  initAdmin();
  const businessId = "biz_demo";

  await createBusiness({
    businessId,
    name: "ABC Kirana Store",
    category: "Grocery Store",
    gst: "29ABCDE1234F1Z5",
    address: "MG Road, Bengaluru",
    currency: "₹",
    language: "English",
    owner: "demo",
    createdAt: new Date().toISOString(),
  });

  await adjustInventory(
    businessId,
    [
      { name: "Rice", quantity: 145, price: 120 },
      { name: "Sugar", quantity: 20, price: 45 },
      { name: "Oil", quantity: 60, price: 160 },
      { name: "Aashirvaad Atta", quantity: 20, price: 520 },
    ],
    "add",
  );

  // Seed a supplier invoice (feeds inventory + expense + preferred supplier).
  await saveInvoice({
    invoiceId: `inv_seed_${Date.now()}`,
    supplier: "ABC Traders",
    items: [{ name: "Rice", quantity: 50, price: 120 }],
    amount: 14160,
    gst: 2160,
    date: isoDaysAgo(2),
    businessId,
    paid: false,
  });

  // Seed sales over the last 3 months for the forecast chart.
  const monthly = [
    { d: isoDaysAgo(90), a: 250000 },
    { d: isoDaysAgo(60), a: 300000 },
    { d: isoDaysAgo(30), a: 320000 },
    { d: isoDaysAgo(0), a: 18450 },
  ];
  for (const m of monthly) {
    await saveSale({
      saleId: `sale_${m.d}`,
      customer: "Walk-in",
      items: [{ name: "Rice", quantity: 5, price: 120 }],
      amount: m.a,
      date: m.d,
      businessId,
    });
  }

  await saveExpense({
    expenseId: `exp_seed_${Date.now()}`,
    category: "Utilities",
    amount: 5600,
    date: isoDaysAgo(0),
    businessId,
  });

  console.log("Seed complete for", businessId);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
