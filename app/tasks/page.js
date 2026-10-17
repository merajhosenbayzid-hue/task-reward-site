"use client";

import { useState, useRef, useEffect } from "react";
import { getTaskClicks, addTaskClick } from "../../lib/demo";

const WAIT_SECONDS = 10;

const TASKS = [
  {
    id: "task1",
    n: "টাস্ক ১",
    title: "৫০০ ক্লিক",
    target: 500,
    reward: "১২ টাকা",
    url: "https://velvet-links.netlify.app/r/500clicka12tk",
    desc: "লিংকে গিয়ে ৫০০টি ক্লিক সম্পন্ন করুন।",
  },
  {
    id: "task2",
    n: "টাস্ক ২",
    title: "৬০০ ক্লিক",
    target: 600,
    reward: "১৪ টাকা",
    url: "https://velvet-links.netlify.app/r/600clicka14tk",
    desc: "লিংকে গিয়ে ৬০০টি ক্লিক সম্পন্ন করুন।",
  },
  {
    id: "task3",
    n: "টাস্ক ৩",
    title: "৭০০ ক্লিক",
    target: 700,
    reward: "১৬ টাকা",
    url: "https://velvet-links.netlify.app/r/700clicka16tk",
    desc: "লিংকে গিয়ে ৭০০টি ক্লিক সম্পন্ন করুন।",
  },
  {
    id: "task4",
    n: "টাস্ক ৪",
    title: "৮০০ ক্লিক",
    target: 800,
    reward: "২০ টাকা",
    url: "https://velvet-links.netlify.app/r/800clicka20tk",
    desc: "লিংকে গিয়ে ৮০০টি ক্লিক সম্পন্ন করুন।",
  },
];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function bn(n) {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[+d]);
}

export default function Tasks() {
  const [clicks, setClicks] = useState({});
  const [countdown, setCountdown] = useState({}); // taskId -> seconds left
  const [flashed, setFlashed] = useState({}); // taskId -> true briefly after count
  const timers = useRef({});

  useEffect(() => {
    setClicks(getTaskClicks());
    return () => Object.values(timers.current).forEach(clearInterval);
  }, []);

  function startTask(t) {
    if (countdown[t.id] != null) return; // already counting
    window.open(t.url, "_blank", "noopener,noreferrer");
    setCountdown((c) => ({ ...c, [t.id]: WAIT_SECONDS }));
    setFlashed((f) => ({ ...f, [t.id]: false }));
    timers.current[t.id] = setInterval(() => {
      setCountdown((c) => {
        const left = (c[t.id] ?? 0) - 1;
        if (left <= 0) {
          clearInterval(timers.current[t.id]);
          delete timers.current[t.id];
          const total = addTaskClick(t.id);
          setClicks((k) => ({ ...k, [t.id]: total }));
          setFlashed((f) => ({ ...f, [t.id]: true }));
          setTimeout(() => setFlashed((f) => ({ ...f, [t.id]: false })), 4000);
          const { [t.id]: _drop, ...rest } = c;
          return rest;
        }
        return { ...c, [t.id]: left };
      });
    }, 1000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">📋 টাস্ক তালিকা</h1>
      <p className="text-center text-gray-600 mt-2">
        বাটনে ক্লিক করলে লিংক নতুন ট্যাবে খুলবে।{" "}
        <b>১০ সেকেন্ড</b> থাকলে <b>১ ক্লিক</b> গণনা হবে — তার আগে ট্যাব বন্ধ
        করলে গণনা হবে না।
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {TASKS.map((t) => {
          const done = clicks[t.id] || 0;
          const left = countdown[t.id];
          const counting = left != null;
          const pct = Math.min(100, Math.round((done / t.target) * 100));
          return (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow p-6 border border-emerald-100"
            >
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

              <div className="mt-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>
                    ক্লিক: {bn(done)} / {bn(t.target)}
                  </span>
                  <span>{bn(pct)}%</span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: pct + "%" }}
                  />
                </div>
              </div>

              {counting ? (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-amber-700">
                    ⏳ {bn(left)}
                  </div>
                  <p className="text-sm text-amber-800 mt-1">
                    সেকেন্ড অপেক্ষা করুন… ট্যাব বন্ধ করবেন না
                  </p>
                  <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{
                        width: ((WAIT_SECONDS - left) / WAIT_SECONDS) * 100 + "%",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startTask(t)}
                  className="mt-4 block w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700"
                >
                  টাস্ক শুরু করুন ↗
                </button>
              )}

              {flashed[t.id] && (
                <p className="mt-3 text-center text-emerald-700 font-bold">
                  ✓ ১ ক্লিক গণনা হয়েছে!
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        ক্লিক গণনা আপনার অ্যাকাউন্টে সংরক্ষিত থাকে।
      </p>
    </div>
  );
}
