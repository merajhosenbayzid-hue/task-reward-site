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
  if (out.user) syncCurrencyFromUser(out.user);
  return out;
}
export async function loginUser(email, password) {
  const out = await call("login", { email, password });
  setToken(out.token);
  if (out.user) syncCurrencyFromUser(out.user);
  return out;
}
export async function googleLogin(idToken) {
  const out = await call("googleLogin", { idToken });
  setToken(out.token);
  if (out.user) syncCurrencyFromUser(out.user);
  return out;
}
export async function getCurrentUser() {
  const t = getToken();
  if (!t) return null;
  try {
    const out = await call("getMe", {});
    syncCurrencyFromUser(out.user);
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

// ---------- profile / account ----------

export async function setCurrencyApi(currency) {
  return call("setCurrency", { currency });
}
export async function updateProfileName(name) {
  return call("updateProfile", { name });
}
export async function changePassword(currentPassword, newPassword) {
  return call("changePassword", { currentPassword, newPassword });
}
export async function updatePhoto(photo) {
  return call("updatePhoto", { photo });
}
export async function requestPasswordReset(email) {
  return call("requestPasswordReset", { email });
}
export async function verifyResetToken(token) {
  return call("verifyResetToken", { token });
}
export async function resetPassword(token, newPassword) {
  return call("resetPassword", { token, newPassword });
}

/** Push the server-side currency preference into localStorage (display only). */
export function syncCurrencyFromUser(user) {
  if (!user || !user.currency || typeof window === "undefined") return;
  const c = ["BDT", "USD", "EUR"].includes(user.currency) ? user.currency : "BDT";
  if (localStorage.getItem("tr_currency") !== c) {
    localStorage.setItem("tr_currency", c);
    window.dispatchEvent(new Event("tr-currency-change"));
  }
}

// ---------- owner panel (2FA, sessionStorage token) ----------

const ADMIN_TOKEN_KEY = "tr_admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}
export function setAdminToken(t) {
  if (typeof window === "undefined") return;
  if (t) sessionStorage.setItem(ADMIN_TOKEN_KEY, t);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
export function clearAdminToken() {
  setAdminToken(null);
}

/** Owner login step 1 — password check, OTP sent on success. */
export async function requestAdminOtp(email, password) {
  return call("requestAdminOtp", { email, password });
}
/** Owner login step 2 — verify 6-digit code, get admin token. */
export async function verifyAdminOtp(email, otp) {
  const out = await call("verifyAdminOtp", { email, otp });
  if (out.adminToken) setAdminToken(out.adminToken);
  return out;
}
export async function adminLogout() {
  try {
    await call("adminLogout", { adminToken: getAdminToken() });
  } catch {}
  clearAdminToken();
}

/** Throw the raw error so the panel can react to "Owner verification required". */
function adminCall(action, data = {}) {
  return call(action, { adminToken: getAdminToken(), ...data });
}

export async function ownerStats() {
  const out = await adminCall("adminStats", {});
  return out.stats;
}
export async function ownerDeposits(status = "all") {
  const out = await adminCall("adminDeposits", { status });
  return out.deposits;
}
export async function ownerDecideDeposit(requestId, decision, reason = "") {
  return adminCall("adminDecide", { requestId, decision, reason });
}
export async function ownerUsers() {
  const out = await adminCall("adminUsers", {});
  return out.users;
}
export async function ownerSuspend(email, banned) {
  return adminCall("adminSuspend", { email, banned });
}
export async function ownerWithdrawals(status = "all") {
  const out = await adminCall("adminWithdrawals", { status });
  return out.withdrawals;
}
export async function ownerDecideWithdrawal(requestId, decision, reason = "") {
  return adminCall("adminDecideWithdrawal", { requestId, decision, reason });
}
export async function ownerAudit() {
  const out = await adminCall("adminAudit", {});
  return out.log;
}
export async function ownerGetSettings() {
  const out = await adminCall("adminGetSettings", {});
  return out.settings;
}
export async function ownerSetSettings(settings) {
  return adminCall("adminSetSettings", { settings });
}
export async function ownerBackup() {
  return adminCall("adminBackup", {});
}

/** Public site settings — no auth needed. */
export async function getPublicSettings() {
  const out = await call("getPublicSettings", {});
  return out.settings || {};
}

// ---------- withdrawals (user) ----------

export async function requestWithdrawal({ amount, method, accountNo }) {
  return call("requestWithdrawal", { amount, method, accountNo });
}
export async function myWithdrawals() {
  const out = await call("myWithdrawals", {});
  return out.withdrawals || [];
}

// ---------- admin (legacy, now require owner 2FA token) ----------

export async function adminDeposits(status = "all") {
  const out = await adminCall("adminDeposits", { status });
  return out.deposits;
}
export async function adminDecide(requestId, decision, reason = "") {
  return adminCall("adminDecide", { requestId, decision, reason });
}
export async function adminUsers() {
  const out = await adminCall("adminUsers", {});
  return out.users;
}

export { API_READY };
