"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  { n: "১", title: "ফ্রি অ্যাকাউন্ট খুলুন", text: "Gmail ও মোবাইল নম্বর দিয়ে ১ মিনিটে অ্যাকাউন্ট খুলুন — কোনো টাকা লাগবে না।", bg: "bg-lav" },
  { n: "২", title: "অ্যাকাউন্ট অ্যাক্টিভ করুন", text: "বিকাশ, নগদ বা রকেটে ১০০ টাকা ডিপোজিট করে ৭ দিনের জন্য অ্যাক্টিভ করুন।", bg: "bg-sun" },
  { n: "৩", title: "টাস্ক ও রেফার করুন", text: "সহজ টাস্ক সম্পন্ন করুন এবং বন্ধুদের রেফার করে বোনাস আয় করুন।", bg: "bg-peach" },
  { n: "৪", title: "পুরস্কার জিতুন", text: "শর্ত পূরণ হলে বিকাশ/নগদ/রকেটে টাকা উত্তোলন করুন।", bg: "bg-peri" },
];

const STATS = [
  { value: "১২,০০০+", label: "সন্তুষ্ট ইউজার" },
  { value: "৮,৫০,০০০৳+", label: "মোট পেমেন্ট" },
  { value: "৪.৮/৫", label: "ইউজার রেটিং" },
  { value: "২৪ ঘণ্টা", label: "পেমেন্ট সময়" },
];

const TASK_TYPES = [
  { icon: "🖱️", title: "সহজ টাস্ক", text: "ক্লিক ও সাধারণ কাজ করে আয় করুন", bg: "bg-lav", chip: "জনপ্রিয়", chipBg: "bg-sun" },
  { icon: "👥", title: "রেফার করুন", text: "বন্ধুদের আমন্ত্রণ জানিয়ে বোনাস জিতুন", bg: "bg-peach", chip: "বোনাস", chipBg: "bg-coral text-white" },
  { icon: "🎁", title: "বোনাস আয়", text: "ওয়েলকাম ও রেফার বোনাসে আয় বাড়ান", bg: "bg-peri", chip: "১০%+", chipBg: "bg-lav" },
];

const BENEFITS = [
  { icon: "🔒", title: "নিরাপদ", text: "আপনার তথ্য ও টাকা সম্পূর্ণ সুরক্ষিত থাকে", bg: "bg-lav" },
  { icon: "⚡", title: "দ্রুত পেমেন্ট", text: "উত্তোলনের ২৪ ঘণ্টার মধ্যে টাকা পৌঁছে যায়", bg: "bg-creamdeep" },
  { icon: "📜", title: "স্বচ্ছ নিয়ম", text: "সব নিয়ম পরিষ্কার — লুকানো কোনো শর্ত নেই", bg: "bg-peach" },
];

const FEATURES = [
  { icon: "🎁", title: "১০% ওয়েলকাম বোনাস", text: "প্রতিটি সফল ডিপোজিটে ১০% বোনাস — ১০০ টাকায় ১১০ টাকা!", bg: "bg-lav" },
  { icon: "👥", title: "৫% রেফার বোনাস", text: "বন্ধুরা ডিপোজিট করলে আপনি ৫%, তারাও ৫% পাবেন।", bg: "bg-peach" },
  { icon: "🟢", title: "৭ দিনের অ্যাক্টিভেশন", text: "মাত্র ১০০ টাকায় পুরো সপ্তাহের সব সুবিধা।", bg: "bg-peri" },
  { icon: "🏧", title: "সহজ উত্তোলন", text: "শর্ত পূরণ হলেই বিকাশ/নগদ/রকেটে টাকা তুলুন।", bg: "bg-creamdeep" },
  { icon: "🎧", title: "বাংলা সাপোর্ট", text: "যেকোনো সমস্যায় বাংলায় সাহায্য পাবেন।", bg: "bg-lav" },
  { icon: "🇧🇩", title: "বাংলাদেশি প্ল্যাটফর্ম", text: "বিকাশ, নগদ, রকেট — সব পরিচিত মাধ্যমে পেমেন্ট।", bg: "bg-peach" },
];

const TESTIMONIALS = [
  {
    name: "রহিম উদ্দিন", area: "ঢাকা", stars: "⭐⭐⭐⭐⭐",
    text: "প্রথমে বিশ্বাস হয়নি, কিন্তু ৭ দিনে ১০ জন রেফার করে ৫০০ টাকা তুলেছি। বিকাশে টাকা পেয়েছি ১ দিনেই!",
  },
  {
    name: "সুমাইয়া আক্তার", area: "চট্টগ্রাম", stars: "⭐⭐⭐⭐⭐",
    text: "নিয়মগুলো একদম পরিষ্কার। ডিপোজিটের পর অ্যাকাউন্ট অ্যাক্টিভ হলো, রেফার করে ভালো বোনাস পেয়েছি।",
  },
  {
    name: "করিম হোসেন", area: "রাজশাহী", stars: "⭐⭐⭐⭐",
    text: "সাপোর্ট খুব ভালো — একটা সমস্যায় মেসেজ করতেই সাথে সাথে সমাধান পেয়েছি। টাকা তোলাও সহজ।",
  },
];

const FAQS = [
  { q: "অ্যাকাউন্ট খুলতে কি টাকা লাগে?", a: "না, সম্পূর্ণ বিনামূল্যে অ্যাকাউন্ট খুলতে পারবেন। শুধু Gmail ও BD মোবাইল নম্বর লাগবে।" },
  { q: "অ্যাক্টিভেশন কী? কেন ১০০ টাকা ডিপোজিট করতে হবে?", a: "১০০ টাকা ডিপোজিট করলে আপনার অ্যাকাউন্ট ৭ দিনের জন্য অ্যাক্টিভ হয়। অ্যাক্টিভ থাকলেই রেফার, বোনাস ও উত্তোলনের সুবিধা পাবেন।" },
  { q: "টাকা কীভাবে পাবো?", a: "বিকাশ, নগদ বা রকেটে। উত্তোলনের আবেদন করলে ২৪ ঘণ্টার মধ্যে পেমেন্ট পাঠানো হয়।" },
  { q: "রেফার কীভাবে করবো?", a: "অ্যাকাউন্ট অ্যাক্টিভ করার পর আপনার ইউনিক রেফারেল লিংক পাবেন। লিংকটি বন্ধুদের সাথে শেয়ার করলেই হবে।" },
  { q: "৭ দিন পর কী হবে?", a: "অ্যাক্টিভেশন শেষ হলে নতুন রেফার ও আয় বন্ধ থাকবে। আবার ১০০ টাকা ডিপোজিট করে রিঅ্যাক্টিভ করতে পারবেন।" },
  { q: "এই সাইট কি বিশ্বস্ত?", a: "আমাদের সব নিয়ম ওয়েবসাইটে পরিষ্কারভাবে লেখা আছে — কোনো লুকানো শর্ত নেই। হাজারো ইউজার নিয়মিত পেমেন্ট পাচ্ছেন।" },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="text-white/90 font-bold">{q}</span>
        <span className="text-white/60 text-2xl font-light shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="pb-5 text-white/60 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="-mt-2">
      {/* Hero — cream band, big rounded */}
      <section className="bg-creamdeep rounded-[2.5rem] px-6 md:px-12 pt-10 md:pt-14 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-sun/40 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-lav/40 rounded-full" />
        <div className="relative max-w-2xl">
          <span className="inline-block bg-white text-ink text-sm font-bold px-4 py-2 rounded-full shadow-sm">
            🎉 নতুন ইউজারদের জন্য ১০% ওয়েলকাম বোনাস
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-[1.15] text-ink">
            কাজ করুন,<br />পুরস্কার জিতুন
          </h1>
          <p className="mt-4 text-inksoft text-base md:text-lg max-w-lg">
            সহজ টাস্ক সম্পন্ন করে ও বন্ধুদের রেফার করে আয় করুন।
            ফ্রি অ্যাকাউন্ট, স্বচ্ছ নিয়ম, ২৪ ঘণ্টায় পেমেন্ট।
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            <Link
              href="/signup"
              className="bg-coral text-white font-bold px-8 py-4 rounded-2xl hover:bg-coraldeep shadow-lg shadow-coral/30 text-base"
            >
              শুরু করুন — ফ্রি
            </Link>
            <Link
              href="/login"
              className="bg-white text-ink font-bold px-8 py-4 rounded-2xl hover:bg-cream shadow-sm"
            >
              লগিন
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/70 rounded-3xl p-4 text-center">
                <p className="text-xl md:text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-inksoft mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Task types — white band, photo-style cards */}
      <section className="mt-14">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ink">টাস্কের ধরন</h2>
        <p className="text-center text-inksoft mt-2">পছন্দের কাজ বেছে নিন</p>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {TASK_TYPES.map((t) => (
            <div key={t.title} className={`${t.bg} rounded-[2rem] p-7 relative overflow-hidden`}>
              <span className={`${t.chipBg} text-xs font-bold px-3 py-1.5 rounded-full`}>
                {t.chip}
              </span>
              <p className="text-5xl mt-5">{t.icon}</p>
              <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm">
                <p className="font-bold text-lg text-ink">{t.title}</p>
                <p className="text-sm text-inksoft mt-1">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits — pastel cards */}
      <section className="mt-14">
        <div className="grid md:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <div key={b.title} className={`${b.bg} rounded-[2rem] p-8`}>
              <p className="text-4xl">{b.icon}</p>
              <p className="mt-4 font-bold text-xl text-ink">{b.title}</p>
              <p className="mt-1 text-inksoft">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to start — cream band, big rounded */}
      <section className="mt-14 bg-creamdeep rounded-[2.5rem] px-6 md:px-12 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ink">কীভাবে আয় শুরু করবেন</h2>
        <p className="text-center text-inksoft mt-2">মাত্র ৪টি সহজ ধাপ</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white rounded-[2rem] p-7">
              <span className={`${s.bg} w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-ink`}>
                {s.n}
              </span>
              <p className="mt-4 font-bold text-lg text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-inksoft">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-block bg-coral text-white font-bold px-10 py-4 rounded-2xl hover:bg-coraldeep shadow-lg shadow-coral/30"
          >
            শুরু করুন
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-14">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ink">কেন টাস্ক রিওয়ার্ড?</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`${f.bg} rounded-[2rem] p-7`}>
              <p className="text-4xl">{f.icon}</p>
              <p className="mt-3 font-bold text-lg text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-inksoft">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-14">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ink">ইউজারদের মতামত</h2>
        <p className="text-center text-inksoft mt-2">যারা ইতিমধ্যে আয় করছেন</p>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-[2rem] p-7 shadow-sm">
              <p className="text-sm">{t.stars}</p>
              <p className="mt-3 text-inksoft italic">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-11 h-11 bg-sun rounded-2xl flex items-center justify-center font-bold text-ink">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">{t.name}</p>
                  <p className="text-xs text-inksoft">📍 {t.area} • যাচাইকৃত ✅</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Q&A — dark navy panel like Yandex */}
      <section className="mt-14 bg-navy rounded-[2.5rem] px-6 md:px-12 py-12 md:py-14">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white">প্রশ্ন ও উত্তর</h2>
        <div className="mt-6 max-w-2xl mx-auto">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-block bg-coral text-white font-bold px-10 py-4 rounded-2xl hover:bg-coraldeep"
          >
            এখনই অ্যাকাউন্ট খুলুন — ফ্রি
          </Link>
        </div>
      </section>
    </div>
  );
}
