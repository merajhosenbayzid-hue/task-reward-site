"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, getCurrentUser } from "../../lib/demo";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const cu = getCurrentUser();
    if (cu) {
      setUser(cu);
      setAuthed(true);
    } else {
      setUser(getUser());
    }
  }, []);

  if (!user) return <p className="text-center py-10">লোড হচ্ছে...</p>;

  if (!authed)
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <h1 className="text-2xl font-bold">👤 ড্যাশবোর্ড</h1>
        <p className="text-gray-600 mt-2">ড্যাশবোর্ড দেখতে লগিন করুন।</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/login"
            className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700"
          >
            লগিন করুন
          </Link>
          <Link
            href="/signup"
            className="bg-amber-400 text-emerald-950 font-bold px-6 py-3 rounded-xl hover:bg-amber-300"
          >
            অ্যাকাউন্ট খুলুন
          </Link>
        </div>
      </div>
    );

  const cards = [
    { label: "💰 ব্যালেন্স", value: `${user.balance} টাকা`, color: "border-emerald-500" },
    { label: "👥 মোট রেফার", value: `${user.referrals} জন`, color: "border-amber-400" },
    { label: "✅ সম্পন্ন টাস্ক", value: `${user.tasksDone} টি`, color: "border-sky-500" },
    { label: "📦 আমার প্যাকেজ", value: user.package, color: "border-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">👤 ড্যাশবোর্ড</h1>
      <p className="text-center text-gray-600 mt-1">স্বাগতম, {user.name}!</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`bg-white rounded-xl shadow p-5 border-t-4 ${c.color} text-center`}>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <Link href="/tasks" className="bg-emerald-600 text-white text-center font-bold py-3 rounded-xl hover:bg-emerald-700">
          টাস্ক করুন
        </Link>
        <Link href="/deposit" className="bg-amber-400 text-emerald-950 text-center font-bold py-3 rounded-xl hover:bg-amber-300">
          ডিপোজিট করুন
        </Link>
        <Link href="/referral" className="bg-white text-emerald-800 text-center font-bold py-3 rounded-xl shadow hover:bg-emerald-50">
          বন্ধুদের রেফার করুন
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        আপনার সর্বশেষ তথ্য নিচে দেখুন।
      </p>
    </div>
  );
}
