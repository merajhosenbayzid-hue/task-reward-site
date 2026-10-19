"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser, isActive, daysLeft, getReferralInfo,
  getWithdrawEligibility, myDeposits,
} from "../../lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cu = await getCurrentUser();
      if (!alive) return;
      if (cu) {
        setUser(cu);
        setAuthed(true);
        try {
          const ri = await getReferralInfo();
          if (alive) setStats({ total: ri.total, active: ri.active });
        } catch {}
        try {
          const deps = await myDeposits();
          if (alive) {
            // notify about recently decided deposits (approved/rejected)
            setNotices(deps.filter((d) => d.status !== "pending").slice(0, 3));
          }
        } catch {}
      }
      if (alive) setLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  if (!loaded) return <p className="text-center py-16 text-mist">Loading...</p>;

  if (!authed)
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="glass rounded-[2.5rem] p-10">
          <p className="text-5xl">👤</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-mist mt-2">Log in to view your dashboard.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/login" className="bg-white text-night font-bold px-6 py-3 rounded-full hover:bg-mist">
              Log in
            </Link>
            <Link href="/signup" className="btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );

  const active = isActive(user);
  const elig = getWithdrawEligibility(user, stats);

  const cards = [
    { icon: "💰", label: "Balance", value: `৳${user.balance}`, g: "from-peach to-rose" },
    { icon: "👥", label: "Total referrals", value: `${stats.total}`, g: "from-aqua to-grape" },
    { icon: "🟢", label: "Active referrals", value: `${stats.active}`, g: "from-grape to-rose" },
    { icon: "✅", label: "Completed tasks", value: "0", g: "from-rose to-sun" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <p className="text-mist mt-1">Welcome, {user.name}!</p>

      {/* deposit decision notifications */}
      {notices.map((n) => (
        <div
          key={n.requestId}
          className={`mt-4 rounded-[2rem] p-5 font-bold border ${
            n.status === "approved"
              ? "border-aqua/40 bg-aqua/10 text-aqua"
              : "border-peach/40 bg-peach/10 text-peach"
          }`}
        >
          {n.status === "approved" ? (
            <>🎉 Your deposit of ৳{n.amount} was approved! It&apos;s been added to your balance.</>
          ) : (
            <>⚠️ Your deposit of ৳{n.amount} was rejected. Reason: {n.rejectReason || "—"}</>
          )}
        </div>
      ))}

      {/* balance hero card */}
      <div className="mt-6 relative overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 btn-gradient opacity-90" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-blob" />
        <div className="relative p-8 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-bold">Total balance</p>
            <p className="text-5xl font-bold text-white mt-1">৳{user.balance}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-bold text-white">
              {active ? "🟢 Active" : "🔴 Inactive"}
              {active && <span>• {daysLeft(user)} days left</span>}
            </div>
          </div>
          <div className="text-7xl opacity-30 floaty">💰</div>
        </div>
      </div>

      {!active && (
        <Link
          href="/deposit"
          className="mt-4 block text-center bg-white/10 border border-peach/40 rounded-2xl px-5 py-4 font-bold text-peach hover:bg-white/15"
        >
          🔴 Account inactive — deposit to activate (৳100+ = 7 days) →
        </Link>
      )}

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-[2rem] p-6 text-center hover:bg-white/[0.08] transition">
            <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${c.g} flex items-center justify-center text-2xl`}>
              {c.icon}
            </div>
            <p className="mt-3 text-xs text-faint">{c.label}</p>
            <p className="mt-1 text-xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-5 glass rounded-[2rem] p-6 ${elig.eligible ? "border-aqua/40" : ""}`}>
        {elig.eligible ? (
          <p className="font-bold text-white">
            🎉 You&apos;re eligible to withdraw!{" "}
            <Link href="/withdraw" className="text-peach underline">Withdraw now →</Link>
          </p>
        ) : (
          <p className="text-mist text-sm">
            ℹ️ Withdrawal eligibility: <b className="text-white">{stats.active}/10</b> active referrals
            {!active && " • Account still needs activation"}
          </p>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Link href="/tasks" className="btn-gradient text-white text-center font-bold py-4 rounded-full hover:opacity-90 shadow-lg shadow-rose/25">
          Do tasks
        </Link>
        <Link href="/deposit" className="bg-white text-night text-center font-bold py-4 rounded-full hover:bg-mist">
          Deposit
        </Link>
        <Link href="/referral" className="glass text-white text-center font-bold py-4 rounded-full hover:bg-white/10">
          Refer friends
        </Link>
      </div>
    </div>
  );
}
