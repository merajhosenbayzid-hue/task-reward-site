"use client";

import Link from "next/link";
import { useEffect } from "react";
import LiveFeed from "../components/LiveFeed";

const MARQUEE = ["রেফার করুন", "কমিশন জিতুন", "টাস্ক সম্পন্ন করুন", "১০% ওয়েলকাম বোনাস", "দ্রুত পেমেন্ট", "২৪/৭ সাপোর্ট"];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
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
          <p className="text-xs uppercase tracking-[0.25em] text-peach font-bold">
            🎉 নতুন ইউজারদের জন্য ১০% ওয়েলকাম বোনাস
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-bold leading-tight text-white">
            কাজ করুন, <span className="text-gradient">রেফার করুন</span>
            <br />
            পুরস্কার জিতুন
          </h1>
          <p className="mt-5 text-mist text-lg max-w-md">
            বাংলাদেশের সবচেয়ে সহজ টাস্ক ও রিওয়ার্ড প্ল্যাটফর্ম। প্রতিদিন
            হাজারো ইউজার আয় করছে — আপনিও শুরু করুন একদম ফ্রিতে।
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="bg-white text-night font-bold px-8 py-3.5 rounded-full hover:bg-mist transition shadow-xl shadow-white/10"
            >
              ফ্রি অ্যাকাউন্ট খুলুন
            </Link>
            <Link
              href="/dashboard"
              className="border border-white/25 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition"
            >
              ড্যাশবোর্ড দেখুন
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["১২,০০০+", "সন্তুষ্ট ইউজার"],
              ["৮.৫ লাখ৳+", "মোট পেমেন্ট"],
              ["৪.৮/৫", "ইউজার রেটিং"],
              ["২৪ ঘণ্টা", "সাপোর্ট"],
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
                  {m} <span className="text-peach">✦</span>
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
            মাত্র ৩ ধাপে <span className="text-gradient">আয় শুরু</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {[
            ["১", "ফ্রি অ্যাকাউন্ট খুলুন", "শুধু নাম, জিমেইল ও মোবাইল নম্বর দিয়ে ১ মিনিটে রেজিস্টার করুন।", "from-peach to-rose"],
            ["২", "১০০৳ দিয়ে অ্যাক্টিভ করুন", "৭ দিনের জন্য অ্যাকাউন্ট অ্যাক্টিভ করুন ও রেফারেল শুরু করুন।", "from-rose to-grape"],
            ["৩", "রেফার করুন ও আয় করুন", "বন্ধুদের রেফার করুন, প্রতিটি ডিপোজিটে ৫% কমিশন পান।", "from-aqua to-grape"],
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
            কেন <span className="text-gradient">টাস্ক রিওয়ার্ড</span>?
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ["🎁", "১০% ওয়েলকাম বোনাস", "প্রথম ডিপোজিটেই অতিরিক্ত বোনাস।"],
            ["👥", "৫% রেফারেল কমিশন", "প্রতিটি রেফারের ডিপোজিটে ইনস্ট্যান্ট কমিশন।"],
            ["⚡", "দ্রুত পেমেন্ট", "উত্তোলন রিকোয়েস্টে দ্রুত অ্যাপ্রুভাল।"],
            ["🔒", "১০০% নিরাপদ", "আপনার তথ্য ও ব্যালেন্স সম্পূর্ণ সুরক্ষিত।"],
          ].map(([e, t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="glass rounded-[2rem] p-6 h-full hover:bg-white/[0.08] transition">
                <p className="text-4xl">{e}</p>
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
            ইউজাররা যা <span className="text-gradient">বলছেন</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {[
            ["রাহাত হোসেন", "ঢাকা", "প্রথম মাসেই ১,২০০৳ উত্তোলন করেছি। রেফারেল সিস্টেমটা সত্যিই কাজ করে!", "from-peach to-rose"],
            ["নুসরাত জাহান", "চট্টগ্রাম", "ইন্টারফেসটা অনেক সহজ। বন্ধুদের রেফার করে ভালো কমিশন পাচ্ছি।", "from-aqua to-grape"],
            ["সাকিব আল হাসান", "রাজশাহী", "পেমেন্ট দ্রুত পেয়েছি। সাপোর্ট টিমও খুব হেল্পফুল।", "from-rose to-grape"],
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
                    <p className="text-xs text-faint">{c} • ⭐⭐⭐⭐⭐</p>
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
            সাধারণ <span className="text-gradient">প্রশ্নোত্তর</span>
          </h2>
        </Reveal>
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {[
            ["অ্যাকাউন্ট খুলতে কি টাকা লাগে?", "না, সম্পূর্ণ ফ্রি। শুধু নাম, জিমেইল ও মোবাইল নম্বর দিলেই হবে।"],
            ["কীভাবে আয় করবো?", "১০০৳ ডিপোজিট করে ৭ দিনের জন্য অ্যাকাউন্ট অ্যাক্টিভ করুন, তারপর বন্ধুদের রেফার করুন। প্রতিটি রেফারের ডিপোজিটে ৫% কমিশন পাবেন।"],
            ["টাকা কীভাবে তুলবো?", "নিজের অ্যাকাউন্ট অ্যাক্টিভ থাকলে এবং ১০ জন অ্যাক্টিভ রেফার থাকলে উত্তোলন করতে পারবেন।"],
            ["পেমেন্ট কত দ্রুত পাবো?", "উত্তোলন রিকোয়েস্ট অ্যাডমিন অ্যাপ্রুভালের পর দ্রুত পেমেন্ট পাঠানো হয়।"],
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
              আজই শুরু করুন আপনার আয়ের যাত্রা
            </h2>
            <p className="mt-3 text-white/85 max-w-md mx-auto">
              ফ্রি অ্যাকাউন্ট খুলুন, ১০% ওয়েলকাম বোনাস নিন।
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-block bg-white text-night font-bold px-10 py-4 rounded-full hover:bg-mist transition shadow-2xl"
            >
              এখনই শুরু করুন →
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
