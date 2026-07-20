import { ImageResponse } from "next/og";

export const alt = "VyaparAI — AI Employee for Your Business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#312E81",
          backgroundImage:
            "linear-gradient(135deg, #4F46E5 0%, #312E81 70%, #1E1B4B 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* V + bars + spark mark */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "26px",
              background: "linear-gradient(135deg,#4F46E5,#312E81)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            }}
          >
            <svg width="62" height="62" viewBox="0 0 512 512" fill="none">
              <path
                d="M132 158 L256 326 L380 158 L330 158 L256 270 L182 158 Z"
                fill="#FFFFFF"
              />
              <rect x="214" y="318" width="20" height="58" rx="10" fill="#A5B4FC" />
              <rect x="246" y="300" width="20" height="76" rx="10" fill="#C7D2FE" />
              <rect x="278" y="284" width="20" height="92" rx="10" fill="#FFFFFF" />
              <path
                d="M392 132 c11 0 20 9 20 20 0 8 -4 14 -11 18 8 4 13 12 13 21 0 13 -11 24 -24 24 -9 0 -17 -5 -21 -12 -6 7 -14 11 -23 11 -15 0 -28 -12 -28 -28 0 -11 7 -21 17 -25 -3 -8 -3 -18 2 -25 6 -10 16 -15 28 -14 11 1 20 9 24 18 6 -5 12 -7 19 -5 Z"
                fill="#67E8F9"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-1px" }}>
              VyaparAI
            </div>
            <div style={{ fontSize: "20px", color: "#C7D2FE" }}>
              AI Employee for Your Business
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              maxWidth: "920px",
            }}
          >
            Automate invoices, inventory & insights with AI.
          </div>
          <div style={{ fontSize: "26px", color: "#C7D2FE", maxWidth: "860px" }}>
            An autonomous business operations assistant for Indian MSMEs — not a
            chatbot, a workflow engine.
          </div>
        </div>

        {/* Bottom pill row */}
        <div style={{ display: "flex", gap: "14px" }}>
          {["Documents → AI", "Inventory Automation", "AI Insights"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 22px",
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: "20px",
                color: "white",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
