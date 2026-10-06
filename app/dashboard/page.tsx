import Link from "next/link";

export default function Dashboard() {
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

        <div className="nav-profile">
          CREATOR
        </div>
      </nav>

      <section className="dashboard-section">
        <div className="dashboard-header">
          <div>
            <div className="eyebrow">CREATOR DASHBOARD</div>
            <h1>Selamat datang kembali.</h1>
            <p>
              Lanjutkan perjalanan belajar dan bangun sistem
              kontenmu secara bertahap.
            </p>
          </div>

          <div className="readiness-card">
            <span>CREATOR READINESS</span>
            <strong>64%</strong>

            <div className="progress-line">
              <div className="progress-fill" />
            </div>

            <small>4 dari 7 area sudah siap</small>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="continue-card">
            <div className="card-label">CONTINUE LEARNING</div>

            <h2>Target Audience</h2>

            <p>
              Pelajari cara menentukan siapa audience yang paling
              relevan dengan kontenmu.
            </p>

            <div className="lesson-meta">
              <span>MODULE 02</span>
              <span>12 MIN</span>
            </div>

            <Link
              href="/lesson/target-audience"
              className="primary-button"
            >
              Lanjutkan
              <span>→</span>
            </Link>
          </section>

          <section className="progress-card">
            <div className="card-label">PROGRESS OVERVIEW</div>

            <div className="big-progress">28%</div>

            <p>Overall learning progress</p>

            <div className="progress-stats">
              <div>
                <strong>6</strong>
                <span>Lessons</span>
              </div>

              <div>
                <strong>2</strong>
                <span>Modules</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Quiz</span>
              </div>
            </div>
          </section>
        </div>

        <section className="learning-section">
          <div className="section-heading compact">
            <div className="eyebrow">LEARNING PATH</div>
            <h2>Perjalanan belajarmu.</h2>
          </div>

          <div className="module-list">
            <Link href="/learning-path" className="module-row">
              <div className="module-index">01</div>

              <div className="module-info">
                <strong>Fondasi</strong>
                <span>Memahami dasar content system</span>
              </div>

              <div className="module-status complete">
                COMPLETE
              </div>
            </Link>

            <Link
              href="/learning-path"
              className="module-row active"
            >
              <div className="module-index">02</div>

              <div className="module-info">
                <strong>Brand & Target</strong>
                <span>
                  Brand, positioning, dan target audience
                </span>
              </div>

              <div className="module-status">2 / 5</div>
            </Link>

            <Link href="/learning-path" className="module-row">
              <div className="module-index">03</div>

              <div className="module-info">
                <strong>Riset & Benchmarking</strong>
                <span>Research dan menemukan benchmark</span>
              </div>

              <div className="module-status">LOCKED</div>
            </Link>

            <Link href="/learning-path" className="module-row">
              <div className="module-index">04</div>

              <div className="module-info">
                <strong>Content Pillar</strong>
                <span>Membangun struktur content pillar</span>
              </div>

              <div className="module-status">LOCKED</div>
            </Link>
          </div>
        </section>

        <section className="quick-section">
          <div className="section-heading compact">
            <div className="eyebrow">QUICK ACCESS</div>
            <h2>Tools untuk creator.</h2>
          </div>

          <div className="quick-grid">
            <Link href="/creator-check" className="quick-card">
              <span>01</span>
              <strong>Creator Check</strong>
              <small>Cek kesiapan creator</small>
            </Link>

            <Link href="/learning-path" className="quick-card">
              <span>02</span>
              <strong>Learning Path</strong>
              <small>Lihat jalur belajar</small>
            </Link>

            <Link href="/dashboard" className="quick-card">
              <span>03</span>
              <strong>Progress</strong>
              <small>Lihat progress belajar</small>
            </Link>
          </div>
        </section>
      </section>

      <footer className="footer">
        <span>RIZMAGO LAB STUDIO</span>
        <span>CONTENT LEARNING SYSTEM</span>
      </footer>
    </main>
  );
}
