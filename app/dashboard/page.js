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

  if (!loaded) return <p className="text-center py-16 text-mist">লোড হচ্ছে...</p>;

  if (!authed)
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="glass rounded-[2.5rem] p-10">
          <p className="text-5xl">👤</p>
          <h1 className="mt-4 text-2xl font-bold text-white">ড্যাশবোর্ড</h1>
          <p className="text-mist mt-2">ড্যাশবোর্ড দেখতে লগিন করুন।</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/login" className="bg-white text-night font-bold px-6 py-3 rounded-full hover:bg-mist">
              লগিন করুন
            </Link>
            <Link href="/signup" className="btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
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
    { icon: "💰", label: "ব্যালেন্স", value: `${user.balance} টাকা`, g: "from-peach to-rose" },
    { icon: "👥", label: "মোট রেফার", value: `${stats.total} জন`, g: "from-aqua to-grape" },
    { icon: "🟢", label: "অ্যাক্টিভ রেফার", value: `${stats.active} জন`, g: "from-grape to-rose" },
    { icon: "✅", label: "সম্পন্ন টাস্ক", value: `${user.tasksDone} টি`, g: "from-rose to-sun" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">ড্যাশবোর্ড</h1>
      <p className="text-mist mt-1">স্বাগতম, {user.name}!</p>

      {/* balance hero card */}
      <div className="mt-6 relative overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 btn-gradient opacity-90" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-blob" />
        <div className="relative p-8 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-bold">মোট ব্যালেন্স</p>
            <p className="text-5xl font-bold text-white mt-1">{user.balance}৳</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-bold text-white">
              {active ? "🟢 অ্যাক্টিভ" : "🔴 ইনঅ্যাক্টিভ"}
              {active && <span>• {daysLeft(user)} দিন বাকি</span>}
            </div>
          </div>
          <div className="text-7xl opacity-30 floaty">💰</div>
        </div>
      </div>

      {!active && (
        <Link
          href="/deposit"
          className="mt-4 block text-center bg-white/10 border border-peach/40 rounded-2xl px-5 py-4 font-bold text-peach hover:bg-white/15"
        >
          🔴 অ্যাকাউন্ট ইনঅ্যাক্টিভ — ১০০ টাকা ডিপোজিট করে ৭ দিনের জন্য অ্যাক্টিভ করুন →
        </Link>
      )}

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-[2rem] p-6 text-center hover:bg-white/[0.08] transition">
            <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${c.g} flex items-center justify-center text-2xl`}>
              {c.icon}
            </div>
            <p className="mt-3 text-xs text-faint">{c.label}</p>
            <p className="mt-1 text-xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-5 glass rounded-[2rem] p-6 ${elig.eligible ? "border-aqua/40" : ""}`}>
        {elig.eligible ? (
          <p className="font-bold text-white">
            🎉 আপনি টাকা উত্তোলনের যোগ্য!{" "}
            <Link href="/withdraw" className="text-peach underline">উত্তোলন করুন →</Link>
          </p>
        ) : (
          <p className="text-mist text-sm">
            ℹ️ উত্তোলনের যোগ্যতা: <b className="text-white">{stats.active}/১০</b> জন অ্যাক্টিভ রেফারেল
            {!active && " • অ্যাকাউন্ট অ্যাক্টিভ করা বাকি"}
          </p>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Link href="/tasks" className="btn-gradient text-white text-center font-bold py-4 rounded-full hover:opacity-90 shadow-lg shadow-rose/25">
          টাস্ক করুন
        </Link>
        <Link href="/deposit" className="bg-white text-night text-center font-bold py-4 rounded-full hover:bg-mist">
          ডিপোজিট করুন
        </Link>
        <Link href="/referral" className="glass text-white text-center font-bold py-4 rounded-full hover:bg-white/10">
          বন্ধুদের রেফার করুন
        </Link>
      </div>
    </div>
  );
}
