"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, isActive, daysLeft, getReferralInfo, referralLink } from "../../lib/api";

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

  if (!loaded) return <p className="text-center py-16 text-mist">লোড হচ্ছে...</p>;

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
  const link = info ? referralLink(info.referralCode) : "";

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
        বন্ধুদের রেফার করুন — তাদের ডিপোজিট অনুমোদন হলে আপনি পাবেন <b className="text-white">৫%</b> বোনাস!
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
        <p className="mt-2 text-xs text-faint">আপনার কোড: <b className="text-white">{info?.referralCode}</b></p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="glass rounded-[2rem] p-6 text-center">
          <p className="text-3xl">👥</p>
          <p className="text-sm text-faint mt-1">মোট রেফার</p>
          <p className="text-2xl font-bold text-white">{info?.total ?? 0} জন</p>
        </div>
        <div className="glass rounded-[2rem] p-6 text-center">
          <p className="text-3xl">🟢</p>
          <p className="text-sm text-faint mt-1">অ্যাক্টিভ রেফার</p>
          <p className="text-2xl font-bold text-white">{info?.active ?? 0} জন</p>
        </div>
      </div>

      {info && info.list.length > 0 && (
        <div className="mt-5 glass rounded-[2rem] p-6">
          <p className="font-bold text-white mb-3">👥 আপনার রেফারেল তালিকা</p>
          <div className="space-y-2">
            {info.list.map((r, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 rounded-2xl px-4 py-2.5 text-sm">
                <span className="text-white font-bold">{r.name}</span>
                <span className={r.active ? "text-aqua font-bold" : "text-faint"}>
                  {r.active ? "🟢 অ্যাক্টিভ" : "🔴 ইনঅ্যাক্টিভ"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <th className="p-4 font-bold">রেফারের ডিপোজিট</th>
                <th className="p-4 font-bold">আপনি পাবেন</th>
              </tr>
            </thead>
            <tbody>
              {[
                { deposit: "১০০ টাকা", bonus: "৫ টাকা" },
                { deposit: "৫০০ টাকা", bonus: "২৫ টাকা" },
                { deposit: "১০০০ টাকা", bonus: "৫০ টাকা" },
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
          * ৫% রেফার বোনাস শুধু ডিপোজিট অ্যাডমিন-অনুমোদনের পর যোগ হয়।
        </p>
      </div>
    </div>
  );
}
