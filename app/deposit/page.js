"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addToList, getList, getCurrentUser, activateAccount, isActive, daysLeft,
} from "../../lib/demo";

const METHODS = ["বিকাশ", "নগদ", "রকেট"];
const ACTIVATION_AMOUNT = 100;
const ACTIVE_DAYS = 7;

const inputCls =
  "mt-1 w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 focus:border-rose focus:outline-none text-white placeholder:text-faint";

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
        <div className="glass rounded-[2.5rem] p-10">
          <p className="text-lg font-bold text-white">ডিপোজিট করতে লগিন করুন</p>
          <Link href="/login" className="mt-4 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
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

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white">💵 ডিপোজিট ও অ্যাক্টিভেশন</h1>

      <div className={`mt-6 rounded-[2rem] p-5 text-center font-bold border ${
        active ? "border-aqua/40 text-aqua bg-aqua/5" : "border-peach/40 text-peach bg-peach/5"
      }`}>
        {active ? (
          <>🟢 অ্যাকাউন্ট অ্যাক্টিভ আছে — {daysLeft(user)} দিন বাকি</>
        ) : (
          <>🔴 অ্যাকাউন্ট ইনঅ্যাক্টিভ — অ্যাক্টিভ করতে ডিপোজিট করুন</>
        )}
      </div>

      <div className="mt-5 glass rounded-[2rem] p-8 text-center">
        <p className="text-5xl font-bold text-white">{ACTIVATION_AMOUNT} <span className="text-2xl">টাকা</span></p>
        <p className="mt-2 text-mist">ডিপোজিট করলে অ্যাকাউন্ট <b className="text-white">{ACTIVE_DAYS} দিনের</b> জন্য অ্যাক্টিভ হবে</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { icon: "👥", text: "রেফার করতে পারবেন" },
            { icon: "💰", text: "ব্যালেন্স দেখা যাবে" },
            { icon: "🏧", text: "উত্তোলনের যোগ্যতা" },
          ].map((f) => (
            <div key={f.text} className="bg-white/5 rounded-3xl p-4 text-center">
              <p className="text-2xl">{f.icon}</p>
              <p className="mt-1 text-xs font-bold text-white">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="mt-5 border border-aqua/40 bg-aqua/10 rounded-[2rem] p-5 text-center font-bold text-aqua">
          ✅ আবেদন জমা হয়েছে! যাচাইয়ের পর {ACTIVE_DAYS} দিনের জন্য অ্যাক্টিভ হবে।
        </div>
      )}

      <form onSubmit={submit} className="mt-5 glass rounded-[2rem] p-7 space-y-5">
        <div>
          <label className="font-bold text-sm text-white">পেমেন্ট মাধ্যম</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMethod(m)}
                className={`py-3 rounded-full font-bold transition ${
                  method === m ? "btn-gradient text-white" : "bg-white/5 text-mist hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-bold text-sm text-white">আপনার {method} নম্বর</label>
          <input value={sender} onChange={(e) => setSender(e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <label className="font-bold text-sm text-white">ট্রানজেকশন আইডি (TrxID)</label>
          <input value={trxId} onChange={(e) => setTrxId(e.target.value)} className={inputCls} placeholder="যেমন: BKS9X2KQ7M" />
        </div>
        <button type="submit" className="w-full btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 shadow-lg shadow-rose/25">
          {ACTIVATION_AMOUNT} টাকা ডিপোজিট জমা দিন
        </button>
        <p className="text-xs text-faint text-center">📝 ম্যানুয়াল যাচাই — অ্যাডমিন যাচাই করে অ্যাকাউন্ট অ্যাক্টিভ করবেন</p>
      </form>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-white">🕘 আমার ডিপোজিট ইতিহাস</h2>
          <div className="mt-3 space-y-3">
            {history.map((d) => (
              <div key={d.id} className="glass rounded-3xl p-5 text-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{d.method} — {d.amount} টাকা</p>
                  <p className="text-faint text-xs">{d.date} • TrxID: {d.trxId}</p>
                </div>
                <span className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full">{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
