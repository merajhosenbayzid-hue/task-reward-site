"use client";

const FEED = [
  { name: "রহিম উদ্দিন", amount: "৫", time: "১ মিনিট আগে", bg: "bg-lav" },
  { name: "সুমাইয়া আক্তার", amount: "২.৫০", time: "২ মিনিট আগে", bg: "bg-peach" },
  { name: "করিম হোসেন", amount: "১৫", time: "৩ মিনিট আগে", bg: "bg-peri" },
  { name: "নাজমুল হক", amount: "৫", time: "৫ মিনিট আগে", bg: "bg-creamdeep" },
  { name: "ফারিয়া সুলতানা", amount: "৭.৫০", time: "৭ মিনিট আগে", bg: "bg-lav" },
  { name: "তানভীর আহমেদ", amount: "২.৫০", time: "৯ মিনিট আগে", bg: "bg-peach" },
  { name: "শারমিন আক্তার", amount: "৫", time: "১২ মিনিট আগে", bg: "bg-peri" },
  { name: "মেহেদি হাসান", amount: "১৫", time: "১৫ মিনিট আগে", bg: "bg-creamdeep" },
  { name: "রিয়া মনি", amount: "২.৫০", time: "১৮ মিনিট আগে", bg: "bg-lav" },
  { name: "সাকিব খান", amount: "৫", time: "২১ মিনিট আগে", bg: "bg-peach" },
  { name: "নুসরাত জাহান", amount: "৭.৫০", time: "২৫ মিনিট আগে", bg: "bg-peri" },
  { name: "আরিফুল ইসলাম", amount: "৫", time: "২৮ মিনিট আগে", bg: "bg-creamdeep" },
];

export default function LiveFeed() {
  const loop = [...FEED, ...FEED];
  return (
    <div className="bg-white/85 backdrop-blur rounded-[2rem] p-5 shadow-xl shadow-ink/5 border border-white">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <p className="font-bold text-ink">লাইভ রেফার কমিশন</p>
      </div>
      <p className="text-xs text-inksoft mt-1">ইউজাররা এখন কমিশন পাচ্ছেন</p>

      <div className="mt-4 h-80 overflow-hidden relative">
        <div className="ticker-up space-y-2.5">
          {loop.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-cream/80 rounded-2xl p-3"
            >
              <div className={`w-10 h-10 ${f.bg} rounded-2xl flex items-center justify-center font-bold text-ink shrink-0`}>
                {f.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{f.name}</p>
                <p className="text-xs text-inksoft">রেফার কমিশন পেয়েছেন • {f.time}</p>
              </div>
              <p className="text-sm font-bold text-coral whitespace-nowrap">+{f.amount}৳</p>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}
