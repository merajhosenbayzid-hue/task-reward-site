// Demo state helpers — everything lives in localStorage. No real API calls.
"use client";

const KEYS = {
  user: "tr_user",
  deposits: "tr_deposits",
  withdrawals: "tr_withdrawals",
  taskClicks: "tr_task_clicks",
};

const DEFAULT_USER = {
  name: "ডেমো ব্যবহারকারী",
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

export const SITE_DOMAIN = "https://task-reward.onrender.com";
