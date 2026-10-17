const TASKS = [
  {
    n: "টাস্ক ১",
    title: "৫০০ ক্লিক",
    reward: "১২ টাকা",
    url: "https://velvet-links.netlify.app/r/500clicka12tk",
    desc: "লিংকে গিয়ে ৫০০টি ক্লিক সম্পন্ন করুন।",
  },
  {
    n: "টাস্ক ২",
    title: "৬০০ ক্লিক",
    reward: "১৪ টাকা",
    url: "https://velvet-links.netlify.app/r/600clicka14tk",
    desc: "লিংকে গিয়ে ৬০০টি ক্লিক সম্পন্ন করুন।",
  },
  {
    n: "টাস্ক ৩",
    title: "৭০০ ক্লিক",
    reward: "১৬ টাকা",
    url: "https://velvet-links.netlify.app/r/700clicka16tk",
    desc: "লিংকে গিয়ে ৭০০টি ক্লিক সম্পন্ন করুন।",
  },
  {
    n: "টাস্ক ৪",
    title: "৮০০ ক্লিক",
    reward: "২০ টাকা",
    url: "https://velvet-links.netlify.app/r/800clicka20tk",
    desc: "লিংকে গিয়ে ৮০০টি ক্লিক সম্পন্ন করুন।",
  },
];

export default function Tasks() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">📋 টাস্ক তালিকা</h1>
      <p className="text-center text-gray-600 mt-2">
        প্রতিটি টাস্ক আলাদা বক্সে দেওয়া আছে — বাটনে ক্লিক করে টাস্কের লিংকে যান।
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {TASKS.map((t) => (
          <div key={t.n} className="bg-white rounded-xl shadow p-6 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                {t.n}
              </span>
              <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                পুরস্কার: {t.reward}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold">{t.title}</h3>
            <p className="mt-1 text-gray-600 text-sm">{t.desc}</p>
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700"
            >
              টাস্ক শুরু করুন ↗
            </a>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        ⚠️ ডেমো সংস্করণ — টাস্ক সম্পন্ন হলে পুরস্কার ডেমো ব্যালেন্সে যোগ হবে।
      </p>
    </div>
  );
}
