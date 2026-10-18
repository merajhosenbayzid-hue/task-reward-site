import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-bold">💰 টাস্ক রিওয়ার্ড</p>
            <p className="mt-2 text-sm text-emerald-300">
              বাংলাদেশের বিশ্বস্ত টাস্ক ও রিওয়ার্ড প্ল্যাটফর্ম। সহজ কাজ করুন,
              রেফার করুন, পুরস্কার জিতুন।
            </p>
            <div className="mt-3 flex gap-2 text-sm">
              <span className="bg-emerald-900 px-2.5 py-1 rounded-lg">🔒 ১০০% নিরাপদ</span>
              <span className="bg-emerald-900 px-2.5 py-1 rounded-lg">⚡ দ্রুত পেমেন্ট</span>
            </div>
          </div>
          <div>
            <p className="font-bold">দ্রুত লিংক</p>
            <div className="mt-2 grid grid-cols-2 gap-1 text-sm text-emerald-300">
              <Link href="/tasks" className="hover:text-white py-1">টাস্ক</Link>
              <Link href="/deposit" className="hover:text-white py-1">ডিপোজিট</Link>
              <Link href="/withdraw" className="hover:text-white py-1">উত্তোলন</Link>
              <Link href="/referral" className="hover:text-white py-1">রেফারেল</Link>
              <Link href="/signup" className="hover:text-white py-1">অ্যাকাউন্ট খুলুন</Link>
              <Link href="/login" className="hover:text-white py-1">লগিন</Link>
            </div>
          </div>
          <div>
            <p className="font-bold">যোগাযোগ</p>
            <div className="mt-2 text-sm text-emerald-300 space-y-1">
              <p>🎧 সাপোর্ট: প্রতিদিন সকাল ৯টা – রাত ১০টা</p>
              <p>💬 লাইভ চ্যাট শীঘ্রই আসছে</p>
              <p>📧 ইমেইল: support@task-reward-site.onrender.com</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-emerald-900 text-center text-sm text-emerald-400">
          <p>© ২০২৬ টাস্ক রিওয়ার্ড — সর্বস্বত্ব সংরক্ষিত</p>
          <p className="mt-1 text-xs">স্বচ্ছ নিয়ম • নিরাপদ পেমেন্ট • বাংলাদেশি প্ল্যাটফর্ম 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}
