import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import "./landing.css";

import { appsScriptGet } from "@/lib/apps-script";
import SalesCountdown from "./components/SalesCountdown";
import VideoShowcase from "./components/VideoShowcase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Influencer Workflow — Rizmago Lab Studio",
  description:
    "Workflow membuat AI Influencer sampai menjadi video yang siap diposting.",
};

type Settings = {
  early_bird_price: number;
  early_bird_status: string;
  current_price: number;
  current_regular_price: number;
  next_batch_price: number;
  countdown_enabled: number;
  countdown_minutes: number;
  accent_color: string;
  danger_color: string;
  background_color: string;
};

const money = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));

async function getSettings() {
  const data = await appsScriptGet<{ settings?: Settings | null }>({
    action: "get_sales_page",
    published: "true",
  });

  return data.settings ?? undefined;
}

const steps = [
  {
    n: "01",
    title: "CREATE",
    text: "Bikin karakter AI Influencer yang bisa kamu gunakan secara konsisten.",
  },
  {
    n: "02",
    title: "SETUP",
    text: "Siapkan produk, konsep, script, visual, dan format konten.",
  },
  {
    n: "03",
    title: "GENERATE",
    text: "Ikuti workflow untuk mengubah konsep menjadi video AI.",
  },
  {
    n: "04",
    title: "PUBLISH",
    text: "Siapkan output untuk TikTok, Reels, Shorts, dan platform lainnya.",
  },
];

export default async function HomePage() {
  const s = await getSettings();

  if (!s) {
    return <main className="new-landing">Sales page belum dipublish.</main>;
  }

  const style = {
    "--accent": s.accent_color || "#ff5757",
    "--danger": s.danger_color || "#ff5757",
    "--bg": s.background_color || "#07090d",
  } as CSSProperties;

  return (
    <main className="new-landing" style={style}>

      {/* NAV */}
      <nav className="new-nav">
        <Link href="/" className="new-logo">
          <strong>RIZMAGO</strong>
          <span>LAB STUDIO</span>
        </Link>

        <a href="/lead-gate" className="nav-cta">
          MULAI BIKIN AI →
        </a>
      </nav>

      {/* HERO */}
      <section className="new-hero">
        <div className="hero-pill">AI INFLUENCER WORKFLOW</div>

        <h1>
          MAU NGONTEN,
          <br />
          <em>TAPI HIDUP LO UDAH CUKUP SIBUK?</em>
        </h1>

        <p className="hero-lead">
          Kerja 9–5. Pulang capek. Nggak punya kamera.
          <br />
          Nggak pede tampil terus di depan kamera.
          <br />
          Tapi tetap pengen mulai bikin konten.
        </p>

        <p className="hero-sub">
          Sekarang kamu bisa bikin konten dengan
          <strong> AI Influencer.</strong>
          <br />
          Bukan sekadar generate gambar.
          Pelajari workflow dari karakter AI sampai video siap posting.
        </p>

        <a href="/lead-gate" className="hero-button">
          MULAI BIKIN KONTEN <span>→</span>
        </a>

        <div className="hero-note">
          workflow praktikal · tools gratis & berbayar · praktik dari nol
        </div>
      </section>

      {/* PAIN */}
      <section className="center-section pain-section">
        <span className="eyebrow">REALITA</span>

        <h2>
          Yang bikin susah bukan
          <br />
          <span>niatnya.</span>
        </h2>

        <div className="pain-grid">
          <article>
            <b>01</b>
            <h3>Nggak punya waktu</h3>
            <p>
              Kerja 9–5 sudah makan sebagian besar energi. Mau ngonten malah
              keburu capek.
            </p>
          </article>

          <article>
            <b>02</b>
            <h3>Nggak punya kamera</h3>
            <p>
              Nggak harus langsung beli kamera, lighting, atau bikin studio
              sendiri.
            </p>
          </article>

          <article>
            <b>03</b>
            <h3>Malu tampil</h3>
            <p>
              Pengen bikin personal brand tapi belum nyaman muncul di kamera
              setiap hari.
            </p>
          </article>

          <article>
            <b>04</b>
            <h3>Nggak tahu mulai dari mana</h3>
            <p>
              Tool ada di mana-mana. Tutorial juga banyak. Tapi alurnya nggak
              jelas.
            </p>
          </article>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="workflow" className="center-section solution-section">
        <span className="eyebrow">THE IDEA</span>

        <h2>
          Kamu nggak butuh
          <br />
          <span>lebih banyak tools.</span>
        </h2>

        <p className="section-lead">
          Kamu butuh workflow yang jelas.
          <br />
          Dari bikin karakter AI sampai menjadi video yang siap digunakan.
        </p>

        <div className="workflow-grid">
          {steps.map((step) => (
            <article key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section id="showcase" className="center-section showcase-section">
        <span className="eyebrow">SEE THE OUTPUT</span>

        <h2>
          Bukan cuma teori.
          <br />
          <span>Lihat hasilnya.</span>
        </h2>

        <p className="section-lead">
          Contoh video dari workflow AI Influencer, UGC, Commercial,
          sampai short-form content.
        </p>

        <VideoShowcase />
      </section>

      {/* AI INFLUENCER */}
      <section className="center-section influencer-section">
        <span className="eyebrow">AI INFLUENCER</span>

        <h2>
          Bikin versi digital
          <br />
          <span>dari dirimu.</span>
        </h2>

        <p className="section-lead">
          Jadi kamu nggak harus selalu berdiri di depan kamera untuk mulai
          membangun konten.
        </p>

        <div className="format-list">
          <span>AI UGC</span>
          <span>PRODUCT VIDEO</span>
          <span>SHORT VIDEO</span>
          <span>COMMERCIAL</span>
          <span>TALKING AI</span>
          <span>AI INFLUENCER</span>
        </div>
      </section>

      {/* OFFER */}
      <section className="offer-section">
        <div className="offer-box">

          <span className="eyebrow">MULAI SEKARANG</span>

          <h2>
            Jangan tunggu
            <br />
            sampai “siap”.
          </h2>

          <p>
            Mulai dari workflow yang sederhana.
            <br />
            Tools bisa berkembang belakangan.
          </p>

          <div className="price-area">
            <div className="sold">
              <span>EARLY BIRD</span>
              <del>{money(s.early_bird_price)}</del>
              <b>{s.early_bird_status || "SOLD OUT"}</b>
            </div>

            <div className="current-price">
              <small>HARGA SEKARANG</small>
              <strong>{money(s.current_price)}</strong>
              <del>{money(s.current_regular_price)}</del>
            </div>

            <div className="next-price">
              <small>NEXT BATCH</small>
              <strong>{money(s.next_batch_price)}</strong>
            </div>
          </div>

          {s.countdown_enabled ? (
            <SalesCountdown minutes={s.countdown_minutes} />
          ) : null}

          <a href="/lead-gate" className="offer-button">
            MULAI AJA DULU →
          </a>

          <div className="offer-trust">
            <span>🛡️ Garansi Bimbingan</span>
            <span>↻ Free Update Materi</span>
            <span>AI Influencer Workflow</span>
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="final-section">
        <span className="eyebrow">YOUR TURN</span>

        <h2>
          Kerja tetap jalan.
          <br />
          <span>Konten juga mulai jalan.</span>
        </h2>

        <p>
          Nggak perlu nunggu punya kamera.
          <br />
          Nggak perlu nunggu punya waktu luang sempurna.
        </p>

        <a href="/lead-gate" className="hero-button">
          MULAI BIKIN AI →
        </a>
      </section>

      <footer className="new-footer">
        <strong>RIZMAGO LAB STUDIO</strong>
        <span>AI INFLUENCER / CONTENT WORKFLOW</span>
      </footer>
    </main>
  );
}