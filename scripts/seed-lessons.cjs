const mysql = require("mysql2/promise");

const lessons = [
  {
    slug: "fondasi",
    lessonNumber: "01",
    chapter: "01 / FONDASI",
    title: "Fondasi",
    description:
      "Bangun dasar yang jelas sebelum masuk ke proses produksi dan pengembangan konten.",
    videoId: "6z2egU-Xei4",
    videoUrl: "https://www.youtube.com/watch?v=6z2egU-Xei4",
    status: "published",

    flashcards: [],
    materials: [],
    quiz: [],
  },

  {
    slug: "target-audience",
    lessonNumber: "02",
    chapter: "02 / BRAND & TARGET",
    title: "Menentukan Target Audience",
    description:
      "Memahami siapa yang ingin kamu bantu agar arah konten menjadi lebih jelas.",
    videoId: "BLkvC-dlSV4",
    videoUrl: "https://www.youtube.com/watch?v=BLkvC-dlSV4",
    status: "published",

    flashcards: [
      {
        question: "Apa itu target audience?",
        answer:
          "Orang yang menjadi sasaran utama dari komunikasi dan konten yang dibuat.",
      },
      {
        question: "Kenapa target audience penting?",
        answer:
          "Target audience membantu menentukan arah pesan, topik, dan pendekatan konten.",
      },
      {
        question: "Mulai dari apa saat menentukan target audience?",
        answer:
          "Identifikasi kebutuhan, masalah, atau konteks audience yang ingin kamu bantu.",
      },
    ],

    materials: [
      {
        title: "Tentukan siapa yang ingin kamu jangkau",
        content: "Tentukan siapa yang ingin kamu jangkau.",
      },
      {
        title: "Pahami kebutuhan audience",
        content: "Pahami kebutuhan dan masalah utama mereka.",
      },
      {
        title: "Gunakan sebagai dasar arah konten",
        content:
          "Gunakan informasi tersebut sebagai dasar arah konten.",
      },
    ],

    quiz: [
      {
        question: "Apa fungsi utama menentukan target audience?",
        options: [
          "Menentukan jumlah followers",
          "Menentukan arah komunikasi dan konten",
          "Membuat konten menjadi viral",
          "Menentukan harga equipment",
        ],
        correctAnswer: 1,
      },
      {
        question: "Hal apa yang perlu dipahami dari target audience?",
        options: [
          "Warna favorit saja",
          "Jumlah followers mereka",
          "Kebutuhan dan masalah mereka",
          "Equipment yang mereka gunakan",
        ],
        correctAnswer: 2,
      },
      {
        question: "Target audience dapat membantu menentukan...",
        options: [
          "Arah pesan dan topik",
          "Harga kamera",
          "Jumlah posting yang pasti viral",
          "Algoritma platform",
        ],
        correctAnswer: 0,
      },
      {
        question: "Langkah awal yang tepat adalah...",
        options: [
          "Membeli equipment",
          "Mencari viral content",
          "Menentukan siapa yang ingin dibantu",
          "Membuat logo",
        ],
        correctAnswer: 2,
      },
      {
        question: "Target audience sebaiknya menjadi dasar untuk...",
        options: [
          "Arah konten",
          "Ukuran kamera",
          "Nama laptop",
          "Jumlah storage",
        ],
        correctAnswer: 0,
      },
    ],
  },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "creator_studio",
  });

  try {
    await connection.beginTransaction();

    for (const lesson of lessons) {
      // Cari lesson berdasarkan slug
      const [existingRows] = await connection.execute(
        `
          SELECT id
          FROM lessons
          WHERE slug = ?
          LIMIT 1
        `,
        [lesson.slug]
      );

      const existing = existingRows;

      let lessonId;

      if (existing.length) {
        lessonId = existing[0].id;

        await connection.execute(
          `
            UPDATE lessons
            SET
              lesson_number = ?,
              chapter = ?,
              title = ?,
              description = ?,
              video_id = ?,
              video_url = ?,
              status = ?
            WHERE id = ?
          `,
          [
            lesson.lessonNumber,
            lesson.chapter,
            lesson.title,
            lesson.description,
            lesson.videoId,
            lesson.videoUrl,
            lesson.status,
            lessonId,
          ]
        );

        // Bersihkan child data agar seed idempotent
        await connection.execute(
          `DELETE FROM flashcards WHERE lesson_id = ?`,
          [lessonId]
        );

        await connection.execute(
          `DELETE FROM materials WHERE lesson_id = ?`,
          [lessonId]
        );

        await connection.execute(
          `DELETE FROM quiz_questions WHERE lesson_id = ?`,
          [lessonId]
        );
      } else {
        const [result] = await connection.execute(
          `
            INSERT INTO lessons (
              slug,
              lesson_number,
              chapter,
              title,
              description,
              video_id,
              video_url,
              status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            lesson.slug,
            lesson.lessonNumber,
            lesson.chapter,
            lesson.title,
            lesson.description,
            lesson.videoId,
            lesson.videoUrl,
            lesson.status,
          ]
        );

        lessonId = result.insertId;
      }

      // Flashcards
      for (let i = 0; i < lesson.flashcards.length; i++) {
        const card = lesson.flashcards[i];

        await connection.execute(
          `
            INSERT INTO flashcards (
              lesson_id,
              sort_order,
              question,
              answer
            )
            VALUES (?, ?, ?, ?)
          `,
          [
            lessonId,
            i,
            card.question,
            card.answer,
          ]
        );
      }

      // Materials
      for (let i = 0; i < lesson.materials.length; i++) {
        const material = lesson.materials[i];

        await connection.execute(
          `
            INSERT INTO materials (
              lesson_id,
              sort_order,
              title,
              content
            )
            VALUES (?, ?, ?, ?)
          `,
          [
            lessonId,
            i,
            material.title,
            material.content,
          ]
        );
      }

      // Quiz
      for (let i = 0; i < lesson.quiz.length; i++) {
        const quiz = lesson.quiz[i];

        const [questionResult] = await connection.execute(
          `
            INSERT INTO quiz_questions (
              lesson_id,
              sort_order,
              question
            )
            VALUES (?, ?, ?)
          `,
          [
            lessonId,
            i,
            quiz.question,
          ]
        );

        const questionId = questionResult.insertId;

        let correctOptionId = null;

        for (let j = 0; j < quiz.options.length; j++) {
          const [optionResult] = await connection.execute(
            `
              INSERT INTO quiz_options (
                question_id,
                sort_order,
                option_text
              )
              VALUES (?, ?, ?)
            `,
            [
              questionId,
              j,
              quiz.options[j],
            ]
          );

          if (j === quiz.correctAnswer) {
            correctOptionId = optionResult.insertId;
          }
        }

        if (correctOptionId !== null) {
          await connection.execute(
            `
              UPDATE quiz_questions
              SET correct_option_id = ?
              WHERE id = ?
            `,
            [
              correctOptionId,
              questionId,
            ]
          );
        }
      }

      console.log(
        `Seeded: ${lesson.lessonNumber} / ${lesson.title}`
      );
    }

    await connection.commit();

    console.log("");
    console.log("SEED BERHASIL.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("");
  console.error("SEED GAGAL:");
  console.error(error);
  process.exitCode = 1;
});