import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-16 rounded-t-[2.5rem]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 bg-sun rounded-2xl flex items-center justify-center text-xl font-bold text-ink">
                ৳
              </span>
              <span className="text-lg font-bold">টাস্ক রিওয়ার্ড</span>
            </div>
            <p className="mt-3 text-sm text-white/60">
              বাংলাদেশের বিশ্বস্ত টাস্ক ও রিওয়ার্ড প্ল্যাটফর্ম। সহজ কাজ করুন,
              রেফার করুন, পুরস্কার জিতুন।
            </p>
          </div>
          <div>
            <p className="font-bold text-sm text-white/40">দ্রুত লিংক</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Link href="/tasks" className="text-white/70 hover:text-white">টাস্ক</Link>
              <Link href="/deposit" className="text-white/70 hover:text-white">ডিপোজিট</Link>
              <Link href="/withdraw" className="text-white/70 hover:text-white">উত্তোলন</Link>
              <Link href="/referral" className="text-white/70 hover:text-white">রেফারেল</Link>
              <Link href="/signup" className="text-white/70 hover:text-white">অ্যাকাউন্ট খুলুন</Link>
              <Link href="/login" className="text-white/70 hover:text-white">লগিন</Link>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm text-white/40">যোগাযোগ</p>
            <div className="mt-3 text-sm text-white/70 space-y-2">
              <p>🎧 সাপোর্ট: প্রতিদিন সকাল ৯টা – রাত ১০টা</p>
              <p>📧 support@task-reward-site.onrender.com</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <p>© ২০২৬ টাস্ক রিওয়ার্ড — সর্বস্বত্ব সংরক্ষিত</p>
          <p>স্বচ্ছ নিয়ম • নিরাপদ পেমেন্ট • বাংলাদেশি প্ল্যাটফর্ম 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}
