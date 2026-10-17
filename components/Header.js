"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  return (
    <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">💰 টাস্ক রিওয়ার্ড</span>
          <span className="text-xs bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
            ডেমো সংস্করণ
          </span>
        </Link>
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
