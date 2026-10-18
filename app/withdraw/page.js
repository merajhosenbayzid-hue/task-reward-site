"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addToList, getList, getCurrentUser, getWithdrawEligibility, isActive, daysLeft,
} from "../../lib/demo";

const METHODS = ["বিকাশ", "নগদ", "রকেট"];

export default function Withdraw() {
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState(METHODS[0]);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setUser(getCurrentUser());
    setHistory(getList("withdrawals"));
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <p className="text-lg font-bold">উত্তোলন করতে লগিন করুন</p>
        <Link href="/login" className="mt-3 inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl">
          লগিন করুন
        </Link>
      </div>
    );
  }

  const elig = getWithdrawEligibility(user);

  const submit = (e) => {
    e.preventDefault();
    if (!elig.eligible) {
      alert("শর্ত পূরণ হয়নি — নিচের তালিকা দেখুন।");
      return;
    }
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) {
      alert("সঠিক টাকার পরিমাণ দিন।");
      return;
    }
    if (amt > user.balance) {
      alert("ব্যালেন্সের চেয়ে বেশি টাকা চাওয়া যাবে না।");
      return;
    }
    if (!account) {
      alert("আপনার অ্যাকাউন্ট নম্বর দিন।");
      return;
    }
    const list = addToList("withdrawals", { method, account, amount: amt });
    setHistory(list);
    setDone(true);
    setAccount("");
    setAmount("");
  };

  const checks = [
    {
      label: "আপনার অ্যাকাউন্ট অ্যাক্টিভ",
      ok: isActive(user),
      hint: isActive(user) ? `${daysLeft(user)} দিন বাকি` : "ডিপোজিট করে অ্যাক্টিভ করুন",
    },
    {
      label: `যোগ্য রেফারেল (কমপক্ষে ১০ জন)`,
      ok: elig.stats.active >= 10,
      hint: `${elig.stats.active} জন অ্যাক্টিভ রেফারেল`,
    },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🏧 টাকা উত্তোলন</h1>

      <div className="mt-4 bg-white rounded-xl shadow p-6 text-center">
        <p className="text-gray-500 text-sm">উত্তোলনযোগ্য ব্যালেন্স</p>
        <p className="text-3xl font-bold text-emerald-700">{user.balance} টাকা</p>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow p-6">
        <h2 className="font-bold">📋 উত্তোলনের শর্ত</h2>
        <div className="mt-3 space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-lg">{c.ok ? "✅" : "❌"}</span>
              <div>
                <p className="font-bold">{c.label}</p>
                <p className="text-gray-500">{c.hint}</p>
              </div>
            </div>
          ))}
        </div>
        {elig.eligible ? (
          <p className="mt-3 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl px-4 py-3">
            🎉 অভিনন্দন! আপনি উত্তোলনের যোগ্য।
          </p>
        ) : (
          <div className="mt-3 bg-red-50 rounded-xl px-4 py-3 text-sm">
            {elig.reasons.map((r, i) => (
              <p key={i} className="text-red-700 mt-1">⚠️ {r}</p>
            ))}
            <div className="mt-3 flex gap-2 flex-wrap">
              <Link href="/deposit" className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl">ডিপোজিট করুন</Link>
              <Link href="/referral" className="bg-amber-400 text-emerald-950 text-sm font-bold px-4 py-2 rounded-xl">রেফার করুন</Link>
            </div>
          </div>
        )}
      </div>

      {done && (
        <div className="mt-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-4 text-center font-bold">
          ✅ উত্তোলনের আবেদন জমা হয়েছে! অ্যাডমিন অনুমোদন করলে পেমেন্ট পাঠানো হবে।
        </div>
      )}

      {elig.eligible && (
        <form onSubmit={submit} className="mt-4 bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="font-bold text-sm">পেমেন্ট মাধ্যম</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2.5 rounded-xl font-bold border-2 ${
                    method === m
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white border-gray-200 hover:border-emerald-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-bold text-sm">আপনার {method} নম্বর</label>
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2.5"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className="font-bold text-sm">টাকার পরিমাণ</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2.5"
              placeholder="যেমন: 100"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700">
            উত্তোলনের আবেদন করুন
          </button>
        </form>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold">🕘 উত্তোলন ইতিহাস</h2>
          <div className="mt-2 space-y-2">
            {history.map((w) => (
              <div key={w.id} className="bg-white rounded-xl shadow p-4 text-sm flex justify-between">
                <div>
                  <p className="font-bold">{w.method} — {w.amount} টাকা</p>
                  <p className="text-gray-500">{w.date}</p>
                </div>
                <span className="text-amber-600 font-bold">{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
