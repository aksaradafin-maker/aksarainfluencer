"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import type {
  Lesson,
  Flashcard,
  MaterialItem,
  QuizQuestion,
} from "@/lib/lessons";

type AdminLesson = Omit<Lesson, "material"> & {
  materials: MaterialItem[];
};

import "../admin-lessons.css";
import "./editor.css";


export default function LessonEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [lesson, setLesson] =
    useState<AdminLesson | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadLesson() {
      try {
        const response = await fetch(
          `/api/lessons/${slug}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Lesson tidak ditemukan"
          );
        }

        const data =
          (await response.json()) as AdminLesson;

        setLesson(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat lesson."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [slug]);


  function updateLessonField(
    field: keyof Lesson,
    value: string
  ) {
    if (!lesson) return;

    setLesson({
      ...lesson,
      [field]: value,
    });

    setSaved(false);
  }


  function addFlashcard() {
    if (!lesson) return;

    const nextId =
      lesson.flashcards.length === 0
        ? 1
        : Math.max(
            ...lesson.flashcards.map(
              (item) => item.id
            )
          ) + 1;

    const newCard: Flashcard = {
      id: nextId,
      question: "",
      answer: "",
    };

    setLesson({
      ...lesson,
      flashcards: [
        ...lesson.flashcards,
        newCard,
      ],
    });

    setSaved(false);
  }


  function updateFlashcard(
    id: number,
    field: "question" | "answer",
    value: string
  ) {
    if (!lesson) return;

    setLesson({
      ...lesson,
      flashcards:
        lesson.flashcards.map((card) =>
          card.id === id
            ? {
                ...card,
                [field]: value,
              }
            : card
        ),
    });

    setSaved(false);
  }


  function deleteFlashcard(id: number) {
    if (!lesson) return;

    const confirmed =
      window.confirm(
        "Hapus flashcard ini?"
      );

    if (!confirmed) return;

    setLesson({
      ...lesson,
      flashcards:
        lesson.flashcards.filter(
          (card) => card.id !== id
        ),
    });

    setSaved(false);
  }


  function addMaterial() {
    if (!lesson) return;

    const nextId =
      lesson.materials.length === 0
        ? 1
        : Math.max(
            ...lesson.materials.map(
              (item) => item.id
            )
          ) + 1;

    const newMaterial: MaterialItem = {
      id: nextId,
      title: "",
      content: "",
    };

    setLesson({
      ...lesson,
      materials: [
        ...lesson.materials,
        newMaterial,
      ],
    });

    setSaved(false);
  }


  function updateMaterial(
    id: number,
    field: "title" | "content",
    value: string
  ) {
    if (!lesson) return;

    setLesson({
      ...lesson,
      materials:
        lesson.materials.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item
        ),
    });

    setSaved(false);
  }


  function deleteMaterial(id: number) {
    if (!lesson) return;

    const confirmed =
      window.confirm(
        "Hapus material ini?"
      );

    if (!confirmed) return;

    setLesson({
      ...lesson,
      materials:
        lesson.materials.filter(
          (item) => item.id !== id
        ),
    });

    setSaved(false);
  }


  function addQuiz() {
    if (!lesson) return;

    const nextId =
      lesson.quiz.length === 0
        ? 1
        : Math.max(
            ...lesson.quiz.map(
              (item) => item.id
            )
          ) + 1;

    const newQuestion: QuizQuestion = {
      id: nextId,
      question: "",
      options: [
        "",
        "",
        "",
        "",
      ],
      correctAnswer: 0,
    };

    setLesson({
      ...lesson,
      quiz: [
        ...lesson.quiz,
        newQuestion,
      ],
    });

    setSaved(false);
  }


  function updateQuizQuestion(
    id: number,
    value: string
  ) {
    if (!lesson) return;

    setLesson({
      ...lesson,
      quiz:
        lesson.quiz.map((item) =>
          item.id === id
            ? {
                ...item,
                question: value,
              }
            : item
        ),
    });

    setSaved(false);
  }


  function updateQuizOption(
    id: number,
    optionIndex: number,
    value: string
  ) {
    if (!lesson) return;

    setLesson({
      ...lesson,
      quiz:
        lesson.quiz.map((item) => {
          if (item.id !== id) {
            return item;
          }

          const options = [
            ...item.options,
          ];

          options[optionIndex] = value;

          return {
            ...item,
            options,
          };
        }),
    });

    setSaved(false);
  }


  function updateQuizAnswer(
    id: number,
    value: number
  ) {
    if (!lesson) return;

    setLesson({
      ...lesson,
      quiz:
        lesson.quiz.map((item) =>
          item.id === id
            ? {
                ...item,
                correctAnswer: value,
              }
            : item
        ),
    });

    setSaved(false);
  }


  function deleteQuiz(id: number) {
    if (!lesson) return;

    const confirmed =
      window.confirm(
        "Hapus pertanyaan quiz ini?"
      );

    if (!confirmed) return;

    setLesson({
      ...lesson,
      quiz:
        lesson.quiz.filter(
          (item) => item.id !== id
        ),
    });

    setSaved(false);
  }


  async function saveChanges() {
    if (!lesson) return;

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(
        `/api/lessons/${lesson.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(lesson),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal menyimpan perubahan."
        );
      }

      const result =
        await response.json();

      setLesson(result.lesson);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan."
      );
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <main className="admin-lessons">
        <div className="admin-container">
          <div className="editor-loading">
            Loading lesson...
          </div>
        </div>
      </main>
    );
  }


  if (!lesson) {
    return (
      <main className="admin-lessons">

        <div className="admin-container">

          <div className="editor-empty">

            <span className="admin-eyebrow">
              LESSON NOT FOUND
            </span>

            <h1>
              {error ||
                "Lesson tidak ditemukan."}
            </h1>

            <Link href="/admin/lessons">
              ← Kembali ke Lesson Control
            </Link>

          </div>

        </div>

      </main>
    );
  }


  return (
    <main className="admin-lessons">

      <header className="admin-header">

        <Link
          href="/admin/lessons"
          className="admin-brand"
        >
          RIZMAGO<span>LAB STUDIO</span>
        </Link>

        <Link
          href={`/lesson/${lesson.slug}`}
          className="admin-back"
        >
          View Lesson ↗
        </Link>

      </header>


      <div className="admin-container">

        <div className="editor-topbar">

          <Link href="/admin/lessons">
            ← All Lessons
          </Link>

          <span>
            LESSON {lesson.number}
          </span>

        </div>


        <section className="editor-heading">

          <div>

            <span className="admin-eyebrow">
              LESSON EDITOR
            </span>

            <h1>
              {lesson.title}
            </h1>

            <p>
              Kelola semua content lesson
              dari halaman ini.
            </p>

          </div>

          <div className="editor-actions">

            {saved && (
              <span className="save-success">
                ✓ Saved
              </span>
            )}

            <button
              className="save-button"
              onClick={saveChanges}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </section>


        {error && (
          <div className="editor-error">
            {error}
          </div>
        )}


        {/* BASIC INFO */}

        <section className="editor-section">

          <div className="editor-section-heading">

            <span>01</span>

            <div>

              <h2>
                Basic Information
              </h2>

              <p>
                Informasi utama lesson.
              </p>

            </div>

          </div>


          <div className="editor-grid">

            <label className="editor-field">

              <span>
                LESSON NUMBER
              </span>

              <input
                value={lesson.number}
                onChange={(event) =>
                  updateLessonField(
                    "number",
                    event.target.value
                  )
                }
              />

            </label>


            <label className="editor-field">

              <span>
                CATEGORY
              </span>

              <input
                value={lesson.chapter}
                onChange={(event) =>
                  updateLessonField(
                    "chapter",
                    event.target.value
                  )
                }
              />

            </label>


            <label className="editor-field editor-field--full">

              <span>
                TITLE
              </span>

              <input
                value={lesson.title}
                onChange={(event) =>
                  updateLessonField(
                    "title",
                    event.target.value
                  )
                }
              />

            </label>


            <label className="editor-field editor-field--full">

              <span>
                DESCRIPTION
              </span>

              <textarea
                value={lesson.description}
                onChange={(event) =>
                  updateLessonField(
                    "description",
                    event.target.value
                  )
                }
                rows={4}
              />

            </label>

          </div>

        </section>


        {/* VIDEO */}

        <section className="editor-section">

          <div className="editor-section-heading">

            <span>02</span>

            <div>

              <h2>
                Video
              </h2>

              <p>
                Video utama lesson.
              </p>

            </div>

          </div>


          <div className="editor-video">

            <iframe
              src={`https://www.youtube.com/embed/${lesson.videoId}`}
              title={lesson.title}
              allowFullScreen
            />

          </div>


          <label className="editor-field editor-field--full">

            <span>
              YOUTUBE URL
            </span>

            <input
              value={lesson.videoUrl}
              onChange={(event) =>
                updateLessonField(
                  "videoUrl",
                  event.target.value
                )
              }
            />

          </label>

        </section>


        {/* FLASHCARDS */}

        <section className="editor-section">

          <div className="editor-section-heading">

            <div className="section-heading-number">
              03
            </div>

            <div className="section-heading-main">

              <div className="section-heading-title">

                <h2>
                  Flashcards
                </h2>

                <span>
                  {lesson.flashcards.length}
                </span>

              </div>

              <p>
                Tambahkan dan kelola
                flashcard lesson.
              </p>

            </div>

          </div>


          <div className="content-editor-list">

            {lesson.flashcards.map(
              (card, index) => (

                <article
                  className="content-editor-card"
                  key={card.id}
                >

                  <div className="content-editor-top">

                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteFlashcard(card.id)
                      }
                    >
                      Delete
                    </button>

                  </div>


                  <div className="content-editor-fields">

                    <label className="editor-field">

                      <span>
                        QUESTION / FRONT
                      </span>

                      <textarea
                        value={card.question}
                        onChange={(event) =>
                          updateFlashcard(
                            card.id,
                            "question",
                            event.target.value
                          )
                        }
                        rows={3}
                        placeholder="Tulis pertanyaan flashcard..."
                      />

                    </label>


                    <label className="editor-field">

                      <span>
                        ANSWER / BACK
                      </span>

                      <textarea
                        value={card.answer}
                        onChange={(event) =>
                          updateFlashcard(
                            card.id,
                            "answer",
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="Tulis jawaban flashcard..."
                      />

                    </label>

                  </div>

                </article>

              )
            )}

          </div>


          <button
            className="add-content-button"
            onClick={addFlashcard}
          >
            + Add Flashcard
          </button>

        </section>


        {/* MATERIAL */}

        <section className="editor-section">

          <div className="editor-section-heading">

            <div className="section-heading-number">
              04
            </div>

            <div className="section-heading-main">

              <div className="section-heading-title">

                <h2>
                  Material
                </h2>

                <span>
                  {lesson.materials.length}
                </span>

              </div>

              <p>
                Materi pendamping setelah
                video dan flashcard.
              </p>

            </div>

          </div>


          <div className="content-editor-list">

            {lesson.materials.map(
              (item, index) => (

                <article
                  className="content-editor-card"
                  key={item.id}
                >

                  <div className="content-editor-top">

                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteMaterial(item.id)
                      }
                    >
                      Delete
                    </button>

                  </div>


                  <div className="content-editor-fields">

                    <label className="editor-field">

                      <span>
                        TITLE
                      </span>

                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateMaterial(
                            item.id,
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="Judul material..."
                      />

                    </label>


                    <label className="editor-field">

                      <span>
                        CONTENT
                      </span>

                      <textarea
                        value={item.content}
                        onChange={(event) =>
                          updateMaterial(
                            item.id,
                            "content",
                            event.target.value
                          )
                        }
                        rows={5}
                        placeholder="Isi material..."
                      />

                    </label>

                  </div>

                </article>

              )
            )}

          </div>


          <button
            className="add-content-button"
            onClick={addMaterial}
          >
            + Add Material
          </button>

        </section>


        {/* QUIZ */}

        <section className="editor-section">

          <div className="editor-section-heading">

            <div className="section-heading-number">
              05
            </div>

            <div className="section-heading-main">

              <div className="section-heading-title">

                <h2>
                  Knowledge Check
                </h2>

                <span>
                  {lesson.quiz.length}
                </span>

              </div>

              <p>
                Kelola pertanyaan,
                options, dan jawaban quiz.
              </p>

            </div>

          </div>


          <div className="content-editor-list">

            {lesson.quiz.map(
              (question, index) => (

                <article
                  className="content-editor-card"
                  key={question.id}
                >

                  <div className="content-editor-top">

                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteQuiz(question.id)
                      }
                    >
                      Delete
                    </button>

                  </div>


                  <div className="content-editor-fields">

                    <label className="editor-field">

                      <span>
                        QUESTION
                      </span>

                      <textarea
                        value={question.question}
                        onChange={(event) =>
                          updateQuizQuestion(
                            question.id,
                            event.target.value
                          )
                        }
                        rows={3}
                        placeholder="Tulis pertanyaan..."
                      />

                    </label>


                    <div className="quiz-options">

                      {question.options.map(
                        (option, optionIndex) => (

                          <label
                            className="editor-field"
                            key={optionIndex}
                          >

                            <span>
                              OPTION{" "}
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </span>

                            <input
                              value={option}
                              onChange={(event) =>
                                updateQuizOption(
                                  question.id,
                                  optionIndex,
                                  event.target.value
                                )
                              }
                              placeholder={`Option ${String.fromCharCode(
                                65 + optionIndex
                              )}`}
                            />

                          </label>

                        )
                      )}

                    </div>


                    <label className="editor-field">

                      <span>
                        CORRECT ANSWER
                      </span>

                      <select
                        value={
                          question.correctAnswer
                        }
                        onChange={(event) =>
                          updateQuizAnswer(
                            question.id,
                            Number(
                              event.target.value
                            )
                          )
                        }
                      >

                        {question.options.map(
                          (_, optionIndex) => (

                            <option
                              value={optionIndex}
                              key={optionIndex}
                            >
                              Option{" "}
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </option>

                          )
                        )}

                      </select>

                    </label>

                  </div>

                </article>

              )
            )}

          </div>


          <button
            className="add-content-button"
            onClick={addQuiz}
          >
            + Add Question
          </button>

        </section>


        <section className="editor-footer">

          <Link href="/admin/lessons">
            ← Back
          </Link>

          <div className="editor-actions">

            {saved && (
              <span className="save-success">
                ✓ Changes saved
              </span>
            )}

            <button
              className="save-button"
              onClick={saveChanges}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </section>

      </div>

    </main>
  );
}