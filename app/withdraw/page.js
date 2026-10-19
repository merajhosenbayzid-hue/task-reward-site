"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, getReferralInfo, getWithdrawEligibility, isActive, daysLeft,
} from "../../lib/api";
import { IconBank, IconClipboard, IconCheckBadge, IconXBadge, IconSparkles, IconAlert, IconClock } from "../../components/icons";

const METHODS = ["bKash", "Nagad", "Rocket"];

const inputCls =
  "mt-1 w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 focus:border-rose focus:outline-none text-white placeholder:text-faint";

export default function Withdraw() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [method, setMethod] = useState(METHODS[0]);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cu = await getCurrentUser();
      if (!alive) return;
      setUser(cu);
      if (cu) {
        try {
          const ri = await getReferralInfo();
          if (alive) setStats({ total: ri.total, active: ri.active });
        } catch {}
      }
      if (typeof window !== "undefined") {
        try {
          setHistory(JSON.parse(localStorage.getItem("tr_withdrawals") || "[]"));
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
          <p className="text-lg font-bold text-white">Log in to withdraw</p>
          <Link href="/login" className="mt-4 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const elig = getWithdrawEligibility(user, stats);

  const submit = (e) => {
    e.preventDefault();
    if (!elig.eligible) {
      alert("Requirements not met — see the list below.");
      return;
    }
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    if (amt > user.balance) {
      alert("You can't request more than your balance.");
      return;
    }
    if (!account) {
      alert("Enter your account number.");
      return;
    }
    const item = {
      id: Date.now(),
      method, account, amount: amt,
      date: new Date().toLocaleString("en-US"),
      status: "Pending",
    };
    const list = [item, ...history];
    setHistory(list);
    try {
      localStorage.setItem("tr_withdrawals", JSON.stringify(list));
    } catch {}
    setDone(true);
    setAccount("");
    setAmount("");
  };

  const checks = [
    {
      label: "Your account is active",
      ok: isActive(user),
      hint: isActive(user) ? `${daysLeft(user)} days left` : "Activate with a deposit",
    },
    {
      label: "Eligible referrals (at least 10)",
      ok: stats.active >= 10,
      hint: `${stats.active} active referrals`,
    },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2"><IconBank size={30} className="icon-3d" /> Withdraw Money</h1>

      <div className="mt-6 glass rounded-[2rem] p-8 text-center">
        <p className="text-faint text-sm">Withdrawable balance</p>
        <p className="text-4xl font-bold text-white mt-1">৳{user.balance}</p>
      </div>

      <div className="mt-5 glass rounded-[2rem] p-7">
        <h2 className="font-bold text-lg text-white flex items-center gap-2"><IconClipboard size={20} className="icon-3d" /> Withdrawal requirements</h2>
        <div className="mt-4 space-y-3">
          {checks.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-3xl ${c.ok ? "bg-aqua/10 border border-aqua/30" : "bg-white/5"}`}>
              <span className="shrink-0 mt-0.5">{c.ok ? <IconCheckBadge size={26} className="icon-3d" /> : <IconXBadge size={26} className="icon-3d" />}</span>
              <div>
                <p className="font-bold text-white text-sm">{c.label}</p>
                <p className="text-mist text-xs">{c.hint}</p>
              </div>
            </div>
          ))}
        </div>
        {elig.eligible ? (
          <p className="mt-4 bg-aqua/10 border border-aqua/30 rounded-3xl px-5 py-4 font-bold text-aqua text-sm">
            <span className="inline-flex items-center gap-2"><IconSparkles size={16} className="icon-3d" /> Congratulations! You&apos;re eligible to withdraw.</span>
          </p>
        ) : (
          <div className="mt-4 bg-peach/10 border border-peach/30 rounded-3xl px-5 py-4 text-sm">
            {elig.reasons.map((r, i) => (
              <p key={i} className="text-peach mt-1 flex items-center gap-1.5"><IconAlert size={14} className="icon-3d" /> {r}</p>
            ))}
            <div className="mt-3 flex gap-2 flex-wrap">
              <Link href="/deposit" className="btn-gradient text-white text-sm font-bold px-4 py-2.5 rounded-full">Deposit</Link>
              <Link href="/referral" className="bg-white text-night text-sm font-bold px-4 py-2.5 rounded-full">Refer</Link>
            </div>
          </div>
        )}
      </div>

      {done && (
        <div className="mt-5 border border-aqua/40 bg-aqua/10 rounded-[2rem] p-5 text-center font-bold text-aqua">
          <span className="inline-flex items-center gap-2"><IconCheckBadge size={18} className="icon-3d" /> Withdrawal request submitted! You&apos;ll be paid after admin approval.</span>
        </div>
      )}

      {elig.eligible && (
        <form onSubmit={submit} className="mt-5 glass rounded-[2rem] p-7 space-y-5">
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
            <label className="font-bold text-sm text-white">Your {method} number</label>
            <input value={account} onChange={(e) => setAccount(e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">Amount</label>
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} placeholder="e.g. 100" />
          </div>
          <button type="submit" className="w-full btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 shadow-lg shadow-rose/25">
            Request withdrawal
          </button>
        </form>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-white flex items-center gap-2"><IconClock size={20} className="icon-3d" /> Withdrawal history</h2>
          <div className="mt-3 space-y-3">
            {history.map((w) => (
              <div key={w.id} className="glass rounded-3xl p-5 text-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{w.method} — ৳{w.amount}</p>
                  <p className="text-faint text-xs">{w.date}</p>
                </div>
                <span className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full">{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
