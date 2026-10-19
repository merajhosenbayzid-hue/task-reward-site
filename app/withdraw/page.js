"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, getReferralInfo, getWithdrawEligibility, isActive, daysLeft,
  requestWithdrawal, myWithdrawals,
} from "../../lib/api";
import { IconBank, IconClipboard, IconCheckBadge, IconXBadge, IconSparkles, IconAlert, IconClock } from "../../components/icons";
import { useCurrency, formatMoney } from "../../lib/currency";

const METHODS = ["bKash", "Nagad", "Rocket"];

const inputCls =
  "mt-1 w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/30 focus:outline-none text-white placeholder:text-faint";

export default function Withdraw() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currency] = useCurrency();
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [method, setMethod] = useState(METHODS[0]);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");

  async function loadHistory() {
    try {
      setHistory(await myWithdrawals());
    } catch {}
  }

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
        try {
          const h = await myWithdrawals();
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
        <div className="glass card-warm rounded-[2.5rem] p-10">
          <p className="text-lg font-bold text-white">Log in to withdraw</p>
          <Link href="/login" className="mt-4 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const elig = getWithdrawEligibility(user, stats);

  const submit = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!elig.eligible) {
      setFormErr("Requirements not met — see the list below.");
      return;
    }
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) {
      setFormErr("Enter a valid amount.");
      return;
    }
    if (amt > user.balance) {
      setFormErr("You can't request more than your balance.");
      return;
    }
    if (!account.trim()) {
      setFormErr("Enter your account number.");
      return;
    }
    setSubmitting(true);
    try {
      await requestWithdrawal({ amount: amt, method, accountNo: account.trim() });
      setDone(true);
      setAccount("");
      setAmount("");
      await loadHistory();
      const cu = await getCurrentUser();
      if (cu) setUser(cu);
    } catch (err) {
      setFormErr(err.message || "Request failed — try again.");
    } finally {
      setSubmitting(false);
    }
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
      <div className="relative"><div className="ambient-glow w-[26rem] h-[14rem] -top-20 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <h1 className="font-display text-4xl font-extrabold text-center page-title flex items-center justify-center gap-3 relative"><IconBank size={34} className="icon-3d" /> Withdraw Money</h1></div>

      <div className="mt-6 glass card-warm rounded-[2rem] p-8 text-center relative">
        <p className="text-faint text-sm">Withdrawable balance</p>
        <p className="text-4xl font-bold text-white mt-1">{formatMoney(user.balance, currency)}</p>
      </div>

      <div className="mt-5 glass card-warm rounded-[2rem] p-7">
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
        <form onSubmit={submit} className="mt-5 glass card-warm rounded-[2rem] p-7 space-y-5 relative">
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
          {formErr && (
            <p className="bg-rose/10 border border-rose/30 rounded-2xl px-4 py-3 text-sm font-bold text-rose flex items-center gap-2">
              <IconAlert size={14} className="icon-3d" /> {formErr}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gradient animate-cta-pulse text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Request withdrawal"}
          </button>
        </form>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-white flex items-center gap-2"><IconClock size={20} className="icon-3d" /> Withdrawal history</h2>
          <div className="mt-3 space-y-3">
            {history.map((w) => {
              const s = String(w.status || "").toLowerCase();
              return (
                <div key={w.requestId || w.id} className="glass card-warm rounded-3xl p-5 text-sm">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="font-bold text-white">{w.method} — {formatMoney(w.amount, currency)}</p>
                      <p className="text-faint text-xs">
                        {w.requestId}{w.createdAt ? ` • ${new Date(w.createdAt).toLocaleString("en-US")}` : ""}
                      </p>
                    </div>
                    {s === "approved" ? (
                      <span className="inline-flex items-center gap-1 bg-aqua/15 text-aqua text-xs font-bold px-3 py-1.5 rounded-full"><IconCheckBadge size={14} className="icon-3d" /> Approved</span>
                    ) : s === "rejected" ? (
                      <span className="inline-flex items-center gap-1 bg-rose/15 text-rose text-xs font-bold px-3 py-1.5 rounded-full"><IconXBadge size={14} className="icon-3d" /> Rejected</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-peach/15 text-peach text-xs font-bold px-3 py-1.5 rounded-full"><IconClock size={14} className="icon-3d" /> Pending</span>
                    )}
                  </div>
                  {s === "rejected" && w.rejectReason && (
                    <p className="mt-2 text-xs text-rose">Reason: {w.rejectReason}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
