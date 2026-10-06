"use client";

import { useEffect, useState } from "react";
import { OFFER } from "../offer.config";

const COOKIE = "rzm_visitor_offer_deadline_v2";
const rupiah = (v: number) => "Rp" + new Intl.NumberFormat("id-ID").format(v);

export default function VisitorOffer() {
  const { minutes, price, afterPrice } = OFFER.visitorWindow;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let ts = 0;
    try {
      const row = document.cookie.split("; ").find((c) => c.startsWith(COOKIE + "="));
      ts = row ? Number(decodeURIComponent(row.split("=")[1])) : 0;
    } catch {}
    if (!Number.isFinite(ts) || ts <= 0) {
      ts = Date.now() + minutes * 60000;
      document.cookie = COOKIE + "=" + ts + "; Path=/; Max-Age=31536000; SameSite=Lax";
    }
    const tick = () => setRemaining(Math.max(0, ts - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [minutes]);

  if (remaining === null) return null;

  const expired = remaining <= 0;
  const total = Math.floor(remaining / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  return (
    <div className="visitor-offer">
      {expired ? (
        <div className="visitor-window visitor-window-expired">
          <span>WINDOW VISITOR BERAKHIR</span>
          <strong>{rupiah(afterPrice)}</strong>
        </div>
      ) : (
        <div className="visitor-window">
          <span>HARGA KHUSUS UNTUK VISITOR INI</span>
          <strong>{mm}:{ss}</strong>
          <small>Setelah window berakhir, harga menjadi {rupiah(afterPrice)}.</small>
        </div>
      )}
      <div className="visitor-price">
        <span>HARGA AKSES</span>
        <strong>{rupiah(expired ? afterPrice : price)}</strong>
      </div>
    </div>
  );
}