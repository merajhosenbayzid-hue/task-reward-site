"use client";

import { useEffect, useState } from "react";
import { addToList, getList, getUser } from "../../lib/demo";

const METHODS = ["বিকাশ", "নগদ", "রকেট"];

export default function Withdraw() {
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState(METHODS[0]);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setUser(getUser());
    setHistory(getList("withdrawals"));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) {
      alert("সঠিক টাকার পরিমাণ দিন।");
      return;
    }
    if (user && amt > user.balance) {
      alert("উত্তোলনযোগ্য ব্যালেন্সের চেয়ে বেশি টাকা চাওয়া যাবে না।");
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

  if (!user) return <p className="text-center py-10">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🏧 টাকা উত্তোলন</h1>

      <div className="mt-4 bg-white rounded-xl shadow p-6 text-center">
        <p className="text-gray-500 text-sm">উত্তোলনযোগ্য ব্যালেন্স</p>
        <p className="text-3xl font-bold text-emerald-700">{user.balance} টাকা</p>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm text-gray-600">
        প্যাকেজের শর্ত (টাস্ক + রেফার) পূরণ হলে আবেদন করুন। অ্যাডমিন অনুমোদন করলে
        পেমেন্ট পাঠানো হবে।
      </div>

      {done && (
        <div className="mt-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-4 text-center font-bold">
          ✅ উত্তোলনের আবেদন জমা হয়েছে!
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

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold">🕘 উত্তোলন ইতিহাস (ডেমো)</h2>
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
