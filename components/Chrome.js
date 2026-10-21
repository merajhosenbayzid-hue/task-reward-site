"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Background from "./Background";
import { IconGear } from "./icons";
import { getPublicSettings } from "../lib/api";

const OWNER_PATH = "/owner-x7k2q9";

// Fetched once per page load; failures are silent (no banner, no maintenance).
let settingsCache = null;
let settingsPromise = null;
function loadPublicSettings() {
  if (settingsCache) return Promise.resolve(settingsCache);
  if (!settingsPromise) {
    settingsPromise = getPublicSettings()
      .then((s) => {
        settingsCache = s || {};
        return settingsCache;
      })
      .catch(() => {
        settingsCache = {};
        return settingsCache;
      });
  }
  return settingsPromise;
}

function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4 relative overflow-hidden">
      <div className="ambient-glow w-[34rem] h-[34rem] left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      <div className="text-center max-w-md relative">
        <div className="flex justify-center">
          <IconGear size={56} className="icon-3d animate-spin-slow" />
        </div>
        <h1 className="mt-5 text-3xl font-display font-extrabold page-title">Under maintenance</h1>
        <p className="mt-2 text-mist">We&apos;re improving the site — back soon.</p>
      </div>
    </div>
  );
}

// The owner's hero photo as a fixed background on every inner page —
// the same photo as the homepage, so it never disappears on navigation.
// Skipped on /classic (archive) and the owner panel.
function PhotoBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <img
        src="/images/hero-bg.jpg"
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  );
}

// Shared page chrome. The "/" landing page renders its own nav/hero,
// so the global Header/Background/Footer are skipped only on that route.
// The owner panel route is never bannered and never maintenance-gated.
export default function Chrome({ children }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState(null);
  const isOwner = pathname === OWNER_PATH;

  useEffect(() => {
    loadPublicSettings().then(setSettings);
  }, []);

  if (isOwner) return <>{children}</>;

  if (settings && settings.maintenance) {
    return <MaintenanceScreen />;
  }

  const banner =
    settings && settings.announcement ? (
      <div className="bg-[#14101f]/85 backdrop-blur-md border-b border-[#ff7a1a]/25 text-[#ffd9ae] text-center text-xs sm:text-sm font-bold px-4 py-2.5 relative z-[60]">
        {settings.announcement}
      </div>
    ) : null;

  if (pathname === "/") return <>{banner}{children}</>;

  const isClassic = pathname === "/classic";

  return (
    <>
      {banner}
      {!isClassic && <PhotoBg />}
      <Background />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-8 pb-4 relative z-10">{children}</main>
      <Footer />
    </>
  );
}
