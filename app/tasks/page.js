"use client";

import { useState, useRef, useEffect } from "react";
import { getTaskClicks, addTaskClick } from "../../lib/demo";
import { IconClipboard, IconInbox, IconClock, IconCheck } from "../../components/icons";

const WAIT_SECONDS = 10;

const TASKS = [];

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
      <h1 className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2"><IconClipboard size={30} className="icon-3d" /> Task List</h1>
      <p className="text-center text-mist mt-2 max-w-xl mx-auto">
        Clicking the button opens the link in a new tab.{" "}
        <b className="text-white">Stay 10 seconds</b> to count <b className="text-white">1 click</b> — closing the tab before that won&apos;t count.
      </p>

      {TASKS.length === 0 ? (
        <div className="mt-8 glass rounded-[2.5rem] p-12 text-center max-w-md mx-auto">
          <p className="flex justify-center"><IconInbox size={64} className="icon-3d animate-icon-float" /></p>
          <p className="mt-4 text-xl font-bold text-white">No tasks have been added yet</p>
          <p className="mt-1 text-mist text-sm">New tasks are coming soon.</p>
        </div>
      ) : (
      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {TASKS.map((t, idx) => {
          const done = clicks[t.id] || 0;
          const left = countdown[t.id];
          const counting = left != null;
          const pct = Math.min(100, Math.round((done / t.target) * 100));
          return (
            <div key={t.id} className="glass rounded-[2rem] p-7">
              <div className="flex items-center justify-between">
                <span className="bg-white/10 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  {t.n}
                </span>
                <span className="bg-white text-night text-sm font-bold px-3 py-1.5 rounded-full">
                  Reward: {t.reward}
                </span>
              </div>
              <div className="mt-4 bg-white/5 rounded-3xl p-5">
                <h3 className="text-xl font-bold text-white">{t.title}</h3>
                <p className="mt-1 text-mist text-sm">{t.desc}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm font-bold text-white">
                  <span>
                    Clicks: {done} / {t.target}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-2 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full btn-gradient rounded-full transition-all"
                    style={{ width: pct + "%" }}
                  />
                </div>
              </div>

              {counting ? (
                <div className="mt-4 bg-white/5 rounded-3xl p-5 text-center">
                  <div className="text-4xl font-bold text-white flex items-center justify-center gap-3">
                    <IconClock size={36} className="icon-3d" /> {left}
                  </div>
                  <p className="text-sm text-mist mt-1">
                    seconds — please wait… don&apos;t close the tab
                  </p>
                  <div className="mt-3 h-3 bg-white/10 rounded-full overflow-hidden">
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
                  className="mt-4 block w-full text-center btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 shadow-lg shadow-rose/25"
                >
                  Start task ↗
                </button>
              )}

              {flashed[t.id] && (
                <p className="mt-3 text-center text-white font-bold bg-white/10 rounded-full py-2">
                  <span className="inline-flex items-center gap-2"><IconCheck size={16} /> 1 click counted!</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      )}

      <p className="mt-8 text-center text-xs text-faint">
        Stay 10 seconds on each task to count 1 click.
      </p>
    </div>
  );
}
