"use client";

import { useEffect, useState } from "react";
import { getList, seedDemoData } from "../../lib/demo";

const DEMO_USERS = [
  { name: "রহিম উদ্দিন", package: "প্যাকেজ ২", balance: "৫৫ টাকা", referrals: 4, status: "সক্রিয়" },
  { name: "করিম শেখ", package: "প্যাকেজ ৩", balance: "১১০ টাকা", referrals: 11, status: "সক্রিয়" },
  { name: "সালমা বেগম", package: "প্যাকেজ ১", balance: "১১ টাকা", referrals: 1, status: "সক্রিয়" },
];

const DEMO_TASKS = [
  { name: "টাস্ক ১ — ৫০০ ক্লিক", reward: "১২ টাকা", done: 34 },
  { name: "টাস্ক ২ — ৬০০ ক্লিক", reward: "১৪ টাকা", done: 21 },
  { name: "টাস্ক ৩ — ৭০০ ক্লিক", reward: "১৬ টাকা", done: 12 },
  { name: "টাস্ক ৪ — ৮০০ ক্লিক", reward: "২০ টাকা", done: 8 },
];

function Table({ head, children }) {
  return (
    <div className="overflow-x-auto rounded-[1.5rem] glass">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="bg-white/10 text-white">
            {head.map((h) => (
              <th key={h} className="p-4 text-left font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-mist">{children}</tbody>
      </table>
    </div>
  );
}

export default function Admin() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    seedDemoData();
    setDeposits(getList("deposits"));
    setWithdrawals(getList("withdrawals"));
  }, []);

  const approve = (list, setList, id) => {
    const updated = list.map((x) => (x.id === id ? { ...x, status: "অনুমোদিত" } : x));
    setList(updated);
    if (typeof window !== "undefined") {
      // persist demo change
      const key = list === deposits ? "tr_deposits" : "tr_withdrawals";
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-white">🛠️ অ্যাডমিন প্যানেল</h1>
      <p className="text-center text-mist mt-1">সব কার্যক্রম এখান থেকে পরিচালনা করুন</p>

      <h2 className="mt-10 font-bold text-xl text-white">💵 ডিপোজিট যাচাই</h2>
      <div className="mt-2">
        <Table head={["ব্যবহারকারী", "মাধ্যম", "টাকা", "TrxID", "অবস্থা", ""]}>
          {deposits.map((d, i) => (
            <tr key={d.id} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 text-white">{d.user || "ব্যবহারকারী"}</td>
              <td className="p-4">{d.method}</td>
              <td className="p-4 font-bold text-white">{d.amount} টাকা</td>
              <td className="p-4">{d.trxId}</td>
              <td className="p-4">{d.status}</td>
              <td className="p-4">
                {d.status === "যাচাইাধীন" && (
                  <button
                    onClick={() => approve(deposits, setDeposits, d.id)}
                    className="btn-gradient text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"
                  >
                    অনুমোদন
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <h2 className="mt-10 font-bold text-xl text-white">🏧 উত্তোলন অনুমোদন</h2>
      <div className="mt-2">
        <Table head={["ব্যবহারকারী", "মাধ্যম", "টাকা", "তারিখ", "অবস্থা", ""]}>
          {withdrawals.map((w, i) => (
            <tr key={w.id} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 text-white">{w.user || "ব্যবহারকারী"}</td>
              <td className="p-4">{w.method}</td>
              <td className="p-4 font-bold text-white">{w.amount} টাকা</td>
              <td className="p-4">{w.date}</td>
              <td className="p-4">{w.status}</td>
              <td className="p-4">
                {w.status === "যাচাইাধীন" && (
                  <button
                    onClick={() => approve(withdrawals, setWithdrawals, w.id)}
                    className="btn-gradient text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"
                  >
                    অনুমোদন
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <h2 className="mt-10 font-bold text-xl text-white">👥 ব্যবহারকারী</h2>
      <div className="mt-2">
        <Table head={["নাম", "প্যাকেজ", "ব্যালেন্স", "রেফার", "অবস্থা"]}>
          {DEMO_USERS.map((u, i) => (
            <tr key={u.name} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 font-bold text-white">{u.name}</td>
              <td className="p-4">{u.package}</td>
              <td className="p-4">{u.balance}</td>
              <td className="p-4">{u.referrals} জন</td>
              <td className="p-4 text-aqua font-bold">{u.status}</td>
            </tr>
          ))}
        </Table>
      </div>

      <h2 className="mt-10 font-bold text-xl text-white">📋 টাস্কসমূহ</h2>
      <div className="mt-2">
        <Table head={["টাস্ক", "পুরস্কার", "সম্পন্ন"]}>
          {DEMO_TASKS.map((t, i) => (
            <tr key={t.name} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 font-bold text-white">{t.name}</td>
              <td className="p-4">{t.reward}</td>
              <td className="p-4">{t.done} জন</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
