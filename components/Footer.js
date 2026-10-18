import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20">
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="glass rounded-[2rem] px-8 py-10">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-xl font-bold text-white">
                  ৳
                </span>
                <span className="text-lg font-bold text-white">টাস্ক রিওয়ার্ড</span>
              </div>
              <p className="mt-3 text-sm text-mist">
                বাংলাদেশের বিশ্বস্ত টাস্ক ও রিওয়ার্ড প্ল্যাটফর্ম। সহজ কাজ করুন,
                রেফার করুন, পুরস্কার জিতুন।
              </p>
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-widest text-faint">দ্রুত লিংক</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Link href="/tasks" className="text-mist hover:text-white">টাস্ক</Link>
                <Link href="/deposit" className="text-mist hover:text-white">ডিপোজিট</Link>
                <Link href="/withdraw" className="text-mist hover:text-white">উত্তোলন</Link>
                <Link href="/referral" className="text-mist hover:text-white">রেফারেল</Link>
                <Link href="/signup" className="text-mist hover:text-white">অ্যাকাউন্ট খুলুন</Link>
                <Link href="/login" className="text-mist hover:text-white">লগিন</Link>
              </div>
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-widest text-faint">যোগাযোগ</p>
              <div className="mt-3 text-sm text-mist space-y-2">
                <p>🎧 সাপোর্ট: প্রতিদিন সকাল ৯টা – রাত ১০টা</p>
                <p>📧 support@task-reward-site.onrender.com</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-faint">
            <p>© ২০২৬ টাস্ক রিওয়ার্ড — সর্বস্বত্ব সংরক্ষিত</p>
            <p>স্বচ্ছ নিয়ম • নিরাপদ পেমেন্ট • বাংলাদেশি প্ল্যাটফর্ম 🇧🇩</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
