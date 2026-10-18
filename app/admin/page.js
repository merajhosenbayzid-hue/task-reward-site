"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getList, seedDemoData, getCurrentUser, getUsers, isActive } from "../../lib/demo";

const OWNER_EMAIL = "merajhosenbayzid@gmail.com";

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
  const [users, setUsers] = useState([]);
  const [allowed, setAllowed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cu = getCurrentUser();
    const ok = !!cu && cu.email === OWNER_EMAIL;
    setAllowed(ok);
    if (ok) {
      seedDemoData();
      setDeposits(getList("deposits"));
      setWithdrawals(getList("withdrawals"));
      setUsers(getUsers());
    }
    setLoaded(true);
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

  if (!loaded) return <p className="text-center py-16 text-mist">লোড হচ্ছে...</p>;

  if (!allowed) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="glass rounded-[2.5rem] p-10">
          <p className="text-5xl">🔒</p>
          <h1 className="mt-4 text-2xl font-bold text-white">অ্যাডমিন প্যানেল</h1>
          <p className="text-mist mt-2 text-sm">
            এই পেজটি শুধুমাত্র সাইট মালিকের জন্য সংরক্ষিত।
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block btn-gradient text-white font-bold px-8 py-3 rounded-full hover:opacity-90"
          >
            লগিন করুন
          </Link>
        </div>
      </div>
    );
  }

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

      <h2 className="mt-10 font-bold text-xl text-white">👥 ব্যবহারকারী ({users.length} জন)</h2>
      <div className="mt-2">
        <Table head={["নাম", "ইমেইল", "মোবাইল", "ব্যালেন্স", "রেফারেল কোড", "অবস্থা"]}>
          {users.map((u, i) => (
            <tr key={u.email} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 font-bold text-white">{u.name}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">{u.phone}</td>
              <td className="p-4 text-white">{u.balance} টাকা</td>
              <td className="p-4">{u.referralCode}</td>
              <td className="p-4 font-bold" style={{ color: isActive(u) ? "#2DD4BF" : "#FFB199" }}>
                {isActive(u) ? "🟢 সক্রিয়" : "🔴 নিষ্ক্রিয়"}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td className="p-4 text-center" colSpan={6}>এখনো কোনো ব্যবহারকারী রেজিস্টার করেনি।</td>
            </tr>
          )}
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
