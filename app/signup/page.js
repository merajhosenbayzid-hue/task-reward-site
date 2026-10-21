"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { requestOtp, verifyOtpAndRegister, API_READY } from "../../lib/api";
import { IconBadge, IconEdit, IconGear, IconGift, IconAlert, IconXBadge, IconMail, IconCheckBadge } from "../../components/icons";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/30 text-white placeholder:text-faint";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const refFromUrl = params.get("ref") || "";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", referral: refFromUrl });
  const [step, setStep] = useState(1); // 1 = info, 2 = OTP
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function sendOtp(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const r = await requestOtp(form);
      setInfo(r.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function verify(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyOtpAndRegister({ email: form.email, otp });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="max-w-lg mx-auto py-8 relative">
      <div className="ambient-glow w-[28rem] h-[28rem] -top-24 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <div className="text-center relative">
        <IconBadge size={64} className="mx-auto">
          <IconEdit size={30} className="[&_*]:stroke-white" />
        </IconBadge>
        <h1 className="mt-4 font-display text-5xl font-extrabold page-title">Create Account</h1>
      </div>
      <p className="text-center text-mist mt-1 text-base">
        Completely free — verify your email to open an account.
      </p>

      {!API_READY && (
        <p className="mt-4 text-center text-sm bg-peach/10 border border-peach/30 rounded-full px-4 py-3 font-bold text-peach flex items-center justify-center gap-2">
          <IconGear size={16} className="icon-3d" /> Server setup in progress — please try again in a moment.
        </p>
      )}

      {refFromUrl && (
        <p className="mt-4 text-center text-sm bg-aqua/10 border border-aqua/30 rounded-full px-4 py-3 font-bold text-aqua flex items-center justify-center gap-2">
          <IconGift size={16} className="icon-3d" /> You came with referral code <b>{refFromUrl}</b>!
        </p>
      )}

      {step === 1 ? (
        <form onSubmit={sendOtp} className="mt-4 glass card-warm rounded-[2rem] p-7 space-y-4 relative">
          <div>
            <label className="font-bold text-sm text-white">Your name</label>
            <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">Gmail address</label>
            <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@gmail.com" />
            <p className="text-xs text-faint mt-1 flex items-center gap-1"><IconAlert size={12} className="icon-3d" /> The verification code will be sent to this address.</p>
          </div>
          <div>
            <label className="font-bold text-sm text-white">Mobile number</label>
            <input className={input} inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">Password (at least 6 characters)</label>
            <input className={input} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">Referral code (optional)</label>
            <input className={input} value={form.referral} onChange={(e) => set("referral", e.target.value)} placeholder="Optional" />
          </div>

          {error && (
            <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3 flex items-center gap-2"><IconXBadge size={16} className="icon-3d" /> {error}</p>
          )}

          <button
            type="submit"
            disabled={busy || !API_READY}
            className="w-full btn-gradient animate-cta-pulse text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Sending code…" : <span className="inline-flex items-center gap-2"><IconMail size={18} className="icon-3d icon-interactive" /> Verify email</span>}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-4 glass card-warm rounded-[2rem] p-7 space-y-4 relative">
          <div className="text-center">
            <p className="flex justify-center"><IconMail size={48} className="icon-3d animate-icon-float" /></p>
            <p className="mt-3 font-bold text-white">Enter verification code</p>
            <p className="text-sm text-mist mt-1">
              A 6-digit code was sent to <b className="text-white">{form.email}</b>.
            </p>
          </div>
          {info && (
            <p className="bg-aqua/10 border border-aqua/30 text-aqua font-bold text-sm rounded-2xl px-4 py-3 flex items-center gap-2"><IconCheckBadge size={16} className="icon-3d" /> {info}</p>
          )}
          <div>
            <label className="font-bold text-sm text-white">OTP code</label>
            <input
              className={`${input} text-center text-2xl tracking-[0.5em] font-bold`}
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
            <p className="text-xs text-faint mt-1 text-center">The code is valid for 5 minutes.</p>
          </div>

          {error && (
            <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3 flex items-center gap-2"><IconXBadge size={16} className="icon-3d" /> {error}</p>
          )}

          <button
            type="submit"
            disabled={busy || otp.length !== 6}
            className="w-full btn-gradient animate-cta-pulse text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Verifying…" : <span className="inline-flex items-center gap-2"><IconCheckBadge size={18} className="icon-3d icon-interactive" /> Verify & create account</span>}
          </button>
          <button
            type="button"
            onClick={sendOtp}
            disabled={busy}
            className="w-full text-sm text-peach font-bold hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
          <button
            type="button"
            onClick={() => { setStep(1); setError(""); setInfo(""); }}
            className="w-full text-sm text-faint hover:text-white"
          >
            ← Edit details
          </button>
        </form>
      )}

      <p className="text-center mt-5 text-sm text-mist">
        Already have an account?{" "}
        <Link href="/login" className="text-peach font-bold">Log in</Link>
      </p>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<p className="text-center py-10 text-mist">Loading...</p>}>
      <SignupForm />
    </Suspense>
  );
}
