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
      <div className="max-w-md mx-auto text-center py-10">
        <p className="text-lg font-bold">ডিপোজিট করতে লগিন করুন</p>
        <Link href="/login" className="mt-3 inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl">
          লগিন করুন
        </Link>
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
      <h1 className="text-2xl font-bold text-center">💵 ডিপোজিট ও অ্যাক্টিভেশন</h1>

      <div className={`mt-4 rounded-xl p-4 text-center font-bold ${active ? "bg-emerald-100 text-emerald-800 border border-emerald-400" : "bg-red-50 text-red-700 border border-red-300"}`}>
        {active ? (
          <>🟢 অ্যাকাউন্ট অ্যাক্টিভ আছে — {daysLeft(user)} দিন বাকি</>
        ) : (
          <>🔴 অ্যাকাউন্ট ইনঅ্যাক্টিভ — অ্যাক্টিভ করতে ডিপোজিট করুন</>
        )}
      </div>

      <div className="mt-4 bg-white rounded-xl shadow p-6 text-center border-t-4 border-emerald-500">
        <p className="text-4xl font-bold text-emerald-700">{ACTIVATION_AMOUNT} টাকা</p>
        <p className="mt-1 text-gray-600">ডিপোজিট করলে অ্যাকাউন্ট <b>{ACTIVE_DAYS} দিনের</b> জন্য অ্যাক্টিভ হবে</p>
        <ul className="mt-3 text-sm text-left text-gray-600 space-y-1">
          <li>✅ অ্যাক্টিভ থাকলে রেফার করতে পারবেন</li>
          <li>✅ ব্যালেন্স ও রেফারেল তথ্য দেখা যাবে</li>
          <li>✅ উত্তোলনের যোগ্যতা তৈরি হবে</li>
        </ul>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm">
        <p className="font-bold">📝 ম্যানুয়াল যাচাই</p>
        <p className="mt-1 text-gray-600">
          টাকা পাঠানোর পর নিচের ফর্মে তথ্য দিন। অ্যাডমিন যাচাই করে অ্যাকাউন্ট অ্যাক্টিভ করবেন।
        </p>
      </div>

      {done && (
        <div className="mt-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-4 text-center font-bold">
          ✅ আবেদন জমা হয়েছে! যাচাইয়ের পর {ACTIVE_DAYS} দিনের জন্য অ্যাক্টিভ হবে।
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
          {ACTIVATION_AMOUNT} টাকা ডিপোজিট জমা দিন
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold">🕘 আমার ডিপোজিট ইতিহাস</h2>
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
