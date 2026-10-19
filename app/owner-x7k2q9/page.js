"use client";

import { useEffect, useState } from "react";
import {
  getAdminToken, clearAdminToken, requestAdminOtp, verifyAdminOtp, adminLogout,
  ownerStats, ownerDeposits, ownerDecideDeposit, ownerUsers, ownerSuspend,
  ownerWithdrawals, ownerDecideWithdrawal, ownerAudit, ownerGetSettings,
  ownerSetSettings, ownerBackup,
} from "../../lib/api";
import {
  IconShieldCheck, IconLock, IconKey, IconCheckBadge, IconXBadge, IconClock,
  IconUsers, IconUser, IconGear, IconClipboard, IconReceipt, IconSend,
  IconAlert, IconInbox, IconBanknote, IconEdit,
} from "../../components/icons";

const TABS = ["Overview", "Requests", "Users", "Settings", "Audit Log", "Backup"];

const inputCls =
  "mt-1 w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3 focus:border-rose focus:outline-none text-white placeholder:text-faint";
const btnPrimary =
  "btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50";
const btnGhost =
  "bg-white/5 text-mist font-bold px-6 py-3 rounded-full hover:bg-white/10 transition disabled:opacity-50";

function bdt(n) {
  return `৳${Number(n || 0).toLocaleString("en-US")}`;
}
function fmtTime(t) {
  if (!t) return "—";
  const d = new Date(t);
  if (isNaN(d.getTime())) return String(t);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function isAuthError(e) {
  const m = String((e && e.message) || e || "");
  return /owner verification required|login required|invalid owner session/i.test(m);
}

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const base = "inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full";
  if (s === "approved") return <span className={`${base} bg-aqua/15 text-aqua`}><IconCheckBadge size={14} className="icon-3d" /> Approved</span>;
  if (s === "rejected") return <span className={`${base} bg-rose/15 text-rose`}><IconXBadge size={14} className="icon-3d" /> Rejected</span>;
  return <span className={`${base} bg-peach/15 text-peach`}><IconClock size={14} className="icon-3d" /> Pending</span>;
}

/* ---------------- request row (deposits + withdrawals) ---------------- */

function RequestCard({ r, kind, onDecide, busy }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const isPending = String(r.status || "").toLowerCase() === "pending";
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-white text-sm break-all">{r.requestId}</p>
          <p className="text-mist text-xs mt-1 break-all">{r.email}{r.name ? ` • ${r.name}` : ""}</p>
          <p className="text-faint text-xs mt-1">
            {r.method}{r.senderNo ? ` • Sender: ${r.senderNo}` : ""}{r.accountNo ? ` • Acc: ${r.accountNo}` : ""}{r.trxId ? ` • TrxID: ${r.trxId}` : ""}
          </p>
          <p className="text-faint text-xs">{fmtTime(r.createdAt)}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-white">{bdt(r.amount)}</p>
          <div className="mt-1"><StatusPill status={r.status} /></div>
        </div>
      </div>
      {r.status === "rejected" && r.rejectReason && (
        <p className="mt-3 text-xs text-rose bg-rose/10 border border-rose/20 rounded-2xl px-4 py-2.5">
          Reason: {r.rejectReason}
        </p>
      )}
      {isPending && !rejecting && (
        <div className="mt-4 flex gap-2">
          <button
            disabled={busy}
            onClick={() => onDecide(r.requestId, "approve", "")}
            className="flex-1 bg-aqua/20 text-aqua font-bold py-2.5 rounded-full hover:bg-aqua/30 transition disabled:opacity-50 text-sm"
          >
            Approve
          </button>
          <button
            disabled={busy}
            onClick={() => setRejecting(true)}
            className="flex-1 bg-rose/20 text-rose font-bold py-2.5 rounded-full hover:bg-rose/30 transition disabled:opacity-50 text-sm"
          >
            Reject
          </button>
        </div>
      )}
      {isPending && rejecting && (
        <div className="mt-4 space-y-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Rejection reason (shown to user)"
            className={inputCls}
          />
          <div className="flex gap-2">
            <button
              disabled={busy || !reason.trim()}
              onClick={() => { onDecide(r.requestId, "reject", reason.trim()); setRejecting(false); setReason(""); }}
              className="flex-1 bg-rose text-white font-bold py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50 text-sm"
            >
              Confirm reject
            </button>
            <button
              onClick={() => { setRejecting(false); setReason(""); }}
              className="px-5 bg-white/5 text-mist font-bold py-2.5 rounded-full hover:bg-white/10 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestSection({ title, icon, items, onDecide, busy, filter, setFilter }) {
  const counts = { all: items.length, pending: 0, approved: 0, rejected: 0 };
  items.forEach((r) => {
    const s = String(r.status || "").toLowerCase();
    if (counts[s] !== undefined) counts[s]++;
  });
  const shown = filter === "all" ? items : items.filter((r) => String(r.status || "").toLowerCase() === filter);
  return (
    <div>
      <h3 className="font-bold text-lg text-white flex items-center gap-2">{icon} {title}</h3>
      <div className="mt-3 flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition ${
              filter === f ? "btn-gradient text-white" : "bg-white/5 text-mist hover:bg-white/10"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {shown.length === 0 && (
          <p className="text-faint text-sm text-center py-8 flex flex-col items-center gap-2">
            <IconInbox size={28} className="icon-3d" /> No {filter} requests.
          </p>
        )}
        {shown.map((r) => (
          <RequestCard key={r.requestId} r={r} onDecide={onDecide} busy={busy} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- main page ---------------- */

export default function OwnerPanel() {
  const [stage, setStage] = useState("check"); // check | login1 | login2 | panel
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("Overview");

  // panel data
  const [stats, setStats] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [settings, setSettings] = useState({ announcement: "", maintenance: false });
  const [depFilter, setDepFilter] = useState("pending");
  const [wdFilter, setWdFilter] = useState("pending");
  const [actionBusy, setActionBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [backupInfo, setBackupInfo] = useState(null);

  function kickToLogin() {
    clearAdminToken();
    setStage("login1");
    setErr("");
    setPassword("");
    setOtp("");
  }

  async function loadAll() {
    try {
      const [st, dep, wd, us, au, se] = await Promise.all([
        ownerStats(), ownerDeposits("all"), ownerWithdrawals("all"),
        ownerUsers(), ownerAudit(), ownerGetSettings(),
      ]);
      setStats(st); setDeposits(dep); setWithdrawals(wd);
      setUsers(us); setAudit(au); setSettings({ announcement: se.announcement || "", maintenance: !!se.maintenance });
    } catch (e) {
      if (isAuthError(e)) kickToLogin();
      else setErr(e.message || "Failed to load panel data.");
    }
  }

  useEffect(() => {
    (async () => {
      if (!getAdminToken()) { setStage("login1"); return; }
      try {
        await ownerStats();
        setStage("panel");
        loadAll();
      } catch (e) {
        kickToLogin();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLogin1(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await requestAdminOtp(email.trim(), password);
      setStage("login2");
    } catch {
      setErr("Owner verification failed.");
    } finally {
      setBusy(false);
    }
  }

  async function doLogin2(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await verifyAdminOtp(email.trim(), otp.trim());
      setStage("panel");
      setPassword(""); setOtp("");
      loadAll();
    } catch (e2) {
      setErr(e2.message || "Verification failed.");
    } finally {
      setBusy(false);
    }
  }

  async function doLogout() {
    await adminLogout();
    kickToLogin();
  }

  async function decideDeposit(requestId, decision, reason) {
    setActionBusy(true); setNotice("");
    try {
      await ownerDecideDeposit(requestId, decision, reason);
      setNotice(`Deposit ${requestId} ${decision === "approve" ? "approved" : "rejected"}.`);
      const [dep, st] = await Promise.all([ownerDeposits("all"), ownerStats()]);
      setDeposits(dep); setStats(st);
    } catch (e) {
      if (isAuthError(e)) kickToLogin();
      else setNotice(e.message || "Action failed.");
    } finally {
      setActionBusy(false);
    }
  }

  async function decideWithdrawal(requestId, decision, reason) {
    setActionBusy(true); setNotice("");
    try {
      await ownerDecideWithdrawal(requestId, decision, reason);
      setNotice(`Withdrawal ${requestId} ${decision === "approve" ? "approved" : "rejected"}.`);
      const [wd, st] = await Promise.all([ownerWithdrawals("all"), ownerStats()]);
      setWithdrawals(wd); setStats(st);
    } catch (e) {
      if (isAuthError(e)) kickToLogin();
      else setNotice(e.message || "Action failed.");
    } finally {
      setActionBusy(false);
    }
  }

  async function toggleSuspend(u) {
    const toBan = !u.banned;
    if (!window.confirm(`${toBan ? "Suspend" : "Reactivate"} ${u.email}?`)) return;
    setActionBusy(true);
    try {
      await ownerSuspend(u.email, toBan);
      setUsers(await ownerUsers());
      setNotice(`${u.email} ${toBan ? "suspended" : "reactivated"}.`);
    } catch (e) {
      if (isAuthError(e)) kickToLogin();
      else setNotice(e.message || "Action failed.");
    } finally {
      setActionBusy(false);
    }
  }

  async function saveSettings() {
    setActionBusy(true); setNotice("");
    try {
      await ownerSetSettings({
        announcement: settings.announcement.slice(0, 500),
        maintenance: !!settings.maintenance,
      });
      setNotice("Settings saved.");
    } catch (e) {
      if (isAuthError(e)) kickToLogin();
      else setNotice(e.message || "Save failed.");
    } finally {
      setActionBusy(false);
    }
  }

  async function doBackup() {
    setActionBusy(true); setNotice(""); setBackupInfo(null);
    try {
      const b = await ownerBackup();
      setBackupInfo(b);
      setNotice("Backup created.");
    } catch (e) {
      if (isAuthError(e)) kickToLogin();
      else setNotice(e.message || "Backup failed.");
    } finally {
      setActionBusy(false);
    }
  }

  /* ---------- login screens ---------- */

  if (stage === "check") {
    return <p className="text-center py-24 text-mist">Loading...</p>;
  }

  if (stage === "login1" || stage === "login2") {
    return (
      <div className="max-w-md mx-auto py-16">
        <div className="glass rounded-[2.5rem] p-10 text-center">
          <div className="flex justify-center"><IconShieldCheck size={56} className="icon-3d animate-icon-float" /></div>
          <h1 className="mt-4 text-2xl font-bold text-white">Owner Panel</h1>
          <p className="mt-1 text-xs text-faint flex items-center justify-center gap-1.5">
            <IconLock size={12} className="icon-3d" /> Restricted area — authorized owner only
          </p>

          {stage === "login1" ? (
            <form onSubmit={doLogin1} className="mt-8 space-y-4 text-left">
              <div>
                <label className="font-bold text-sm text-white">Owner email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="owner@gmail.com" autoComplete="username" />
              </div>
              <div>
                <label className="font-bold text-sm text-white">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" autoComplete="current-password" />
              </div>
              {err && <p className="text-rose text-sm font-bold flex items-center gap-1.5"><IconAlert size={14} className="icon-3d" /> {err}</p>}
              <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
                {busy ? "Verifying..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={doLogin2} className="mt-8 space-y-4 text-left">
              <p className="text-sm text-mist text-center">A 6-digit verification code was sent to <span className="text-white font-bold break-all">{email}</span>.</p>
              <div>
                <label className="font-bold text-sm text-white">Verification code</label>
                <input
                  required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`${inputCls} text-center text-2xl tracking-[0.5em] font-bold`}
                  placeholder="••••••" inputMode="numeric" autoComplete="one-time-code"
                />
              </div>
              {err && <p className="text-rose text-sm font-bold flex items-center gap-1.5"><IconAlert size={14} className="icon-3d" /> {err}</p>}
              <button type="submit" disabled={busy || otp.length !== 6} className={`${btnPrimary} w-full`}>
                {busy ? "Verifying..." : "Verify & enter"}
              </button>
              <button type="button" onClick={() => { setStage("login1"); setErr(""); setOtp(""); }} className={`${btnGhost} w-full`}>
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ---------- panel ---------- */

  const cards = stats ? [
    { label: "Total users", value: stats.users, icon: <IconUsers size={26} className="icon-3d" /> },
    { label: "Active users", value: stats.activeUsers, icon: <IconCheckBadge size={26} className="icon-3d" /> },
    { label: "Pending deposits", value: stats.pendingDeposits, icon: <IconClock size={26} className="icon-3d" /> },
    { label: "Pending withdrawals", value: stats.pendingWithdrawals, icon: <IconBanknote size={26} className="icon-3d" /> },
    { label: "Approved deposits", value: stats.approvedDeposits, icon: <IconReceipt size={26} className="icon-3d" /> },
    { label: "Rejected deposits", value: stats.rejectedDeposits, icon: <IconXBadge size={26} className="icon-3d" /> },
    { label: "Approved withdrawals", value: stats.approvedWithdrawals, icon: <IconSend size={26} className="icon-3d" /> },
    { label: "Rejected withdrawals", value: stats.rejectedWithdrawals, icon: <IconXBadge size={26} className="icon-3d" /> },
    { label: "Audit entries", value: stats.auditEntries, icon: <IconClipboard size={26} className="icon-3d" /> },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconShieldCheck size={40} className="icon-3d" />
          <div>
            <h1 className="text-2xl font-bold text-white">Owner Panel</h1>
            <p className="text-xs text-faint break-all">{email}</p>
          </div>
        </div>
        <button onClick={doLogout} className={btnGhost}>Log out</button>
      </div>

      {err && <p className="mt-4 text-rose text-sm font-bold">{err}</p>}
      {notice && (
        <p className="mt-4 bg-aqua/10 border border-aqua/30 rounded-3xl px-5 py-3 text-sm font-bold text-aqua">{notice}</p>
      )}

      {/* tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setNotice(""); }}
            className={`whitespace-nowrap text-sm font-bold px-5 py-2.5 rounded-full transition ${
              tab === t ? "btn-gradient text-white" : "bg-white/5 text-mist hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Overview" && (
          <div>
            {!stats ? (
              <p className="text-mist text-center py-12">Loading stats...</p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {cards.map((c) => (
                    <div key={c.label} className="glass rounded-3xl p-5">
                      <div className="flex items-center gap-2">{c.icon}</div>
                      <p className="mt-2 text-3xl font-bold text-white">{c.value}</p>
                      <p className="text-xs text-faint">{c.label}</p>
                    </div>
                  ))}
                </div>
                <h3 className="mt-8 font-bold text-lg text-white">Recent activity</h3>
                <div className="mt-3 space-y-2">
                  {audit.slice(0, 8).map((a, i) => (
                    <div key={i} className="glass rounded-2xl px-4 py-3 text-xs flex flex-wrap gap-x-4 gap-y-1">
                      <span className="text-faint">{fmtTime(a.time)}</span>
                      <span className="text-white font-bold">{a.action}</span>
                      <span className="text-mist break-all">{a.detail}</span>
                    </div>
                  ))}
                  {audit.length === 0 && <p className="text-faint text-sm">No activity yet.</p>}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "Requests" && (
          <div className="space-y-10">
            <RequestSection
              title="Deposit requests" icon={<IconReceipt size={20} className="icon-3d" />}
              items={deposits} onDecide={decideDeposit} busy={actionBusy}
              filter={depFilter} setFilter={setDepFilter}
            />
            <RequestSection
              title="Withdrawal requests" icon={<IconBanknote size={20} className="icon-3d" />}
              items={withdrawals} onDecide={decideWithdrawal} busy={actionBusy}
              filter={wdFilter} setFilter={setWdFilter}
            />
          </div>
        )}

        {tab === "Users" && (
          <div>
            <div className="overflow-x-auto rounded-[1.5rem] glass">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="bg-white/10 text-white">
                    {["User", "Balance", "Referral", "Status", "Action"].map((h) => (
                      <th key={h} className="p-4 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-mist">
                  {users.map((u) => {
                    const isOwner = String(u.email || "").toLowerCase() === String(email || "").toLowerCase();
                    const banned = !!u.banned;
                    return (
                      <tr key={u.email} className="border-t border-white/5">
                        <td className="p-4">
                          <p className="font-bold text-white flex items-center gap-2">
                            <IconUser size={14} className="icon-3d" /> {u.name}
                            {isOwner && <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full">OWNER</span>}
                          </p>
                          <p className="text-xs text-faint break-all">{u.email}</p>
                          <p className="text-xs text-faint">{u.phone}</p>
                        </td>
                        <td className="p-4 font-bold text-white">{bdt(u.balance)}</td>
                        <td className="p-4 text-xs">{u.referralCode || "—"}</td>
                        <td className="p-4">
                          {banned
                            ? <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-rose/15 text-rose"><IconXBadge size={14} className="icon-3d" /> Suspended</span>
                            : <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-aqua/15 text-aqua"><IconCheckBadge size={14} className="icon-3d" /> Active</span>}
                        </td>
                        <td className="p-4">
                          {!isOwner && (
                            <button
                              disabled={actionBusy}
                              onClick={() => toggleSuspend({ ...u, banned })}
                              className={`text-xs font-bold px-4 py-2 rounded-full transition disabled:opacity-50 ${
                                banned ? "bg-aqua/20 text-aqua hover:bg-aqua/30" : "bg-rose/20 text-rose hover:bg-rose/30"
                              }`}
                            >
                              {banned ? "Reactivate" : "Suspend"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <p className="text-faint text-sm text-center py-8">No users found.</p>}
          </div>
        )}

        {tab === "Settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="glass rounded-[2rem] p-7">
              <h3 className="font-bold text-lg text-white flex items-center gap-2"><IconSend size={20} className="icon-3d" /> Site announcement</h3>
              <p className="text-xs text-faint mt-1">Shown as a banner on every page. Leave empty to hide.</p>
              <textarea
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value.slice(0, 500) })}
                rows={3}
                maxLength={500}
                className={inputCls}
                placeholder="e.g. Welcome bonus increased to 15% this week!"
              />
              <p className="text-xs text-faint text-right mt-1">{settings.announcement.length}/500</p>
            </div>
            <div className="glass rounded-[2rem] p-7 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2"><IconGear size={20} className="icon-3d" /> Maintenance mode</h3>
                <p className="text-xs text-faint mt-1">When on, visitors see an &quot;Under maintenance&quot; screen. The owner panel stays accessible.</p>
              </div>
              <button
                role="switch"
                aria-checked={settings.maintenance}
                onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })}
                className={`w-14 h-8 rounded-full transition shrink-0 ${settings.maintenance ? "btn-gradient" : "bg-white/10"}`}
              >
                <span className={`block w-6 h-6 bg-white rounded-full mt-1 transition-all ${settings.maintenance ? "ml-7" : "ml-1"}`} />
              </button>
            </div>
            <button onClick={saveSettings} disabled={actionBusy} className={btnPrimary}>
              {actionBusy ? "Saving..." : "Save settings"}
            </button>
          </div>
        )}

        {tab === "Audit Log" && (
          <div>
            <div className="overflow-x-auto rounded-[1.5rem] glass max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="sticky top-0">
                  <tr className="bg-white/10 text-white">
                    {["Time", "Actor", "Action", "Detail"].map((h) => (
                      <th key={h} className="p-4 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-mist">
                  {[...audit].reverse().map((a, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="p-4 text-xs whitespace-nowrap">{fmtTime(a.time)}</td>
                      <td className="p-4 text-xs break-all">{a.actor}</td>
                      <td className="p-4 font-bold text-white text-xs">{a.action}</td>
                      <td className="p-4 text-xs break-all">{a.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {audit.length === 0 && <p className="text-faint text-sm text-center py-8">No audit entries yet.</p>}
          </div>
        )}

        {tab === "Backup" && (
          <div className="max-w-2xl">
            <div className="glass rounded-[2rem] p-8 text-center">
              <div className="flex justify-center"><IconClipboard size={44} className="icon-3d" /></div>
              <h3 className="mt-3 font-bold text-lg text-white">Database backup</h3>
              <p className="mt-1 text-sm text-mist">Backups are full copies of the database in your Google Drive.</p>
              <button onClick={doBackup} disabled={actionBusy} className={`${btnPrimary} mt-5`}>
                {actionBusy ? "Creating..." : "Create backup now"}
              </button>
              {backupInfo && (
                <div className="mt-5 bg-white/5 rounded-2xl p-4 text-sm">
                  <p className="font-bold text-white break-all">{backupInfo.name}</p>
                  {backupInfo.url && (
                    <a href={backupInfo.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-peach font-bold underline">
                      Open in Google Drive
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
