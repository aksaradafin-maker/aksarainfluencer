"use client";

import { FormEvent, useState } from "react";

const DEFAULT_LYNK_URL = "https://lynk.id/a/1911036127";

export default function LeadGatePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lynkUrl, setLynkUrl] = useState(DEFAULT_LYNK_URL);

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const payload = {
      action: "createLead",
      nama: String(form.get("nama") || "").trim(),
      whatsapp: String(form.get("whatsapp") || "").trim(),
      email: String(form.get("email") || "").trim(),
      source: "landing-ai-influencer",
      cta: "Mulai Aja Dulu",
      harga: 199000
    };

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || "Data gagal disimpan."
        );
      }

      setLynkUrl(String(result?.offer?.lynk_url || DEFAULT_LYNK_URL));
      setSuccess(true);
    } catch {
      setError("Data belum berhasil disimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lead-page">
      <style>{`
  .lead-page {
    min-height: 100svh;
    width: 100%;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    padding: 40px 20px;
    margin: 0;
    background:
      radial-gradient(
        circle at 50% 0%,
        rgba(255, 87, 87, 0.08),
        transparent 42%
      ),
      #07090d;
    color: #f5f5f5;
  }

  .lead-card {
    width: min(520px, 100%);
    box-sizing: border-box;
    padding: 34px;
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 22px;
    background: rgba(13,17,24,.96);
    box-shadow:
      0 24px 80px rgba(0,0,0,.42),
      0 0 0 1px rgba(255,255,255,.02);
  }

  .lead-kicker {
    margin: 0 0 10px;
    color: #ff5757;
    font-size: 11px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: .14em;
  }

  .lead-card h1 {
    margin: 0 0 12px;
    color: #fff;
    font-size: clamp(30px, 6vw, 46px);
    line-height: 1.04;
    letter-spacing: -.035em;
  }

  .lead-desc {
    margin: 0 0 26px;
    color: rgba(255,255,255,.68);
    font-size: 15px;
    line-height: 1.65;
  }

  .lead-form {
    display: grid;
    gap: 16px;
    width: 100%;
  }

  .lead-form label {
    display: grid;
    gap: 8px;
    width: 100%;
    color: rgba(255,255,255,.78);
    font-size: 13px;
    line-height: 1.3;
    font-weight: 700;
  }

  .lead-form input {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 50px;
    box-sizing: border-box;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 12px;
    outline: none;
    background: #090c11;
    color: #fff;
    font: inherit;
    font-size: 15px;
    -webkit-appearance: none;
    appearance: none;
  }

  .lead-form input::placeholder {
    color: rgba(255,255,255,.34);
  }

  .lead-form input:focus {
    border-color: rgba(255,87,87,.72);
    box-shadow: 0 0 0 3px rgba(255,87,87,.10);
  }

  .lead-gate-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 52px;
    margin-top: 4px;
    padding: 0 18px;
    box-sizing: border-box;
    border: 0;
    border-radius: 12px;
    background: #ff5757;
    color: #fff;
    font: inherit;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .01em;
    cursor: pointer;
  }

  .lead-gate-submit:disabled {
    opacity: .65;
    cursor: wait;
  }

  .lead-gate-note {
    display: block;
    margin-top: 16px;
    color: rgba(255,255,255,.42);
    font-size: 12px;
    line-height: 1.55;
  }

  .lead-gate-success-icon {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    margin-bottom: 18px;
    border-radius: 50%;
    background: rgba(255,87,87,.12);
    color: #ff5757;
    font-size: 24px;
    font-weight: 800;
  }

  .lead-gate-link {
    text-decoration: none;
  }

  @media (max-width: 560px) {
    .lead-page {
      min-height: 100svh;
      padding: 20px 14px;
      align-items: center;
    }

    .lead-card {
      padding: 25px 20px;
      border-radius: 18px;
    }

    .lead-card h1 {
      font-size: 34px;
    }
  }
`}</style>
      <div className="lead-card">
        {!success ? (
          <>
            <div className="lead-kicker">AI INFLUENCER</div>

            <h1>Hold Harga Sekarang</h1>

            <p className="lead-desc">
              Isi data kamu terlebih dahulu untuk mencatat pendaftaran
              dan mendapatkan akses ke harga saat ini.
            </p>

            <form onSubmit={submitLead} className="lead-form">
              <label>
                Nama
                <input
                  name="nama"
                  required
                  placeholder="Nama kamu"
                />
              </label>

              <label>
                WhatsApp
                <input
                  name="whatsapp"
                  required
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="nama@email.com"
                />
              </label>

              {error && (
                <div className="lead-error">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "MENYIMPAN..." : "HOLD HARGA →"}
              </button>
            </form>
          </>
        ) : (
          <div className="lead-success">
            <div className="lead-kicker">BERHASIL</div>

            <h1>Data kamu sudah tercatat.</h1>

            <p className="lead-desc">
              Pendaftaran kamu sudah masuk. Lanjutkan ke halaman
              checkout untuk menyelesaikan pembelian.
            </p>

            <a href={lynkUrl}>
              LANJUT KE LYNK.ID →
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .lead-page {
          min-height: 100vh;
          box-sizing: border-box;
          padding: 40px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #07090d;
          color: #fff;
        }

        .lead-card {
          width: 100%;
          max-width: 520px;
          box-sizing: border-box;
          padding: 32px;
          border-radius: 18px;
          background: #0d1118;
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 24px 80px rgba(0,0,0,.4);
        }

        .lead-kicker {
          margin-bottom: 12px;
          color: #ff5757;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        h1 {
          margin: 0;
          font-size: clamp(30px, 7vw, 44px);
          line-height: 1.05;
          letter-spacing: -.035em;
        }

        .lead-desc {
          margin: 16px 0 28px;
          color: rgba(255,255,255,.68);
          line-height: 1.65;
        }

        .lead-form {
          display: grid;
          gap: 18px;
        }

        label {
          display: grid;
          gap: 8px;
          color: rgba(255,255,255,.9);
          font-size: 13px;
          font-weight: 700;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 15px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.14);
          background: #07090d;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        input:focus {
          border-color: rgba(255,87,87,.65);
        }

        button,
        .lead-success a {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 15px 18px;
          border: 0;
          border-radius: 10px;
          background: #ff5757;
          color: #fff;
          text-align: center;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        button:disabled {
          opacity: .65;
          cursor: wait;
        }

        .lead-error {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,87,87,.3);
          background: rgba(255,87,87,.08);
          color: #ff8a8a;
          font-size: 13px;
        }

        @media (max-width: 560px) {
          .lead-card {
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}