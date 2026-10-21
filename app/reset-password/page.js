"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyResetToken, resetPassword } from "../../lib/api";
import { IconBadge, IconKey, IconXBadge, IconCheckBadge } from "../../components/icons";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3.5 mt-1 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/30 text-white placeholder:text-faint";

function ResetBody() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState("checking"); // checking | invalid | valid | done
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) {
        if (alive) setState("invalid");
        return;
      }
      try {
        await verifyResetToken(token);
        if (alive) setState("valid");
      } catch {
        if (alive) setState("invalid");
      }
    })();
    return () => { alive = false; };
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (newPw.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (newPw !== confPw) {
      setErr("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(token, newPw);
      setState("done");
    } catch (e2) {
      setErr(e2.message || "This link is no longer valid. Please request a new one.");
      setState("invalid");
    }
    setBusy(false);
  }

  return (
    <div className="max-w-lg mx-auto py-8 relative">
      <div className="ambient-glow w-[28rem] h-[28rem] -top-24 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <div className="text-center relative">
        <IconBadge size={64} className="mx-auto">
          <IconKey size={30} className="[&_*]:stroke-white" />
        </IconBadge>
        <h1 className="mt-4 font-display text-5xl font-extrabold page-title">Reset Password</h1>
      </div>

      <div className="mt-6 glass card-warm rounded-[2rem] p-8 relative">
        {state === "checking" && (
          <p className="text-center text-mist text-sm py-4">Verifying your recovery link…</p>
        )}

        {state === "invalid" && (
          <div className="text-center space-y-4">
            <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-4 flex items-start gap-2 text-left">
              <IconXBadge size={18} className="icon-3d shrink-0 mt-0.5" />
              <span>This recovery link is invalid or has expired. Links work only once and expire after a short time.</span>
            </p>
            <Link
              href="/forgot-password"
              className="inline-block btn-gradient text-white font-bold px-8 py-3.5 rounded-full hover:opacity-90"
            >
              Request a new link
            </Link>
          </div>
        )}

        {state === "valid" && (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="font-bold text-sm text-white">New Password</label>
              <input
                className={input}
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="font-bold text-sm text-white">Confirm New Password</label>
              <input
                className={input}
                type="password"
                value={confPw}
                onChange={(e) => setConfPw(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
              />
            </div>
            {err && (
              <p className="bg-peach/15 border border-peach/40 text-peach font-bold text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                <IconXBadge size={16} className="icon-3d" /> {err}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full btn-gradient animate-cta-pulse text-white font-bold py-4 rounded-full hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        {state === "done" && (
          <div className="text-center space-y-4">
            <p className="bg-aqua/15 border border-aqua/40 text-aqua font-bold text-sm rounded-2xl px-4 py-4 flex items-start gap-2 text-left">
              <IconCheckBadge size={18} className="icon-3d shrink-0 mt-0.5" />
              <span>Your password has been changed successfully. You can now log in with your new password.</span>
            </p>
            <Link
              href="/login"
              className="inline-block btn-gradient text-white font-bold px-8 py-3.5 rounded-full hover:opacity-90"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<p className="text-center py-16 text-mist">Loading…</p>}>
      <ResetBody />
    </Suspense>
  );
}
