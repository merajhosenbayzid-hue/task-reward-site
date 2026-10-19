"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, adminDeposits, adminDecide, adminUsers,
} from "../../lib/api";

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

const STATUS_BN = { pending: "⏳ যাচাইাধীন", approved: "✅ অনুমোদিত", rejected: "❌ প্রত্যাখ্যাত" };

export default function Admin() {
  const [allowed, setAllowed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const cu = await getCurrentUser();
      const ok = !!cu && cu.email === OWNER_EMAIL;
      if (!alive) return;
      setAllowed(ok);
      if (ok) await refresh();
      setLoaded(true);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    try {
      const [p, h, u] = await Promise.all([
        adminDeposits("pending"),
        adminDeposits("all"),
        adminUsers(),
      ]);
      setPending(p);
      setHistory(h.filter((d) => d.status !== "pending"));
      setUsers(u);
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  }

  async function decide(requestId, decision) {
    if (decision === "reject" && !rejectReason.trim()) {
      setMsg("❌ প্রত্যাখ্যানের কারণ লিখুন।");
      return;
    }
    setBusyId(requestId);
    setMsg("");
    try {
      await adminDecide(requestId, decision, rejectReason);
      setMsg(decision === "approve" ? "✅ অনুমোদিত — ব্যালেন্সে টাকা যোগ হয়েছে।" : "✅ রিকোয়েস্ট প্রত্যাখ্যাত হয়েছে।");
      setRejectId(null);
      setRejectReason("");
      await refresh();
    } catch (e) {
      setMsg("❌ " + e.message);
    }
    setBusyId(null);
  }

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

      {msg && (
        <p className="mt-4 text-center text-sm font-bold text-white glass rounded-full px-5 py-3 max-w-xl mx-auto">
          {msg}
        </p>
      )}

      {/* PENDING DEPOSIT REQUESTS */}
      <h2 className="mt-10 font-bold text-xl text-white">
        ⏳ Pending Deposit Requests ({pending.length}টি)
      </h2>
      {pending.length === 0 ? (
        <p className="mt-2 text-mist text-sm glass rounded-3xl p-5 text-center">
          কোনো যাচাইাধীন রিকোয়েস্ট নেই। 🎉
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {pending.map((d) => (
            <div key={d.requestId} className="glass rounded-[1.5rem] p-6">
              <div className="flex flex-wrap justify-between gap-3 items-start">
                <div>
                  <p className="font-bold text-white text-lg">{d.amount} টাকা <span className="text-sm text-faint">({d.method})</span></p>
                  <p className="text-sm text-mist mt-1">👤 {d.name} ({d.email})</p>
                  <p className="text-sm text-mist">📱 প্রেরক: {d.senderNo}</p>
                  <p className="text-sm text-mist">🔑 TrxID: <b className="text-white">{d.trxId}</b></p>
                  <p className="text-xs text-faint mt-1">🕘 {d.createdAt} • ID: {d.requestId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => decide(d.requestId, "approve")}
                    disabled={busyId === d.requestId}
                    className="bg-aqua/20 border border-aqua/50 text-aqua font-bold px-5 py-2.5 rounded-full hover:bg-aqua/30 disabled:opacity-50 text-sm"
                  >
                    {busyId === d.requestId ? "…" : "✅ Approve"}
                  </button>
                  <button
                    onClick={() => setRejectId(rejectId === d.requestId ? null : d.requestId)}
                    disabled={busyId === d.requestId}
                    className="bg-peach/10 border border-peach/40 text-peach font-bold px-5 py-2.5 rounded-full hover:bg-peach/20 disabled:opacity-50 text-sm"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
              {rejectId === d.requestId && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="প্রত্যাখ্যানের কারণ লিখুন…"
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-faint focus:outline-none focus:border-rose"
                  />
                  <button
                    onClick={() => decide(d.requestId, "reject")}
                    disabled={busyId === d.requestId}
                    className="btn-gradient text-white text-sm font-bold px-5 rounded-full disabled:opacity-50"
                  >
                    নিশ্চিত করুন
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-bold text-xl text-white">📜 ডিপোজিট হিস্ট্রি</h2>
      <div className="mt-2">
        <Table head={["ইউজার", "টাকা", "মাধ্যম", "TrxID", "অবস্থা", "সিদ্ধান্ত"]}>
          {history.map((d, i) => (
            <tr key={d.requestId} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 text-white">{d.name}<br /><span className="text-xs text-faint">{d.email}</span></td>
              <td className="p-4 font-bold text-white">{d.amount} টাকা</td>
              <td className="p-4">{d.method}</td>
              <td className="p-4">{d.trxId}</td>
              <td className="p-4">{STATUS_BN[d.status]}</td>
              <td className="p-4 text-xs">{d.decidedAt || "—"}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr><td className="p-4 text-center" colSpan={6}>কোনো হিস্ট্রি নেই।</td></tr>
          )}
        </Table>
      </div>

      <h2 className="mt-10 font-bold text-xl text-white">👥 ব্যবহারকারী ({users.length} জন)</h2>
      <div className="mt-2">
        <Table head={["নাম", "ইমেইল", "মোবাইল", "ব্যালেন্স", "রেফারেল কোড", "অবস্থা"]}>
          {users.map((u, i) => (
            <tr key={u.email} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 font-bold text-white">{u.name}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">{u.phone || "—"}</td>
              <td className="p-4 text-white">{u.balance} টাকা</td>
              <td className="p-4">{u.referralCode}</td>
              <td className="p-4 font-bold" style={{ color: u.active ? "#2DD4BF" : "#FFB199" }}>
                {u.active ? "🟢 সক্রিয়" : "🔴 নিষ্ক্রিয়"}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td className="p-4 text-center" colSpan={6}>এখনো কোনো ব্যবহারকারী রেজিস্টার করেনি।</td></tr>
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
