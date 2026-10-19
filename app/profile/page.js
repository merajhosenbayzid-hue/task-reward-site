"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser, isActive, daysLeft,
  updateProfileName, changePassword, updatePhoto, setCurrencyApi,
} from "../../lib/api";
import { useCurrency, formatMoney, setCurrencyLocal } from "../../lib/currency";
import { Avatar, StatusDot, IconUser, IconBadge, IconKey, IconCheckBadge, IconXBadge, IconClipboard } from "../../components/icons";
import CurrencySelect from "../../components/CurrencySelect";

const input =
  "w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3 mt-1 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/30 text-white placeholder:text-faint";

function Msg({ ok, err }) {
  if (!ok && !err) return null;
  return (
    <p className={`flex items-center gap-2 text-sm font-bold rounded-2xl px-4 py-3 ${
      ok ? "bg-aqua/15 border border-aqua/40 text-aqua" : "bg-peach/15 border border-peach/40 text-peach"
    }`}>
      {ok ? <IconCheckBadge size={16} className="icon-3d shrink-0" /> : <IconXBadge size={16} className="icon-3d shrink-0" />}
      {ok || err}
    </p>
  );
}

function Card({ title, children }) {
  return (
    <div className="glass card-warm rounded-[2rem] p-6 sm:p-8 relative">
      <h2 className="font-display text-xl font-extrabold page-title mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* Resize an image file to max 256px and return a JPEG data URL (or throw). */
function fileToPhotoDataUrl(file) {
  return new Promise((resolve, reject) => {
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      reject(new Error("Only JPG, PNG or WebP images are supported."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image is too large — please choose one under 5MB."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 256;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      for (const q of [0.85, 0.7, 0.55]) {
        const dataUrl = canvas.toDataURL("image/jpeg", q);
        if (dataUrl.length <= 150 * 1024 * 1.37) {
          resolve(dataUrl);
          return;
        }
      }
      reject(new Error("Couldn't shrink this image under 150KB — try a smaller one."));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image file."));
    };
    img.src = url;
  });
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currency] = useCurrency();

  // edit name
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [nameOk, setNameOk] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [nameBusy, setNameBusy] = useState(false);

  // photo
  const [preview, setPreview] = useState(null); // data URL staged for upload
  const [photoOk, setPhotoOk] = useState("");
  const [photoErr, setPhotoErr] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef(null);

  // password
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [pwOk, setPwOk] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  // currency note
  const [curMsg, setCurMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const cu = await getCurrentUser();
      if (!alive) return;
      if (!cu) {
        router.push("/login");
        return;
      }
      setUser(cu);
      setName(cu.name || "");
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, [router]);

  if (!loaded) return <p className="text-center py-16 text-mist">Loading...</p>;

  const active = isActive(user);

  async function saveName() {
    setNameOk("");
    setNameErr("");
    const n = name.trim();
    if (n.length < 2) {
      setNameErr("Please enter your name (at least 2 characters).");
      return;
    }
    setNameBusy(true);
    try {
      await updateProfileName(n);
      const cu = await getCurrentUser();
      if (cu) setUser(cu);
      setNameOk("Name updated successfully.");
      setEditMode(false);
    } catch (err) {
      setNameErr(err.message);
    }
    setNameBusy(false);
  }

  async function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setPhotoOk("");
    setPhotoErr("");
    try {
      const dataUrl = await fileToPhotoDataUrl(f);
      setPreview(dataUrl);
    } catch (err) {
      setPhotoErr(err.message);
    }
  }

  async function savePhoto() {
    if (!preview) return;
    setPhotoOk("");
    setPhotoErr("");
    setPhotoBusy(true);
    try {
      await updatePhoto(preview);
      const cu = await getCurrentUser();
      if (cu) setUser(cu);
      setPreview(null);
      setPhotoOk("Profile photo updated.");
    } catch (err) {
      setPhotoErr(err.message);
    }
    setPhotoBusy(false);
  }

  async function removePhoto() {
    setPhotoOk("");
    setPhotoErr("");
    setPhotoBusy(true);
    try {
      await updatePhoto("");
      const cu = await getCurrentUser();
      if (cu) setUser(cu);
      setPreview(null);
      setPhotoOk("Profile photo removed.");
    } catch (err) {
      setPhotoErr(err.message);
    }
    setPhotoBusy(false);
  }

  async function doChangePassword() {
    setPwOk("");
    setPwErr("");
    if (!curPw) {
      setPwErr("Please enter your current password.");
      return;
    }
    if (newPw.length < 6) {
      setPwErr("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confPw) {
      setPwErr("New password and confirmation don't match.");
      return;
    }
    setPwBusy(true);
    try {
      await changePassword(curPw, newPw);
      setCurPw("");
      setNewPw("");
      setConfPw("");
      setPwOk("Password changed successfully.");
    } catch (err) {
      setPwErr(err.message);
    }
    setPwBusy(false);
  }

  async function handleCurrency(code) {
    setCurrencyLocal(code);
    setCurMsg("");
    try {
      await setCurrencyApi(code);
      const cu = await getCurrentUser();
      if (cu) setUser(cu);
      setCurMsg("Currency preference saved.");
    } catch (err) {
      setCurMsg("Saved on this device only — couldn't reach the server.");
    }
  }

  function copyRef() {
    try {
      navigator.clipboard.writeText(user.referralCode || "");
      setCurMsg("Referral code copied.");
      setTimeout(() => setCurMsg(""), 2000);
    } catch {}
  }

  // backend stores createdAt as "dd/MM/yyyy" — parse it safely
  const parseMemberDate = (s) => {
    if (!s) return null;
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s).trim());
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };
  const _md = parseMemberDate(user.createdAt);
  const memberSince = _md
    ? _md.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const shownPhoto = preview || user.photo;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6 relative">
      <div className="ambient-glow w-[30rem] h-[18rem] -top-16 left-1/2 -translate-x-1/2" aria-hidden="true" />
      {/* ---------- identity ---------- */}
      <div className="glass card-warm rounded-[2.5rem] p-8 text-center relative">
        <div className="flex justify-center">
          {shownPhoto ? (
            <img src={shownPhoto} alt="Profile" className="w-[84px] h-[84px] rounded-full object-cover ring-2 ring-white/20" />
          ) : (
            <Avatar name={user.name || user.email} size={84} />
          )}
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold page-title">{user.name || "User"}</h1>
        <p className="text-mist text-sm mt-1">{user.email}</p>
        {user.phone && <p className="text-mist text-sm mt-0.5">{user.phone}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${active ? "bg-aqua/15 text-aqua border border-aqua/30" : "bg-peach/15 text-peach border border-peach/30"}`}>
            <StatusDot active={active} size={10} />
            {active ? `Active — ${daysLeft(user)} days left` : "Inactive"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold bg-white/10 text-white border border-white/10">
            Balance: {formatMoney(user.balance, currency)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span className="text-faint">Referral code:</span>
          <code className="font-bold text-white bg-white/10 rounded-lg px-2.5 py-1">{user.referralCode || "—"}</code>
          <button onClick={copyRef} className="text-mist hover:text-white transition" title="Copy referral code">
            <IconClipboard size={16} className="icon-3d" />
          </button>
        </div>
        <p className="mt-2 text-xs text-faint">Member since {memberSince}</p>
      </div>

      {/* ---------- edit profile ---------- */}
      <Card title="Edit Profile">
        {editMode ? (
          <>
            <div>
              <label className="font-bold text-sm text-white">Name</label>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={60} />
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveName}
                disabled={nameBusy}
                className="btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90 disabled:opacity-50"
              >
                {nameBusy ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => { setEditMode(false); setName(user.name || ""); setNameErr(""); setNameOk(""); }}
                className="bg-white/10 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-faint">Name</p>
              <p className="font-bold text-white">{user.name || "—"}</p>
              <p className="text-sm text-faint mt-2">Email <span className="text-mist">(can't be changed)</span></p>
              <p className="font-bold text-white">{user.email}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-white text-night text-sm font-bold px-5 py-2.5 rounded-full hover:bg-mist shrink-0"
            >
              Edit Profile
            </button>
          </div>
        )}
        <Msg ok={nameOk} err={nameErr} />
      </Card>

      {/* ---------- profile photo ---------- */}
      <Card title="Profile Photo">
        <div className="flex items-center gap-4">
          {shownPhoto ? (
            <img src={shownPhoto} alt="Preview" className="w-16 h-16 rounded-full object-cover ring-2 ring-white/20 shrink-0" />
          ) : (
            <Avatar name={user.name || user.email} size={64} />
          )}
          <p className="text-xs text-faint">JPG, PNG or WebP. Resized to max 256px automatically (under 150KB).</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPickFile}
          className="hidden"
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            className="bg-white text-night text-sm font-bold px-5 py-2.5 rounded-full hover:bg-mist"
          >
            {user.photo || preview ? "Change Photo" : "Upload Photo"}
          </button>
          {preview && (
            <button
              onClick={savePhoto}
              disabled={photoBusy}
              className="btn-gradient text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50"
            >
              {photoBusy ? "Saving…" : "Save Changes"}
            </button>
          )}
          {user.photo && !preview && (
            <button
              onClick={removePhoto}
              disabled={photoBusy}
              className="bg-peach/15 border border-peach/40 text-peach text-sm font-bold px-5 py-2.5 rounded-full hover:bg-peach/25 disabled:opacity-50"
            >
              Remove Photo
            </button>
          )}
          {preview && (
            <button
              onClick={() => { setPreview(null); setPhotoErr(""); }}
              className="bg-white/10 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/20"
            >
              Cancel
            </button>
          )}
        </div>
        <Msg ok={photoOk} err={photoErr} />
      </Card>

      {/* ---------- change password ---------- */}
      <Card title="Change Password">
        <div>
          <label className="font-bold text-sm text-white">Current Password</label>
          <input className={input} type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="••••••" autoComplete="current-password" />
        </div>
        <div>
          <label className="font-bold text-sm text-white">New Password</label>
          <input className={input} type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
        </div>
        <div>
          <label className="font-bold text-sm text-white">Confirm New Password</label>
          <input className={input} type="password" value={confPw} onChange={(e) => setConfPw(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" />
        </div>
        <div>
          <button
            onClick={doChangePassword}
            disabled={pwBusy}
            className="btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
          >
            <IconKey size={16} className="[&_*]:stroke-white" />
            {pwBusy ? "Changing…" : "Change Password"}
          </button>
        </div>
        <Msg ok={pwOk} err={pwErr} />
      </Card>

      {/* ---------- preferences ---------- */}
      <Card title="Preferences">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-white text-sm">Display currency</p>
            <p className="text-xs text-faint mt-1">Display only — your real balance never changes.</p>
          </div>
          <CurrencySelect value={currency} onSelect={handleCurrency} />
        </div>
        {curMsg && <p className="text-xs font-bold text-aqua">{curMsg}</p>}
        <div className="pt-2">
          <Link href="/dashboard" className="text-sm font-bold text-mist hover:text-white">← Back to Dashboard</Link>
        </div>
      </Card>
    </div>
  );
}
