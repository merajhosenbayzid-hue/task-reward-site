"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout, isActive, daysLeft } from "../lib/demo";

const LINKS = [
  { href: "/", label: "হোম" },
  { href: "/tasks", label: "টাস্ক" },
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/deposit", label: "ডিপোজিট" },
  { href: "/withdraw", label: "উত্তোলন" },
  { href: "/referral", label: "রেফারেল" },
  { href: "/admin", label: "অ্যাডমিন" },
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
    <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">💰 টাস্ক রিওয়ার্ড</span>
        </Link>
        {ready &&
          (user ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold hidden sm:inline">👤 {user.name}</span>
              <span className="bg-emerald-900 px-2.5 py-1 rounded-lg font-bold">💰 {user.balance}৳</span>
              <span
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  isActive(user) ? "bg-emerald-500" : "bg-red-500"
                }`}
                title={isActive(user) ? `${daysLeft(user)} দিন বাকি` : "ইনঅ্যাক্টিভ"}
              >
                {isActive(user) ? "🟢" : "🔴"}
              </span>
              <button
                onClick={doLogout}
                className="bg-emerald-900 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-950"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-bold">
              <Link href="/login" className="px-3 py-1.5 hover:underline">
                লগিন
              </Link>
              <Link
                href="/signup"
                className="bg-amber-400 text-emerald-950 px-3 py-1.5 rounded-lg hover:bg-amber-300"
              >
                সাইন আপ
              </Link>
            </div>
          ))}
      </div>
      <nav className="bg-emerald-800">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto whitespace-nowrap text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2.5 ${
                pathname === l.href
                  ? "bg-emerald-900 font-bold border-b-2 border-amber-400"
                  : "hover:bg-emerald-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
