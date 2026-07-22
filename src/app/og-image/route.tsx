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
          flexDirection: "row",
          background: "#0C0C0F",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left panel — brand mark + geometric accents */}
        <div
          style={{
            width: 420,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0C0C0F 0%, #1A1508 50%, #0C0C0F 100%)",
          }}
        >
          <svg width="420" height="630">
            <defs>
              <linearGradient id="ogGold" x1="0" y1="0" x2="420" y2="630" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FDE68A" />
                <stop offset="0.5" stopColor="#FBBF24" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="ogGoldBar" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#92400E" />
                <stop offset="1" stopColor="#FBBF24" />
              </linearGradient>
            </defs>

            {/* Circuit grid — subtle tech texture */}
            <g opacity="0.06" stroke="#FBBF24" strokeWidth="0.8">
              <line x1="60" y1="100" x2="360" y2="100" />
              <line x1="60" y1="160" x2="360" y2="160" />
              <line x1="60" y1="220" x2="360" y2="220" />
              <line x1="60" y1="280" x2="360" y2="280" />
              <line x1="60" y1="340" x2="360" y2="340" />
              <line x1="60" y1="400" x2="360" y2="400" />
              <line x1="60" y1="460" x2="360" y2="460" />
              <line x1="60" y1="520" x2="360" y2="520" />
              <line x1="100" y1="60" x2="100" y2="570" />
              <line x1="160" y1="60" x2="160" y2="570" />
              <line x1="220" y1="60" x2="220" y2="570" />
              <line x1="280" y1="60" x2="280" y2="570" />
              <line x1="340" y1="60" x2="340" y2="570" />
            </g>

            {/* Node dots */}
            <g fill="#FBBF24" opacity="0.1">
              <circle cx="100" cy="160" r="3" />
              <circle cx="220" cy="100" r="3" />
              <circle cx="340" cy="220" r="3" />
              <circle cx="160" cy="340" r="3" />
              <circle cx="280" cy="460" r="3" />
              <circle cx="100" cy="520" r="3" />
            </g>

            {/* Connection traces between nodes */}
            <g stroke="#FBBF24" strokeWidth="0.6" opacity="0.08" fill="none">
              <path d="M100 160 L220 100" />
              <path d="M220 100 L340 220" />
              <path d="M160 340 L280 460" />
              <path d="M100 520 L160 340" />
              <path d="M340 220 L280 460" />
            </g>

            {/* Glow ring behind V mark */}
            <circle cx="210" cy="260" r="150" fill="#FBBF24" opacity="0.08" />
            <circle cx="210" cy="260" r="120" fill="none" stroke="#FBBF24" strokeWidth="0.6" opacity="0.12" />
            <circle cx="210" cy="260" r="180" fill="none" stroke="#FBBF24" strokeWidth="0.4" opacity="0.06" />

            {/* V mark */}
            <g transform="translate(210, 250)">
              <path d="M-120 -110 L0 50 L120 -110 L84 -110 L0 -10 L-84 -110 Z" fill="url(#ogGold)" />
            </g>

            {/* Ascending data bars with gradient fill */}
            <rect x="80" y="400" width="10" height="50" rx="5" fill="url(#ogGoldBar)" opacity="0.35" />
            <rect x="96" y="380" width="10" height="70" rx="5" fill="url(#ogGoldBar)" opacity="0.45" />
            <rect x="112" y="360" width="10" height="90" rx="5" fill="url(#ogGoldBar)" opacity="0.55" />
            <rect x="128" y="340" width="10" height="110" rx="5" fill="url(#ogGoldBar)" opacity="0.65" />
            <rect x="144" y="320" width="10" height="130" rx="5" fill="url(#ogGoldBar)" opacity="0.8" />

            {/* Glassy inner panel overlay — translucent fill */}
            <rect x="30" y="30" width="360" height="570" rx="20" fill="#FBBF24" opacity="0.03" />
            {/* Inner border — frosted glass edge */}
            <rect x="30" y="30" width="360" height="570" rx="20" fill="none" stroke="white" strokeWidth="0.6" opacity="0.06" />
            {/* Top highlight strip — glass reflection */}
            <rect x="60" y="31" width="300" height="1" rx="0.5" fill="white" opacity="0.08" />
          </svg>
        </div>

        {/* Right panel — text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 70px 60px 60px",
          }}
        >
          {/* Eyebrow tag */}
          <div style={{ display: "flex", fontSize: 15, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" as const, color: "#FBBF24", marginBottom: 20 }}>
            AI-Powered Business Automation
          </div>
          {/* Title */}
          <div style={{ display: "flex", fontSize: 80, fontWeight: 800, lineHeight: 1, color: "#FFFFFF", marginBottom: 8 }}>
            {"Vyapar"}
            <span style={{ color: "#FBBF24" }}>{"AI"}</span>
          </div>
          {/* Subtitle */}
          <div style={{ display: "flex", fontSize: 28, fontWeight: 400, lineHeight: 1.4, color: "#A1A1AA", maxWidth: 520, marginTop: 16 }}>
            Your AI employee that automates invoices, inventory &amp; business decisions.
          </div>
          {/* Accent divider */}
          <div style={{ display: "flex", width: 60, height: 3, background: "linear-gradient(90deg, #FBBF24, #D97706)", borderRadius: 2, marginTop: 32 }} />
          {/* URL */}
          <div style={{ display: "flex", fontSize: 15, color: "#52525B", marginTop: 16, fontWeight: 500 }}>
            vyaparai.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
