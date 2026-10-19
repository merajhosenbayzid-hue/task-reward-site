// Premium 3D SVG icon system — Task Reward brand (peach → rose → grape).
// Consistent 24×24 viewBox, 1.8px strokes, gradient fills, soft depth.
// Usage: <IconWallet size={20} className="icon-3d" />

function Base({ size = 20, className = "", children, filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? undefined : "none"}
      className={`icon-svg ${className}`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const SW = 1.8; // unified stroke width
const CAP = { strokeLinecap: "round", strokeLinejoin: "round" };

function Grad({ id, c1 = "#FFB199", c2 = "#FF6B9D", c3 = "#A855F7" }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor={c1} />
        <stop offset="0.55" stopColor={c2} />
        <stop offset="1" stopColor={c3} />
      </linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#fff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/* ---------------- Brand mark: 3D ৳ coin ---------------- */
export function BrandMark({ size = 40, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`icon-3d ${className}`} aria-hidden="true">
      <Grad id="trg-brand" />
      <circle cx="24" cy="24" r="21" fill="url(#trg-brand)" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
      <ellipse cx="24" cy="14" rx="13" ry="7" fill="url(#trg-brand-gloss)" opacity="0.5" />
      <text x="24" y="32" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff" fontFamily="inherit">
        ৳
      </text>
    </svg>
  );
}

/* ---------------- Wallet (balance) ---------------- */
export function IconWallet({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-wallet" />
      <g stroke="url(#trg-wallet)" strokeWidth={SW} {...CAP}>
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </g>
    </Base>
  );
}

/* ---------------- Status dot (3D glossy, pulsing) ---------------- */
export function StatusDot({ active = true, size = 14, className = "" }) {
  const c = active ? "#2DD4BF" : "#FF6B9D";
  const glow = active ? "rgba(45,212,191,.45)" : "rgba(255,107,157,.45)";
  return (
    <span
      className={`status-dot ${className}`}
      style={{ width: size, height: size, ["--dot"]: c, ["--glow"]: glow }}
      title={active ? "Active" : "Inactive"}
    />
  );
}

/* ---------------- Key ---------------- */
export function IconKey({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-key" />
      <g stroke="url(#trg-key)" strokeWidth={SW} {...CAP}>
        <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </g>
    </Base>
  );
}

/* ---------------- Check badge (3D gradient circle) ---------------- */
export function IconCheckBadge({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`icon-3d ${className}`} aria-hidden="true">
      <Grad id="trg-check" c1="#2DD4BF" c2="#2DD4BF" c3="#0EA5A0" />
      <circle cx="12" cy="12" r="10" fill="url(#trg-check)" />
      <ellipse cx="12" cy="7.5" rx="6.5" ry="3.5" fill="url(#trg-check-gloss)" opacity="0.55" />
      <path d="m8 12.5 2.7 2.7L16.5 9" stroke="#fff" strokeWidth="2.4" fill="none" {...CAP} />
    </svg>
  );
}

/* small inline check */
export function IconCheck({ size = 14, className = "" }) {
  return (
    <Base size={size} className={className}>
      <path d="m4.5 12.5 5 5 10-11" stroke="#2DD4BF" strokeWidth="2.6" fill="none" {...CAP} />
    </Base>
  );
}

/* ---------------- X badge ---------------- */
export function IconXBadge({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`icon-3d ${className}`} aria-hidden="true">
      <Grad id="trg-x" c1="#FFB199" c2="#FF6B9D" c3="#E11D48" />
      <circle cx="12" cy="12" r="10" fill="url(#trg-x)" />
      <ellipse cx="12" cy="7.5" rx="6.5" ry="3.5" fill="url(#trg-x-gloss)" opacity="0.55" />
      <path d="m9 9 6 6M15 9l-6 6" stroke="#fff" strokeWidth="2.4" {...CAP} />
    </svg>
  );
}

/* ---------------- Alert triangle ---------------- */
export function IconAlert({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-alert" c1="#FFCC00" c2="#FFB199" c3="#FF6B9D" />
      <g stroke="url(#trg-alert)" strokeWidth={SW} {...CAP}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </g>
    </Base>
  );
}

/* ---------------- Gift ---------------- */
export function IconGift({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-gift" />
      <g stroke="url(#trg-gift)" strokeWidth={SW} {...CAP}>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
      </g>
    </Base>
  );
}

/* ---------------- Users / User ---------------- */
export function IconUsers({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-users" />
      <g stroke="url(#trg-users)" strokeWidth={SW} {...CAP}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </g>
    </Base>
  );
}

export function IconUser({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-user" />
      <g stroke="url(#trg-user)" strokeWidth={SW} {...CAP}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </g>
    </Base>
  );
}

/* ---------------- Lock / Shield ---------------- */
export function IconLock({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-lock" />
      <g stroke="url(#trg-lock)" strokeWidth={SW} {...CAP}>
        <rect width="18" height="11" x="3" y="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </g>
    </Base>
  );
}

export function IconShieldCheck({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-shield" c1="#2DD4BF" c2="#FFB199" c3="#FF6B9D" />
      <g stroke="url(#trg-shield)" strokeWidth={SW} {...CAP}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </g>
    </Base>
  );
}

/* ---------------- Link ---------------- */
export function IconLink({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-link" />
      <g stroke="url(#trg-link)" strokeWidth={SW} {...CAP}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
    </Base>
  );
}

/* ---------------- Banknote ---------------- */
export function IconBanknote({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-cash" c1="#FFB199" c2="#FFCC00" c3="#FF6B9D" />
      <g stroke="url(#trg-cash)" strokeWidth={SW} {...CAP}>
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </g>
    </Base>
  );
}

/* ---------------- Send ---------------- */
export function IconSend({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-send" />
      <g stroke="url(#trg-send)" strokeWidth={SW} {...CAP}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </g>
    </Base>
  );
}

/* ---------------- Document / Clipboard / Receipt ---------------- */
export function IconEdit({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-edit" />
      <g stroke="url(#trg-edit)" strokeWidth={SW} {...CAP}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </g>
    </Base>
  );
}

export function IconClipboard({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-clip" />
      <g stroke="url(#trg-clip)" strokeWidth={SW} {...CAP}>
        <rect width="8" height="4" x="8" y="2" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </g>
    </Base>
  );
}

export function IconReceipt({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-receipt" />
      <g stroke="url(#trg-receipt)" strokeWidth={SW} {...CAP}>
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </g>
    </Base>
  );
}

/* ---------------- Phone ---------------- */
export function IconPhone({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-phone" />
      <g stroke="url(#trg-phone)" strokeWidth={SW} {...CAP}>
        <rect width="14" height="20" x="5" y="2" rx="2" />
        <path d="M12 18h.01" />
      </g>
    </Base>
  );
}

/* ---------------- Gear ---------------- */
export function IconGear({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-gear" />
      <g stroke="url(#trg-gear)" strokeWidth={SW} {...CAP}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </g>
    </Base>
  );
}

/* ---------------- Clock ---------------- */
export function IconClock({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-clock" />
      <g stroke="url(#trg-clock)" strokeWidth={SW} {...CAP}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </g>
    </Base>
  );
}

/* ---------------- Bank (landmark) ---------------- */
export function IconBank({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-bank" />
      <g stroke="url(#trg-bank)" strokeWidth={SW} {...CAP}>
        <path d="M3 22h18" />
        <path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
        <path d="m12 2 9 5H3z" />
      </g>
    </Base>
  );
}

/* ---------------- Mail / Headset ---------------- */
export function IconMail({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-mail" />
      <g stroke="url(#trg-mail)" strokeWidth={SW} {...CAP}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </g>
    </Base>
  );
}

export function IconHeadset({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-head" />
      <g stroke="url(#trg-head)" strokeWidth={SW} {...CAP}>
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 0 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
      </g>
    </Base>
  );
}

/* ---------------- Bulb / Zap / Star / Sparkles ---------------- */
export function IconBulb({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-bulb" c1="#FFCC00" c2="#FFB199" c3="#FF6B9D" />
      <g stroke="url(#trg-bulb)" strokeWidth={SW} {...CAP}>
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" />
      </g>
    </Base>
  );
}

export function IconZap({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-zap" c1="#FFCC00" c2="#FFB199" c3="#FF6B9D" />
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="url(#trg-zap)" strokeWidth={SW} strokeLinejoin="round" />
    </Base>
  );
}

export function IconStar({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-star" c1="#FFCC00" c2="#FFB199" c3="#FF6B9D" />
      <path
        d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
        stroke="url(#trg-star)" strokeWidth={SW} strokeLinejoin="round"
      />
    </Base>
  );
}

export function IconSparkles({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-spark" />
      <g stroke="url(#trg-spark)" strokeWidth={SW} {...CAP} strokeLinejoin="round">
        <path d="M12 3l1.9 5.7 5.7 1.9-5.7 1.9L12 18.2l-1.9-5.7L4.4 10.6l5.7-1.9z" />
        <path d="M19 3v4M17 5h4" />
      </g>
    </Base>
  );
}

/* ---------------- Inbox (empty state) ---------------- */
export function IconInbox({ size, className }) {
  return (
    <Base size={size} className={className}>
      <Grad id="trg-inbox" />
      <g stroke="url(#trg-inbox)" strokeWidth={SW} {...CAP}>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </g>
    </Base>
  );
}

/* ---------------- 3D icon badge (page hero tiles) ---------------- */
export function IconBadge({ size = 64, className = "", children, glow = true }) {
  return (
    <span
      className={`icon-badge ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="icon-badge-gloss" />
      {children}
      {glow && <span className="icon-badge-shine" />}
    </span>
  );
}

/* ---------------- Premium 3D avatar (LiveFeed) ---------------- */
const AVATAR_PAIRS = [
  ["#FFB199", "#FF6B9D"], ["#2DD4BF", "#A855F7"], ["#FF6B9D", "#A855F7"],
  ["#FFCC00", "#FFB199"], ["#A855F7", "#2DD4BF"],
];
export function Avatar({ name = "?", size = 40, seed = 0, className = "" }) {
  const [c1, c2] = AVATAR_PAIRS[seed % AVATAR_PAIRS.length];
  const gid = `tav-${seed % AVATAR_PAIRS.length}`;
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`icon-3d shrink-0 ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}-r`} cx="0.35" cy="0.3" r="1">
          <stop stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.4" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill={`url(#${gid}-r)`} />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
      <ellipse cx="24" cy="15" rx="12" ry="6.5" fill="#fff" opacity="0.28" />
      <text x="24" y="31.5" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="inherit">
        {initial}
      </text>
    </svg>
  );
}
