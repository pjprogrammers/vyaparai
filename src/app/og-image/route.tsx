import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VyaparAI — AI Employee for Your Business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.85 }}>AI Employee for Your Business</div>
        <div style={{ fontSize: 110, fontWeight: 800, margin: "12px 0", lineHeight: 1 }}>
          VyaparAI
        </div>
        <div style={{ fontSize: 38, opacity: 0.9 }}>
          Automate invoices, inventory & insights with AI.
        </div>
      </div>
    ),
    { ...size },
  );
}
