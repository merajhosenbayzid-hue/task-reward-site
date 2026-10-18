"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, isActive, daysLeft, getReferralStats, getWithdrawEligibility,
} from "../../lib/demo";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cu = getCurrentUser();
    if (cu) {
      setUser(cu);
      setAuthed(true);
    }
    setLoaded(true);
  }, []);

  if (!loaded) return <p className="text-center py-16 text-inksoft">লোড হচ্ছে...</p>;

  if (!authed)
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm">
          <p className="text-5xl">👤</p>
          <h1 className="mt-4 text-2xl font-bold text-ink">ড্যাশবোর্ড</h1>
          <p className="text-inksoft mt-2">ড্যাশবোর্ড দেখতে লগিন করুন।</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/login" className="bg-coral text-white font-bold px-6 py-3 rounded-2xl hover:bg-coraldeep">
              লগিন করুন
            </Link>
            <Link href="/signup" className="bg-sun text-ink font-bold px-6 py-3 rounded-2xl hover:opacity-90">
              অ্যাকাউন্ট খুলুন
            </Link>
          </div>
        </div>
      </div>
    );

  const active = isActive(user);
  const stats = getReferralStats(user.referralCode);
  const elig = getWithdrawEligibility(user);

  const cards = [
    { icon: "💰", label: "ব্যালেন্স", value: `${user.balance} টাকা`, bg: "bg-lav" },
    { icon: "👥", label: "মোট রেফার", value: `${stats.total} জন`, bg: "bg-peach" },
    { icon: "🟢", label: "অ্যাক্টিভ রেফার", value: `${stats.active} জন`, bg: "bg-peri" },
    { icon: "✅", label: "সম্পন্ন টাস্ক", value: `${user.tasksDone} টি`, bg: "bg-creamdeep" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">ড্যাশবোর্ড</h1>
      <p className="text-inksoft mt-1">স্বাগতম, {user.name}!</p>

      <div className={`mt-6 rounded-[2rem] p-6 flex items-center gap-4 ${active ? "bg-lav" : "bg-peach"}`}>
        <span className="text-4xl">{active ? "🟢" : "🔴"}</span>
        <div className="flex-1">
          <p className="font-bold text-ink">
            {active ? `অ্যাকাউন্ট অ্যাক্টিভ — ${daysLeft(user)} দিন বাকি` : "অ্যাকাউন্ট ইনঅ্যাক্টিভ"}
          </p>
          {!active && (
            <Link href="/deposit" className="text-sm font-bold text-coral underline">
              ১০০ টাকা ডিপোজিট করে ৭ দিনের জন্য অ্যাক্টিভ করুন
            </Link>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-[2rem] p-6 text-center`}>
            <p className="text-3xl">{c.icon}</p>
            <p className="mt-2 text-sm text-inksoft">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-5 rounded-[2rem] p-6 ${elig.eligible ? "bg-lav" : "bg-white shadow-sm"}`}>
        {elig.eligible ? (
          <p className="font-bold text-ink">
            🎉 আপনি টাকা উত্তোলনের যোগ্য!{" "}
            <Link href="/withdraw" className="text-coral underline">উত্তোলন করুন</Link>
          </p>
        ) : (
          <p className="text-inksoft text-sm">
            ℹ️ উত্তোলনের যোগ্যতা: <b className="text-ink">{stats.active}/১০</b> জন অ্যাক্টিভ রেফারেল
            {!active && " • অ্যাকাউন্ট অ্যাক্টিভ করা বাকি"}
          </p>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Link href="/tasks" className="bg-coral text-white text-center font-bold py-4 rounded-2xl hover:bg-coraldeep shadow-lg shadow-coral/25">
          টাস্ক করুন
        </Link>
        <Link href="/deposit" className="bg-sun text-ink text-center font-bold py-4 rounded-2xl hover:opacity-90">
          ডিপোজিট করুন
        </Link>
        <Link href="/referral" className="bg-white text-ink text-center font-bold py-4 rounded-2xl shadow-sm hover:bg-cream">
          বন্ধুদের রেফার করুন
        </Link>
      </div>
    </div>
  );
}
