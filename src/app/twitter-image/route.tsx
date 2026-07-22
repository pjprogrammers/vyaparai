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
          background: "#0C0C0F",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background SVG — decorations only, no text */}
        <svg width="1200" height="630">
          <defs>
            <linearGradient id="twGold" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FDE68A" />
              <stop offset="0.4" stopColor="#FBBF24" />
              <stop offset="0.8" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="twBar" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#92400E" />
              <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>
            <linearGradient id="twVG" x1="0" y1="0" x2="120" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FDE68A" />
              <stop offset="0.5" stopColor="#FBBF24" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Outer golden frame border */}
          <rect x="16" y="16" width="1168" height="598" rx="24" fill="none" stroke="url(#twGold)" strokeWidth="1" opacity="0.25" />

          {/* Grid lines — refined tech texture */}
          <g stroke="#FBBF24" strokeWidth="0.5" opacity="0.04">
            <line x1="0" y1="80" x2="1200" y2="80" />
            <line x1="0" y1="160" x2="1200" y2="160" />
            <line x1="0" y1="240" x2="1200" y2="240" />
            <line x1="0" y1="320" x2="1200" y2="320" />
            <line x1="0" y1="400" x2="1200" y2="400" />
            <line x1="0" y1="480" x2="1200" y2="480" />
            <line x1="0" y1="560" x2="1200" y2="560" />
            <line x1="160" y1="0" x2="160" y2="630" />
            <line x1="320" y1="0" x2="320" y2="630" />
            <line x1="480" y1="0" x2="480" y2="630" />
            <line x1="720" y1="0" x2="720" y2="630" />
            <line x1="880" y1="0" x2="880" y2="630" />
            <line x1="1040" y1="0" x2="1040" y2="630" />
          </g>

          {/* Connection traces */}
          <g stroke="#FBBF24" strokeWidth="0.5" opacity="0.06" fill="none">
            <path d="M60 80 L200 160" />
            <path d="M200 160 L1000 80" />
            <path d="M1000 80 L1140 160" />
            <path d="M60 480 L1140 480" />
            <path d="M160 160 L480 320" />
            <path d="M1040 160 L720 320" />
          </g>

          {/* Left data bars */}
          <rect x="60" y="380" width="8" height="80" rx="4" fill="url(#twBar)" opacity="0.25" />
          <rect x="76" y="350" width="8" height="110" rx="4" fill="url(#twBar)" opacity="0.3" />
          <rect x="92" y="320" width="8" height="140" rx="4" fill="url(#twBar)" opacity="0.35" />
          <rect x="108" y="290" width="8" height="170" rx="4" fill="url(#twBar)" opacity="0.4" />
          <rect x="124" y="260" width="8" height="200" rx="4" fill="url(#twBar)" opacity="0.45" />

          {/* Right data bars */}
          <rect x="1068" y="380" width="8" height="80" rx="4" fill="url(#twBar)" opacity="0.25" />
          <rect x="1084" y="350" width="8" height="110" rx="4" fill="url(#twBar)" opacity="0.3" />
          <rect x="1100" y="320" width="8" height="140" rx="4" fill="url(#twBar)" opacity="0.35" />
          <rect x="1116" y="290" width="8" height="170" rx="4" fill="url(#twBar)" opacity="0.4" />
          <rect x="1132" y="260" width="8" height="200" rx="4" fill="url(#twBar)" opacity="0.45" />

          {/* Corner bracket accents */}
          <g opacity="0.12" stroke="#FBBF24" strokeWidth="1.5" fill="none">
            <path d="M40 80 L40 40 L100 40" />
            <path d="M1100 40 L1160 40 L1160 80" />
            <path d="M1160 550 L1160 590 L1100 590" />
            <path d="M100 590 L40 590 L40 550" />
          </g>

          {/* Node dots */}
          <g fill="#FBBF24" opacity="0.08">
            <circle cx="60" cy="80" r="3" />
            <circle cx="200" cy="160" r="2" />
            <circle cx="1000" cy="80" r="3" />
            <circle cx="1140" cy="160" r="2" />
            <circle cx="60" cy="480" r="2" />
            <circle cx="1140" cy="480" r="3" />
            <circle cx="160" cy="320" r="2" />
            <circle cx="1040" cy="320" r="2" />
          </g>

          {/* Glow rings behind V mark */}
          <circle cx="600" cy="230" r="100" fill="none" stroke="#FBBF24" strokeWidth="0.5" opacity="0.1" />
          <circle cx="600" cy="230" r="80" fill="#FBBF24" opacity="0.04" />

          {/* V mark */}
          <g transform="translate(540, 180)">
            <path d="M10 10 L60 68 L110 10 L88 10 L60 48 L32 10 Z" fill="url(#twVG)" />
          </g>

          {/* Accent line */}
          <rect x="560" y="355" width="80" height="3" rx="1.5" fill="url(#twGold)" />

          {/* Glassy center card — translucent fill */}
          <rect x="300" y="140" width="600" height="350" rx="20" fill="#FBBF24" opacity="0.025" />
          {/* Inner border — frosted glass edge */}
          <rect x="300" y="140" width="600" height="350" rx="20" fill="none" stroke="white" strokeWidth="0.6" opacity="0.05" />
          {/* Top highlight strip — glass reflection */}
          <rect x="340" y="141" width="520" height="1" rx="0.5" fill="white" opacity="0.07" />

          {/* Bottom golden bar */}
          <rect x="0" y="626" width="1200" height="4" fill="url(#twGold)" />
        </svg>

        {/* Text overlay — pulled up over the SVG with negative margin */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -630,
            height: 630,
          }}
        >
          {/* Title */}
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1, color: "#FFFFFF" }}>
            {"Vyapar"}
            <span style={{ color: "#FBBF24" }}>{"AI"}</span>
          </div>
          {/* Accent divider */}
          <div style={{ display: "flex", width: 80, height: 3, background: "linear-gradient(90deg, #FBBF24, #D97706)", borderRadius: 2, marginTop: 20, marginBottom: 20 }} />
          {/* Subtitle */}
          <div style={{ display: "flex", fontSize: 30, fontWeight: 500, color: "#A1A1AA", textAlign: "center" as const, lineHeight: 1.4 }}>
            AI Automation Assistant for MSMEs
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
