# VyaparAI — AI Employee for Your Business

An AI-powered **autonomous business operations assistant** for Indian MSMEs.
Not a chatbot — a workflow engine:

**Documents → AI Processing → Business Data → Automation → Predictions → Actions**

Built as a startup-like SaaS MVP using Next.js 15/16, Firebase, and Gemini AI.

---

## Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Frontend        | Next.js (App Router) + React 19  |
| UI              | Tailwind CSS + shadcn-style components |
| Animation       | Framer Motion (deps installed)   |
| Auth            | Firebase Authentication          |
| Database        | Cloud Firestore                  |
| Storage         | Firebase Storage                 |
| Backend         | Next.js API Routes / Server Actions |
| AI Model        | Gemini 2.5 Flash                 |
| OCR             | Tesseract.js (free) / Cloud Vision (upgrade) |
| Validation      | Zod                             |
| Charts          | Recharts (deps installed)        |
| PDF Generation  | React-PDF + pdf-lib (deps installed) |
| Hosting         | Vercel + Firebase                |

See [`TECH_STACK.md`](./TECH_STACK.md) for the full breakdown.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

- **Firebase**: create a project, enable Auth + Firestore + Storage, and copy the
  web config values into the `NEXT_PUBLIC_FIREBASE_*` vars.
- **Gemini**: generate an API key at Google AI Studio and set `GEMINI_API_KEY`.
- **Admin SDK** (for server writes via `firebase-admin`): set
  `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` (for the seed script and
  server-side data access). For the client-side demo, the Firebase Web SDK is
  sufficient.

#### Vercel environment variables

Add the same variables in **Vercel → Project → Settings → Environment Variables**.
Toggle the **"Sensitive"** switch according to this table:

| Variable | Sensitive on Vercel? | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ❌ No | Embedded in the browser bundle |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ❌ No | Embedded in the browser bundle |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ❌ No | Embedded in the browser bundle |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ❌ No | Embedded in the browser bundle |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ❌ No | Embedded in the browser bundle |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ❌ No | Embedded in the browser bundle |
| `GEMINI_API_KEY` | ✅ **Yes** | Server-only secret |
| `FIREBASE_CLIENT_EMAIL` | ✅ **Yes** | Server-only secret |
| `FIREBASE_PRIVATE_KEY` | ✅ **Yes** | Server-only secret |
| `OCR_PROVIDER` | ❌ No | Non-secret toggle |

`.env.local` is gitignored (never pushed); `.env.example` is committed as a
template with no real secrets.

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

### 4. (Optional) Seed demo data

```bash
npm run seed
```

Uses Firebase Admin credentials from `.env.local` to populate the demo dashboard
(`biz_demo`) with sample products, a sale, and an expense.

---

## Project Structure

```
src/
  app/
    page.tsx                 # Landing page
    auth/page.tsx            # Login / signup + business setup
    dashboard/page.tsx       # Main business dashboard (server component)
    actions/setup.ts         # Server action: create user + business
    api/
      process-invoice/       # POST: OCR + Gemini -> Firestore + inventory
      ai-insights/           # POST/GET: AI business insights
      forecast/              # POST: sales forecasting
  components/
    auth-provider.tsx        # Firebase Auth context
    invoice-uploader.tsx     # Upload widget (client)
    ui/card.tsx              # Reusable card
  lib/
    firebase/client.ts       # Firebase Web SDK
    firebase/admin.ts        # Firebase Admin SDK (server-only)
    ai/gemini.ts             # Gemini prompts + calls
    ai/ocr.ts                # Tesseract / Vision OCR
    ai/schemas.ts            # Zod validation
    db.ts                    # Firestore data layer (server-only)
    types.ts                 # Shared domain types
    utils.ts                 # cn(), currency, date helpers
```

---

## Core Workflows Implemented

1. **User Registration** — Firebase Auth (Google/Email) + first-time business setup.
2. **Main Dashboard** — Sales, expenses, low-stock, invoice counts from Firestore.
3. **Document Intelligence** — Upload invoice → OCR → Gemini → Zod-validated JSON →
   Firestore, with automatic inventory + expense updates.
4. **Inventory Automation** — Every invoice adds stock; every sale subtracts stock.
5. **AI Stock Prediction** — Low-stock alerts derived from inventory thresholds.
6. **AI Business Insights** — Gemini analyses sales/inventory/expenses → insights.
7. **Sales Forecasting** — Gemini predicts next-month revenue from history.

### Roadmap (per spec)

- Invoice Generator (PDF with GST/QR) — deps installed (`@react-pdf/renderer`, `pdf-lib`)
- Customer AI Assistant (WhatsApp + owner-approval gate)
- Charts/analytics dashboard (`recharts` installed)
- FCM notifications, regional languages, GST filing

---

## Deployment

- **Frontend/Backend**: Vercel (import the repo; set env vars in project settings).
- **Database/Storage**: Firebase (Firestore + Storage).
- Ensure `serverExternalPackages` in `next.config.ts` keeps `firebase-admin`/grpc
  out of the browser bundle.

---

## Scripts

| Command           | Description                 |
| ----------------- | --------------------------- |
| `npm run dev`     | Start dev server            |
| `npm run build`   | Production build            |
| `npm run lint`    | ESLint                      |
| `npm run typecheck` | TypeScript type check     |
| `npm run seed`    | Seed demo Firestore data    |
