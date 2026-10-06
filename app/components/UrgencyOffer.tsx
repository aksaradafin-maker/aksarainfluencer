"use client";

import { useEffect, useState } from "react";

const OFFER_DURATION = 30 * 60;
const STORAGE_KEY = "rizmago_batch_offer_started_at";

export default function UrgencyOffer() {
  const [remaining, setRemaining] = useState(OFFER_DURATION);

  useEffect(() => {
    let startedAt = Number(localStorage.getItem(STORAGE_KEY));

    if (!startedAt || Number.isNaN(startedAt)) {
      startedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, String(startedAt));
    }

    const update = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(OFFER_DURATION - elapsed, 0));
    };

    update();

    const timer = window.setInterval(update, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <section className="offer-section" id="offer">
      <div className="offer-shell">

        {/* URGENCY BAR */}
        <div className="urgency-strip">
          <span className="urgency-dot" />
          <span className="urgency-label">BATCH PRICE</span>
          <span className="urgency-copy">
            Harga Rp199K dikunci selama
          </span>
          <strong className="urgency-timer">
            {minutes}:{seconds}
          </strong>
        </div>

        {/* HEADLINE */}
        <div className="offer-intro">
          <div className="offer-kicker">
            <span>LIMITED BATCH</span>
            <i />
            <span>RIZMAGO LAB STUDIO</span>
          </div>

          <h2>
            Early Bird sudah habis.
            <br />
            <em>Harga berikutnya naik.</em>
          </h2>

          <p>
            Kamu masih punya kesempatan masuk di harga batch sekarang.
            Tapi setelah periode ini selesai, akses berikutnya kembali ke
            harga normal batch selanjutnya.
          </p>
        </div>

        {/* PRICE LADDER */}
        <div className="price-ladder">

          <div className="price-step sold">
            <div className="step-top">
              <span>01 / EARLY BIRD</span>
              <b>SOLD OUT</b>
            </div>

            <div className="step-price">
              <del>Rp99.000</del>
            </div>

            <p>
              Harga early bird sudah habis.
            </p>
          </div>

          <div className="price-arrow">→</div>

          <div className="price-step current">
            <div className="step-top">
              <span>02 / CURRENT BATCH</span>
              <b>AVAILABLE NOW</b>
            </div>

            <div className="step-price">
              <del>Rp499.000</del>
              <strong>Rp199.000</strong>
            </div>

            <div className="save-badge">
              HEMAT Rp300.000
            </div>

            <p>
              Harga khusus untuk batch saat ini.
            </p>

            <a
              href="https://lynk.id/a/1911036127"
              target="_blank"
              rel="noopener noreferrer"
              className="offer-cta"
            >
              <span>🔥 KUNCI HARGA Rp199.000</span>
              <b>→</b>
            </a>
          </div>

          <div className="price-arrow">→</div>

          <div className="price-step future">
            <div className="step-top">
              <span>03 / NEXT BATCH</span>
              <b>AFTER THIS BATCH</b>
            </div>

            <div className="step-price">
              <strong>Rp499.000</strong>
            </div>

            <p>
              Harga setelah batch sekarang berakhir.
            </p>
          </div>

        </div>

        {/* VALUE */}
        <div className="value-area">

          <div className="value-heading">
            <span>WHAT YOU GET</span>

            <h3>
              Bukan cuma beli materi.
              <br />
              <em>Kamu mendapatkan sistem.</em>
            </h3>

            <p>
              Satu alur belajar untuk membantu kamu memahami proses
              content creation dari fondasi sampai evaluasi.
            </p>
          </div>

          <div className="value-grid">

            <article className="value-card">
              <span>01</span>
              <h4>11-Step Content System</h4>
              <p>
                Workflow dari fondasi, audience, riset, planning,
                produksi sampai evaluasi.
              </p>
              <small>SYSTEM VALUE</small>
            </article>

            <article className="value-card">
              <span>02</span>
              <h4>Video Lessons</h4>
              <p>
                Materi video untuk memahami setiap tahap secara
                bertahap dan terstruktur.
              </p>
              <small>LEARNING VALUE</small>
            </article>

            <article className="value-card">
              <span>03</span>
              <h4>Learning Materials</h4>
              <p>
                Materi pendukung yang bisa digunakan kembali saat
                kamu perlu review.
              </p>
              <small>REFERENCE VALUE</small>
            </article>

            <article className="value-card">
              <span>04</span>
              <h4>60 Flashcards</h4>
              <p>
                Latihan recall untuk membantu menguatkan pemahaman
                setelah belajar.
              </p>
              <small>LEARNING TOOL</small>
            </article>

            <article className="value-card">
              <span>05</span>
              <h4>Quiz & Learning Check</h4>
              <p>
                Cek pemahaman setelah menyelesaikan materi sebelum
                lanjut ke tahap berikutnya.
              </p>
              <small>CHECKPOINT</small>
            </article>

            <article className="value-card highlight">
              <span>06</span>
              <h4>Content Workflow</h4>
              <p>
                Bukan sekadar teori terpisah. Semua tahap dirancang
                sebagai satu alur kerja.
              </p>
              <small>CORE VALUE</small>
            </article>

          </div>
        </div>

        {/* BONUS */}
        <div className="bonus-area">

          <div className="bonus-heading">
            <div>
              <span>EXTRA VALUE</span>
              <h3>
                Plus bonus untuk
                <br />
                mempercepat eksekusi.
              </h3>
            </div>

            <p>
              Gunakan tools pendukung ini saat kamu mulai menerapkan
              sistem yang dipelajari.
            </p>
          </div>

          <div className="bonus-grid">

            <article className="bonus-card">
              <span>BONUS 01</span>
              <h4>Content Planning Framework</h4>
              <p>
                Struktur untuk membantu mengubah ide menjadi rencana
                konten yang lebih jelas.
              </p>
              <strong>ESTIMATED VALUE</strong>
            </article>

            <article className="bonus-card">
              <span>BONUS 02</span>
              <h4>Content Workflow Reference</h4>
              <p>
                Referensi alur kerja agar proses produksi tidak
                berjalan secara acak.
              </p>
              <strong>ESTIMATED VALUE</strong>
            </article>

            <article className="bonus-card">
              <span>BONUS 03</span>
              <h4>60 Learning Flashcards</h4>
              <p>
                Deck flashcard untuk mengulang konsep penting
                dengan cepat.
              </p>
              <strong>ESTIMATED VALUE</strong>
            </article>

          </div>
        </div>

        {/* FINAL OFFER */}
        <div className="final-offer">

          <div className="final-offer-copy">
            <span>THE DECISION</span>

            <h3>
              Kamu bisa masuk
              <br />
              <em>sekarang di Rp199K.</em>
            </h3>

            <p>
              Atau menunggu batch berikutnya dan membayar Rp499K.
            </p>

            <div className="price-comparison">
              <div>
                <small>SEKARANG</small>
                <strong>Rp199.000</strong>
              </div>

              <div className="comparison-arrow">→</div>

              <div>
                <small>NEXT BATCH</small>
                <strong>Rp499.000</strong>
              </div>
            </div>
          </div>

          <div className="final-offer-action">

            <div className="final-timer-label">
              PRICE LOCK WINDOW
            </div>

            <div className="final-timer">
              {minutes}:{seconds}
            </div>

            <a
              href="https://lynk.id/a/1911036127"
              target="_blank"
              rel="noopener noreferrer"
              className="final-cta"
            >
              🔥 KUNCI HARGA Rp199.000
              <span>→</span>
            </a>

            <small>
              Akses checkout melalui halaman resmi.
            </small>
          </div>

        </div>

      </div>
    </section>
  );
}