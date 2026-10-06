const mysql = require("mysql2/promise");

async function main() {
  const db = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "creator_studio",
  });

  try {
    const [lessons] = await db.execute(
      "SELECT id FROM lessons WHERE slug = ? LIMIT 1",
      ["cara-memakai-playbook"]
    );

    if (!lessons.length) {
      throw new Error("Lesson cara-memakai-playbook tidak ditemukan.");
    }

    const lessonId = lessons[0].id;

    await db.execute(
      "DELETE FROM flashcards WHERE lesson_id = ?",
      [lessonId]
    );

    const cards = [
      [
        "Apa fungsi utama Playbook Content Plan?",
        "Menjadi panduan kerja konten dari perencanaan sampai evaluasi.",
      ],
      [
        "Berapa langkah utama workflow konten?",
        "Ada 13 langkah dalam workflow konten.",
      ],
      [
        "Mengapa workflow perlu berjalan berurutan?",
        "Agar output satu tahap dapat menjadi input untuk tahap berikutnya.",
      ],
      [
        "Siapa saja yang dapat menggunakan playbook?",
        "Pemula, tim sosmed, manajer, desainer, dan copywriter.",
      ],
      [
        "Apa yang perlu diperhatikan saat membaca playbook?",
        "Ikuti tujuan, input, proses, output, checklist, dan alur setiap tahap.",
      ],
    ];

    for (let i = 0; i < cards.length; i++) {
      await db.execute(
        `INSERT INTO flashcards
          (lesson_id, sort_order, question, answer)
         VALUES (?, ?, ?, ?)`,
        [lessonId, i + 1, cards[i][0], cards[i][1]]
      );
    }

    const [rows] = await db.execute(`
      SELECT
        l.lesson_number,
        l.slug,
        l.title,
        COUNT(f.id) AS flashcards
      FROM lessons l
      LEFT JOIN flashcards f
        ON f.lesson_id = l.id
      GROUP BY l.id, l.lesson_number, l.slug, l.title
      ORDER BY CAST(l.lesson_number AS UNSIGNED)
    `);

    console.table(rows);

    const [total] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM flashcards
    `);

    console.log("");
    console.log("TOTAL FLASHCARD:", total[0].total);
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});