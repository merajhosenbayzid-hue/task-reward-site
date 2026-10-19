"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, googleLogin, API_READY } from "../../lib/api";
import { GOOGLE_CLIENT_ID } from "../../lib/config";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-rose text-white placeholder:text-faint";

const GOOGLE_READY = !GOOGLE_CLIENT_ID.includes("PASTE_");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_READY || typeof window === "undefined") return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogle,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_black",
          size: "large",
          width: 320,
          text: "signin_with",
          shape: "pill",
        });
      } catch {}
    };
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGoogle(response) {
    setError("");
    setGBusy(true);
    try {
      await googleLogin(response.credential);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setGBusy(false);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center">
        <span className="inline-flex w-16 h-16 btn-gradient rounded-[1.5rem] text-4xl items-center justify-center mx-auto shadow-lg shadow-rose/30">
          🔑
        </span>
        <h1 className="mt-4 text-3xl font-bold text-white">লগিন</h1>
        <p className="text-mist mt-1 text-sm">আপনার অ্যাকাউন্টে প্রবেশ করুন।</p>
      </div>

      {!API_READY && (
        <p className="mt-4 text-center text-sm bg-peach/10 border border-peach/30 rounded-full px-4 py-3 font-bold text-peach">
          ⚙️ সার্ভার সেটআপ চলছে — কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      )}

      {GOOGLE_READY && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div ref={googleBtnRef} className="flex justify-center min-h-[44px]">
            {gBusy && <p className="text-sm text-mist">Google দিয়ে লগইন হচ্ছে…</p>}
          </div>
          <div className="flex items-center gap-3 w-full my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-faint">অথবা</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-2 glass rounded-[2rem] p-8 space-y-5">
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
          disabled={busy || !API_READY}
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
