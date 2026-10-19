import Link from "next/link";
import { Baloo_2 } from "next/font/google";
import Footer from "../components/Footer";
import PromoNav from "./PromoNav";
import InfoButton from "./InfoButton";
import { IconGift, IconUsers, IconZap, IconLock } from "../components/icons";
import "./promo.css";

const baloo = Baloo_2({ subsets: ["latin"], weight: "800", display: "swap" });

export const metadata = {
  title: "Task Reward — Work, Refer, Win Rewards",
  description:
    "The easiest task & reward platform. Thousands of users earn every day — start completely free.",
};

const FEATURES = [
  {
    icon: <IconGift size={38} className="icon-3d" />,
    title: "10% welcome bonus",
    desc: "Extra bonus on your first deposit.",
  },
  {
    icon: <IconUsers size={38} className="icon-3d" />,
    title: "5% referral commission",
    desc: "Instant commission on every referral's deposit.",
  },
  {
    icon: <IconZap size={38} className="icon-3d" />,
    title: "Fast payments",
    desc: "Quick approval on withdrawal requests.",
  },
  {
    icon: <IconLock size={38} className="icon-3d" />,
    title: "100% secure",
    desc: "Your data and balance are fully protected.",
  },
];

const STARS = [
  { top: "3%", left: "68%", size: 22, delay: "0s" },
  { top: "11%", left: "86%", size: 14, delay: "1.1s" },
  { top: "19%", left: "58%", size: 12, delay: "2s" },
  { top: "1%", left: "44%", size: 16, delay: "0.6s" },
  { top: "27%", left: "90%", size: 10, delay: "1.7s" },
  { top: "33%", left: "72%", size: 9, delay: "2.6s" },
];

const PAYMENTS = [
  ["bKash", "#e2136e"],
  ["Nagad", "#f6921e"],
  ["Rocket", "#a04fc4"],
];

function LampScene() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[440px]">
      {/* twinkling stars */}
      {STARS.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="promo-star absolute z-10"
          style={{ top: s.top, left: s.left, width: s.size, animationDelay: s.delay }}
          fill="#ffe9c9"
          aria-hidden="true"
        >
          <path d="M12 0 C13.2 6.8 17.2 10.8 24 12 C17.2 13.2 13.2 17.2 12 24 C10.8 17.2 6.8 13.2 0 12 C6.8 10.8 10.8 6.8 12 0 Z" />
        </svg>
      ))}

      {/* copper desk lamp + moon */}
      <svg viewBox="0 0 420 560" className="h-auto w-full" role="img" aria-label="Copper desk lamp illustration">
        <defs>
          <radialGradient id="pl-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb35c" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#ff8a2a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff8a2a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pl-moon" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#f4ecdb" />
            <stop offset="70%" stopColor="#e3d7bd" />
            <stop offset="100%" stopColor="#c9b891" />
          </radialGradient>
          <linearGradient id="pl-copper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7b96a" />
            <stop offset="45%" stopColor="#d97a2e" />
            <stop offset="100%" stopColor="#8a3f12" />
          </linearGradient>
          <linearGradient id="pl-copper-d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5541f" />
            <stop offset="100%" stopColor="#5e2708" />
          </linearGradient>
          <linearGradient id="pl-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffcf8f" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffcf8f" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="pl-bulb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbef" />
            <stop offset="100%" stopColor="#fffbef" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* pale moon */}
        <circle cx="265" cy="140" r="118" fill="url(#pl-moon)" opacity="0.92" />
        <circle cx="230" cy="115" r="18" fill="#c2b088" opacity="0.45" />
        <circle cx="296" cy="166" r="26" fill="#c2b088" opacity="0.32" />
        <circle cx="262" cy="186" r="12" fill="#c2b088" opacity="0.38" />

        {/* warm ambient glow */}
        <circle cx="205" cy="330" r="200" fill="url(#pl-glow)" className="promo-glow" />

        {/* light beam */}
        <polygon points="268,234 372,234 412,540 218,540" fill="url(#pl-beam)" opacity="0.35" />

        {/* floor + warm sheen */}
        <ellipse cx="210" cy="528" rx="205" ry="24" fill="#06060f" />
        <ellipse cx="210" cy="520" rx="150" ry="14" fill="#ff9a3c" opacity="0.14" />

        {/* lamp base */}
        <ellipse cx="210" cy="508" rx="62" ry="15" fill="url(#pl-copper-d)" />
        <rect x="204" y="472" width="12" height="34" rx="6" fill="url(#pl-copper-d)" />

        {/* lower arm */}
        <rect x="203" y="340" width="14" height="136" rx="7" fill="url(#pl-copper)" />
        <circle cx="210" cy="338" r="14" fill="url(#pl-copper-d)" />
        <circle cx="210" cy="338" r="5" fill="#2a1408" />

        {/* upper arm */}
        <line x1="210" y1="338" x2="302" y2="228" stroke="url(#pl-copper)" strokeWidth="13" strokeLinecap="round" />
        <circle cx="302" cy="228" r="11" fill="url(#pl-copper-d)" />

        {/* shade dome */}
        <path d="M246 232 A72 60 0 0 1 390 232 Z" fill="url(#pl-copper)" />
        <ellipse cx="318" cy="232" rx="72" ry="15" fill="#2e1606" />
        <ellipse cx="318" cy="230" rx="46" ry="9" fill="url(#pl-bulb)" />
        <rect x="314" y="166" width="8" height="16" fill="url(#pl-copper-d)" />
        <circle cx="318" cy="164" r="9" fill="url(#pl-copper-d)" />
      </svg>

      {/* floating paper cards */}
      <div
        className="promo-card absolute bottom-[10%] right-[2%] hidden h-28 w-20 rounded-lg bg-[#f7f3e8] shadow-[0_18px_40px_rgba(0,0,0,.5)] sm:block"
        style={{ "--tilt": "10deg", animationDelay: "0.8s" }}
        aria-hidden="true"
      >
        <div className="mx-3 mt-4 h-1.5 rounded bg-[#d8d2bd]" />
        <div className="mx-3 mt-2 h-1.5 w-2/3 rounded bg-[#e4dfcc]" />
        <div className="mx-3 mt-2 h-1.5 rounded bg-[#e4dfcc]" />
      </div>
      <div
        className="promo-card absolute bottom-[3%] right-[22%] hidden h-20 w-24 rounded-lg bg-[#efe9d8] shadow-[0_18px_40px_rgba(0,0,0,.5)] sm:block"
        style={{ "--tilt": "-7deg", animationDelay: "2.1s" }}
        aria-hidden="true"
      >
        <div className="mx-3 mt-4 h-1.5 w-1/2 rounded bg-[#d8d2bd]" />
        <div className="mx-3 mt-2 h-1.5 rounded bg-[#e4dfcc]" />
      </div>
    </div>
  );
}

export default function PromoPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0a0a18] text-white">
      <PromoNav />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] overflow-hidden">
        {/* owner's clean photo as the full hero background */}
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* panda watermark in the dark side of the hero — the owner's photo,
            blended with a warm glow to match the palette */}
        <div
          className="pointer-events-none absolute -right-[12vmin] top-[6%] z-0 h-[56vmin] w-[56vmin]"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage: "url(/images/panda-bg.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.34,
              maskImage: "radial-gradient(circle, black 52%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle, black 52%, transparent 70%)",
            }}
          />
          <div
            className="absolute -inset-[10%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,122,26,.22), transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 pb-20 pt-28 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          {/* left: copy */}
          <div className="promo-rise">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#1a0e05]/80">
              10% Welcome Bonus for New Users
            </p>

            <h1
              className={`${baloo.className} promo-headline mt-5`}
              style={{ fontSize: "clamp(3.2rem, 8.5vw, 7rem)" }}
              aria-label="Work, refer and win rewards"
            >
              <span className="promo-dark-word block">WORK,</span>
              <span className="neon-word block" data-text="REFER">
                REFER
              </span>
              <span className="promo-dark-word block">AND WIN</span>
              <span className="neon-word block" data-text="REWARDS">
                REWARDS
              </span>
            </h1>

            <InfoButton />

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 [text-shadow:0_2px_12px_rgba(0,0,0,.55)]">
              The easiest task &amp; reward platform. Thousands of users earn every
              day — start completely free.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link
                href="/signup"
                className="rounded-full bg-[#16121f] px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_36px_rgba(0,0,0,.45)] transition hover:scale-[1.03] hover:bg-[#221b30]"
              >
                Create free account
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-bold text-white/85 underline decoration-white/40 underline-offset-4 transition hover:text-white [text-shadow:0_2px_10px_rgba(0,0,0,.55)]"
              >
                View dashboard →
              </Link>
            </div>

            {/* payment badges */}
            <div className="mt-9 flex flex-wrap gap-2.5">
              {PAYMENTS.map(([label, color]) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: color }}
                    aria-hidden="true"
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* right: the lamp is baked into the background photo */}
          <div className="relative hidden lg:block" aria-hidden="true" />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="promo-features" className="relative bg-[#0a0a18] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-orange-300/90">
            Features
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold text-white sm:text-4xl">
            Why Task Reward?
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-orange-500/40 hover:bg-white/[0.06]"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
