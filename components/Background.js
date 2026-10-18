"use client";

const COINS = [
  { left: "4%", top: "14%", size: "text-3xl", delay: "0s", dur: "8s" },
  { left: "90%", top: "10%", size: "text-4xl", delay: "1.5s", dur: "9s" },
  { left: "8%", top: "62%", size: "text-2xl", delay: "3s", dur: "7s" },
  { left: "86%", top: "58%", size: "text-3xl", delay: "0.8s", dur: "10s" },
  { left: "72%", top: "86%", size: "text-2xl", delay: "2.2s", dur: "8.5s" },
  { left: "18%", top: "88%", size: "text-4xl", delay: "4s", dur: "11s" },
];

const CHECKS = [
  { left: "12%", top: "30%", delay: "0s" },
  { left: "82%", top: "34%", delay: "2.3s" },
  { left: "68%", top: "70%", delay: "4.6s" },
  { left: "22%", top: "72%", delay: "1.4s" },
];

const RISERS = [
  { left: "10%", text: "+৫৳ কমিশন", icon: "💰", delay: "0s", dur: "9s" },
  { left: "85%", text: "✓ টাস্ক সম্পন্ন", icon: "✅", delay: "3s", dur: "10s" },
  { left: "30%", text: "👥 নতুন রেফার", icon: "", delay: "6s", dur: "9.5s" },
  { left: "62%", text: "+১৫৳ বোনাস", icon: "🎁", delay: "1.8s", dur: "11s" },
  { left: "45%", text: "✓ পেমেন্ট পাঠানো", icon: "", delay: "4.5s", dur: "10.5s" },
];

const NODES = [
  { cx: 60, cy: 60 }, { cx: 150, cy: 40 }, { cx: 240, cy: 80 },
  { cx: 100, cy: 150 }, { cx: 200, cy: 160 }, { cx: 290, cy: 140 },
];
const LINKS = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* animated gradient blobs — peach/pink/purple/teal */}
      <div className="animate-blob absolute -top-48 -left-48 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25 bg-gradient-to-br from-peach via-rose to-grape" />
      <div className="animate-blob absolute top-1/4 -right-56 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-grape via-rose to-peach" style={{ animationDelay: "-6s" }} />
      <div className="animate-blob absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-15 bg-gradient-to-br from-aqua via-grape to-rose" style={{ animationDelay: "-12s" }} />

      {/* referral network — moving connections */}
      <svg
        className="absolute right-[4%] top-[22%] w-72 h-56 opacity-25 hidden lg:block"
        viewBox="0 0 340 210"
        fill="none"
      >
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke="url(#netgrad)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="animate-dash"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="10" fill="rgba(255,107,157,0.25)" />
            <circle cx={n.cx} cy={n.cy} r="4.5" fill={i % 2 ? "#2DD4BF" : "#FFB199"} />
          </g>
        ))}
        <defs>
          <linearGradient id="netgrad" x1="0" y1="0" x2="340" y2="210">
            <stop stopColor="#FFB199" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="absolute left-[3%] bottom-[16%] w-60 h-48 opacity-20 hidden lg:block"
        viewBox="0 0 340 210"
        fill="none"
      >
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke="#2DD4BF"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="animate-dash"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
        {NODES.map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r="4.5" fill={i % 2 ? "#FFB199" : "#A855F7"} />
        ))}
      </svg>

      {/* task-complete checkmarks popping */}
      {CHECKS.map((c, i) => (
        <div
          key={i}
          className="animate-check-pop absolute"
          style={{ left: c.left, top: c.top, animationDelay: c.delay }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aqua to-grape flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-aqua/30">
            ✓
          </div>
        </div>
      ))}

      {/* floating coins */}
      {COINS.map((c, i) => (
        <span
          key={i}
          className={`floaty absolute ${c.size} font-bold text-peach opacity-20`}
          style={{ left: c.left, top: c.top, animationDelay: c.delay, animationDuration: c.dur }}
        >
          ৳
        </span>
      ))}

      {/* mini live-activity cards rising + fading */}
      {RISERS.map((r, i) => (
        <div
          key={i}
          className="animate-rise-fade absolute"
          style={{ left: r.left, bottom: "6%", animationDelay: r.delay, animationDuration: r.dur }}
        >
          <div className="glass rounded-full px-4 py-2 text-xs font-bold text-white whitespace-nowrap">
            {r.icon ? `${r.icon} ` : ""}{r.text}
          </div>
        </div>
      ))}

      {/* people working online — subtle illustration accents */}
      <div className="floaty absolute left-[6%] top-[42%] text-5xl opacity-20 hidden md:block" style={{ animationDuration: "12s" }}>
        🧑‍💻
      </div>
      <div className="floaty absolute right-[7%] top-[64%] text-4xl opacity-20 hidden md:block" style={{ animationDuration: "10s", animationDelay: "2s" }}>
        👩‍💻
      </div>
    </div>
  );
}
