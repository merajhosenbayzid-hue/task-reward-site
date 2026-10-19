import Link from "next/link";
import { IconHeadset, IconMail } from "./icons";
import { SOCIALS } from "../lib/social";

export default function Footer() {
  // To enable a channel, set its url and enabled:true in lib/social.js
  const active = SOCIALS.filter((s) => s.enabled && s.url);

  return (
    <footer className="relative z-10 mt-20">
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="glass rounded-[2rem] px-8 py-10">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-xl font-bold text-white">
                  ৳
                </span>
                <span className="text-lg font-bold text-white">Task Reward</span>
              </div>
              <p className="mt-3 text-sm text-mist">
                A trusted task &amp; reward platform. Do easy tasks,
                refer friends, win rewards.
              </p>
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-widest text-faint">Quick Links</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Link href="/tasks" className="text-mist hover:text-white">Tasks</Link>
                <Link href="/deposit" className="text-mist hover:text-white">Deposit</Link>
                <Link href="/withdraw" className="text-mist hover:text-white">Withdraw</Link>
                <Link href="/referral" className="text-mist hover:text-white">Referral</Link>
                <Link href="/signup" className="text-mist hover:text-white">Create Account</Link>
                <Link href="/login" className="text-mist hover:text-white">Log in</Link>
              </div>
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-widest text-faint">Contact</p>
              <div className="mt-3 text-sm text-mist space-y-2">
                <p className="flex items-center gap-2"><IconHeadset size={16} className="icon-3d" /> Support: every day 9 AM – 10 PM</p>
                <p className="flex items-center gap-2"><IconMail size={16} className="icon-3d" /> support@task-reward-site.onrender.com</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-faint">
            <p>© 2026 Task Reward — All rights reserved</p>
            <p>Clear rules • Secure payments • Made for Bangladesh 🇧🇩</p>
          </div>

          {/* ---------- Support & Community ---------- */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="font-bold text-xs uppercase tracking-widest text-faint">Support &amp; Community</p>
            {active.length > 0 ? (
              <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-4">
                {active.map(({ id, label, url, Icon }) => (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="flex flex-col items-center gap-1.5 text-mist hover:text-white transition group"
                  >
                    <span className="w-11 h-11 rounded-full glass flex items-center justify-center group-hover:-translate-y-1 group-hover:bg-white/15 transition">
                      <Icon />
                    </span>
                    <span className="text-[10px] font-bold">{label}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-faint">Our official support channels are coming soon.</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
