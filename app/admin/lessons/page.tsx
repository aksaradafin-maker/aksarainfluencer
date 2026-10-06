"use client";

import Link from "next/link";
import { lessons } from "@/lib/lessons";
import "./admin-lessons.css";

export default function LessonsAdminPage() {
  return (
    <main className="admin-lessons">

      <header className="admin-header">

        <Link
          href="/"
          className="admin-brand"
        >
          RIZMAGO<span>LAB STUDIO</span>
        </Link>

        <Link
          href="/learning-path"
          className="admin-back"
        >
          ← Learning Path
        </Link>

      </header>


      <div className="admin-container">

        <section className="admin-hero">

          <div>

            <span className="admin-eyebrow">
              CONTENT CONTROL
            </span>

            <h1>
              Lesson Control
            </h1>

            <p>
              Kelola seluruh lesson dari satu tempat.
              Data learner dan admin menggunakan sumber
              data yang sama.
            </p>

          </div>

          <div className="admin-count">
            <strong>
              {lessons.length}
            </strong>

            <span>
              LESSONS
            </span>
          </div>

        </section>


        <section className="lesson-admin-list">

          <div className="lesson-admin-list__header">
            <span>LESSON</span>
            <span>CONTENT</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>


          {lessons.map((lesson) => (

            <article
              className="lesson-admin-row"
              key={lesson.slug}
            >

              <div className="lesson-admin-number">

                <span>
                  {lesson.number}
                </span>

                <div>

                  <small>
                    {lesson.chapter}
                  </small>

                  <h2>
                    {lesson.title}
                  </h2>

                  <p>
                    {lesson.description}
                  </p>

                </div>

              </div>


              <div className="lesson-admin-content">

                <span>
                  VIDEO
                  <b>1</b>
                </span>

                <span>
                  FLASHCARD
                  <b>{lesson.flashcards.length}</b>
                </span>

                <span>
                  MATERIAL
                  <b>{lesson.material.length}</b>
                </span>

                <span>
                  QUIZ
                  <b>{lesson.quiz.length}</b>
                </span>

              </div>


              <div>

                <span
                  className={`lesson-status lesson-status--${lesson.status}`}
                >
                  {lesson.status}
                </span>

              </div>


              <div>

                <Link
                  href={`/admin/lessons/${lesson.slug}`}
                  className="lesson-edit-button"
                >
                  Edit Lesson →
                </Link>

              </div>

            </article>

          ))}

        </section>

      </div>

    </main>
  );
}