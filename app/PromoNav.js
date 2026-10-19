"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "../components/icons";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deposit", label: "Deposit" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/referral", label: "Referral" },
];

export default function PromoNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size={38} className="drop-shadow-[0_4px_14px_rgba(0,0,0,.45)]" />
          <span className="text-lg font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,.5)]">
            Task Reward
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-white/85 transition hover:text-white [text-shadow:0_2px_8px_rgba(0,0,0,.5)]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#14101f] shadow-[0_8px_24px_rgba(0,0,0,.35)] transition hover:bg-orange-100"
          >
            Login
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M3 3l12 12M15 3L3 15" />
              ) : (
                <path d="M2 4.5h14M2 9h14M2 13.5h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-[#12101f]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
