"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../../lib/demo";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const r = await loginUser(email, password);
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
        <span className="inline-block w-16 h-16 bg-sun rounded-[1.5rem] text-4xl flex items-center justify-center mx-auto">
          🔑
        </span>
        <h1 className="mt-4 text-3xl font-bold text-ink">লগিন</h1>
        <p className="text-inksoft mt-1 text-sm">আপনার Gmail ও পাসওয়ার্ড দিয়ে লগিন করুন।</p>
      </div>

      <form onSubmit={submit} className="mt-6 bg-white rounded-[2rem] p-8 shadow-sm space-y-5">
        <div>
          <label className="font-bold text-sm text-ink">Gmail ঠিকানা</label>
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>
        <div>
          <label className="font-bold text-sm text-ink">পাসওয়ার্ড</label>
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>

        {error && (
          <p className="bg-peach text-ink font-bold text-sm rounded-2xl px-4 py-3">❌ {error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-coral text-white font-bold py-4 rounded-2xl hover:bg-coraldeep disabled:opacity-50 shadow-lg shadow-coral/25"
        >
          {busy ? "অপেক্ষা করুন…" : "লগিন করুন"}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-inksoft">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="text-coral font-bold">অ্যাকাউন্ট খুলুন</Link>
      </p>
    </div>
  );
}
