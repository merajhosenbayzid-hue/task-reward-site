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
    <div className="min-h-screen flex items-center justify-center bg-night px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center">
          <IconGear size={56} className="icon-3d animate-spin-slow" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white">Under maintenance</h1>
        <p className="mt-2 text-mist">We&apos;re improving the site — back soon.</p>
      </div>
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
      <div className="bg-gradient-to-r from-peach via-rose to-grape text-white text-center text-xs sm:text-sm font-bold px-4 py-2.5 relative z-[60]">
        {settings.announcement}
      </div>
    ) : null;

  if (pathname === "/") return <>{banner}{children}</>;

  return (
    <>
      {banner}
      <Background />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-28 pb-4 relative z-10">{children}</main>
      <Footer />
    </>
  );
}
