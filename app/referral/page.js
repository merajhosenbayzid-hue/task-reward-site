"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, isActive, daysLeft } from "../../lib/demo";

export default function Referral() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    const cu = getCurrentUser();
    setUser(cu);
    if (cu) {
      import("../../lib/demo").then((m) => setStats(m.getReferralStats(cu.referralCode)));
    }
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="glass rounded-[2.5rem] p-10">
          <p className="text-lg font-bold text-white">রেফার করতে লগিন করুন</p>
          <Link href="/login" className="mt-4 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
            লগিন করুন
          </Link>
        </div>
      </div>
    );
  }

  const active = isActive(user);
  const link = `https://task-reward-site.onrender.com/signup?ref=${user.referralCode}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("কপি করা যায়নি — লিংকটি সিলেক্ট করে কপি করুন।");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white">🎁 <span className="text-gradient">রেফার করুন, পুরস্কার জিতুন</span></h1>
      <p className="text-center text-mist mt-2">
        বন্ধুদের রেফার করুন — তাদের ডিপোজিটে আপনি পাবেন <b className="text-white">৫%</b> বোনাস!
      </p>

      <div className={`mt-6 rounded-[2rem] p-5 text-center font-bold border ${
        active ? "border-aqua/40 text-aqua bg-aqua/5" : "border-peach/40 text-peach bg-peach/5"
      }`}>
        {active ? (
          <>🟢 অ্যাকাউন্ট অ্যাক্টিভ — {daysLeft(user)} দিন বাকি। রেফার করতে পারবেন।</>
        ) : (
          <>🔴 অ্যাকাউন্ট ইনঅ্যাক্টিভ — রেফার করতে হলে{" "}
            <Link href="/deposit" className="underline">ডিপোজিট করে অ্যাক্টিভ করুন</Link>
          </>
        )}
      </div>

      <div className="mt-5 glass rounded-[2rem] p-7">
        <p className="font-bold text-white">🔗 আপনার রেফারেল লিংক</p>
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 bg-white/5 border-2 border-white/10 rounded-full px-4 py-3 text-sm text-white"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copy}
            disabled={!active}
            className="btn-gradient text-white font-bold px-5 rounded-full hover:opacity-90 disabled:opacity-40 shrink-0"
          >
            {copied ? "✅ কপি!" : "কপি"}
          </button>
        </div>
        <p className="mt-2 text-xs text-faint">আপনার কোড: <b className="text-white">{user.referralCode}</b></p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="glass rounded-[2rem] p-6 text-center">
          <p className="text-3xl">👥</p>
          <p className="text-sm text-faint mt-1">মোট রেফার</p>
          <p className="text-2xl font-bold text-white">{stats.total} জন</p>
        </div>
        <div className="glass rounded-[2rem] p-6 text-center">
          <p className="text-3xl">🟢</p>
          <p className="text-sm text-faint mt-1">অ্যাক্টিভ রেফার</p>
          <p className="text-2xl font-bold text-white">{stats.active} জন</p>
        </div>
      </div>

      <div className="mt-5 glass rounded-[2rem] p-5 text-sm text-mist">
        ℹ️ রেফার করার সুবিধা শুধু অ্যাক্টিভ অ্যাকাউন্টে থাকে। উত্তোলনের জন্য কমপক্ষে
        ১০ জন <b className="text-white">অ্যাক্টিভ</b> রেফারেল লাগবে।
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-xl text-white">💸 রেফার বোনাস টেবিল</h2>
        <div className="mt-3 overflow-x-auto rounded-[1.5rem]">
          <table className="w-full text-center text-sm min-w-[420px] glass">
            <thead>
              <tr className="bg-white/10 text-white">
                <th className="p-4 font-bold">নতুন ব্যবহারকারীর ডিপোজিট</th>
                <th className="p-4 font-bold">রেফারকারী পাবেন</th>
                <th className="p-4 font-bold">নতুন ব্যবহারকারী পাবেন</th>
              </tr>
            </thead>
            <tbody>
              {[
                { deposit: "১০ টাকা", referrer: "০.৫০ টাকা", newUser: "১.৫০ টাকা" },
                { deposit: "৫০ টাকা", referrer: "২.৫০ টাকা", newUser: "৭.৫০ টাকা" },
                { deposit: "১০০ টাকা", referrer: "৫ টাকা", newUser: "১৫ টাকা" },
              ].map((r, i) => (
                <tr key={r.deposit} className={i % 2 ? "bg-white/5" : ""}>
                  <td className="p-4 text-white">{r.deposit}</td>
                  <td className="p-4 font-bold text-peach">{r.referrer}</td>
                  <td className="p-4 font-bold text-peach">{r.newUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-faint">
          * নতুন ব্যবহারকারীর বোনাস = ৫% রেফার বোনাস + ১০% ওয়েলকাম বোনাস। বোনাস শুধু ডিপোজিট নিশ্চিত হওয়ার পর যোগ হয়।
        </p>
      </div>
    </div>
  );
}
