// Reusable professional currency dropdown (BDT / USD / EUR).
// Pure display control — the parent decides how to persist (local + server).
"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCIES, useCurrency, setCurrencyLocal } from "../lib/currency";

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function CurrencySelect({ value, onSelect, className = "" }) {
  const [autoCurrency] = useCurrency();
  const cur = value || autoCurrency;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const pick = (code) => {
    setOpen(false);
    if (onSelect) onSelect(code);
    else setCurrencyLocal(code); // default: persist display currency locally
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="glass card-warm rounded-full px-3.5 py-2 text-sm font-bold text-white flex items-center gap-1.5 hover:bg-white/10 transition"
        title="Display currency"
      >
        <span className="text-[#ff7a1a]">{CURRENCIES[cur].symbol}</span>
        <span>{cur}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-60 glass card-warm rounded-2xl p-1.5 z-50"
        >
          {Object.entries(CURRENCIES).map(([code, c]) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === cur}
              onClick={() => pick(code)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                code === cur ? "bg-orange-500/15 text-white" : "text-mist hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-orange-500/15 flex items-center justify-center font-bold text-[#ff7a1a] shrink-0">
                {c.symbol}
              </span>
              <span className="font-bold text-left flex-1">{c.label}</span>
              {code === cur && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
