"use client";

import { useEffect, useRef, useState } from "react";
import { StatusDot } from "./icons";

// English display names (romanized)
const NAMES = [
  "Rahim Uddin", "Sumaiya Akter", "Karim Hosen", "Nazmul Haque",
  "Faria Sultana", "Tanvir Ahmed", "Sharmin Akter", "Mehedi Hasan",
  "Riya Moni", "Sakib Khan", "Nusrat Jahan", "Ariful Islam",
  "Zubaida Akter", "Hasan Mahmud", "Tasnim Rahman", "Imran Khan",
  "Shafiqul Islam", "Maria Sultana", "Rakib Hosen", "Antora Das",
  "Fahim Chowdhury", "Lamia Akter", "Sajib Mia", "Priya Rani",
];
const AMOUNTS = ["5", "2.50", "15", "7.50", "10"];

let uid = 0;

export default function LiveFeed() {
  const [items, setItems] = useState([]);
  const [online, setOnline] = useState(120);
  const [commissions, setCommissions] = useState(340);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    if (rm) {
      // static fallback — plain name list, no animation, no box
      setItems(
        [0, 1, 2, 3, 4].map((i) => ({
          id: `s${i}`,
          name: NAMES[(i * 5) % NAMES.length],
          amount: AMOUNTS[i % AMOUNTS.length],
        }))
      );
      return;
    }
    const spawn = () => {
      const item = {
        id: ++uid,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
        // slight horizontal variation for a natural floating feel
        left: `${6 + Math.random() * 58}%`,
        dur: `${8.5 + Math.random() * 3}s`,
      };
      setItems((prev) => [...prev.slice(-5), item]);
    };
    spawn();
    const t1 = setInterval(spawn, 2700);
    const t2 = setInterval(() => {
      setOnline(116 + Math.floor(Math.random() * 16));
      setCommissions(335 + Math.floor(Math.random() * 18));
    }, 9000);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <div>
      {/* plain header — no box, no border */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-soft-ping absolute inline-flex h-full w-full rounded-full bg-rose" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose" />
        </span>
        <p className="font-bold text-white">Live Referral Activity</p>
      </div>
      <p className="text-xs text-mist mt-1">Users are earning commissions right now</p>

      {reduced ? (
        <div className="mt-5 space-y-3">
          {items.map((f) => (
            <p key={f.id} className="text-sm">
              <span className="font-semibold text-white">{f.name}</span>{" "}
              <span className="text-peach font-bold text-xs">+৳{f.amount}</span>
            </p>
          ))}
        </div>
      ) : (
        <div className="float-stage mt-2" aria-hidden="true">
          {items.map((f) => (
            <div
              key={f.id}
              className="float-name"
              style={{ left: f.left, animationDuration: f.dur }}
              onAnimationEnd={() => remove(f.id)}
            >
              <span className="float-name-text">{f.name}</span>
              <span className="float-name-amt">+৳{f.amount}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-faint mt-3 flex items-center gap-1.5">
        <StatusDot active size={9} />
        {online} online • {commissions} commissions today
      </p>
    </div>
  );
}
