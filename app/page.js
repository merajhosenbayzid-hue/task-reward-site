"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  { n: "১", title: "ফ্রি অ্যাকাউন্ট খুলুন", text: "মাত্র ১ মিনিটে Gmail ও মোবাইল নম্বর দিয়ে অ্যাকাউন্ট খুলুন — কোনো টাকা লাগবে না।" },
  { n: "২", title: "অ্যাকাউন্ট অ্যাক্টিভ করুন", text: "বিকাশ, নগদ বা রকেটে ১০০ টাকা ডিপোজিট করে ৭ দিনের জন্য অ্যাক্টিভ করুন।" },
  { n: "৩", title: "টাস্ক ও রেফার করুন", text: "সহজ টাস্ক সম্পন্ন করুন এবং বন্ধুদের রেফার করে বোনাস আয় করুন।" },
  { n: "৪", title: "পুরস্কার জিতুন", text: "শর্ত পূরণ হলে বিকাশ/নগদ/রকেটে টাকা উত্তোলন করুন।" },
];

const STATS = [
  { value: "১২,০০০+", label: "সন্তুষ্ট ইউজার" },
  { value: "৮,৫০,০০০৳+", label: "মোট পেমেন্ট" },
  { value: "৪.৮/৫", label: "ইউজার রেটিং" },
  { value: "২৪ ঘণ্টা", label: "পেমেন্ট সময়" },
];

const TRUST_BADGES = [
  { icon: "🔒", title: "১০০% নিরাপদ", text: "আপনার তথ্য ও টাকা সম্পূর্ণ সুরক্ষিত" },
  { icon: "⚡", title: "দ্রুত পেমেন্ট", text: "উত্তোলনের ২৪ ঘণ্টার মধ্যে পেমেন্ট" },
  { icon: "🇧🇩", title: "বাংলাদেশি প্ল্যাটফর্ম", text: "বিকাশ, নগদ, রকেট সাপোর্ট" },
  { icon: "📜", title: "স্বচ্ছ নিয়ম", text: "লুকানো কোনো শর্ত নেই" },
];

const FEATURES = [
  { icon: "🎁", title: "১০% ওয়েলকাম বোনাস", text: "প্রতিটি সফল ডিপোজিটে ১০% বোনাস — ১০০ টাকায় ১১০ টাকা!" },
  { icon: "👥", title: "৫% রেফার বোনাস", text: "বন্ধুরা ডিপোজিট করলে আপনি পাবেন ৫%, তারাও পাবেন ৫%।" },
  { icon: "💰", title: "সহজ টাস্ক", text: "কঠিন কিছু নয় — সাধারণ কাজ করেই আয় শুরু করুন।" },
  { icon: "🟢", title: "৭ দিনের অ্যাক্টিভেশন", text: "মাত্র ১০০ টাকায় পুরো সপ্তাহের সুবিধা।" },
  { icon: "🏧", title: "সহজ উত্তোলন", text: "শর্ত পূরণ হলেই বিকাশ/নগদ/রকেটে টাকা তুলুন।" },
  { icon: "🎧", title: "বাংলা সাপোর্ট", text: "যেকোনো সমস্যায় বাংলায় সাহায্য পাবেন।" },
];

const TESTIMONIALS = [
  {
    name: "রহিম উদ্দিন",
    area: "ঢাকা",
    stars: "⭐⭐⭐⭐⭐",
    text: "প্রথমে বিশ্বাস হয়নি, কিন্তু ৭ দিনে ১০ জন রেফার করে ৫০০ টাকা তুলেছি। বিকাশে টাকা পেয়েছি ১ দিনেই!",
  },
  {
    name: "সুমাইয়া আক্তার",
    area: "চট্টগ্রাম",
    stars: "⭐⭐⭐⭐⭐",
    text: "নিয়মগুলো একদম পরিষ্কার। ডিপোজিটের পর অ্যাকাউন্ট অ্যাক্টিভ হলো, রেফার করে ভালো বোনাস পেয়েছি।",
  },
  {
    name: "করিম হোসেন",
    area: "রাজশাহী",
    stars: "⭐⭐⭐⭐",
    text: "সাপোর্ট খুব ভালো — একটা সমস্যায় মেসেজ করতেই সাথে সাথে সমাধান পেয়েছি। টাকা তোলাও সহজ।",
  },
];

const FAQS = [
  {
    q: "অ্যাকাউন্ট খুলতে কি টাকা লাগে?",
    a: "না, সম্পূর্ণ বিনামূল্যে অ্যাকাউন্ট খুলতে পারবেন। শুধু Gmail ও BD মোবাইল নম্বর লাগবে।",
  },
  {
    q: "অ্যাক্টিভেশন কী? কেন ১০০ টাকা ডিপোজিট করতে হবে?",
    a: "১০০ টাকা ডিপোজিট করলে আপনার অ্যাকাউন্ট ৭ দিনের জন্য অ্যাক্টিভ হয়। অ্যাক্টিভ থাকলেই রেফার, বোনাস ও উত্তোলনের সুবিধা পাবেন।",
  },
  {
    q: "টাকা কীভাবে পাবো?",
    a: "বিকাশ, নগদ বা রকেটে। উত্তোলনের আবেদন করলে ২৪ ঘণ্টার মধ্যে পেমেন্ট পাঠানো হয়।",
  },
  {
    q: "রেফার কীভাবে করবো?",
    a: "অ্যাকাউন্ট অ্যাক্টিভ করার পর আপনার ইউনিক রেফারেল লিংক পাবেন। লিংকটি বন্ধুদের সাথে শেয়ার করলেই হবে।",
  },
  {
    q: "৭ দিন পর কী হবে?",
    a: "অ্যাক্টিভেশন শেষ হলে নতুন রেফার ও আয় বন্ধ থাকবে। আবার ১০০ টাকা ডিপোজিট করে রিঅ্যাক্টিভ করতে পারবেন।",
  },
  {
    q: "এই সাইট কি বিশ্বস্ত?",
    a: "আমাদের সব নিয়ম ওয়েবসাইটে পরিষ্কারভাবে লেখা আছে — কোনো লুকানো শর্ত নেই। হাজারো ইউজার নিয়মিত পেমেন্ট পাচ্ছেন।",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow border border-emerald-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left font-bold"
      >
        <span>{q}</span>
        <span className="text-emerald-600 text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="px-5 pb-4 text-gray-600 text-sm">{a}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Announcement bar */}
      <div className="bg-amber-400 text-emerald-950 text-center text-sm font-bold rounded-xl px-4 py-2.5 -mt-2 mb-4">
        🎉 নতুন ইউজারদের জন্য ১০% ওয়েলকাম বোনাস! এখনই ফ্রি অ্যাকাউন্ট খুলুন
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-white/5 rounded-full" />
        <div className="relative">
          <span className="inline-block bg-white/20 text-sm font-bold px-4 py-1.5 rounded-full">
            🇧🇩 বাংলাদেশের বিশ্বস্ত টাস্ক প্ল্যাটফর্ম
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
            কাজ করুন,<br />পুরস্কার জিতুন 🎉
          </h1>
          <p className="mt-4 text-emerald-50 max-w-xl text-base md:text-lg">
            সহজ টাস্ক সম্পন্ন করে ও বন্ধুদের রেফার করে আয় করুন।
            ফ্রি অ্যাকাউন্ট, স্বচ্ছ নিয়ম, ২৪ ঘণ্টায় পেমেন্ট।
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Link
              href="/signup"
              className="bg-amber-400 text-emerald-950 font-bold px-7 py-3.5 rounded-xl hover:bg-amber-300 shadow-lg text-base"
            >
              🆓 ফ্রি অ্যাকাউন্ট খুলুন
            </Link>
            <Link
              href="/login"
              className="bg-white/15 border border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/25"
            >
              লগিন করুন
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-xl md:text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-emerald-100 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TRUST_BADGES.map((b) => (
          <div key={b.title} className="bg-white rounded-xl shadow p-4 flex gap-3 items-start border border-emerald-100">
            <span className="text-2xl">{b.icon}</span>
            <div>
              <p className="font-bold text-sm">{b.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{b.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center">⚙️ কীভাবে কাজ করে</h2>
        <p className="text-center text-gray-500 text-sm mt-1">মাত্র ৪টি সহজ ধাপে আয় শুরু করুন</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-emerald-500 hover:shadow-lg transition">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow">
                {s.n}
              </div>
              <h4 className="mt-3 font-bold">{s.title}</h4>
              <p className="mt-1 text-sm text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center">💎 কেন টাস্ক রিওয়ার্ড?</h2>
        <p className="text-center text-gray-500 text-sm mt-1">আপনার আস্থার কারণগুলো</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow p-6 border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition">
              <p className="text-3xl">{f.icon}</p>
              <h4 className="mt-2 font-bold">{f.title}</h4>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bonuses */}
      <section className="mt-12 grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg p-6 text-emerald-950">
          <h3 className="text-xl font-bold">🎁 ১০% ওয়েলকাম বোনাস</h3>
          <p className="mt-2 text-sm opacity-80">
            প্রতিটি সফল ডিপোজিটে ১০% বোনাস — যাচাইয়ের পর অ্যাকাউন্টে যোগ হবে।
          </p>
          <p className="mt-3 font-bold text-lg">১০০ টাকা → <span className="text-2xl">১১০ টাকা</span></p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold">👥 ৫% রেফার বোনাস</h3>
          <p className="mt-2 text-sm text-emerald-100">
            আপনার লিংকে কেউ ডিপোজিট করলে আপনি পাবেন ৫%, নতুন ব্যবহারকারীও পাবেন ৫%।
          </p>
          <p className="mt-3 font-bold text-lg">যত বেশি রেফার, তত বেশি আয় 🚀</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center">💬 ইউজারদের মতামত</h2>
        <p className="text-center text-gray-500 text-sm mt-1">যারা ইতিমধ্যে আয় করছেন</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-xl shadow p-6 border border-emerald-100">
              <p className="text-sm">{t.stars}</p>
              <p className="mt-2 text-sm text-gray-600 italic">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">📍 {t.area} • যাচাইকৃত ইউজার ✅</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center">❓ সাধারণ প্রশ্ন</h2>
        <p className="text-center text-gray-500 text-sm mt-1">আপনার সব প্রশ্নের উত্তর</p>
        <div className="mt-6 space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-12 bg-gradient-to-r from-emerald-700 to-teal-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold">আজই শুরু করুন — সম্পূর্ণ ফ্রি! 🚀</h2>
        <p className="mt-2 text-emerald-100">
          ১ মিনিটে অ্যাকাউন্ট খুলুন, ৭ দিনের অ্যাক্টিভেশনে আয় শুরু করুন।
        </p>
        <Link
          href="/signup"
          className="mt-5 inline-block bg-amber-400 text-emerald-950 font-bold px-8 py-3.5 rounded-xl hover:bg-amber-300 shadow-lg"
        >
          এখনই অ্যাকাউন্ট খুলুন
        </Link>
      </section>
    </div>
  );
}
