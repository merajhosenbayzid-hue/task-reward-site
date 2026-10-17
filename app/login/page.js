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
    "w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">🔑 লগিন</h1>
      <p className="text-center text-gray-600 mt-1 text-sm">আপনার Gmail ও পাসওয়ার্ড দিয়ে লগিন করুন।</p>

      <form onSubmit={submit} className="mt-6 bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="font-bold text-sm">Gmail ঠিকানা</label>
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>
        <div>
          <label className="font-bold text-sm">পাসওয়ার্ড</label>
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 font-bold text-sm rounded-xl px-4 py-3">❌ {error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? "অপেক্ষা করুন…" : "লগিন করুন"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="text-emerald-700 font-bold">অ্যাকাউন্ট খুলুন</Link>
      </p>
    </div>
  );
}
