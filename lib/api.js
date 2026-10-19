// Real backend API client — talks to the TaskReward Apps Script backend.
// Session token is kept in localStorage; everything else lives server-side.
"use client";

import { API_URL, API_READY } from "./config";

const TOKEN_KEY = "tr_api_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(t) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function call(action, data = {}) {
  if (!API_READY) throw new Error("Server not connected yet — setup in progress.");
  let res;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action, token: getToken(), ...data }),
    });
  } catch {
    throw new Error("Can't reach the server — check your internet and try again.");
  }
  let out;
  try {
    out = await res.json();
  } catch {
    throw new Error("Invalid response from server — please try again later.");
  }
  if (!out.ok) {
    const err = new Error(out.error || "Something went wrong.");
    err.code = out.error;
    throw err;
  }
  return out;
}

// ---------- auth ----------

export async function requestOtp({ name, email, phone, password, referral }) {
  return call("requestOtp", { name, email, phone, password, referral });
}
export async function verifyOtpAndRegister({ email, otp }) {
  const out = await call("verifyOtp", { email, otp });
  setToken(out.token);
  return out;
}
export async function loginUser(email, password) {
  const out = await call("login", { email, password });
  setToken(out.token);
  return out;
}
export async function googleLogin(idToken) {
  const out = await call("googleLogin", { idToken });
  setToken(out.token);
  return out;
}
export async function getCurrentUser() {
  const t = getToken();
  if (!t) return null;
  try {
    const out = await call("getMe", {});
    return out.user;
  } catch {
    return null;
  }
}
export async function logout() {
  try {
    await call("logout", {});
  } catch {}
  setToken(null);
}

// ---------- pure helpers (same rules as before) ----------

export function isActive(user) {
  return !!(user && user.activeUntil && Date.now() < user.activeUntil);
}
export function daysLeft(user) {
  if (!isActive(user)) return 0;
  return Math.ceil((user.activeUntil - Date.now()) / 86400000);
}
export function getWithdrawEligibility(user, stats) {
  const reasons = [];
  if (!isActive(user)) {
    reasons.push("Your account is not active — activate it with a deposit.");
  }
  const active = stats ? stats.active : 0;
  if (active < 10) {
    reasons.push(`You need at least 10 eligible (active) referrals — you have ${active}.`);
  }
  return { eligible: reasons.length === 0, reasons, stats };
}

// ---------- referrals ----------

export async function getReferralInfo() {
  return call("referralInfo", {});
}
export function referralLink(code) {
  return `https://task-reward-site.onrender.com/signup?ref=${code}`;
}

// ---------- deposits ----------

export async function requestDeposit({ amount, method, senderNo, trxId }) {
  return call("requestDeposit", { amount, method, senderNo, trxId });
}
export async function myDeposits() {
  const out = await call("myDeposits", {});
  return out.deposits;
}

// ---------- admin ----------

export async function adminDeposits(status = "all") {
  const out = await call("adminDeposits", { status });
  return out.deposits;
}
export async function adminDecide(requestId, decision, reason = "") {
  return call("adminDecide", { requestId, decision, reason });
}
export async function adminUsers() {
  const out = await call("adminUsers", {});
  return out.users;
}

export { API_READY };
