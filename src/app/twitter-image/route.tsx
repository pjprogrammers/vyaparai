import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VyaparAI — AI Automation Assistant for MSMEs";
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
          background: "linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700 }}>VyaparAI</div>
        <div style={{ fontSize: 56, marginTop: 24, opacity: 0.92 }}>
          AI Automation Assistant for MSMEs
        </div>
      </div>
    ),
    { ...size },
  );
}
