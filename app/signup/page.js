"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { requestOtp, verifyOtpAndRegister, API_READY } from "../../lib/api";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-rose text-white placeholder:text-faint";

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
    <div className="max-w-md mx-auto py-8">
      <div className="text-center">
        <span className="inline-flex w-16 h-16 btn-gradient rounded-[1.5rem] text-4xl items-center justify-center mx-auto shadow-lg shadow-rose/30">📝</span>
        <h1 className="mt-4 text-3xl font-bold text-white">অ্যাকাউন্ট খুলুন</h1>
      </div>
      <p className="text-center text-mist mt-1 text-sm">
        সম্পূর্ণ বিনামূল্যে — ইমেইল যাচাই করে অ্যাকাউন্ট খুলুন।
      </p>

      {!API_READY && (
        <p className="mt-4 text-center text-sm bg-peach/10 border border-peach/30 rounded-full px-4 py-3 font-bold text-peach">
          ⚙️ সার্ভার সেটআপ চলছে — কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      )}

      {refFromUrl && (
        <p className="mt-4 text-center text-sm bg-aqua/10 border border-aqua/30 rounded-full px-4 py-3 font-bold text-aqua">
          🎁 রেফারেল কোড <b>{refFromUrl}</b> দিয়ে এসেছেন!
        </p>
      )}

      {step === 1 ? (
        <form onSubmit={sendOtp} className="mt-4 glass rounded-[2rem] p-7 space-y-4">
          <div>
            <label className="font-bold text-sm text-white">আপনার নাম</label>
            <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="যেমন: রহিম উদ্দিন" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">Gmail ঠিকানা</label>
            <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@gmail.com" />
            <p className="text-xs text-faint mt-1">⚠️ এই ঠিকানায় যাচাইকরণ কোড যাবে।</p>
          </div>
          <div>
            <label className="font-bold text-sm text-white">BD মোবাইল নম্বর</label>
            <input className={input} inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
            <input className={input} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" />
          </div>
          <div>
            <label className="font-bold text-sm text-white">রেফারেল কোড (যদি থাকে)</label>
            <input className={input} value={form.referral} onChange={(e) => set("referral", e.target.value)} placeholder="ঐচ্ছিক" />
          </div>

          {error && (
            <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3">❌ {error}</p>
          )}

          <button
            type="submit"
            disabled={busy || !API_READY}
            className="w-full btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg shadow-rose/25"
          >
            {busy ? "কোড পাঠানো হচ্ছে…" : "📧 ইমেইল যাচাই করুন"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-4 glass rounded-[2rem] p-7 space-y-4">
          <div className="text-center">
            <p className="text-5xl">📧</p>
            <p className="mt-3 font-bold text-white">যাচাইকরণ কোড দিন</p>
            <p className="text-sm text-mist mt-1">
              <b className="text-white">{form.email}</b> ঠিকানায় ৬ সংখ্যার কোড পাঠানো হয়েছে।
            </p>
          </div>
          {info && (
            <p className="bg-aqua/10 border border-aqua/30 text-aqua font-bold text-sm rounded-2xl px-4 py-3">✅ {info}</p>
          )}
          <div>
            <label className="font-bold text-sm text-white">OTP কোড</label>
            <input
              className={`${input} text-center text-2xl tracking-[0.5em] font-bold`}
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
            <p className="text-xs text-faint mt-1 text-center">কোডটি ৫ মিনিট কার্যকর থাকবে।</p>
          </div>

          {error && (
            <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3">❌ {error}</p>
          )}

          <button
            type="submit"
            disabled={busy || otp.length !== 6}
            className="w-full btn-gradient text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg shadow-rose/25"
          >
            {busy ? "যাচাই হচ্ছে…" : "✅ যাচাই করুন ও অ্যাকাউন্ট খুলুন"}
          </button>
          <button
            type="button"
            onClick={sendOtp}
            disabled={busy}
            className="w-full text-sm text-peach font-bold hover:underline disabled:opacity-50"
          >
            কোড আবার পাঠান
          </button>
          <button
            type="button"
            onClick={() => { setStep(1); setError(""); setInfo(""); }}
            className="w-full text-sm text-faint hover:text-white"
          >
            ← তথ্য বদলান
          </button>
        </form>
      )}

      <p className="text-center mt-5 text-sm text-mist">
        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="text-peach font-bold">লগিন করুন</Link>
      </p>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<p className="text-center py-10 text-mist">লোড হচ্ছে...</p>}>
      <SignupForm />
    </Suspense>
  );
}
