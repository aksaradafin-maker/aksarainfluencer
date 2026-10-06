"use client";

import { useEffect } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"];

export default function CtaTracker() {
  useEffect(() => {
    let saved: Record<string, string> = {};
    try {
      saved = JSON.parse(sessionStorage.getItem("rzm_utm") || "{}");
    } catch {}

    const q = new URLSearchParams(location.search);
    KEYS.forEach((k) => {
      const v = q.get(k);
      if (v) saved[k] = v;
    });
    try {
      sessionStorage.setItem("rzm_utm", JSON.stringify(saved));
    } catch {}

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="lynk.id"]');
      if (!a) return;

      const spot = a.closest("section,header,footer")?.className.split(" ")[0] || "sticky-bar";

      const url = new URL(a.href);
      Object.entries(saved).forEach(([k, v]) => url.searchParams.set(k, v));
      a.href = url.toString();

      const body = JSON.stringify({ spot, ...saved });
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      (window as any).fbq?.("track", "InitiateCheckout");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}