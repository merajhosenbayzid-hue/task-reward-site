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
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm">
          <p className="text-lg font-bold text-ink">উত্তোলন করতে লগিন করুন</p>
          <Link href="/login" className="mt-4 inline-block bg-coral text-white font-bold px-6 py-3 rounded-2xl hover:bg-coraldeep">
            লগিন করুন
          </Link>
        </div>
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
      label: "যোগ্য রেফারেল (কমপক্ষে ১০ জন)",
      ok: elig.stats.active >= 10,
      hint: `${elig.stats.active} জন অ্যাক্টিভ রেফারেল`,
    },
  ];

  const inputCls = "mt-1 w-full border-2 border-creamdeep rounded-2xl px-4 py-3 focus:border-coral focus:outline-none bg-white";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-ink">🏧 টাকা উত্তোলন</h1>

      <div className="mt-6 bg-white rounded-[2rem] p-8 text-center shadow-sm">
        <p className="text-inksoft text-sm">উত্তোলনযোগ্য ব্যালেন্স</p>
        <p className="text-4xl font-bold text-ink mt-1">{user.balance} <span className="text-xl">টাকা</span></p>
      </div>

      <div className="mt-5 bg-white rounded-[2rem] p-7 shadow-sm">
        <h2 className="font-bold text-lg text-ink">📋 উত্তোলনের শর্ত</h2>
        <div className="mt-4 space-y-3">
          {checks.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-3xl ${c.ok ? "bg-lav/60" : "bg-cream"}`}>
              <span className="text-2xl">{c.ok ? "✅" : "⭕"}</span>
              <div>
                <p className="font-bold text-ink text-sm">{c.label}</p>
                <p className="text-inksoft text-xs">{c.hint}</p>
              </div>
            </div>
          ))}
        </div>
        {elig.eligible ? (
          <p className="mt-4 bg-lav rounded-3xl px-5 py-4 font-bold text-ink text-sm">
            🎉 অভিনন্দন! আপনি উত্তোলনের যোগ্য।
          </p>
        ) : (
          <div className="mt-4 bg-peach/60 rounded-3xl px-5 py-4 text-sm">
            {elig.reasons.map((r, i) => (
              <p key={i} className="text-ink mt-1">⚠️ {r}</p>
            ))}
            <div className="mt-3 flex gap-2 flex-wrap">
              <Link href="/deposit" className="bg-coral text-white text-sm font-bold px-4 py-2.5 rounded-2xl">ডিপোজিট করুন</Link>
              <Link href="/referral" className="bg-sun text-ink text-sm font-bold px-4 py-2.5 rounded-2xl">রেফার করুন</Link>
            </div>
          </div>
        )}
      </div>

      {done && (
        <div className="mt-5 bg-lav rounded-[2rem] p-5 text-center font-bold text-ink">
          ✅ উত্তোলনের আবেদন জমা হয়েছে! অ্যাডমিন অনুমোদন করলে পেমেন্ট পাঠানো হবে।
        </div>
      )}

      {elig.eligible && (
        <form onSubmit={submit} className="mt-5 bg-white rounded-[2rem] p-7 shadow-sm space-y-5">
          <div>
            <label className="font-bold text-sm text-ink">পেমেন্ট মাধ্যম</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-3 rounded-2xl font-bold ${
                    method === m ? "bg-ink text-white" : "bg-cream text-ink hover:bg-creamdeep"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-bold text-sm text-ink">আপনার {method} নম্বর</label>
            <input value={account} onChange={(e) => setAccount(e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="font-bold text-sm text-ink">টাকার পরিমাণ</label>
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} placeholder="যেমন: 100" />
          </div>
          <button type="submit" className="w-full bg-coral text-white font-bold py-4 rounded-2xl hover:bg-coraldeep shadow-lg shadow-coral/25">
            উত্তোলনের আবেদন করুন
          </button>
        </form>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-ink">🕘 উত্তোলন ইতিহাস</h2>
          <div className="mt-3 space-y-3">
            {history.map((w) => (
              <div key={w.id} className="bg-white rounded-3xl p-5 text-sm flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-ink">{w.method} — {w.amount} টাকা</p>
                  <p className="text-inksoft text-xs">{w.date}</p>
                </div>
                <span className="bg-creamdeep text-ink text-xs font-bold px-3 py-1.5 rounded-full">{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
