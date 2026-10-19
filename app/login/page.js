"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, googleLogin, API_READY } from "../../lib/api";
import { GOOGLE_CLIENT_ID } from "../../lib/config";
import { IconBadge, IconKey, IconGear, IconXBadge } from "../../components/icons";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/30 text-white placeholder:text-faint";

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
    <div className="max-w-md mx-auto py-8 relative">
      <div className="ambient-glow w-[28rem] h-[28rem] -top-24 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <div className="text-center relative">
        <IconBadge size={64} className="mx-auto">
          <IconKey size={30} className="[&_*]:stroke-white" />
        </IconBadge>
        <h1 className="mt-4 font-display text-4xl font-extrabold page-title">Log in</h1>
        <p className="text-mist mt-1 text-sm">Sign in to your account.</p>
      </div>

      {!API_READY && (
        <p className="mt-4 text-center text-sm bg-peach/10 border border-peach/30 rounded-full px-4 py-3 font-bold text-peach flex items-center justify-center gap-2">
          <IconGear size={16} className="icon-3d" /> Server setup in progress — please try again in a moment.
        </p>
      )}

      {GOOGLE_READY && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div ref={googleBtnRef} className="flex justify-center min-h-[44px]">
            {gBusy && <p className="text-sm text-mist">Signing in with Google…</p>}
          </div>
          <div className="flex items-center gap-3 w-full my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-faint">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-2 glass card-warm rounded-[2rem] p-8 space-y-5 relative">
        <div>
          <label className="font-bold text-sm text-white">Gmail address</label>
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>
        <div>
          <label className="font-bold text-sm text-white">Password</label>
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-xs font-bold text-mist hover:text-white">
              Forgot Password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3 flex items-center gap-2"><IconXBadge size={16} className="icon-3d" /> {error}</p>
        )}

        <button
          type="submit"
          disabled={busy || !API_READY}
          className="w-full btn-gradient animate-cta-pulse text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Please wait…" : "Log in"}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-mist">
        No account?{" "}
        <Link href="/signup" className="text-peach font-bold">Create account</Link>
      </p>
    </div>
  );
}
