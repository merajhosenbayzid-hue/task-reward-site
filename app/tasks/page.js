"use client";

import { useState, useRef, useEffect } from "react";
import { getTaskClicks, addTaskClick } from "../../lib/demo";

const WAIT_SECONDS = 10;

const TASKS = [];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function bn(n) {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[+d]);
}

const CARD_BGS = ["bg-lav", "bg-peach", "bg-peri", "bg-creamdeep"];

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
      <h1 className="text-3xl font-bold text-center text-ink">📋 টাস্ক তালিকা</h1>
      <p className="text-center text-inksoft mt-2 max-w-xl mx-auto">
        বাটনে ক্লিক করলে লিংক নতুন ট্যাবে খুলবে।{" "}
        <b className="text-ink">১০ সেকেন্ড</b> থাকলে <b className="text-ink">১ ক্লিক</b> গণনা হবে — তার আগে ট্যাব বন্ধ
        করলে গণনা হবে না।
      </p>

      {TASKS.length === 0 ? (
        <div className="mt-8 bg-white rounded-[2.5rem] p-12 shadow-sm text-center max-w-md mx-auto">
          <p className="text-6xl">📭</p>
          <p className="mt-4 text-xl font-bold text-ink">এখনো কোনো টাস্ক যোগ করা হয়নি</p>
          <p className="mt-1 text-inksoft text-sm">নতুন টাস্ক শীঘ্রই আসছে।</p>
        </div>
      ) : (
      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {TASKS.map((t, idx) => {
          const done = clicks[t.id] || 0;
          const left = countdown[t.id];
          const counting = left != null;
          const pct = Math.min(100, Math.round((done / t.target) * 100));
          return (
            <div
              key={t.id}
              className={`${CARD_BGS[idx % CARD_BGS.length]} rounded-[2rem] p-7`}
            >
              <div className="flex items-center justify-between">
                <span className="bg-white text-ink text-sm font-bold px-3 py-1.5 rounded-full">
                  {t.n}
                </span>
                <span className="bg-sun text-ink text-sm font-bold px-3 py-1.5 rounded-full">
                  পুরস্কার: {t.reward}
                </span>
              </div>
              <div className="mt-4 bg-white rounded-3xl p-5">
                <h3 className="text-xl font-bold text-ink">{t.title}</h3>
                <p className="mt-1 text-inksoft text-sm">{t.desc}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm font-bold text-ink">
                  <span>
                    ক্লিক: {bn(done)} / {bn(t.target)}
                  </span>
                  <span>{bn(pct)}%</span>
                </div>
                <div className="mt-2 h-3 bg-white/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral rounded-full transition-all"
                    style={{ width: pct + "%" }}
                  />
                </div>
              </div>

              {counting ? (
                <div className="mt-4 bg-white rounded-3xl p-5 text-center">
                  <div className="text-4xl font-bold text-ink">
                    ⏳ {bn(left)}
                  </div>
                  <p className="text-sm text-inksoft mt-1">
                    সেকেন্ড অপেক্ষা করুন… ট্যাব বন্ধ করবেন না
                  </p>
                  <div className="mt-3 h-3 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sun rounded-full transition-all"
                      style={{
                        width: ((WAIT_SECONDS - left) / WAIT_SECONDS) * 100 + "%",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startTask(t)}
                  className="mt-4 block w-full text-center bg-coral text-white font-bold py-4 rounded-2xl hover:bg-coraldeep shadow-lg shadow-coral/25"
                >
                  টাস্ক শুরু করুন ↗
                </button>
              )}

              {flashed[t.id] && (
                <p className="mt-3 text-center text-ink font-bold bg-white rounded-full py-2">
                  ✓ ১ ক্লিক গণনা হয়েছে!
                </p>
              )}
            </div>
          );
        })}
      </div>
      )}

      <p className="mt-8 text-center text-xs text-inksoft">
        প্রতিটি টাস্কে ১০ সেকেন্ড করে থাকলে ১টি ক্লিক গণনা হয়।
      </p>
    </div>
  );
}
