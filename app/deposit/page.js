"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, requestDeposit, myDeposits, isActive, daysLeft,
} from "../../lib/api";
import { StatusDot, IconBanknote, IconCheckBadge, IconXBadge, IconBulb, IconSend, IconEdit, IconClock } from "../../components/icons";
import { useCurrency, formatMoney } from "../../lib/currency";

const METHODS = ["bKash", "Nagad", "Rocket"];

const inputCls =
  "mt-1 w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 focus:border-rose focus:outline-none text-white placeholder:text-faint";

function StatusLabel({ status }) {
  const cls = "inline-flex items-center gap-1";
  if (status === "pending") return <span className={cls}><IconClock size={14} className="icon-3d" /> Pending</span>;
  if (status === "approved") return <span className={cls}><IconCheckBadge size={14} className="icon-3d" /> Approved</span>;
  if (status === "rejected") return <span className={cls}><IconXBadge size={14} className="icon-3d" /> Rejected</span>;
  return <span>{status}</span>;
}

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currency] = useCurrency();
  const [method, setMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState("100");
  const [sender, setSender] = useState("");
  const [trxId, setTrxId] = useState("");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cu = await getCurrentUser();
      if (!alive) return;
      setUser(cu);
      if (cu) {
        try {
          const h = await myDeposits();
          if (alive) setHistory(h);
        } catch {}
      }
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  if (!loaded) return <p className="text-center py-16 text-mist">Loading...</p>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="glass rounded-[2.5rem] p-10">
          <p className="text-lg font-bold text-white">Log in to deposit</p>
          <Link href="/login" className="mt-4 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const active = isActive(user);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setDone("");
    setBusy(true);
    try {
      const r = await requestDeposit({ amount, method, senderNo: sender, trxId });
      setDone(`${r.message} (Request ID: ${r.requestId})`);
      setSender("");
      setTrxId("");
      const h = await myDeposits();
      setHistory(h);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2"><IconBanknote size={30} className="icon-3d" /> Deposit</h1>
      <p className="text-center text-mist mt-2 text-sm">
        Send the money, then submit the transaction ID — your balance will be credited after admin approval.
      </p>

      <div className={`mt-6 rounded-[2rem] p-5 text-center font-bold border ${
        active ? "border-aqua/40 text-aqua bg-aqua/5" : "border-peach/40 text-peach bg-peach/5"
      }`}>
        {active ? (
          <span className="inline-flex items-center gap-2"><StatusDot active size={13} /> Account active — {daysLeft(user)} days left</span>
        ) : (
          <span className="inline-flex items-center gap-2"><StatusDot size={13} /> Account inactive — an approved deposit of {formatMoney(100, currency)}+ activates it for 7 days</span>
        )}
      </div>

      {done && (
        <div className="mt-5 border border-aqua/40 bg-aqua/10 rounded-[2rem] p-5 text-center font-bold text-aqua text-sm">
          <span className="inline-flex items-center gap-2"><IconCheckBadge size={16} className="icon-3d" /> {done}</span>
        </div>
      )}
      {error && (
        <div className="mt-5 bg-peach/15 border border-peach/40 rounded-[2rem] p-5 text-center font-bold text-peach text-sm">
          <span className="inline-flex items-center gap-2"><IconXBadge size={16} className="icon-3d" /> {error}</span>
        </div>
      )}

      <form onSubmit={submit} className="mt-5 glass rounded-[2rem] p-7 space-y-5">
        <div>
          <label className="font-bold text-sm text-white">Amount</label>
          <input
            type="number" min="1" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputCls} placeholder="e.g. 100"
          />
          <p className="text-xs text-faint mt-1 flex items-center gap-1"><IconBulb size={14} className="icon-3d" /> {formatMoney(100, currency)} or more activates your account for 7 days.</p>
        </div>
        <div>
          <label className="font-bold text-sm text-white">Payment method</label>
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
          <label className="font-bold text-sm text-white">The number you sent money from</label>
          <input value={sender} onChange={(e) => setSender(e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <label className="font-bold text-sm text-white">Transaction ID (TrxID)</label>
          <input value={trxId} onChange={(e) => setTrxId(e.target.value)} className={inputCls} placeholder="e.g. BKS9X2KQ7M" />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg shadow-rose/25"
        >
          {busy ? "Sending…" : <span className="inline-flex items-center gap-2"><IconSend size={18} className="icon-3d icon-interactive" /> Send deposit request</span>}
        </button>
        <p className="text-xs text-faint text-center">
          <span className="inline-flex items-center gap-1"><IconEdit size={14} className="icon-3d" /> Admin will verify the payment and approve — then your balance will be credited.</span>
        </p>
      </form>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-white flex items-center gap-2"><IconClock size={20} className="icon-3d" /> My deposit requests</h2>
          <div className="mt-3 space-y-3">
            {history.map((d) => (
              <div key={d.requestId} className="glass rounded-3xl p-5 text-sm">
                <div className="flex justify-between items-center gap-2">
                  <p className="font-bold text-white">{d.method} — {formatMoney(d.amount, currency)}</p>
                  <span className="text-xs font-bold whitespace-nowrap">
                    <StatusLabel status={d.status} />
                  </span>
                </div>
                <p className="text-faint text-xs mt-1">
                  {d.createdAt} • TrxID: {d.trxId} • ID: {d.requestId}
                </p>
                {d.status === "rejected" && d.rejectReason && (
                  <p className="text-peach text-xs mt-2">Reason: {d.rejectReason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
