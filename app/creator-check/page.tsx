"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: "purpose",
    label: "Apa tujuan utama kamu membuat konten?",
    options: [
      "Membangun personal brand",
      "Mendapatkan audience",
      "Mempromosikan bisnis atau produk",
      "Belum yakin",
    ],
  },
  {
    id: "equipment",
    label: "Bagaimana kondisi equipment kamu saat ini?",
    options: [
      "Sudah punya setup lengkap",
      "Punya smartphone dan basic equipment",
      "Hanya punya smartphone",
      "Belum punya equipment",
    ],
  },
  {
    id: "topic",
    label: "Seberapa jelas topik konten kamu?",
    options: [
      "Sudah sangat jelas",
      "Sudah punya beberapa ide",
      "Masih mencari arah",
      "Belum tahu mau membahas apa",
    ],
  },
  {
    id: "audience",
    label: "Seberapa jelas target audience kamu?",
    options: [
      "Sangat jelas",
      "Lumayan jelas",
      "Masih umum",
      "Belum tahu",
    ],
  },
  {
    id: "platform",
    label: "Platform utama yang ingin kamu gunakan?",
    options: [
      "Instagram",
      "TikTok",
      "YouTube",
      "Belum menentukan",
    ],
  },
];

const scoreMap: Record<string, number> = {
  "Membangun personal brand": 4,
  "Mendapatkan audience": 4,
  "Mempromosikan bisnis atau produk": 4,
  "Belum yakin": 2,

  "Sudah punya setup lengkap": 4,
  "Punya smartphone dan basic equipment": 3,
  "Hanya punya smartphone": 2,
  "Belum punya equipment": 1,

  "Sudah sangat jelas": 4,
  "Sudah punya beberapa ide": 3,
  "Masih mencari arah": 2,
  "Belum tahu mau membahas apa": 1,

  "Sangat jelas": 4,
  "Lumayan jelas": 3,
  "Masih umum": 2,
  "Belum tahu": 1,

  Instagram: 4,
  TikTok: 4,
  YouTube: 4,
  "Belum menentukan": 2,
};

function getReadiness(score: number) {
  if (score >= 17) {
    return {
      level: "READY",
      title: "Kamu sudah punya fondasi yang cukup kuat.",
      description:
        "Kamu bisa mulai fokus membangun sistem content planning, produksi, dan evaluasi.",
    };
  }

  if (score >= 12) {
    return {
      level: "BUILDING",
      title: "Fondasi kamu sudah mulai terbentuk.",
      description:
        "Beberapa bagian sudah siap, tetapi masih ada area penting yang perlu diperjelas sebelum masuk ke workflow penuh.",
    };
  }

  return {
    level: "STARTING",
    title: "Kita mulai dari fondasi.",
    description:
      "Kamu belum perlu memikirkan semuanya sekaligus. Kita akan menyusun prioritas belajar dari bagian paling dasar terlebih dahulu.",
  };
}

export default function CreatorCheck() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const currentIndex = questions.findIndex(
    (question) => !answers[question.id]
  );

  const completed = Object.keys(answers).length;
  const progress = Math.round((completed / questions.length) * 100);

  const totalScore = Object.values(answers).reduce(
    (total, answer) => total + (scoreMap[answer] || 0),
    0
  );

  const readiness = getReadiness(totalScore);

  function selectAnswer(questionId: string, answer: string) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
    setShowResult(false);
  }

  function handleSubmit() {
    if (completed === questions.length) {
      setShowResult(true);
    }
  }

  if (showResult) {
    return (
      <main className="site-shell">
        <nav className="navbar">
          <Link href="/" className="brand">
            RIZMAGO<span>LAB STUDIO</span>
          </Link>

          <div className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/learning-path">Learning Path</Link>
          </div>
        </nav>

        <section className="check-result-section">
          <div className="result-container">
            <div className="eyebrow">CREATOR READINESS PROFILE</div>

            <div className="result-score">
              <span>{Math.round((totalScore / 20) * 100)}%</span>
            </div>

            <div className="result-level">{readiness.level}</div>

            <h1>{readiness.title}</h1>

            <p className="result-description">
              {readiness.description}
            </p>

            <div className="result-grid">
              <div className="result-card">
                <span className="card-label">YANG SUDAH ADA</span>
                <strong>
                  {answers.topic ? "Content direction" : "—"}
                </strong>
                <p>
                  Jawaban kamu menunjukkan beberapa fondasi creator sudah
                  mulai terbentuk.
                </p>
              </div>

              <div className="result-card">
                <span className="card-label">PRIORITAS SEKARANG</span>
                <strong>Brand & Target</strong>
                <p>
                  Perjelas arah, target audience, dan sistem konten sebelum
                  masuk ke produksi yang lebih konsisten.
                </p>
              </div>

              <div className="result-card">
                <span className="card-label">LANGKAH BERIKUTNYA</span>
                <strong>Learning Path</strong>
                <p>
                  Gunakan hasil check ini sebagai titik awal perjalanan
                  belajar kamu.
                </p>
              </div>
            </div>

            <div className="result-actions">
              <Link href="/learning-path" className="primary-button">
                Lihat Learning Path →
              </Link>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowResult(false);
                  setAnswers({});
                }}
              >
                Ulangi Check
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <nav className="navbar">
        <Link href="/" className="brand">
          RIZMAGO<span>LAB STUDIO</span>
        </Link>

        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/learning-path">Learning Path</Link>
        </div>

        <Link href="/dashboard" className="nav-button">
          Dashboard
        </Link>
      </nav>

      <section className="creator-check-section">
        <div className="check-container">
          <div className="check-header">
            <div>
              <div className="eyebrow">CREATOR CHECK / 01</div>
              <h1>Kenali kondisi creator kamu.</h1>
              <p>
                Jawab berdasarkan kondisi kamu sekarang. Tidak ada jawaban
                benar atau salah.
              </p>
            </div>

            <div className="check-progress">
              <strong>{progress}%</strong>
              <span>COMPLETED</span>
            </div>
          </div>

          <div className="check-progress-line">
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className="questions-list">
            {questions.map((question, index) => (
              <div className="question-card" key={question.id}>
                <div className="question-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="question-content">
                  <h2>{question.label}</h2>

                  <div className="answer-grid">
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option;

                      return (
                        <button
                          type="button"
                          key={option}
                          className={`answer-option ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() =>
                            selectAnswer(question.id, option)
                          }
                        >
                          <span>{option}</span>
                          <span>{selected ? "✓" : "↗"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="check-footer">
            <span>
              {completed} dari {questions.length} pertanyaan terjawab
            </span>

            <button
              type="button"
              className="primary-button"
              disabled={completed !== questions.length}
              onClick={handleSubmit}
            >
              Lihat Readiness Profile →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}