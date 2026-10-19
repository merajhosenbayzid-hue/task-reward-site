"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, adminDeposits, adminDecide, adminUsers,
} from "../../lib/api";
import { StatusDot, IconGear, IconLock, IconClock, IconSparkles, IconUser, IconPhone, IconKey, IconCheckBadge, IconXBadge, IconReceipt, IconUsers, IconClipboard } from "../../components/icons";

const OWNER_EMAIL = "merajhosenbayzid@gmail.com";

const DEMO_TASKS = [
  { name: "Task 1 — 500 clicks", reward: "৳12", done: 34 },
  { name: "Task 2 — 600 clicks", reward: "৳14", done: 21 },
  { name: "Task 3 — 700 clicks", reward: "৳16", done: 12 },
  { name: "Task 4 — 800 clicks", reward: "৳20", done: 8 },
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

function StatusLabel({ status }) {
  const cls = "inline-flex items-center gap-1";
  if (status === "pending") return <span className={cls}><IconClock size={14} className="icon-3d" /> Pending</span>;
  if (status === "approved") return <span className={cls}><IconCheckBadge size={14} className="icon-3d" /> Approved</span>;
  if (status === "rejected") return <span className={cls}><IconXBadge size={14} className="icon-3d" /> Rejected</span>;
  return <span>{status}</span>;
}

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
  const [msgOk, setMsgOk] = useState(true);

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
      setMsg(e.message);
      setMsgOk(false);
    }
  }

  async function decide(requestId, decision) {
    if (decision === "reject" && !rejectReason.trim()) {
      setMsg("Please write a rejection reason.");
      setMsgOk(false);
      return;
    }
    setBusyId(requestId);
    setMsg("");
    try {
      await adminDecide(requestId, decision, rejectReason);
      setMsg(decision === "approve" ? "Approved — balance has been credited." : "Request has been rejected.");
      setMsgOk(true);
      setRejectId(null);
      setRejectReason("");
      await refresh();
    } catch (e) {
      setMsg(e.message);
      setMsgOk(false);
    }
    setBusyId(null);
  }

  if (!loaded) return <p className="text-center py-16 text-mist">Loading...</p>;

  if (!allowed) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="glass rounded-[2.5rem] p-10">
          <p className="flex justify-center"><IconLock size={48} className="icon-3d" /></p>
          <h1 className="mt-4 text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-mist mt-2 text-sm">
            This page is reserved for the site owner only.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block btn-gradient text-white font-bold px-8 py-3 rounded-full hover:opacity-90"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2"><IconGear size={30} className="icon-3d" /> Admin Panel</h1>
      <p className="text-center text-mist mt-1">Manage everything from here</p>

      {msg && (
        <p className="mt-4 text-center text-sm font-bold text-white glass rounded-full px-5 py-3 max-w-xl mx-auto flex items-center justify-center gap-2">
          {msgOk ? <IconCheckBadge size={16} className="icon-3d" /> : <IconXBadge size={16} className="icon-3d" />}
          {msg}
        </p>
      )}

      {/* PENDING DEPOSIT REQUESTS */}
      <h2 className="mt-10 font-bold text-xl text-white flex items-center gap-2">
        <IconClock size={22} className="icon-3d" /> Pending Deposit Requests ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="mt-2 text-mist text-sm glass rounded-3xl p-5 text-center">
          <span className="inline-flex items-center gap-2">No pending requests. <IconSparkles size={16} className="icon-3d" /></span>
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {pending.map((d) => (
            <div key={d.requestId} className="glass rounded-[1.5rem] p-6">
              <div className="flex flex-wrap justify-between gap-3 items-start">
                <div>
                  <p className="font-bold text-white text-lg">৳{d.amount} <span className="text-sm text-faint">({d.method})</span></p>
                  <p className="text-sm text-mist mt-1 flex items-center gap-1.5"><IconUser size={14} className="icon-3d" /> {d.name} ({d.email})</p>
                  <p className="text-sm text-mist flex items-center gap-1.5"><IconPhone size={14} className="icon-3d" /> Sender: {d.senderNo}</p>
                  <p className="text-sm text-mist flex items-center gap-1.5"><IconKey size={14} className="icon-3d" /> TrxID: <b className="text-white">{d.trxId}</b></p>
                  <p className="text-xs text-faint mt-1 flex items-center gap-1.5"><IconClock size={12} className="icon-3d" /> {d.createdAt} • ID: {d.requestId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => decide(d.requestId, "approve")}
                    disabled={busyId === d.requestId}
                    className="bg-aqua/20 border border-aqua/50 text-aqua font-bold px-5 py-2.5 rounded-full hover:bg-aqua/30 disabled:opacity-50 text-sm"
                  >
                    {busyId === d.requestId ? "…" : <span className="inline-flex items-center gap-1.5"><IconCheckBadge size={16} className="icon-3d icon-interactive" /> Approve</span>}
                  </button>
                  <button
                    onClick={() => setRejectId(rejectId === d.requestId ? null : d.requestId)}
                    disabled={busyId === d.requestId}
                    className="bg-peach/10 border border-peach/40 text-peach font-bold px-5 py-2.5 rounded-full hover:bg-peach/20 disabled:opacity-50 text-sm"
                  >
                    <span className="inline-flex items-center gap-1.5"><IconXBadge size={16} className="icon-3d icon-interactive" /> Reject</span>
                  </button>
                </div>
              </div>
              {rejectId === d.requestId && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Write the rejection reason…"
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-faint focus:outline-none focus:border-rose"
                  />
                  <button
                    onClick={() => decide(d.requestId, "reject")}
                    disabled={busyId === d.requestId}
                    className="btn-gradient text-white text-sm font-bold px-5 rounded-full disabled:opacity-50"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-bold text-xl text-white flex items-center gap-2"><IconReceipt size={22} className="icon-3d" /> Deposit history</h2>
      <div className="mt-2">
        <Table head={["User", "Amount", "Method", "TrxID", "Status", "Decided"]}>
          {history.map((d, i) => (
            <tr key={d.requestId} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 text-white">{d.name}<br /><span className="text-xs text-faint">{d.email}</span></td>
              <td className="p-4 font-bold text-white">৳{d.amount}</td>
              <td className="p-4">{d.method}</td>
              <td className="p-4">{d.trxId}</td>
              <td className="p-4"><StatusLabel status={d.status} /></td>
              <td className="p-4 text-xs">{d.decidedAt || "—"}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr><td className="p-4 text-center" colSpan={6}>No history yet.</td></tr>
          )}
        </Table>
      </div>

      <h2 className="mt-10 font-bold text-xl text-white flex items-center gap-2"><IconUsers size={22} className="icon-3d" /> Users ({users.length})</h2>
      <div className="mt-2">
        <Table head={["Name", "Email", "Mobile", "Balance", "Referral Code", "Status"]}>
          {users.map((u, i) => (
            <tr key={u.email} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 font-bold text-white">{u.name}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">{u.phone || "—"}</td>
              <td className="p-4 text-white">৳{u.balance}</td>
              <td className="p-4">{u.referralCode}</td>
              <td className="p-4 font-bold" style={{ color: u.active ? "#2DD4BF" : "#FFB199" }}>
                {u.active ? <span className="inline-flex items-center gap-1.5"><StatusDot active size={11} /> Active</span> : <span className="inline-flex items-center gap-1.5"><StatusDot size={11} /> Inactive</span>}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td className="p-4 text-center" colSpan={6}>No users have registered yet.</td></tr>
          )}
        </Table>
      </div>

      <h2 className="mt-10 font-bold text-xl text-white flex items-center gap-2"><IconClipboard size={22} className="icon-3d" /> Tasks</h2>
      <div className="mt-2">
        <Table head={["Task", "Reward", "Completed"]}>
          {DEMO_TASKS.map((t, i) => (
            <tr key={t.name} className={i % 2 ? "bg-white/5" : ""}>
              <td className="p-4 font-bold text-white">{t.name}</td>
              <td className="p-4">{t.reward}</td>
              <td className="p-4">{t.done}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
