"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout, isActive } from "../lib/api";

const LINKS = [
  { href: "/", label: "হোম" },
  { href: "/tasks", label: "টাস্ক" },
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/deposit", label: "ডিপোজিট" },
  { href: "/withdraw", label: "উত্তোলন" },
  { href: "/referral", label: "রেফারেল" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

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

  async function doLogout() {
    await logout();
    setUser(null);
    router.push("/");
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <header className="max-w-6xl mx-auto flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-rose/30">
            ৳
          </span>
          <span className="text-lg font-bold text-white hidden sm:inline">টাস্ক রিওয়ার্ড</span>
        </Link>

        <nav className="flex-1 hidden md:flex justify-center">
          <div className="glass rounded-full px-2 py-1.5 flex items-center gap-0.5">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${
                  pathname === l.href
                    ? "bg-white text-night"
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
                  pathname === l.href ? "bg-white text-night" : "text-mist"
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
              <span className="hidden lg:inline glass rounded-full px-4 py-2 text-sm font-bold text-white">
                💰 {user.balance}৳
              </span>
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm glass`}
                title={isActive(user) ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
              >
                {isActive(user) ? "🟢" : "🔴"}
              </span>
              <button
                onClick={doLogout}
                className="bg-white text-night text-sm font-bold px-5 py-2.5 rounded-full hover:bg-mist"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="text-sm font-bold text-mist hover:text-white px-3 py-2 hidden sm:inline"
              >
                লগিন
              </Link>
              <Link
                href="/signup"
                className="btn-gradient text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-rose/30 hover:opacity-90"
              >
                শুরু করুন
              </Link>
            </div>
          ))}
      </header>
    </div>
  );
}
