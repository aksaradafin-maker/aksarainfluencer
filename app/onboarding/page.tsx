import Link from "next/link";

export default function Onboarding() {
  return (
    <main className="site-shell">
      <nav className="navbar">
        <Link href="/" className="brand">
          RIZMAGO<span>LAB STUDIO</span>
        </Link>

        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/creator-check">Creator Check</Link>
          <Link href="/learning-path">Learning Path</Link>
        </div>

        <Link href="/creator-check" className="nav-button">
          Mulai Check
        </Link>
      </nav>

      <section className="onboarding-section">
        <div className="onboarding-container">
          <div className="eyebrow">WELCOME TO CREATORSTUDIO</div>

          <h1>
            Sebelum belajar,
            <br />
            <span>kenali dulu kondisi kamu.</span>
          </h1>

          <p className="onboarding-description">
            CreatorStudio akan membantu memetakan kondisi awal kamu,
            apa yang sudah kamu punya, dan apa yang perlu kamu pelajari
            terlebih dahulu.
          </p>

          <div className="onboarding-grid">
            <div className="onboarding-card">
              <div className="feature-number">01</div>
              <h3>Creator Check</h3>
              <p>
                Jawab beberapa pertanyaan sederhana tentang tujuan,
                equipment, topik, audience, dan platform kamu.
              </p>
            </div>

            <div className="onboarding-card">
              <div className="feature-number">02</div>
              <h3>Readiness Profile</h3>
              <p>
                Dapatkan gambaran tentang kondisi creator kamu saat ini
                dan bagian mana yang perlu diperkuat.
              </p>
            </div>

            <div className="onboarding-card">
              <div className="feature-number">03</div>
              <h3>Learning Path</h3>
              <p>
                Sistem menyusun jalur belajar yang lebih relevan
                berdasarkan hasil Creator Check kamu.
              </p>
            </div>
          </div>

          <div className="onboarding-actions">
            <Link href="/creator-check" className="primary-button">
              Mulai Creator Check →
            </Link>

            <Link href="/" className="secondary-button">
              Kembali
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>CREATORSTUDIO</div>
        <div>Creator Learning System</div>
      </footer>
    </main>
  );
}