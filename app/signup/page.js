"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../../lib/demo";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const refFromUrl = params.get("ref") || "";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", referral: refFromUrl });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const r = await registerUser(form);
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.push("/dashboard");
  }

  const input =
    "w-full border-2 border-creamdeep rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-coral bg-white";

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center">
        <span className="inline-block w-16 h-16 bg-sun rounded-[1.5rem] text-4xl flex items-center justify-center mx-auto">📝</span>
        <h1 className="mt-4 text-3xl font-bold text-ink">অ্যাকাউন্ট খুলুন</h1>
      </div>
      <p className="text-center text-inksoft mt-1 text-sm">
        সম্পূর্ণ বিনামূল্যে অ্যাকাউন্ট খুলুন — কোনো ডিপোজিট লাগবে না।
      </p>

      {refFromUrl && (
        <p className="mt-4 text-center text-sm bg-lav rounded-2xl px-4 py-3 font-bold text-ink">
          🎁 রেফারেল কোড <b>{refFromUrl}</b> দিয়ে এসেছেন!
        </p>
      )}

      <form onSubmit={submit} className="mt-4 bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="font-bold text-sm text-ink">আপনার নাম</label>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="যেমন: রহিম উদ্দিন" />
        </div>
        <div>
          <label className="font-bold text-sm text-ink">Gmail ঠিকানা</label>
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@gmail.com" />
          <p className="text-xs text-inksoft mt-1">⚠️ @gmail.com ছাড়া অন্য কোনো ঠিকানায় কোড যাবে না।</p>
        </div>
        <div>
          <label className="font-bold text-sm text-ink">BD মোবাইল নম্বর</label>
          <input className={input} inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" />
          <p className="text-xs text-inksoft mt-1">⚠️ BD নম্বর ছাড়া অ্যাকাউন্ট খোলা যাবে না।</p>
        </div>
        <div>
          <label className="font-bold text-sm text-ink">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
          <input className={input} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" />
        </div>
        <div>
          <label className="font-bold text-sm text-ink">রেফারেল কোড (যদি থাকে)</label>
          <input className={input} value={form.referral} onChange={(e) => set("referral", e.target.value)} placeholder="ঐচ্ছিক" />
        </div>

        {error && (
          <p className="bg-peach text-ink font-bold text-sm rounded-2xl px-4 py-3">❌ {error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-coral text-white font-bold py-4 rounded-2xl hover:bg-coraldeep disabled:opacity-50 shadow-lg shadow-coral/25"
        >
          {busy ? "অপেক্ষা করুন…" : "অ্যাকাউন্ট খুলুন"}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-inksoft">
        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="text-coral font-bold">লগিন করুন</Link>
      </p>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<p className="text-center py-10">লোড হচ্ছে...</p>}>
      <SignupForm />
    </Suspense>
  );
}
