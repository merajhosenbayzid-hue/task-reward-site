"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addToList, getList, getCurrentUser, activateAccount, isActive, daysLeft,
} from "../../lib/demo";

const METHODS = ["বিকাশ", "নগদ", "রকেট"];
const ACTIVATION_AMOUNT = 100;
const ACTIVE_DAYS = 7;

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState(METHODS[0]);
  const [sender, setSender] = useState("");
  const [trxId, setTrxId] = useState("");
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setUser(getCurrentUser());
    setHistory(getList("deposits"));
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm">
          <p className="text-lg font-bold text-ink">ডিপোজিট করতে লগিন করুন</p>
          <Link href="/login" className="mt-4 inline-block bg-coral text-white font-bold px-6 py-3 rounded-2xl hover:bg-coraldeep">
            লগিন করুন
          </Link>
        </div>
      </div>
    );
  }

  const active = isActive(user);

  const submit = (e) => {
    e.preventDefault();
    if (!sender || !trxId) {
      alert("আপনার নম্বর ও ট্রানজেকশন আইডি দিন।");
      return;
    }
    addToList("deposits", { method, amount: ACTIVATION_AMOUNT, sender, trxId });
    const updated = activateAccount(user.email);
    setUser(updated);
    setHistory(getList("deposits"));
    setDone(true);
    setSender("");
    setTrxId("");
  };

  const inputCls = "mt-1 w-full border-2 border-creamdeep rounded-2xl px-4 py-3 focus:border-coral focus:outline-none bg-white";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-ink">💵 ডিপোজিট ও অ্যাক্টিভেশন</h1>

      <div className={`mt-6 rounded-[2rem] p-5 text-center font-bold ${active ? "bg-lav text-ink" : "bg-peach text-ink"}`}>
        {active ? (
          <>🟢 অ্যাকাউন্ট অ্যাক্টিভ আছে — {daysLeft(user)} দিন বাকি</>
        ) : (
          <>🔴 অ্যাকাউন্ট ইনঅ্যাক্টিভ — অ্যাক্টিভ করতে ডিপোজিট করুন</>
        )}
      </div>

      <div className="mt-5 bg-white rounded-[2rem] p-8 text-center shadow-sm">
        <p className="text-5xl font-bold text-ink">{ACTIVATION_AMOUNT} <span className="text-2xl">টাকা</span></p>
        <p className="mt-2 text-inksoft">ডিপোজিট করলে অ্যাকাউন্ট <b className="text-ink">{ACTIVE_DAYS} দিনের</b> জন্য অ্যাক্টিভ হবে</p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-left">
          {[
            { icon: "👥", text: "রেফার করতে পারবেন" },
            { icon: "💰", text: "ব্যালেন্স দেখা যাবে" },
            { icon: "🏧", text: "উত্তোলনের যোগ্যতা" },
          ].map((f) => (
            <div key={f.text} className="bg-cream rounded-3xl p-4 text-center">
              <p className="text-2xl">{f.icon}</p>
              <p className="mt-1 text-xs font-bold text-ink">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="mt-5 bg-lav rounded-[2rem] p-5 text-center font-bold text-ink">
          ✅ আবেদন জমা হয়েছে! যাচাইয়ের পর {ACTIVE_DAYS} দিনের জন্য অ্যাক্টিভ হবে।
        </div>
      )}

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
          <input value={sender} onChange={(e) => setSender(e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <label className="font-bold text-sm text-ink">ট্রানজেকশন আইডি (TrxID)</label>
          <input value={trxId} onChange={(e) => setTrxId(e.target.value)} className={inputCls} placeholder="যেমন: BKS9X2KQ7M" />
        </div>
        <button type="submit" className="w-full bg-coral text-white font-bold py-4 rounded-2xl hover:bg-coraldeep shadow-lg shadow-coral/25">
          {ACTIVATION_AMOUNT} টাকা ডিপোজিট জমা দিন
        </button>
        <p className="text-xs text-inksoft text-center">📝 ম্যানুয়াল যাচাই — অ্যাডমিন যাচাই করে অ্যাকাউন্ট অ্যাক্টিভ করবেন</p>
      </form>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-ink">🕘 আমার ডিপোজিট ইতিহাস</h2>
          <div className="mt-3 space-y-3">
            {history.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-5 text-sm flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-ink">{d.method} — {d.amount} টাকা</p>
                  <p className="text-inksoft text-xs">{d.date} • TrxID: {d.trxId}</p>
                </div>
                <span className="bg-creamdeep text-ink text-xs font-bold px-3 py-1.5 rounded-full">{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
