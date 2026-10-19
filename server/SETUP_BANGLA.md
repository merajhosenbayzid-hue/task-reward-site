# টাস্ক রিওয়ার্ড ব্যাকএন্ড সেটআপ (বাংলা গাইড)

তিনটা নতুন সিস্টেমের সার্ভার: **OTP রেজিস্ট্রেশন + Google লগইন + ডিপোজিট অনুমোদন**।
ডেটাবেস হবে তোমার Google Sheet (আসল, শেয়ার্ড)।

---

## ধাপ ১: Apps Script-এ কোড বসানো (৫ মিনিট)

1. যাও: **https://script.google.com** → **New project**
2. `Code.gs` ফাইলের পুরো কোড কপি করে এখানে পেস্ট করো (আগের কোড মুছে)
3. প্রজেক্টের নাম দাও: `TaskReward Backend` → **Save** (Ctrl+S)
4. উপরের ফাংশন লিস্ট থেকে **`setupOnce`** সিলেক্ট করে **Run** চাপো
5. **Authorize** চাইবে → তোমার Gmail সিলেক্ট করো → **Advanced** → **Go to TaskReward Backend (unsafe)** → **Allow**
   (এটা তোমার নিজের স্ক্রিপ্ট, ভয় নেই — OTP মেইল পাঠানোর অনুমতি লাগে)
6. নিচে **Execution log**-এ একটা Google Sheet লিংক দেখাবে — ওটা তোমার ডেটাবেস ✅

## ধাপ ২: Web App হিসেবে ডিপ্লয় (৩ মিনিট)

1. ডানে উপরে **Deploy** → **New deployment**
2. ⚙️ গিয়ার আইকন → **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. **Deploy** → **Authorize access** (আবার Allow)
6. **Web app URL** কপি করো — এটা `/exec` দিয়ে শেষ হবে

👉 এই URL টা আমাকে পাঠাও।

## ধাপ ৩: Google Client ID বানানো (৫ মিনিট) — "Google দিয়ে লগইন" বাটনের জন্য

1. যাও: **https://console.cloud.google.com**
2. উপরে প্রজেক্ট লিস্ট → **New Project** → নাম: `TaskReward` → **Create** → প্রজেক্ট সিলেক্ট করো
3. বামে মেনু → **APIs & Services** → **OAuth consent screen**
   - User Type: **External** → **Create**
   - App name: `Task Reward`, User support email: তোমার Gmail → **Save and Continue** (বাকি সব Next)
4. বামে **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**, Name: `TaskReward Web`
   - **Authorized JavaScript origins** → **Add URI**: `https://task-reward-site.onrender.com`
   - **Create**
5. **Client ID** কপি করো (লম্বা `.apps.googleusercontent.com` দিয়ে শেষ)

👉 এই Client ID টা আমাকে পাঠাও।

## ধাপ ৪: Client ID স্ক্রিপ্টে বসানো (১ মিনিট)

1. Apps Script-এ ফিরে যাও → কোডের একদম উপরে `CONFIG` ব্লকে
2. `GOOGLE_CLIENT_ID: "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE"` — এখানে তোমার Client ID বসাও
3. **Save** → **Deploy** → **Manage deployments** → ✏️ Edit → **New version** → **Deploy**
   (নতুন ভার্সন ডিপ্লয় না করলে Google লগইন কাজ করবে না!)

---

## ✅ চেকলিস্ট

- [ ] `setupOnce` রান হয়েছে, Sheet লিংক পেয়েছো
- [ ] Web app ডিপ্লয় হয়েছে (`/exec` URL)
- [ ] `/exec` URL আমাকে পাঠিয়েছো
- [ ] Google Client ID বানিয়ে আমাকে পাঠিয়েছো
- [ ] Client ID স্ক্রিপ্টে বসিয়ে **New version** ডিপ্লয় করেছো

এগুলো পেলেই আমি ফ্রন্টএন্ড যুক্ত করে লাইভ টেস্ট করবো।

## 📊 ডেটাবেস (Sheet)

`TaskReward DB` শিটে ৩টা ট্যাব: **Users** (ইউজার), **Deposits** (ডিপোজিট রিকোয়েস্ট), **OTPs** (OTP লগ)।
তুমি চাইলে শিট খুলে সরাসরি দেখতে পারবে কে রেজিস্টার করলো, কে ডিপোজিট চাইলো।

## ⚠️ নোট

- OTP মেইল যাবে তোমার Gmail থেকে (দিনে ~১০০টা ফ্রি — শুরুতে যথেষ্ট)
- অ্যাডমিন = শুধু তুমি (`merajhosenbayzid@gmail.com` দিয়ে লগিন করলে)
- পুরনো ডেমো অ্যাকাউন্টগুলো নতুন সিস্টেমে আসবে না — সবাই নতুন করে আসল অ্যাকাউন্ট খুলবে
