"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

export default function FlashcardSection() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadLesson() {
      try {
        const response = await fetch(`/api/lessons/${slug}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load lesson");
        }

        const data = await response.json();

        setCards(
          Array.isArray(data.flashcards)
            ? data.flashcards.map((card: Flashcard) => ({
                id: Number(card.id),
                question: card.question,
                answer: card.answer,
              }))
            : []
        );
      } catch (error) {
        console.error(error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [slug]);

  const card = cards[currentIndex];

  const progress = cards.length
    ? ((currentIndex + 1) / cards.length) * 100
    : 0;

  const knownCount = known.length;
  const unknownCount = unknown.length;

  const currentStatus = useMemo(() => {
    if (!card) return null;

    if (known.includes(card.id)) return "known";
    if (unknown.includes(card.id)) return "unknown";

    return null;
  }, [card, known, unknown]);

  function goPrevious() {
    if (currentIndex <= 0) return;

    setCurrentIndex((value) => value - 1);
    setFlipped(false);
  }

  function goNext() {
    if (currentIndex >= cards.length - 1) return;

    setCurrentIndex((value) => value + 1);
    setFlipped(false);
  }

  function chooseAnswer(isKnown: boolean) {
    if (!card) return;

    if (isKnown) {
      setKnown((items) =>
        items.includes(card.id) ? items : [...items, card.id]
      );

      setUnknown((items) => items.filter((id) => id !== card.id));
    } else {
      setUnknown((items) =>
        items.includes(card.id) ? items : [...items, card.id]
      );

      setKnown((items) => items.filter((id) => id !== card.id));
    }

    setFlipped(false);

    if (currentIndex >= cards.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function reviewUnknown() {
    const remaining = cards.filter((item) => unknown.includes(item.id));

    if (remaining.length === 0) {
      restart();
      return;
    }

    setCards(remaining);
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
    setKnown([]);
    setUnknown([]);
  }

  function restart() {
    if (!slug) return;

    async function reload() {
      try {
        const response = await fetch(`/api/lessons/${slug}`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        setCards(
          Array.isArray(data.flashcards)
            ? data.flashcards.map((item: Flashcard) => ({
                id: Number(item.id),
                question: item.question,
                answer: item.answer,
              }))
            : []
        );

        setCurrentIndex(0);
        setFlipped(false);
        setKnown([]);
        setUnknown([]);
        setFinished(false);
      } catch (error) {
        console.error(error);
      }
    }

    reload();
  }

  if (loading) {
    return (
      <section className="flashcard-section">
        <div className="flashcard-loading">
          <span>FLASHCARDS</span>
          <strong>Loading...</strong>
        </div>
      </section>
    );
  }

  if (!cards.length) {
    return (
      <section className="flashcard-section">
        <div className="flashcard-empty">
          <span>FLASHCARDS</span>
          <strong>Belum ada flashcard.</strong>
        </div>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="flashcard-section">
        <div className="flashcard-section-heading">
          <div className="flashcard-section-title">
            <span>02</span>

            <div>
              <small>LEARNING AID</small>
              <h2>Flashcards</h2>
            </div>
          </div>
        </div>

        <div className="flashcard-divider" />

        <div className="flashcard-result">
          <span className="flashcard-result-kicker">
            SESSION COMPLETE
          </span>

          <h3>Review selesai.</h3>

          <p>
            Tandai kartu yang sudah kamu pahami dan ulangi kartu yang
            masih perlu diperkuat.
          </p>

          <div className="flashcard-score-grid">
            <div className="flashcard-score-card">
              <strong>{knownCount}</strong>
              <span>TAHU</span>
            </div>

            <div className="flashcard-score-card">
              <strong>{unknownCount}</strong>
              <span>BELUM TAHU</span>
            </div>
          </div>

          <div className="flashcard-result-actions">
            {unknownCount > 0 && (
              <button
                type="button"
                className="flashcard-primary-button"
                onClick={reviewUnknown}
              >
                REVIEW BELUM TAHU
              </button>
            )}

            <button
              type="button"
              className="flashcard-secondary-button"
              onClick={restart}
            >
              ULANGI SEMUA
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flashcard-section">
      <div className="flashcard-section-heading">
        <div className="flashcard-section-title">
          <span>02</span>

          <div>
            <small>LEARNING AID</small>
            <h2>Flashcards</h2>
          </div>
        </div>

        <div className="flashcard-counter">
          <strong>{String(currentIndex + 1).padStart(2, "0")}</strong>
          <span>/ {String(cards.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="flashcard-divider" />

      <div className="flashcard-progress">
        <div
          className="flashcard-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flashcard-navigation">
        <button
          type="button"
          className="flashcard-nav-button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <span>
          {currentIndex + 1} / {cards.length}
        </span>

        <button
          type="button"
          className="flashcard-nav-button flashcard-nav-next"
          onClick={goNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
        </button>
      </div>

      <button
        type="button"
        className={`flashcard-card ${
          flipped ? "is-flipped" : ""
        }`}
        onClick={() => setFlipped((value) => !value)}
        aria-label="Flip flashcard"
      >
        <div className="flashcard-card-inner">
          <div className="flashcard-face flashcard-front">
            <div className="flashcard-face-top">
              <span>
                CARD {String(card.id).padStart(2, "0")}
              </span>

              <span>QUESTION</span>
            </div>

            <div className="flashcard-face-content">
              <small>RECALL</small>

              <h3>{card.question}</h3>
            </div>

            <div className="flashcard-face-bottom">
              CLICK TO FLIP
            </div>
          </div>

          <div className="flashcard-face flashcard-back">
            <div className="flashcard-face-top">
              <span>
                CARD {String(card.id).padStart(2, "0")}
              </span>

              <span>ANSWER</span>
            </div>

            <div className="flashcard-face-content">
              <small>ANSWER</small>

              <h3>{card.answer}</h3>
            </div>

            <div className="flashcard-face-bottom">
              CLICK TO FLIP BACK
            </div>
          </div>
        </div>
      </button>

      <div className="flashcard-status">
        {currentStatus === "known" && (
          <span className="flashcard-status-known">
            Sudah ditandai Tahu
          </span>
        )}

        {currentStatus === "unknown" && (
          <span className="flashcard-status-unknown">
            Masih perlu direview
          </span>
        )}
      </div>

      <div className="flashcard-actions">
        <button
          type="button"
          className="flashcard-action flashcard-action-unknown"
          onClick={() => chooseAnswer(false)}
        >
          <span>×</span>
          <strong>Belum Tahu</strong>
        </button>

        <button
          type="button"
          className="flashcard-action flashcard-action-known"
          onClick={() => chooseAnswer(true)}
        >
          <span>✓</span>
          <strong>Tahu</strong>
        </button>
      </div>

      <div className="flashcard-scorebar">
        <div>
          <span className="flashcard-score-dot known" />
          <span>Tahu</span>
          <strong>{knownCount}</strong>
        </div>

        <div>
          <span className="flashcard-score-dot unknown" />
          <span>Belum Tahu</span>
          <strong>{unknownCount}</strong>
        </div>
      </div>
    </section>
  );
}