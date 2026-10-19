"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /promo is now the homepage — redirect old preview URL to /
export default function PromoRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
