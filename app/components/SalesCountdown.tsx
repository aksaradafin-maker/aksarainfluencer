"use client";

import { useEffect, useState } from "react";

type Props = {
  minutes: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function SalesCountdown({ minutes }: Props) {
  const [remaining, setRemaining] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = "rizzmago_sales_price_window_v1";

    let deadline = Number(
      window.localStorage.getItem(key) || 0
    );

    if (!deadline || deadline <= Date.now()) {
      deadline = Date.now() + minutes * 60 * 1000;
      window.localStorage.setItem(
        key,
        String(deadline)
      );
    }

    const tick = () => {
      const next = Math.max(
        0,
        deadline - Date.now()
      );

      setRemaining(next);
      setReady(true);
    };

    tick();

    const timer = window.setInterval(
      tick,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [minutes]);

  const totalSeconds = Math.floor(
    remaining / 1000
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutesLeft = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  if (!ready) {
    return (
      <div className="sales-countdown">
        <span>PRICE LOCK WINDOW</span>
        <strong>30:00</strong>
      </div>
    );
  }

  if (remaining <= 0) {
    return (
      <div className="sales-countdown sales-countdown-expired">
        <span>PRICE LOCK WINDOW</span>
        <strong>WINDOW SELESAI</strong>
      </div>
    );
  }

  return (
    <div className="sales-countdown">
      <span>PRICE LOCK WINDOW</span>

      <strong>
        {hours > 0
          ? `${pad(hours)}:${pad(minutesLeft)}:${pad(seconds)}`
          : `${pad(minutesLeft)}:${pad(seconds)}`}
      </strong>

      <small>
        Kunci harga batch sekarang sebelum
        window berakhir.
      </small>
    </div>
  );
}