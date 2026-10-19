"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, isActive, daysLeft, getReferralInfo, referralLink } from "../../lib/api";
import { StatusDot, IconGift, IconCheckBadge, IconUsers, IconBanknote, IconLink, IconLock } from "../../components/icons";

export default function Referral() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cu = await getCurrentUser();
      if (!alive) return;
      setUser(cu);
      if (cu) {
        try {
          const ri = await getReferralInfo();
          if (alive) setInfo(ri);
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
          <p className="text-lg font-bold text-white">Log in to refer</p>
          <Link href="/login" className="mt-4 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const active = isActive(user);
  const link = info ? referralLink(info.referralCode) : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Couldn't copy — please select the link and copy it manually.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2"><IconGift size={30} className="icon-3d" /> <span className="text-gradient">Refer &amp; Win Rewards</span></h1>
      <p className="text-center text-mist mt-2">
        Refer friends — when their deposit is approved, you get a <b className="text-white">5%</b> bonus!
      </p>

      <div className={`mt-6 rounded-[2rem] p-5 text-center font-bold border ${
        active ? "border-aqua/40 text-aqua bg-aqua/5" : "border-peach/40 text-peach bg-peach/5"
      }`}>
        {active ? (
          <span className="inline-flex items-center gap-2"><StatusDot active size={13} /> Account active — {daysLeft(user)} days left. You can refer.</span>
        ) : (
          <span className="inline-flex items-center gap-2"><StatusDot size={13} /> Account inactive —{" "}
            <Link href="/deposit" className="underline">deposit to activate</Link> to refer
          </span>
        )}
      </div>

      {active ? (
      <div className="mt-5 glass rounded-[2rem] p-7">
        <p className="font-bold text-white flex items-center gap-2"><IconLink size={18} className="icon-3d" /> Your Referral Link</p>
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 bg-white/5 border-2 border-white/10 rounded-full px-4 py-3 text-sm text-white"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copy}
            className="btn-gradient text-white font-bold px-5 rounded-full hover:opacity-90 shrink-0"
          >
            {copied ? <span className="inline-flex items-center gap-1.5"><IconCheckBadge size={16} className="icon-3d icon-interactive" /> Copied!</span> : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-xs text-faint">Your code: <b className="text-white">{info?.referralCode}</b></p>
      </div>
      ) : (
      <div className="mt-5 glass rounded-[2rem] p-7 text-center">
        <p className="flex justify-center"><IconLock size={44} className="icon-3d" /></p>
        <p className="font-bold text-white mt-3">Referral link locked</p>
        <p className="text-sm text-mist mt-1">
          Activate your account to unlock your referral link and code.{" "}
          <Link href="/deposit" className="text-peach font-bold underline">Deposit now</Link>
        </p>
      </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="glass rounded-[2rem] p-6 text-center">
          <p className="flex justify-center"><IconUsers size={32} className="icon-3d" /></p>
          <p className="text-sm text-faint mt-1">Total referrals</p>
          <p className="text-2xl font-bold text-white">{info?.total ?? 0}</p>
        </div>
        <div className="glass rounded-[2rem] p-6 text-center">
          <p className="flex justify-center"><StatusDot active size={30} /></p>
          <p className="text-sm text-faint mt-1">Active referrals</p>
          <p className="text-2xl font-bold text-white">{info?.active ?? 0}</p>
        </div>
      </div>

      {info && info.list.length > 0 && (
        <div className="mt-5 glass rounded-[2rem] p-6">
          <p className="font-bold text-white mb-3 flex items-center gap-2"><IconUsers size={18} className="icon-3d" /> Your referral list</p>
          <div className="space-y-2">
            {info.list.map((r, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 rounded-2xl px-4 py-2.5 text-sm">
                <span className="text-white font-bold">{r.name}</span>
                <span className={r.active ? "text-aqua font-bold" : "text-faint"}>
                  {r.active ? <span className="inline-flex items-center gap-1.5"><StatusDot active size={11} /> Active</span> : <span className="inline-flex items-center gap-1.5"><StatusDot size={11} /> Inactive</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 glass rounded-[2rem] p-5 text-sm text-mist">
        ℹ️ Referral benefits are only available with an active account. You need at least
        10 <b className="text-white">active</b> referrals to withdraw.
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-xl text-white flex items-center gap-2"><IconBanknote size={22} className="icon-3d" /> Referral bonus table</h2>
        <div className="mt-3 overflow-x-auto rounded-[1.5rem]">
          <table className="w-full text-center text-sm min-w-[420px] glass">
            <thead>
              <tr className="bg-white/10 text-white">
                <th className="p-4 font-bold">Referral&apos;s deposit</th>
                <th className="p-4 font-bold">You get</th>
              </tr>
            </thead>
            <tbody>
              {[
                { deposit: "৳100", bonus: "৳5" },
                { deposit: "৳500", bonus: "৳25" },
                { deposit: "৳1000", bonus: "৳50" },
              ].map((r, i) => (
                <tr key={r.deposit} className={i % 2 ? "bg-white/5" : ""}>
                  <td className="p-4 text-white">{r.deposit}</td>
                  <td className="p-4 font-bold text-peach">{r.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-faint">
          * The 5% referral bonus is added only after the deposit is approved by admin.
        </p>
      </div>
    </div>
  );
}
