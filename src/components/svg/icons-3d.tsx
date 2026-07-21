"use client";

import { motion } from "motion/react";

export function VyaparAILogo({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
    : {};

  return (
    // @ts-expect-error motion.div props
    <Wrapper {...wrapperProps} className={className}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#logoGrad)" />
        <path d="M12 34V14l8 10 8-10v20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="18" r="4" fill="white" fillOpacity="0.9" />
        <path d="M34 30c0-2 2-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Wrapper>
  );
}

export function InvoiceIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ y: [0, -4, 0], rotateY: [0, 10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="invGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
        <filter id="invShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect x="8" y="4" width="40" height="52" rx="4" fill="url(#invGrad)" filter="url(#invShadow)" />
      <rect x="14" y="12" width="28" height="3" rx="1.5" fill="white" fillOpacity="0.8" />
      <rect x="14" y="19" width="20" height="2" rx="1" fill="white" fillOpacity="0.5" />
      <rect x="14" y="25" width="28" height="1" rx="0.5" fill="white" fillOpacity="0.3" />
      <rect x="14" y="30" width="28" height="1" rx="0.5" fill="white" fillOpacity="0.3" />
      <rect x="14" y="35" width="28" height="1" rx="0.5" fill="white" fillOpacity="0.3" />
      <rect x="14" y="42" width="14" height="2" rx="1" fill="white" fillOpacity="0.6" />
      <rect x="34" y="42" width="8" height="2" rx="1" fill="white" fillOpacity="0.4" />
      <circle cx="48" cy="48" r="10" fill="#10b981" />
      <path d="M44 48l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function ChartIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="url(#chartGrad)" fillOpacity="0.1" />
      <rect x="10" y="36" width="8" height="18" rx="2" fill="#6366f1" fillOpacity="0.6" />
      <rect x="22" y="26" width="8" height="28" rx="2" fill="#818cf8" fillOpacity="0.7" />
      <rect x="34" y="16" width="8" height="38" rx="2" fill="#6366f1" />
      <rect x="46" y="20" width="8" height="34" rx="2" fill="#a5b4fc" fillOpacity="0.8" />
      <circle cx="48" cy="12" r="6" fill="#10b981" />
      <path d="M46 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function BoxIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ rotateY: [0, 15, -15, 0], y: [0, -3, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <path d="M32 8L56 20v24L32 56 8 44V20z" fill="url(#boxGrad)" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
      <path d="M32 8v48" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M8 20l24 12 24-12" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="50" cy="14" r="6" fill="#10b981" />
      <path d="M48 14l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function CoinIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill="url(#coinGrad)" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <text x="32" y="38" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">
        ₹
      </text>
    </motion.svg>
  );
}

export function ShieldIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ scale: [1, 1.05, 1], y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M32 6L10 16v16c0 14 9.3 27.1 22 30 12.7-2.9 22-16 22-30V16L32 6z"
        fill="url(#shieldGrad)"
        fillOpacity="0.2"
        stroke="#6366f1"
        strokeWidth="2"
      />
      <path d="M24 32l6 6 12-12" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function BrainIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" fill="url(#brainGrad)" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="2" />
      <path d="M22 28c0-6 4-10 10-10s10 4 10 10" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 32c0 8 6 14 14 14s14-6 14-14" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
      <circle cx="26" cy="30" r="2" fill="#8b5cf6" />
      <circle cx="38" cy="30" r="2" fill="#8b5cf6" />
      <circle cx="32" cy="38" r="2" fill="#8b5cf6" />
      <line x1="26" y1="30" x2="38" y2="30" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="26" y1="30" x2="32" y2="38" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="38" y1="30" x2="32" y2="38" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.5" />
    </motion.svg>
  );
}

export function WhatsAppIcon3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    >
      <defs>
        <linearGradient id="waGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#25D366" />
          <stop offset="100%" stopColor="#128C7E" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" fill="url(#waGrad)" fillOpacity="0.2" stroke="#25D366" strokeWidth="2" />
      <path
        d="M44 38l-3-1.5c-1-.5-2-.2-2.8.5l-1.5 1.2c-.5.4-1 .3-1.3-.1-1.5-1.5-2.8-3.2-3.8-5.2-.3-.7 0-1.3.5-1.7l1-1.2c.5-.5.6-1.2.3-2l-1.5-3c-.5-1-1.3-1.5-2.3-1.5h-2c-1 0-2 .8-2.2 1.8-.5 3 .8 7 3.5 10.5s6.5 5.5 9.5 5.5c1 0 1.8-.5 2.3-1.3l1-1.5c.3-.5.8-.7 1.5-.5l2.8 1.2c.8.3 1.2.8 1.3 1.5.2 1-.3 2-1 2.5z"
        fill="#25D366"
      />
    </motion.svg>
  );
}
