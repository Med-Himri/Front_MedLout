"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_ID, ensureGtag } from "@/lib/googleAnalytics";

// Loads Google Analytics 4 on the shop. Page views are sent by GA itself
// (first load + page changes). Not loaded on the admin, which is always
// opened with a full page load, so staff visits are not counted.
export function GoogleAnalytics() {
  const pathname = usePathname();
  const enabled = Boolean(GA_ID) && !pathname.startsWith("/dashboard");

  useEffect(() => {
    if (enabled) ensureGtag();
  }, [enabled]);

  if (!enabled) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />;
}
