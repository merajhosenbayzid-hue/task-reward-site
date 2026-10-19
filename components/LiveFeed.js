"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, StatusDot, IconCheck } from "./icons";

const NAMES = [
  "রহিম উদ্দিন", "সুমাইয়া আক্তার", "করিম হোসেন", "নাজমুল হক",
  "ফারিয়া সুলতানা", "তানভীর আহমেদ", "শারমিন আক্তার", "মেহেদি হাসান",
  "রিয়া মনি", "সাকিব খান", "নুসরাত জাহান", "আরিফুল ইসলাম",
  "জুবাইদা আক্তার", "হাসান মাহমুদ", "তাসনিম রহমান", "ইমরান খান",
  "শফিকুল ইসলাম", "মারিয়া সুলতানা", "রাকিব হোসেন", "অন্তরা দাস",
  "ফাহিম চৌধুরী", "লামিয়া আক্তার", "সজীব মিয়া", "প্রিয়া রানী",
];
const AMOUNTS = ["5", "2.50", "15", "7.50", "10"];

let uid = 0;
function makeItem() {
  uid += 1;
  return {
    id: uid,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
    secs: 0,
    fresh: true,
  };
}

function timeAgo(secs) {
  if (secs < 60) return "Just now";
  const m = Math.floor(secs / 60);
  const en = String(m).replace(/\d/g, (d) => "0123456789"[+d]);
  return `${en} min ago`;
}

export default function LiveFeed() {
  const [items, setItems] = useState(() => {
    const initial = [];
    for (let i = 0; i < 7; i++) {
      const it = makeItem();
      it.secs = (i + 1) * 47;
      it.fresh = false;
      initial.push(it);
    }
    return initial;
  });
  const tick = useRef(0);

  useEffect(() => {
    const add = setInterval(() => {
      setItems((prev) => {
        const next = [makeItem(), ...prev.map((p) => ({ ...p, fresh: false }))];
        return next.slice(0, 9);
      });
    }, 5000);
    const age = setInterval(() => {
      tick.current += 1;
      setItems((prev) => prev.map((p) => ({ ...p, secs: p.secs + 5 })));
    }, 5000);
    return () => {
      clearInterval(add);
      clearInterval(age);
    };
  }, []);

  return (
    <div className="glass rounded-[2rem] p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-soft-ping absolute inline-flex h-full w-full rounded-full bg-rose" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose" />
        </span>
        <p className="font-bold text-white">Live Referral Activity</p>
      </div>
      <p className="text-xs text-mist mt-1">Users are earning commissions right now</p>

      <div className="mt-4 h-[26rem] overflow-hidden relative">
        <div className="space-y-2.5">
          {items.map((f) => (
            <div
              key={f.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${f.fresh ? "animate-feed-in" : ""}`}
            >
              <Avatar name={f.name} size={40} seed={f.id} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{f.name}</p>
                <p className="text-xs text-mist truncate">
                  earned a referral commission • {timeAgo(f.secs)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-peach whitespace-nowrap">+৳{f.amount}</p>
                <p className="text-[10px] text-aqua font-bold flex items-center gap-1 justify-end">
                  <IconCheck size={11} /> Approved
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-panel to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-panel to-transparent" />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-faint">
        <span className="flex items-center gap-1.5"><StatusDot active size={10} /> {120 + (tick.current % 30)} online</span>
        <span>{340 + (tick.current % 50)} commissions today</span>
      </div>
    </div>
  );
}
