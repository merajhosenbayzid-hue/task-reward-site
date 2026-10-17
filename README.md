# টাস্ক রিওয়ার্ড — ডেমো সংস্করণ

Bangla task & reward website — **Phase 1 demo**.

- Next.js 14 (App Router) + Tailwind CSS
- সম্পূর্ণ বাংলা UI
- কোনো আসল পেমেন্ট বা ব্যাকএন্ড নেই — সব ডেমো ডাটা `localStorage`-এ থাকে
- হেডারে "ডেমো সংস্করণ" ব্যাজ আছে

## চালানো

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # production server
```

Node 18+ প্রয়োজন।

## পেজ

- `/` — হোম (প্যাকেজ, বোনাস, কীভাবে কাজ করে)
- `/tasks` — ৪টি টাস্ক কার্ড
- `/dashboard` — ডেমো ইউজার স্ট্যাটস
- `/deposit` — ডিপোজিট ডেমো ফর্ম (বিকাশ/নগদ/রকেট)
- `/withdraw` — উত্তোলন ডেমো ফর্ম
- `/referral` — রেফারেল লিংক ও বোনাস টেবিল
- `/admin` — ডেমো অ্যাডমিন প্যানেল
