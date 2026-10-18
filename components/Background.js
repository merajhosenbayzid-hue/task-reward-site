const COINS = [
  { left: "6%", top: "12%", size: "text-4xl", delay: "0s", o: "opacity-20" },
  { left: "88%", top: "8%", size: "text-5xl", delay: "1.5s", o: "opacity-15" },
  { left: "12%", top: "58%", size: "text-3xl", delay: "3s", o: "opacity-20" },
  { left: "82%", top: "52%", size: "text-4xl", delay: "0.8s", o: "opacity-15" },
  { left: "70%", top: "82%", size: "text-3xl", delay: "2.2s", o: "opacity-20" },
  { left: "25%", top: "85%", size: "text-5xl", delay: "4s", o: "opacity-10" },
  { left: "45%", top: "4%", size: "text-3xl", delay: "2.8s", o: "opacity-15" },
  { left: "93%", top: "78%", size: "text-4xl", delay: "1.2s", o: "opacity-10" },
];

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* soft color blobs */}
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-sun/25 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-lav/25 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] bg-peach/40 rounded-full blur-3xl" />
      {/* floating coins — earning theme */}
      {COINS.map((c, i) => (
        <span
          key={i}
          className={`absolute ${c.size} ${c.o} floaty font-bold text-ink`}
          style={{ left: c.left, top: c.top, animationDelay: c.delay }}
        >
          ৳
        </span>
      ))}
    </div>
  );
}
