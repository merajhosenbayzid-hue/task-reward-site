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

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <header className="max-w-6xl mx-auto flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 icon-interactive">
          <BrandMark size={40} className="animate-icon-float" />
          <span className="text-lg font-bold text-white hidden sm:inline">Task Reward</span>
        </Link>

        <nav className="flex-1 hidden md:flex justify-center">
          <div className="glass card-warm rounded-full px-2 py-1.5 flex items-center gap-0.5">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${
                  pathname === l.href
                    ? "bg-gradient-to-r from-[#ff7a1a] via-[#ff5e62] to-[#c026d3] text-white shadow-[0_4px_16px_rgba(255,122,26,0.45)]"
                    : "text-mist hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* mobile nav scroll */}
        <nav className="flex-1 md:hidden overflow-x-auto">
          <div className="flex gap-0.5 whitespace-nowrap text-sm">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-full font-bold ${
                  pathname === l.href
                    ? "bg-gradient-to-r from-[#ff7a1a] via-[#ff5e62] to-[#c026d3] text-white shadow-[0_4px_16px_rgba(255,122,26,0.45)]"
                    : "text-mist"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {ready &&
          (user ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden lg:inline glass rounded-full px-4 py-2 text-sm font-bold text-white items-center gap-1.5 flex">
                <IconWallet size={16} className="icon-3d" /> {formatMoney(user.balance, currency)}
              </span>
              <CurrencySelect value={currency} onSelect={handleCurrency} />
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center glass"
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
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <CurrencySelect />
              <Link
                href="/login"
                className="text-sm font-bold text-mist hover:text-white px-3 py-2 hidden sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-gradient text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-rose/30 hover:opacity-90"
              >
                Get started
              </Link>
            </div>
          ))}
      </header>
    </div>
  );
}
