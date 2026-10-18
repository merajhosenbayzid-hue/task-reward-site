"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout, isActive } from "../lib/demo";

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
    setUser(getCurrentUser());
    setReady(true);
  }, [pathname]);

  function doLogout() {
    logout();
    setUser(null);
    router.push("/");
  }

  return (
    <div className="sticky top-3 z-50 px-3">
      <header className="max-w-5xl mx-auto bg-white/85 backdrop-blur-md rounded-full shadow-lg shadow-ink/5 border border-white pl-4 pr-2 py-2 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 bg-sun rounded-2xl flex items-center justify-center text-xl font-bold text-ink">
            ৳
          </span>
          <span className="text-lg font-bold text-ink hidden sm:inline">টাস্ক রিওয়ার্ড</span>
        </Link>

        <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto whitespace-nowrap text-sm px-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-full font-bold transition ${
                pathname === l.href
                  ? "bg-cream text-ink"
                  : "text-inksoft hover:bg-cream/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {ready &&
          (user ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden md:inline bg-cream px-3 py-2 rounded-full text-sm font-bold text-ink">
                💰 {user.balance}৳
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isActive(user) ? "bg-lav" : "bg-peach"
                }`}
                title={isActive(user) ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
              >
                {isActive(user) ? "🟢" : "🔴"}
              </span>
              <button
                onClick={doLogout}
                className="bg-ink text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-navy"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/login"
                className="text-sm font-bold text-ink px-3 py-2 rounded-full hover:bg-cream"
              >
                লগিন
              </Link>
              <Link
                href="/signup"
                className="bg-coral text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-coraldeep shadow-md shadow-coral/30"
              >
                শুরু করুন
              </Link>
            </div>
          ))}
      </header>
    </div>
  );
}
