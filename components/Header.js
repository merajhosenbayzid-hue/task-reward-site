"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser, logout, isActive, setCurrencyApi } from "../lib/api";
import { useCurrency, formatMoney, setCurrencyLocal } from "../lib/currency";
import { BrandMark, IconWallet, StatusDot, Avatar } from "./icons";
import CurrencySelect from "./CurrencySelect";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deposit", label: "Deposit" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/referral", label: "Referral" },
];

// Transparent full-width bar echoing the homepage PromoNav.
// All functionality preserved: nav links, currency, balance, status, avatar menu.
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const [currency] = useCurrency();

  useEffect(() => {
    let alive = true;
    getCurrentUser().then((u) => {
      if (alive) {
        setUser(u);
        setReady(true);
      }
    });
    return () => { alive = false; };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function doLogout() {
    await logout();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  async function handleCurrency(code) {
    setCurrencyLocal(code);
    if (user) {
      try {
        await setCurrencyApi(code);
        const u = await getCurrentUser();
        if (u) setUser(u);
      } catch {}
    }
  }

  const linkCls = (href) =>
    `relative text-sm font-semibold transition [text-shadow:0_2px_8px_rgba(0,0,0,.5)] whitespace-nowrap ${
      pathname === href ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const activeBar = (href) =>
    pathname === href ? (
      <span
        className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#ff5e62] shadow-[0_0_10px_rgba(255,122,26,.9)]"
        aria-hidden="true"
      />
    ) : null;

  return (
    <div className="sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <BrandMark size={38} className="drop-shadow-[0_4px_14px_rgba(0,0,0,.45)]" />
          <span className="text-lg font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,.5)] hidden sm:inline">
            Task Reward
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)}>
              {l.label}
              {activeBar(l.href)}
            </Link>
          ))}
        </div>

        {/* right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {ready &&
            (user ? (
              <>
                <span className="hidden lg:inline-flex glass rounded-full px-4 py-2 text-sm font-bold text-white items-center gap-1.5">
                  <IconWallet size={16} className="icon-3d" /> {formatMoney(user.balance, currency)}
                </span>
                <CurrencySelect value={currency} onSelect={handleCurrency} />
                <span
                  className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center glass"
                  title={isActive(user) ? "Active" : "Inactive"}
                >
                  <StatusDot active={isActive(user)} size={13} />
                </span>
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="w-10 h-10 rounded-full overflow-hidden glass icon-interactive flex items-center justify-center"
                    title={user.name || user.email}
                  >
                    {user.photo ? (
                      <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Avatar name={user.name || user.email} size={34} />
                    )}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 glass card-warm rounded-2xl p-2 z-50">
                      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-3">
                        {user.photo ? (
                          <img src={user.photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <Avatar name={user.name || user.email} size={40} />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{user.name || "User"}</p>
                          <p className="text-xs text-faint truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                      <button
                        onClick={doLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-mist hover:bg-white/10 hover:text-white transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <path d="M16 17l5-5-5-5" />
                          <path d="M21 12H9" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <CurrencySelect />
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 sm:px-6 py-2.5 text-sm font-bold text-[#14101f] shadow-[0_8px_24px_rgba(0,0,0,.35)] transition hover:bg-orange-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-gradient text-white text-sm font-bold px-5 sm:px-6 py-2.5 rounded-full hidden sm:inline"
                >
                  Get started
                </Link>
              </>
            ))}

          {/* mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M3 3l12 12M15 3L3 15" />
              ) : (
                <path d="M2 4.5h14M2 9h14M2 13.5h14" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      {mobileOpen && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-[#12101f]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pathname === l.href
                  ? "text-white bg-gradient-to-r from-[#ff7a1a]/25 to-[#ff5e62]/25"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
