// Demo state helpers — everything lives in localStorage. No real API calls.
"use client";

const KEYS = {
  user: "tr_user",
  deposits: "tr_deposits",
  withdrawals: "tr_withdrawals",
  taskClicks: "tr_task_clicks",
  users: "tr_users",
  session: "tr_session",
};

const DEFAULT_USER = {
  name: "ব্যবহারকারী",
  balance: 55, // টাকা
  referrals: 3,
  tasksDone: 2,
  package: "প্যাকেজ ২",
  referralCode: "DEMO2026",
};

export function getUser() {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(KEYS.user);
    if (raw) return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_USER;
}

export function saveUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function getList(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS[key]);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function addToList(key, item) {
  const list = getList(key);
  list.unshift({ id: Date.now(), date: new Date().toLocaleString("bn-BD"), status: "যাচাইাধীন", ...item });
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS[key], JSON.stringify(list));
  }
  return list;
}

export function seedDemoData() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.deposits)) {
    localStorage.setItem(
      KEYS.deposits,
      JSON.stringify([
        { id: 1, date: "১৮/১০/২০২৬", user: "রহিম উদ্দিন", method: "বিকাশ", amount: 50, trxId: "BKS9X2KQ7M", status: "যাচাইাধীন" },
        { id: 2, date: "১৭/১০/২০২৬", user: "করিম শেখ", method: "নগদ", amount: 100, trxId: "NGD4P8RT2W", status: "অনুমোদিত" },
      ])
    );
  }
  if (!localStorage.getItem(KEYS.withdrawals)) {
    localStorage.setItem(
      KEYS.withdrawals,
      JSON.stringify([
        { id: 1, date: "১৮/১০/২০২৬", user: "রহিম উদ্দিন", method: "বিকাশ", account: "01XXXXXXXXX", amount: 500, status: "যাচাইাধীন" },
      ])
    );
  }
}

export function getTaskClicks() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEYS.taskClicks);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function addTaskClick(taskId) {
  const clicks = getTaskClicks();
  clicks[taskId] = (clicks[taskId] || 0) + 1;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.taskClicks, JSON.stringify(clicks));
  }
  return clicks[taskId];
}

export const SITE_DOMAIN = "https://task-reward-site.onrender.com";

// ---------- Auth (localStorage-based) ----------

export function isGmail(email) {
  return /^[^\s@]+@gmail\.com$/i.test((email || "").trim());
}

export function isBdPhone(phone) {
  return /^01[3-9]\d{8}$/.test((phone || "").trim());
}

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("tr$" + pw));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getUsers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.users) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  if (typeof window !== "undefined") localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function generateReferralCode() {
  const users = getUsers();
  let code;
  do {
    code = "TR" + Math.floor(100000 + Math.random() * 900000);
  } while (users.some((u) => u.referralCode === code));
  return code;
}

export async function registerUser({ name, email, phone, password, referral }) {
  email = (email || "").trim().toLowerCase();
  phone = (phone || "").trim();
  name = (name || "").trim();
  const refCode = (referral || "").trim().toUpperCase();
  if (!name) return { ok: false, error: "আপনার নাম লিখুন।" };
  if (!isGmail(email)) return { ok: false, error: "শুধুমাত্র Gmail ঠিকানা দিয়ে অ্যাকাউন্ট খোলা যাবে (@gmail.com)।" };
  if (!isBdPhone(phone)) return { ok: false, error: "BD মোবাইল নম্বর ছাড়া অ্যাকাউন্ট খোলা যাবে না (01XXXXXXXXX)।" };
  if (!password || password.length < 6) return { ok: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" };
  const users = getUsers();
  if (users.some((u) => u.email === email)) return { ok: false, error: "এই Gmail দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে — লগিন করুন।" };
  if (users.some((u) => u.phone === phone)) return { ok: false, error: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।" };
  const referrer = refCode ? users.find((u) => u.referralCode === refCode) : null;
  const user = {
    name, email, phone,
    passHash: await hashPassword(password),
    referralCode: generateReferralCode(),
    referredBy: referrer ? referrer.referralCode : null,
    balance: 0, tasksDone: 0, package: "কোনো প্যাকেজ নেই",
    activeUntil: null,
    createdAt: new Date().toLocaleString("bn-BD"),
  };
  users.push(user);
  saveUsers(users);
  setSession(email);
  return { ok: true, user };
}

// ---------- Activation & referral rules ----------

export function isActive(user) {
  return !!(user && user.activeUntil && Date.now() < user.activeUntil);
}

export function daysLeft(user) {
  if (!isActive(user)) return 0;
  return Math.ceil((user.activeUntil - Date.now()) / 86400000);
}

export function updateUser(email, patch) {
  const users = getUsers();
  const u = users.find((x) => x.email === (email || "").toLowerCase());
  if (!u) return null;
  Object.assign(u, patch);
  saveUsers(users);
  return u;
}

export function activateAccount(email) {
  return updateUser(email, { activeUntil: Date.now() + 7 * 86400000 });
}

export function getReferralStats(myCode) {
  if (!myCode) return { total: 0, active: 0 };
  const refs = getUsers().filter((u) => u.referredBy === myCode);
  return { total: refs.length, active: refs.filter(isActive).length };
}

export function getWithdrawEligibility(user) {
  const reasons = [];
  if (!isActive(user)) {
    reasons.push("আপনার অ্যাকাউন্ট অ্যাক্টিভ নয় — ১০০ টাকা ডিপোজিট করে ৭ দিনের জন্য অ্যাক্টিভ করুন।");
  }
  const stats = getReferralStats(user.referralCode);
  if (stats.active < 10) {
    reasons.push(`যোগ্য (অ্যাক্টিভ) রেফারেল কমপক্ষে ১০ জন লাগবে — আপনার আছে ${stats.active} জন।`);
  }
  return { eligible: reasons.length === 0, reasons, stats };
}

export async function loginUser(email, password) {
  email = (email || "").trim().toLowerCase();
  const user = getUsers().find((u) => u.email === email);
  if (!user) return { ok: false, error: "এই Gmail দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" };
  if ((await hashPassword(password)) !== user.passHash)
    return { ok: false, error: "পাসওয়ার্ড ভুল হয়েছে।" };
  setSession(email);
  return { ok: true, user };
}

export function getSession() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.session);
}

export function setSession(email) {
  if (typeof window !== "undefined") {
    if (email) localStorage.setItem(KEYS.session, email);
    else localStorage.removeItem(KEYS.session);
  }
}

export function logout() {
  setSession(null);
}

export function getCurrentUser() {
  const email = getSession();
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}
