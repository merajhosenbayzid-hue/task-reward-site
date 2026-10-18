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
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm">
          <p className="text-lg font-bold text-ink">রেফার করতে লগিন করুন</p>
          <Link href="/login" className="mt-4 inline-block bg-coral text-white font-bold px-6 py-3 rounded-2xl hover:bg-coraldeep">
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
      <h1 className="text-3xl font-bold text-center text-ink">🎁 রেফার করুন, পুরস্কার জিতুন</h1>
      <p className="text-center text-inksoft mt-2">
        বন্ধুদের রেফার করুন — তাদের ডিপোজিটে আপনি পাবেন <b className="text-ink">৫%</b> বোনাস!
      </p>

      <div className={`mt-6 rounded-[2rem] p-5 text-center font-bold ${active ? "bg-lav text-ink" : "bg-peach text-ink"}`}>
        {active ? (
          <>🟢 অ্যাকাউন্ট অ্যাক্টিভ — {daysLeft(user)} দিন বাকি। রেফার করতে পারবেন।</>
        ) : (
          <>🔴 অ্যাকাউন্ট ইনঅ্যাক্টিভ — রেফার করতে হলে{" "}
            <Link href="/deposit" className="text-coral underline">ডিপোজিট করে অ্যাক্টিভ করুন</Link>
          </>
        )}
      </div>

      <div className="mt-5 bg-white rounded-[2rem] p-7 shadow-sm">
        <p className="font-bold text-ink">🔗 আপনার রেফারেল লিংক</p>
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 border-2 border-creamdeep rounded-2xl px-4 py-3 bg-cream/50 text-sm text-ink"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copy}
            disabled={!active}
            className="bg-coral text-white font-bold px-5 rounded-2xl hover:bg-coraldeep disabled:opacity-40 shrink-0"
          >
            {copied ? "✅ কপি!" : "কপি"}
          </button>
        </div>
        <p className="mt-2 text-xs text-inksoft">আপনার কোড: <b className="text-ink">{user.referralCode}</b></p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="bg-lav rounded-[2rem] p-6 text-center">
          <p className="text-3xl">👥</p>
          <p className="text-sm text-inksoft mt-1">মোট রেফার</p>
          <p className="text-2xl font-bold text-ink">{stats.total} জন</p>
        </div>
        <div className="bg-peri rounded-[2rem] p-6 text-center">
          <p className="text-3xl">🟢</p>
          <p className="text-sm text-inksoft mt-1">অ্যাক্টিভ রেফার</p>
          <p className="text-2xl font-bold text-ink">{stats.active} জন</p>
        </div>
      </div>

      <div className="mt-5 bg-creamdeep rounded-[2rem] p-5 text-sm text-inksoft">
        ℹ️ রেফার করার সুবিধা শুধু অ্যাক্টিভ অ্যাকাউন্টে থাকে। উত্তোলনের জন্য কমপক্ষে
        ১০ জন <b className="text-ink">অ্যাক্টিভ</b> রেফারেল লাগবে।
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-xl text-ink">💸 রেফার বোনাস টেবিল</h2>
        <div className="mt-3 overflow-x-auto rounded-[1.5rem]">
          <table className="w-full bg-white text-center text-sm min-w-[420px]">
            <thead>
              <tr className="bg-navy text-white">
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
                <tr key={r.deposit} className={i % 2 ? "bg-cream/60" : "bg-white"}>
                  <td className="p-4">{r.deposit}</td>
                  <td className="p-4 font-bold text-coral">{r.referrer}</td>
                  <td className="p-4 font-bold text-coral">{r.newUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-inksoft">
          * নতুন ব্যবহারকারীর বোনাস = ৫% রেফার বোনাস + ১০% ওয়েলকাম বোনাস। বোনাস শুধু ডিপোজিট নিশ্চিত হওয়ার পর যোগ হয়।
        </p>
      </div>
    </div>
  );
}
