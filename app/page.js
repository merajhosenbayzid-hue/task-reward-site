import Link from "next/link";

const PACKAGES = [
  { name: "প্যাকেজ ১", deposit: "১০ টাকা", referrals: "১০ জন", target: "১০০ টাকা" },
  { name: "প্যাকেজ ২", deposit: "৫০ টাকা", referrals: "১০ জন", target: "৫০০ টাকা" },
  { name: "প্যাকেজ ৩", deposit: "১০০ টাকা", referrals: "১০ জন", target: "১,০০০ টাকা" },
];

const STEPS = [
  { n: "১", title: "অ্যাকাউন্ট খুলুন", text: "রেফারেল লিংক দিয়ে বিনামূল্যে অ্যাকাউন্ট খুলুন।" },
  { n: "২", title: "প্যাকেজ বেছে ডিপোজিট করুন", text: "বিকাশ, নগদ বা রকেটে ১০–১০০ টাকা ডিপোজিট করুন।" },
  { n: "৩", title: "বোনাস পান", text: "ডিপোজিট যাচাই হলে ১০% ওয়েলকাম বোনাস যোগ হবে।" },
  { n: "৪", title: "টাস্ক ও রেফার করুন", text: "প্যাকেজের টাস্ক সম্পন্ন করুন ও বন্ধুদের রেফার করুন।" },
  { n: "৫", title: "টাকা উত্তোলন করুন", text: "শর্ত পূরণ হলে উত্তোলনের আবেদন করুন।" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-8 text-center shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold">কাজ করুন, পুরস্কার জিতুন 🎉</h1>
        <p className="mt-3 text-emerald-100 max-w-xl mx-auto">
          টাস্ক রিওয়ার্ডে সহজ কাজ সম্পন্ন করে আয় করুন। ডিপোজিটে ১০% ওয়েলকাম বোনাস,
          রেফারেলে ৫% বোনাস!
        </p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <Link href="/tasks" className="bg-amber-400 text-emerald-950 font-bold px-6 py-3 rounded-xl hover:bg-amber-300">
            টাস্ক দেখুন
          </Link>
          <Link href="/dashboard" className="bg-white text-emerald-800 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50">
            ড্যাশবোর্ড
          </Link>
        </div>
        
      </section>

      {/* Packages */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-center">📦 প্যাকেজসমূহ</h2>
        <div className="mt-4 overflow-x-auto rounded-xl shadow">
          <table className="w-full bg-white text-center min-w-[480px]">
            <thead>
              <tr className="bg-emerald-700 text-white">
                <th className="p-3">প্যাকেজ</th>
                <th className="p-3">ডিপোজিট</th>
                <th className="p-3">প্রয়োজনীয় রেফার</th>
                <th className="p-3">উত্তোলন লক্ষ্য</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGES.map((p, i) => (
                <tr key={p.name} className={i % 2 ? "bg-emerald-50" : "bg-white"}>
                  <td className="p-3 font-bold">{p.name}</td>
                  <td className="p-3">{p.deposit}</td>
                  <td className="p-3">{p.referrals}</td>
                  <td className="p-3 font-bold text-emerald-700">{p.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bonuses */}
      <section className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6 border-t-4 border-amber-400">
          <h3 className="text-xl font-bold">🎁 ১০% ওয়েলকাম বোনাস</h3>
          <p className="mt-2 text-gray-600">
            প্রতিটি সফল ডিপোজিটে ১০% বোনাস — ডিপোজিট যাচাই হওয়ার পর অ্যাকাউন্টে যোগ হবে।
          </p>
          <ul className="mt-3 text-sm space-y-1">
            <li>১০ টাকা → <b>১১ টাকা</b></li>
            <li>৫০ টাকা → <b>৫৫ টাকা</b></li>
            <li>১০০ টাকা → <b>১১০ টাকা</b></li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-t-4 border-emerald-500">
          <h3 className="text-xl font-bold">👥 ৫% রেফার বোনাস</h3>
          <p className="mt-2 text-gray-600">
            আপনার রেফারেল লিংকে কেউ ডিপোজিট করলে আপনি পাবেন ৫%, নতুন ব্যবহারকারী পাবেন
            ৫% + ১০% ওয়েলকাম বোনাস।
          </p>
          <ul className="mt-3 text-sm space-y-1">
            <li>১০০ টাকা ডিপোজিটে রেফারকারী পান <b>৫ টাকা</b></li>
            <li>নতুন ব্যবহারকারী পান <b>১৫ টাকা</b> (৫% + ১০%)</li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-center">⚙️ কীভাবে কাজ করে</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white rounded-xl shadow p-4 text-center">
              <div className="w-10 h-10 mx-auto bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {s.n}
              </div>
              <h4 className="mt-2 font-bold">{s.title}</h4>
              <p className="mt-1 text-sm text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
