"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

export default function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  async function loadUser() {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/";
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-brand">
          <span className="app-brand-main">RIZMAGO</span>
          <span className="app-brand-sub">LAB STUDIO</span>
        </Link>

        <nav className="app-nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/learning-path">Learning Path</Link>
          <Link href="/creator-check">Creator Check</Link>
        </nav>

        <div className="app-header-user">
          {loading ? (
            <div className="app-user-loading">
              LOADING
            </div>
          ) : user ? (
            <div className="app-user-menu">
              <button
                type="button"
                className="app-user-button"
                onClick={() => setMenuOpen((value) => !value)}
              >
                <span className="app-user-avatar">
                  {initials}
                </span>

                <span className="app-user-name">
                  {user.name}
                </span>

                <span className="app-user-chevron">
                  {menuOpen ? "−" : "+"}
                </span>
              </button>

              {menuOpen && (
                <div className="app-user-dropdown">
                  <div className="app-user-dropdown-info">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="app-auth-links">
              <Link href="/login">Masuk</Link>
              <Link
                href="/register"
                className="app-register-link"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}