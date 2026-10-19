"use client";

import Link from "next/link";
import { useEffect } from "react";
import LiveFeed from "../../components/LiveFeed";
import { IconSparkles, IconGift, IconUsers, IconZap, IconLock, IconStar } from "../../components/icons";

import { useCurrency, formatMoney } from "../../lib/currency";

const MARQUEE = ["Refer & Earn", "Win Commissions", "Complete Tasks", "10% Welcome Bonus", "Fast Payments", "24/7 Support"];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [currency] = useCurrency();
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-peach font-bold flex items-center gap-2">
            <IconSparkles size={16} className="icon-3d" /> 10% welcome bonus for new users
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-bold leading-tight text-white">
            Work, <span className="text-gradient">refer</span>
            <br />
            and win rewards
          </h1>
          <p className="mt-5 text-mist text-lg max-w-md">
            The easiest task &amp; reward platform. Thousands of users earn
            every day — start completely free.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="bg-white text-night font-bold px-8 py-3.5 rounded-full hover:bg-mist transition shadow-xl shadow-white/10"
            >
              Create free account
            </Link>
            <Link
              href="/dashboard"
              className="border border-white/25 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition"
            >
              View dashboard
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["12,000+", "Happy users"],
              [`${formatMoney(850000, currency)}+`, "Total paid out"],
              ["4.8/5", "User rating"],
              ["24 hours", "Support"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-white">{v}</p>
                <p className="text-xs text-faint">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <Reveal>
          <LiveFeed />
        </Reveal>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="mt-16 -mx-4 overflow-hidden border-y border-white/10 py-4">
        <div className="animate-marquee flex whitespace-nowrap w-max">
          {[0, 1].map((n) => (
            <div key={n} className="flex">
              {MARQUEE.map((m, i) => (
                <span key={i} className="mx-6 text-sm font-bold uppercase tracking-widest text-mist flex items-center gap-6">
                  {m} <IconSparkles size={14} className="icon-3d" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="mt-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-aqua font-bold text-center">HOW IT WORKS</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white text-center">
            Start earning in <span className="text-gradient">3 steps</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {[
            ["1", "Create a free account", "Register in 1 minute with just your name, email and mobile number.", "from-peach to-rose"],
            ["2", "Activate with ৳100", "Activate your account for 7 days and start referring.", "from-rose to-grape"],
            ["3", "Refer and earn", "Refer friends — earn 5% commission on every deposit.", "from-aqua to-grape"],
          ].map(([n, t, d, g], i) => (
            <Reveal key={t} delay={i * 120}>
              <div className="glass rounded-[2rem] p-7 h-full hover:bg-white/[0.08] transition">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center text-xl font-bold text-white`}>
                  {n}
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{t}</h3>
                <p className="mt-2 text-sm text-mist">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="mt-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-aqua font-bold text-center">FEATURES</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white text-center">
            Why <span className="text-gradient">Task Reward</span>?
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            [<IconGift size={38} className="icon-3d" />, "10% welcome bonus", "Extra bonus on your first deposit."],
            [<IconUsers size={38} className="icon-3d" />, "5% referral commission", "Instant commission on every referral's deposit."],
            [<IconZap size={38} className="icon-3d" />, "Fast payments", "Quick approval on withdrawal requests."],
            [<IconLock size={38} className="icon-3d" />, "100% secure", "Your data and balance are fully protected."],
          ].map(([e, t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="glass rounded-[2rem] p-6 h-full hover:bg-white/[0.08] transition">
                <div className="animate-icon-float w-fit">{e}</div>
                <h3 className="mt-3 font-bold text-white">{t}</h3>
                <p className="mt-1.5 text-sm text-mist">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="mt-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-aqua font-bold text-center">TESTIMONIALS</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white text-center">
            What users <span className="text-gradient">say</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {[
            ["Rahat Hosen", "Dhaka", "I withdrew ৳1,200 in my first month. The referral system really works!", "from-peach to-rose"],
            ["Nusrat Jahan", "Chattogram", "The interface is so simple. I'm earning good commission by referring friends.", "from-aqua to-grape"],
            ["Sakib Al Hasan", "Rajshahi", "Got my payment fast. The support team is very helpful too.", "from-rose to-grape"],
          ].map(([n, c, q, g], i) => (
            <Reveal key={n} delay={i * 120}>
              <div className="glass rounded-[2rem] p-6 h-full">
                <p className="text-mist text-sm leading-relaxed">"{q}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${g} flex items-center justify-center font-bold text-white`}>
                    {n[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{n}</p>
                    <p className="text-xs text-faint">{c} • <span className="inline-flex items-center gap-0.5 align-middle">{[0, 1, 2, 3, 4].map((i) => <IconStar key={i} size={12} />)}</span></p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mt-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-aqua font-bold text-center">FAQ</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white text-center">
            Common <span className="text-gradient">questions</span>
          </h2>
        </Reveal>
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {[
            ["Does it cost anything to open an account?", "No, it's completely free. You only need your name, email and mobile number."],
            ["How do I earn?", "Deposit ৳100 to activate your account for 7 days, then refer friends. You'll earn 5% commission on every referral's deposit."],
            ["How do I withdraw money?", "You can withdraw when your own account is active and you have 10 active referrals."],
            ["How fast will I get paid?", "Payments are sent quickly after an admin approves your withdrawal request."],
          ].map(([q, a], i) => (
            <Reveal key={q} delay={i * 80}>
              <details className="glass rounded-2xl px-6 py-4 group">
                <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-peach group-open:rotate-45 transition text-xl">+</span>
                </summary>
                <p className="mt-3 text-sm text-mist">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <Reveal>
        <section className="mt-20 relative overflow-hidden rounded-[2.5rem]">
          <div className="absolute inset-0 btn-gradient opacity-90" />
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl animate-blob" />
          <div className="relative px-8 py-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Start your earning journey today
            </h2>
            <p className="mt-3 text-white/85 max-w-md mx-auto">
              Open a free account and grab your 10% welcome bonus.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-block bg-white text-night font-bold px-10 py-4 rounded-full hover:bg-mist transition shadow-2xl"
            >
              Start now →
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
