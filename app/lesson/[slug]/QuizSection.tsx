"use client";

import {
  useEffect,
  useState,
} from "react";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

type QuizSectionProps = {
  questions: QuizQuestion[];
  onResult?: (result: {
    score: number;
    passed: boolean;
  }) => void;
};

function getSessionId() {
  const key =
    "creator_studio_session_id";

  const existing =
    window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const id =
    `session-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

  window.localStorage.setItem(
    key,
    id
  );

  return id;
}

export default function QuizSection({
  questions,
  onResult,
}: QuizSectionProps) {
  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, number>>({});

  const [score, setScore] =
    useState<number | null>(null);

  const [attempt, setAttempt] =
    useState(0);

  const [saving, setSaving] =
    useState(false);

  const [canAttempt, setCanAttempt] =
    useState(true);

  const [todayScore, setTodayScore] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadAttempt() {
      if (questions.length === 0) return;

      try {
        const sessionId =
          getSessionId();

        const response =
          await fetch(
            `/api/lessons/${window.location.pathname
              .split("/")
              .filter(Boolean)
              .pop()}/attempt?sessionId=${encodeURIComponent(
              sessionId
            )}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) return;

        const data =
          await response.json();

        if (data.todayAttempt) {
          setCanAttempt(false);
          setTodayScore(
            data.todayAttempt.score
          );
          setScore(
            data.todayAttempt.score
          );
        }
      } catch {
        // Quiz tetap dapat digunakan
        // jika history gagal dimuat.
      }
    }

    loadAttempt();
  }, [questions.length]);

  function chooseAnswer(
    questionIndex: number,
    answerIndex: number
  ) {
    if (
      score !== null ||
      !canAttempt
    ) {
      return;
    }

    setSelectedAnswers(
      (previous) => ({
        ...previous,
        [questionIndex]:
          answerIndex,
      })
    );
  }

  async function submitQuiz() {
    if (
      Object.keys(selectedAnswers)
        .length !== questions.length
    ) {
      return;
    }

    if (!canAttempt) {
      return;
    }

    let correct = 0;

    questions.forEach(
      (question, index) => {
        if (
          selectedAnswers[index] ===
          question.answer
        ) {
          correct++;
        }
      }
    );

    const finalScore =
      questions.length === 0
        ? 0
        : Math.round(
            (correct /
              questions.length) *
              100
          );

    setScore(finalScore);
    setAttempt(
      (previous) => previous + 1
    );
    setSaving(true);
    setError("");

    try {
      const sessionId =
        getSessionId();

      const slug =
        window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop();

      const response =
        await fetch(
          `/api/lessons/${slug}/attempt`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sessionId,
              score: finalScore,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Gagal menyimpan score."
        );
      }

      setCanAttempt(false);
      setTodayScore(finalScore);

      onResult?.({
        score: finalScore,
        passed:
          finalScore >= 80,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan score."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetQuiz() {
    if (!canAttempt) {
      return;
    }

    setSelectedAnswers({});
    setScore(null);
    setError("");
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-empty">
        Belum ada quiz untuk lesson ini.
      </div>
    );
  }

  const answered =
    Object.keys(selectedAnswers)
      .length;

  const passed =
    score !== null &&
    score >= 80;

  return (
    <div className="quiz-section">
      <div className="quiz-status">
        <span>
          ATTEMPT{" "}
          {attempt + 1}
        </span>

        <span>
          {answered} /{" "}
          {questions.length} answered
        </span>
      </div>

      {!canAttempt &&
        score !== null && (
          <div className="quiz-locked">
            <strong>
              Quiz hari ini sudah selesai.
            </strong>

            <span>
              Score terakhir:{" "}
              {score}
            </span>

            {passed ? (
              <p>
                Kamu sudah lulus lesson ini.
              </p>
            ) : (
              <p>
                Remedial tersedia kembali
                besok.
              </p>
            )}
          </div>
        )}

      <div className="quiz-list">
        {questions.map(
          (
            question,
            questionIndex
          ) => (
            <article
              className="quiz-question"
              key={
                `${question.question}-${questionIndex}`
              }
            >
              <div className="quiz-question-number">
                {String(
                  questionIndex + 1
                ).padStart(2, "0")}
              </div>

              <div>
                <h3>
                  {question.question}
                </h3>

                <div className="quiz-options">
                  {question.options.map(
                    (
                      option,
                      optionIndex
                    ) => {
                      const selected =
                        selectedAnswers[
                          questionIndex
                        ] ===
                        optionIndex;

                      const correct =
                        score !== null &&
                        question.answer ===
                          optionIndex;

                      const wrong =
                        score !== null &&
                        selected &&
                        !correct;

                      return (
                        <button
                          type="button"
                          key={
                            `${option}-${optionIndex}`
                          }
                          className={[
                            "quiz-option",
                            selected
                              ? "is-selected"
                              : "",
                            correct
                              ? "is-correct"
                              : "",
                            wrong
                              ? "is-wrong"
                              : "",
                          ]
                            .filter(
                              Boolean
                            )
                            .join(" ")}
                          onClick={() =>
                            chooseAnswer(
                              questionIndex,
                              optionIndex
                            )
                          }
                          disabled={
                            score !== null ||
                            !canAttempt
                          }
                        >
                          <span>
                            {String.fromCharCode(
                              65 +
                                optionIndex
                            )}
                          </span>

                          <span className="quiz-option-text">
                            {option}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {error && (
        <div className="quiz-error">
          {error}
        </div>
      )}

      {score === null ? (
        <div className="quiz-navigation">
          <button
            type="button"
            className="quiz-next-button"
            disabled={
              answered !==
                questions.length ||
              saving ||
              !canAttempt
            }
            onClick={submitQuiz}
          >
            {saving
              ? "Saving..."
              : "Submit Quiz"}
          </button>
        </div>
      ) : (
        <div className="quiz-result">
          <div>
            <span className="quiz-result-label">
              SCORE
            </span>

            <strong>
              {score}
            </strong>
          </div>

          {passed ? (
            <div>
              <h3>
                Nice. Lesson selesai.
              </h3>

              <p>
                Kamu sudah mencapai
                passing score dan dapat
                melanjutkan ke lesson
                berikutnya.
              </p>
            </div>
          ) : (
            <div>
              <h3>
                Remedial diperlukan.
              </h3>

              <p>
                Score kamu belum mencapai
                80. Review kembali material
                sebelum mencoba lagi besok.
              </p>
            </div>
          )}

          {canAttempt && (
            <button
              type="button"
              className="quiz-restart-button"
              onClick={resetQuiz}
            >
              Ulangi Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}
