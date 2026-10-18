"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../../lib/demo";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-rose text-white placeholder:text-faint";

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

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center">
        <span className="inline-flex w-16 h-16 btn-gradient rounded-[1.5rem] text-4xl items-center justify-center mx-auto shadow-lg shadow-rose/30">
          🔑
        </span>
        <h1 className="mt-4 text-3xl font-bold text-white">লগিন</h1>
        <p className="text-mist mt-1 text-sm">আপনার Gmail ও পাসওয়ার্ড দিয়ে লগিন করুন।</p>
      </div>

      <form onSubmit={submit} className="mt-6 glass rounded-[2rem] p-8 space-y-5">
        <div>
          <label className="font-bold text-sm text-white">Gmail ঠিকানা</label>
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>
        <div>
          <label className="font-bold text-sm text-white">পাসওয়ার্ড</label>
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>

        {error && (
          <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3">❌ {error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg shadow-rose/25"
        >
          {busy ? "অপেক্ষা করুন…" : "লগিন করুন"}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-mist">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="text-peach font-bold">অ্যাকাউন্ট খুলুন</Link>
      </p>
    </div>
  );
}
