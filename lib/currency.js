// Currency display layer — BDT is the base (all real balances are stored in BDT).
// USD/EUR are display-only conversions using verified exchange rates.
"use client";

import { useEffect, useState } from "react";

export const CURRENCIES = {
  BDT: { symbol: "৳", label: "BDT — Bangladeshi Taka" },
  USD: { symbol: "$", label: "USD — US Dollar" },
  EUR: { symbol: "€", label: "EUR — Euro" },
};

const LOCAL_KEY = "tr_currency";
const RATES_KEY = "tr_rates";
const DAY_MS = 86400000;
const FALLBACK_RATES = { USD: 0.0085, EUR: 0.0079 };

// Live rates (BDT base). Warmed in the background; formatMoney is sync and
// always falls back to verified static rates until the live fetch lands.
let liveRates = { ...FALLBACK_RATES };
let warming = false;

export async function fetchRates() {
  if (typeof window === "undefined") return { ...FALLBACK_RATES };
  try {
    const raw = localStorage.getItem(RATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.at && Date.now() - parsed.at < DAY_MS && parsed.rates) {
        return parsed.rates;
      }
    }
  } catch {}
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/BDT");
    const json = await res.json();
    if (json && json.result === "success" && json.rates && json.rates.USD && json.rates.EUR) {
      const rates = { USD: Number(json.rates.USD), EUR: Number(json.rates.EUR) };
      try {
        localStorage.setItem(RATES_KEY, JSON.stringify({ at: Date.now(), rates }));
      } catch {}
      return rates;
    }
  } catch {}
  return { ...FALLBACK_RATES };
}

function warmRates() {
  if (warming || typeof window === "undefined") return;
  warming = true;
  fetchRates()
    .then((r) => {
      liveRates = r;
      window.dispatchEvent(new Event("tr-rates-change"));
    })
    .catch(() => {})
    .finally(() => {
      warming = false;
    });
}

if (typeof window !== "undefined") warmRates();

/** Convert a BDT amount to the target currency (display only). */
export function convertBDT(amountBDT, to) {
  const amt = Number(amountBDT) || 0;
  if (!to || to === "BDT") return amt;
  const r = liveRates[to];
  return r ? amt * r : amt;
}

/** Format a BDT amount for display in the given currency. */
export function formatMoney(amountBDT, currency = "BDT") {
  const c = CURRENCIES[currency] ? currency : "BDT";
  const amt = Number(amountBDT) || 0;
  if (c === "BDT") {
    return `৳${Math.round(amt).toLocaleString("en-US")}`;
  }
  const converted = convertBDT(amt, c);
  return `${CURRENCIES[c].symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrency() {
  if (typeof window === "undefined") return "BDT";
  const c = localStorage.getItem(LOCAL_KEY);
  return CURRENCIES[c] ? c : "BDT";
}

/** Persist locally + notify all subscribers. Server sync is the caller's job. */
export function setCurrencyLocal(c) {
  if (!CURRENCIES[c] || typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, c);
  window.dispatchEvent(new Event("tr-currency-change"));
}

/** [currency, setCurrency] — re-renders on currency change AND when live rates land. */
export function useCurrency() {
  const [currency, setCurrency] = useState(() => getCurrency());
  const [, force] = useState(0);
  useEffect(() => {
    warmRates();
    const onChange = () => setCurrency(getCurrency());
    const onRates = () => force((x) => x + 1);
    window.addEventListener("tr-currency-change", onChange);
    window.addEventListener("tr-rates-change", onRates);
    setCurrency(getCurrency());
    return () => {
      window.removeEventListener("tr-currency-change", onChange);
      window.removeEventListener("tr-rates-change", onRates);
    };
  }, []);
  return [currency, setCurrencyLocal];
}
