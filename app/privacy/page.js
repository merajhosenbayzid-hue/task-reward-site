import Link from "next/link";
import { IconBadge, IconLock } from "../../components/icons";

const sections = [
  {
    t: "1. What information we collect",
    b: "When you open an account, we store your name, Gmail address, mobile number and password (encrypted). If you sign in with Google, we receive your name, email and profile photo from Google — used only for login. For deposit requests we store the amount, payment method, sender number and transaction ID.",
  },
  {
    t: "2. How we use your information",
    b: "Your information is used only for: account verification (OTP), login, processing deposit requests, referral tracking and account support. It is not used for anything else.",
  },
  {
    t: "3. Where your data is stored",
    b: "Your data is securely stored on Google's servers (Google Sheets and Apps Script). Passwords are never kept in plain text.",
  },
  {
    t: "4. Sharing with third parties",
    b: "We do not sell or rent your personal information to anyone. It is not shared with third parties except where required by law.",
  },
  {
    t: "5. Your rights",
    b: "You can request to view, correct or delete your account information at any time — contact us at the email below.",
  },
  {
    t: "6. Contact",
    b: "For any privacy questions: merajhosenbayzid@gmail.com",
  },
];

export const metadata = {
  title: "Privacy Policy — Task Reward",
  description: "Task Reward privacy policy.",
};

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto py-8 relative">
      <div className="ambient-glow w-[26rem] h-[16rem] -top-16 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <div className="text-center relative">
        <IconBadge size={64} className="mx-auto">
          <IconLock size={30} className="[&_*]:stroke-white" />
        </IconBadge>
        <h1 className="mt-4 font-display text-5xl font-extrabold page-title">Privacy Policy</h1>
        <p className="text-mist mt-1 text-sm">Last updated: October 2026</p>
      </div>

      <div className="mt-8 space-y-4">
        {sections.map((s) => (
          <div key={s.t} className="glass card-warm rounded-[1.5rem] p-6">
            <h2 className="font-bold text-white">{s.t}</h2>
            <p className="text-mist text-sm mt-2 leading-relaxed">{s.b}</p>
          </div>
        ))}
      </div>

      <p className="text-center mt-8 text-sm text-mist">
        <Link href="/" className="text-peach font-bold">← Back to home</Link>
      </p>
    </div>
  );
}
