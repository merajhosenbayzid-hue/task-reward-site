"use client";

import { useState } from "react";
import { addToList, getList } from "../../lib/demo";

const METHODS = ["বিকাশ", "নগদ", "রকেট"];

export default function Deposit() {
  const [method, setMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState("50");
  const [sender, setSender] = useState("");
  const [trxId, setTrxId] = useState("");
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState(() => getList("deposits"));

  const submit = (e) => {
    e.preventDefault();
    const amt = parseInt(amount, 10);
    if (!amt || amt < 10 || amt > 100) {
      alert("ডিপোজিট ১০ থেকে ১০০ টাকার মধ্যে হতে হবে।");
      return;
    }
    if (!sender || !trxId) {
      alert("আপনার নম্বর ও ট্রানজেকশন আইডি দিন।");
      return;
    }
    const list = addToList("deposits", { method, amount: amt, sender, trxId });
    setHistory(list);
    setDone(true);
    setSender("");
    setTrxId("");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">💵 ডিপোজিট</h1>
      <p className="text-center text-gray-600 mt-1">সর্বনিম্ন ১০ টাকা, সর্বোচ্চ ১০০ টাকা</p>

      <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm">
        <p className="font-bold">📝 ম্যানুয়াল যাচাই</p>
        <p className="mt-1 text-gray-600">
          টাকা পাঠানোর পর নিচের ফর্মে তথ্য দিন। অ্যাডমিন যাচাই করে ব্যালেন্সে যোগ করবেন
          (১০% ওয়েলকাম বোনাসসহ)।
        </p>
      </div>

      {done && (
        <div className="mt-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-4 text-center font-bold">
          ✅ আবেদন জমা হয়েছে! যাচাইয়ের পর ব্যালেন্স যোগ হবে।
        </div>
      )}

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
          <label className="font-bold text-sm">টাকার পরিমাণ (১০–১০০)</label>
          <input
            type="number"
            min="10"
            max="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full border rounded-xl px-4 py-2.5"
            placeholder="যেমন: 50"
          />
        </div>
        <div>
          <label className="font-bold text-sm">আপনার {method} নম্বর</label>
          <input
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="mt-1 w-full border rounded-xl px-4 py-2.5"
            placeholder="01XXXXXXXXX"
          />
        </div>
        <div>
          <label className="font-bold text-sm">ট্রানজেকশন আইডি (TrxID)</label>
          <input
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="mt-1 w-full border rounded-xl px-4 py-2.5"
            placeholder="যেমন: BKS9X2KQ7M"
          />
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700">
          ডিপোজিট জমা দিন
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold">🕘 আমার ডিপোজিট ইতিহাস (ডেমো)</h2>
          <div className="mt-2 space-y-2">
            {history.map((d) => (
              <div key={d.id} className="bg-white rounded-xl shadow p-4 text-sm flex justify-between">
                <div>
                  <p className="font-bold">{d.method} — {d.amount} টাকা</p>
                  <p className="text-gray-500">{d.date} • TrxID: {d.trxId}</p>
                </div>
                <span className="text-amber-600 font-bold">{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
