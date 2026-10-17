"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../../lib/demo";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", referral: "" });
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
    "w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">📝 অ্যাকাউন্ট খুলুন</h1>
      <p className="text-center text-gray-600 mt-1 text-sm">
        শুধু Gmail ঠিকানা ও BD মোবাইল নম্বর দিয়ে অ্যাকাউন্ট খোলা যাবে।
      </p>

      <form onSubmit={submit} className="mt-6 bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="font-bold text-sm">আপনার নাম</label>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="যেমন: রহিম উদ্দিন" />
        </div>
        <div>
          <label className="font-bold text-sm">Gmail ঠিকানা</label>
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@gmail.com" />
          <p className="text-xs text-gray-500 mt-1">⚠️ @gmail.com ছাড়া অন্য কোনো ঠিকানায় কোড যাবে না।</p>
        </div>
        <div>
          <label className="font-bold text-sm">BD মোবাইল নম্বর</label>
          <input className={input} inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" />
          <p className="text-xs text-gray-500 mt-1">⚠️ BD নম্বর ছাড়া অ্যাকাউন্ট খোলা যাবে না।</p>
        </div>
        <div>
          <label className="font-bold text-sm">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
          <input className={input} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" />
        </div>
        <div>
          <label className="font-bold text-sm">রেফারেল কোড (যদি থাকে)</label>
          <input className={input} value={form.referral} onChange={(e) => set("referral", e.target.value)} placeholder="ঐচ্ছিক" />
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 font-bold text-sm rounded-xl px-4 py-3">❌ {error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? "অপেক্ষা করুন…" : "অ্যাকাউন্ট খুলুন"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="text-emerald-700 font-bold">লগিন করুন</Link>
      </p>
    </div>
  );
}
