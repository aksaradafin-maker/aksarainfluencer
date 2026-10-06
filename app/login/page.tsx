"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "../components/auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Email atau password salah.");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span>RIZMAGO</span>
          <small>LAB STUDIO</small>
        </div>

        <div className="auth-heading">
          <span>WELCOME BACK</span>
          <h1>Masuk.</h1>
          <p>
            Lanjutkan lesson dan lihat progres belajar kamu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
          </label>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "MEMERIKSA..." : "MASUK"}
          </button>
        </form>

        <div className="auth-footer">
          Belum punya akun?
          <Link href="/register">Daftar</Link>
        </div>
      </div>
    </main>
  );
}