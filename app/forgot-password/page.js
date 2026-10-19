"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../../lib/api";
import { IconBadge, IconMail, IconCheckBadge } from "../../components/icons";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/30 text-white placeholder:text-faint";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (busy || sent) return;
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
    } catch {
      // never reveal whether the email is registered
    }
    setBusy(false);
    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto py-8 relative">
      <div className="ambient-glow w-[28rem] h-[28rem] -top-24 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <div className="text-center relative">
        <IconBadge size={64} className="mx-auto">
          <IconMail size={30} className="[&_*]:stroke-white" />
        </IconBadge>
        <h1 className="mt-4 font-display text-4xl font-extrabold page-title">Forgot Password</h1>
        <p className="text-mist mt-1 text-sm">Enter your registered Gmail address and we&apos;ll send you a recovery link.</p>
      </div>

      <form onSubmit={submit} className="mt-6 glass card-warm rounded-[2rem] p-8 relative space-y-5">
        {sent ? (
          <p className="bg-aqua/15 border border-aqua/40 text-aqua font-bold text-sm rounded-2xl px-4 py-4 flex items-start gap-2">
            <IconCheckBadge size={18} className="icon-3d shrink-0 mt-0.5" />
            <span>If this email is registered, a recovery link has been sent. Please check your inbox (and spam folder).</span>
          </p>
        ) : (
          <>
            <div>
              <label className="font-bold text-sm text-white">Gmail address</label>
              <input
                className={input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="w-full btn-gradient animate-cta-pulse text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Sending…" : "Send Recovery Link"}
            </button>
          </>
        )}
      </form>

      <p className="text-center mt-5 text-sm text-mist">
        Remembered your password?{" "}
        <Link href="/login" className="font-bold text-white hover:underline">Log in</Link>
      </p>
    </div>
  );
}
