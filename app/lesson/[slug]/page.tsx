"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import FlashcardSection from "./FlashcardSection";
import QuizSection, {
  QuizQuestion,
} from "./QuizSection";

type ApiMaterial = {
  id: number;
  title: string;
  content: string;
};

type ApiQuiz = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

type LessonResponse = {
  slug: string;
  lessonNumber: string;
  chapter: string;
  title: string;
  description: string;
  videoId: string;
  videoUrl: string;
  status: string;
  materials: ApiMaterial[];
  quiz: ApiQuiz[];
};

type LessonView = {
  chapter: string;
  title: string;
  description: string;
  videoId: string;
  material: ApiMaterial[];
  quiz: QuizQuestion[];
};

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [lesson, setLesson] =
    useState<LessonView | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLesson() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/lessons/${slug}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Lesson tidak ditemukan."
          );
        }

        const data =
          (await response.json()) as LessonResponse;

        if (cancelled) return;

        setLesson({
          chapter: data.chapter,
          title: data.title,
          description: data.description,
          videoId: data.videoId,
          material: data.materials ?? [],
          quiz: (data.quiz ?? []).map(
            (question) => ({
              question: question.question,
              options: question.options,
              answer: question.correctAnswer,
            })
          ),
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat lesson."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLesson();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="site-shell">
        <div className="lesson-container">
          <div className="lesson-loading">
            LOADING LESSON...
          </div>
        </div>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="site-shell">
        <div className="lesson-container">
          <div className="lesson-empty">
            <span className="eyebrow">
              LESSON NOT FOUND
            </span>

            <h1>
              {error || "Lesson tidak ditemukan."}
            </h1>

            <p>
              Lesson yang kamu cari belum tersedia
              di learning path.
            </p>

            <Link
              href="/learning-path"
              className="lesson-empty-link"
            >
              ? Kembali ke Learning Path
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <nav className="site-nav">
        <Link href="/" className="brand">
          RIZMAGO<span>LAB STUDIO</span>
        </Link>

        <div className="nav-links">
          <Link href="/dashboard">
            Dashboard
          </Link>

          <Link href="/creator-check">
            Creator Check
          </Link>

          <Link href="/learning-path">
            Learning Path
          </Link>
        </div>
      </nav>

      <div className="lesson-container">
        <section className="lesson-heading">
          <div>
            <div className="eyebrow">
              {lesson.chapter}
            </div>

            <h1>{lesson.title}</h1>

            <p>{lesson.description}</p>
          </div>

          <div className="lesson-meta">
            <span>LESSON</span>
            <strong>02 / 07</strong>
          </div>
        </section>

        {/* 01 ? VIDEO */}
        <section className="lesson-block">
          <div className="lesson-block-heading">
            <div>
              <span className="block-index">
                01
              </span>

              <h2>Watch</h2>
            </div>

            <span className="block-label">
              VIDEO
            </span>
          </div>

          {lesson.videoId ? (
            <div className="lesson-video">
              <iframe
                src={
                  `https://www.youtube.com/embed/${lesson.videoId}`
                }
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="lesson-empty">
              Video untuk lesson ini belum tersedia.
            </div>
          )}
        </section>

        {/* 02 ? FLASHCARD */}
        <section className="lesson-block">
          <div className="lesson-block-heading">
            <div>
              <span className="block-index">
                02
              </span>

              <h2>Flashcard</h2>
            </div>

            <span className="block-label">
              RECALL
            </span>
          </div>

          <FlashcardSection />
        </section>

        {/* 03 ? MATERIAL */}
        <section className="lesson-block">
          <div className="lesson-block-heading">
            <div>
              <span className="block-index">
                03
              </span>

              <h2>Material</h2>
            </div>

            <span className="block-label">
              READ MORE
            </span>
          </div>

          <details className="material-panel">
            <summary>
              <span>
                Buka materi pembelajaran
              </span>

              <span className="material-summary-icon">
                +
              </span>
            </summary>

            <div className="material-card">
              <p className="material-intro">
                Setelah menonton dan melakukan
                recall, gunakan materi berikut
                untuk memperkuat pemahaman.
              </p>

              <div className="material-list">
                {lesson.material.length === 0 ? (
                  <p>
                    Belum ada materi untuk lesson ini.
                  </p>
                ) : (
                  lesson.material.map(
                    (item, index) => (
                      <div
                        className="material-item"
                        key={item.id}
                      >
                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div>
                          {item.title && (
                            <strong>
                              {item.title}
                            </strong>
                          )}

                          <p>{item.content}</p>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </details>
        </section>

        {/* 04 ? QUIZ */}
        <section className="lesson-block">
          <div className="lesson-block-heading">
            <div>
              <span className="block-index">
                04
              </span>

              <h2>Knowledge Check</h2>
            </div>

            <span className="block-label">
              QUIZ
            </span>
          </div>

          <QuizSection
            questions={lesson.quiz}
          />
        </section>

        {/* 05 ? SCOREBOARD */}
        <section className="lesson-block">
          <div className="lesson-block-heading">
            <div>
              <span className="block-index">
                05
              </span>

              <h2>Scoreboard</h2>
            </div>

            <span className="block-label">
              PROGRESS
            </span>
          </div>

          <div className="scoreboard-card">
            <div className="scoreboard-empty">
              <span className="scoreboard-icon">
                01
              </span>

              <div>
                <strong>
                  Quiz Attempt
                </strong>

                <p>
                  Riwayat skor akan kita sambungkan
                  ke database pada tahap berikutnya.
                </p>
              </div>

              <span className="scoreboard-status">
                LOCAL
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
