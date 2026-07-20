# VyaparAI — Technology Stack

> AI-powered autonomous business operations assistant for Indian MSMEs.
> Not a chatbot — a workflow engine: **Documents → AI → Business Data → Automation → Predictions → Actions**.

---

## 1. Frontend (User Interface)

| Concern      | Technology            | Purpose                                                  |
| ------------ | --------------------- | -------------------------------------------------------- |
| Framework    | **Next.js 15** (App Router) | Production React, Server Components, API routes, easy deploy |
| UI Library   | **React 19**          | Interactive components, forms, real-time updates         |
| Styling      | **Tailwind CSS**      | Responsive, modern SaaS look                             |
| Components   | **shadcn/ui**         | Cards, tables, dialogs, forms, charts, buttons           |
| Animation    | **Framer Motion**     | Dashboard animations, AI loading states, transitions     |

**Used for:** Dashboard, authentication, invoice upload, inventory management, reports, AI insights.

---

## 2. Backend

| Concern        | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | **Next.js Server Actions + API Routes** |
| Business logic | Server-side TypeScript modules          |

**Endpoints:** `/api/process-invoice`, `/api/generate-report`, `/api/ai-insights`.

**Architecture:** Next.js API Layer → Firebase Services + Gemini AI.

---

## 3. Authentication

**Firebase Authentication**

- Google Login
- Email / Password
- Phone Authentication (future)
- Session management, permissions, business profile linkage

---

## 4. Database

**Cloud Firestore** (NoSQL, real-time, serverless, free tier)

Collections:

- `users` — uid, name, email, businessId
- `businesses` — businessId, name, category, gst, owner
- `products` — id, name, quantity, price, minimumStock
- `invoices` — invoiceId, supplier, items[], amount, gst, date
- `sales` — saleId, customer, items[], amount, date
- `expenses` — expenseId, category, amount, date
- `insights` — insightId, message, priority, createdAt

---

## 5. File Storage

**Firebase Cloud Storage**

- Invoice PDFs / receipt images
- Business logos
- Generated reports

Flow: Upload → Storage → AI Processing → Firestore Data.

---

## 6. AI Layer (Core of VyaparAI)

**Primary Model:** **Gemini 2.5 Flash**

Used for:

- **Document Understanding** — invoice image → structured JSON
- **AI Insights** — sales + inventory + expenses → natural-language recommendations
- **Sales Forecasting** — historical data → next-month revenue prediction
- **Customer Assistant** — inventory-grounded responses (with owner approval gate)

---

## 7. OCR (Document Reading)

| Option | Technology | Notes |
| ------ | ---------- | ----- |
| Free   | **Tesseract.js** | Client-side, basic invoices |
| Paid/Better | **Google Cloud Vision API** | Complex / handwritten / GST bills |

MVP uses Tesseract.js (free, no infra). Upgrade path to Cloud Vision.

---

## 8. AI Orchestration (Optional)

**LangChain** — prompt management, document pipelines.

For MVP: lightweight prompt templates + Zod validation. LangChain added if pipelines grow complex.

---

## 9. Data Validation

**Zod** — schema-based verification of all AI output before Firestore writes.

Example: Gemini returns `{ product: "Rice", quantity: "50" }` → Zod coerces/validates `quantity` is numeric.

---

## 10. Charts & Analytics

**Recharts** — Sales trend, revenue, expenses, profit, forecast graphs.

---

## 11. PDF Generation

- **@react-pdf/renderer** — customer invoices (GST details, logo, QR code, payment info)
- **pdf-lib** — edit PDFs, add metadata, process documents

---

## 12. Forecasting Engine

- **MVP:** Gemini-driven insights from sales history (no separate service).
- **Future:** Python service — Pandas, NumPy, Scikit-learn (Linear Regression / ARIMA / Random Forest).

---

## 13. Notifications

**Firebase Cloud Messaging** — AI low-stock / expense / insight alerts.

---

## 14. Deployment

| Layer     | Target                       |
| --------- | ---------------------------- |
| Frontend  | **Vercel**                   |
| Backend   | Vercel Serverless Functions (or Firebase Functions) |
| Database  | Firebase Firestore           |
| Storage   | Firebase Storage             |

---

## 15. Development Tooling

- **Editor:** VS Code
- **VCS:** Git + GitHub
- **API Testing:** Postman
- **Design:** Figma

---

## Complete Stack Diagram

```
                    USER
                     |
              Next.js 15 (React 19)
                     |
        Tailwind CSS + shadcn/ui + Framer Motion
                     |
          Firebase Authentication
                     |
          Next.js API Routes / Server Actions
                     |
        +------------+-------------+
        |                          |
 Gemini 2.5 Flash              OCR (Tesseract.js)
        |                          |
        +------------+-------------+
                     |
              Business Logic (Zod-validated)
                     |
              Firestore Database
                     |
        +------------+-------------+
        |                          |
 Firebase Storage            Recharts
        |                          |
 Invoice Files              Analytics
                     |
              Vercel Deployment
```

---

## Stack Summary (PPT-friendly)

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Frontend        | Next.js 15 + React 19            |
| UI              | Tailwind CSS + shadcn/ui         |
| Animation       | Framer Motion                    |
| Authentication  | Firebase Auth                    |
| Database        | Cloud Firestore                  |
| Storage         | Firebase Storage                 |
| Backend         | Next.js API Routes               |
| AI Model        | Gemini 2.5 Flash                 |
| OCR             | Tesseract.js / Google Vision     |
| Validation      | Zod                              |
| Charts          | Recharts                         |
| PDF Generation  | React-PDF + pdf-lib              |
| ML Forecasting  | Python + Scikit-learn (Future)   |
| Hosting         | Vercel + Firebase                |
| Version Control | GitHub                           |

**Pitch line:** *"Next.js + Firebase + Gemini AI + OCR + Predictive Analytics + Cloud Infrastructure"*
