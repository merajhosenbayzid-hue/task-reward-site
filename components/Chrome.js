"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Background from "./Background";

// Shared page chrome. The "/" landing page renders its own nav/hero,
// so the global Header/Background/Footer are skipped only on that route.
export default function Chrome({ children }) {
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;
  return (
    <>
      <Background />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-28 pb-4 relative z-10">{children}</main>
      <Footer />
    </>
  );
}
