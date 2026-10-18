"use client";

import { useEffect, useState } from "react";
import { getUser, SITE_DOMAIN } from "../../lib/demo";

const BONUS_ROWS = [
  { deposit: "১০ টাকা", referrer: "০.৫০ টাকা", newUser: "১.৫০ টাকা" },
  { deposit: "৫০ টাকা", referrer: "২.৫০ টাকা", newUser: "৭.৫০ টাকা" },
  { deposit: "১০০ টাকা", referrer: "৫ টাকা", newUser: "১৫ টাকা" },
];

export default function Referral() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user) return <p className="text-center py-10">লোড হচ্ছে...</p>;

  const link = `${SITE_DOMAIN}/r/${user.referralCode}`;

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
      <h1 className="text-2xl font-bold text-center">🎁 রেফার করুন, পুরস্কার জিতুন</h1>
      <p className="text-center text-gray-600 mt-1">
        বন্ধুদের রেফার করুন — তাদের ডিপোজিটে আপনি পাবেন <b>৫%</b> বোনাস!
      </p>

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <p className="font-bold text-sm">🔗 আপনার রেফারেল লিংক</p>
        <div className="mt-2 flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 border rounded-xl px-4 py-2.5 bg-gray-50 text-sm"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copy}
            className="bg-emerald-600 text-white font-bold px-5 rounded-xl hover:bg-emerald-700"
          >
            {copied ? "✅ কপি!" : "কপি"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">সফল রেফার</p>
          <p className="text-2xl font-bold">{user.referrals} জন</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">রেফার বোনাস আয়</p>
          <p className="text-2xl font-bold text-emerald-700">৭.৫০ টাকা</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-bold">💸 রেফার বোনাস টেবিল</h2>
        <div className="mt-2 overflow-x-auto rounded-xl shadow">
          <table className="w-full bg-white text-center text-sm min-w-[420px]">
            <thead>
              <tr className="bg-emerald-700 text-white">
                <th className="p-3">নতুন ব্যবহারকারীর ডিপোজিট</th>
                <th className="p-3">রেফারকারী পাবেন</th>
                <th className="p-3">নতুন ব্যবহারকারী পাবেন</th>
              </tr>
            </thead>
            <tbody>
              {BONUS_ROWS.map((r, i) => (
                <tr key={r.deposit} className={i % 2 ? "bg-emerald-50" : "bg-white"}>
                  <td className="p-3">{r.deposit}</td>
                  <td className="p-3 font-bold text-emerald-700">{r.referrer}</td>
                  <td className="p-3 font-bold text-emerald-700">{r.newUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          * নতুন ব্যবহারকারীর বোনাস = ৫% রেফার বোনাস + ১০% ওয়েলকাম বোনাস। বোনাস শুধু ডিপোজিট নিশ্চিত হওয়ার পর যোগ হয়।
        </p>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm text-gray-600">
        ℹ️ প্রথম ২০ জন রেফারেল ছাড়াই অ্যাকাউন্ট খুলতে পারবেন। এরপর রেফারেল লিংক ছাড়া
        নতুন অ্যাকাউন্ট খোলা যাবে না।
      </div>
    </div>
  );
}
