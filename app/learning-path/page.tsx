import Link from "next/link";

const modules = [
  {
    number: "01",
    title: "Fondasi",
    description:
      "Memahami dasar workflow content creation dan cara membangun sistem kerja.",
    status: "COMPLETED",
    progress: "3 / 3",
    state: "done",
  },
  {
    number: "02",
    title: "Brand & Target",
    description:
      "Menentukan arah brand dan memahami target audience sebelum menyusun konten.",
    status: "IN PROGRESS",
    progress: "2 / 5",
    state: "active",
  },
  {
    number: "03",
    title: "Riset & Benchmarking",
    description:
      "Membangun proses riset untuk menemukan insight dan referensi konten.",
    status: "LOCKED",
    progress: "0 / 4",
    state: "locked",
  },
  {
    number: "04",
    title: "Content Pillar",
    description:
      "Menyusun content pillar sebagai dasar arah dan variasi konten.",
    status: "LOCKED",
    progress: "0 / 4",
    state: "locked",
  },
  {
    number: "05",
    title: "Perencanaan",
    description:
      "Mengubah arah konten menjadi content plan dan kalender kerja.",
    status: "LOCKED",
    progress: "0 / 5",
    state: "locked",
  },
  {
    number: "06",
    title: "Produksi",
    description:
      "Menjalankan proses produksi berdasarkan sistem dan brief yang sudah dibuat.",
    status: "LOCKED",
    progress: "0 / 5",
    state: "locked",
  },
  {
    number: "07",
    title: "Evaluasi",
    description:
      "Mengevaluasi hasil konten dan menggunakan data untuk perbaikan berikutnya.",
    status: "LOCKED",
    progress: "0 / 4",
    state: "locked",
  },
];

export default function LearningPath() {
  return (
    <main className="site-shell">
      <nav className="navbar">
        <Link href="/" className="brand">
          RIZMAGO<span>LAB STUDIO</span>
        </Link>

        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/creator-check">Creator Check</Link>
        </div>

        <Link href="/dashboard" className="nav-button">
          Dashboard
        </Link>
      </nav>

      <section className="learning-path-section">
        <div className="learning-path-container">
          <div className="learning-path-header">
            <div>
              <div className="eyebrow">PERSONAL LEARNING PATH</div>

              <h1>
                Jalur belajar
                <br />
                <span>yang disusun untuk kamu.</span>
              </h1>

              <p>
                Berdasarkan kondisi awal kamu, CreatorStudio menyusun urutan
                belajar agar kamu tidak perlu mempelajari semuanya sekaligus.
              </p>
            </div>

            <div className="path-readiness">
              <span>READINESS</span>
              <strong>64%</strong>
              <small>BUILDING</small>
            </div>
          </div>

          <div className="path-summary">
            <div>
              <span className="card-label">CURRENT FOCUS</span>
              <strong>Brand & Target</strong>
            </div>

            <div>
              <span className="card-label">MODULE PROGRESS</span>
              <strong>2 / 7</strong>
            </div>

            <div>
              <span className="card-label">OVERALL PROGRESS</span>
              <strong>28%</strong>
            </div>
          </div>

          <div className="path-list">
            {modules.map((module) => {
              const clickable = module.state !== "locked";

              return (
                <div
                  className={`path-module ${module.state}`}
                  key={module.number}
                >
                  <div className="path-module-number">
                    {module.number}
                  </div>

                  <div className="path-module-content">
                    <div className="path-module-top">
                      <div>
                        <span className="path-status">
                          {module.status}
                        </span>

                        <h2>{module.title}</h2>
                      </div>

                      <span className="path-progress">
                        {module.progress}
                      </span>
                    </div>

                    <p>{module.description}</p>

                    {clickable ? (
                      <Link
                        href={
                          module.number === "02"
                            ? "/lesson/target-audience"
                            : "/dashboard"
                        }
                        className="module-link"
                      >
                        {module.state === "done"
                          ? "Review Module →"
                          : "Continue Learning →"}
                      </Link>
                    ) : (
                      <span className="module-locked">
                        Complete previous module first
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="path-bottom">
            <Link href="/creator-check" className="secondary-button">
              Retake Creator Check
            </Link>

            <Link href="/dashboard" className="primary-button">
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>CREATORSTUDIO</div>
        <div>Personal Learning System</div>
      </footer>
    </main>
  );
}