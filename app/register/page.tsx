"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "../components/auth.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal membuat akun.");
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
          <span>START LEARNING</span>
          <h1>Buat akun.</h1>
          <p>
            Simpan progres belajar dan mulai membangun
            konsistensi bersama learner lain.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nama
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama kamu"
              required
            />
          </label>

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
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
          </label>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "MEMBUAT AKUN..." : "BUAT AKUN"}
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun?
          <Link href="/login">Masuk</Link>
        </div>
      </div>
    </main>
  );
}