const mysql = require("mysql2/promise");

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "creator_studio",
};

const lessons = [
  {
    slug: "riset-benchmarking",
    lessonNumber: "03",
    chapter: "03 / RISET & BENCHMARKING",
    title: "Riset & Benchmarking",
    description: "Memahami cara melakukan riset dan membedah benchmark sebagai dasar pengembangan konten.",
  },
  {
    slug: "content-pillar",
    lessonNumber: "04",
    chapter: "04 / CONTENT PILLAR",
    title: "Content Pillar",
    description: "Menentukan kelompok konten dan distribusinya agar arah komunikasi lebih terstruktur.",
  },
  {
    slug: "perencanaan",
    lessonNumber: "05",
    chapter: "05 / PERENCANAAN",
    title: "Perencanaan Konten",
    description: "Mengubah tujuan dan ide menjadi rencana konten yang siap diproduksi.",
  },
  {
    slug: "copywriting-hook",
    lessonNumber: "06",
    chapter: "06 / COPYWRITING & HOOK",
    title: "Copywriting & Hook",
    description: "Menyusun struktur komunikasi konten dan membuat pembuka yang relevan.",
  },
  {
    slug: "desain-produksi",
    lessonNumber: "07",
    chapter: "07 / DESAIN & PRODUKSI",
    title: "Desain & Produksi",
    description: "Menyiapkan standar visual, brief, dan proses produksi konten.",
  },
  {
    slug: "approval-arsip-upload",
    lessonNumber: "08",
    chapter: "08 / APPROVAL, ARSIP & UPLOAD",
    title: "Approval, Arsip & Upload",
    description: "Mengelola approval, penyimpanan aset, scheduling, dan proses upload.",
  },
  {
    slug: "evaluasi-report",
    lessonNumber: "09",
    chapter: "09 / EVALUASI & REPORT",
    title: "Evaluasi & Report",
    description: "Mengevaluasi performa konten dan mengubah hasil evaluasi menjadi keputusan.",
  },
  {
    slug: "pola-konten",
    lessonNumber: "10",
    chapter: "10 / POLA KONTEN TERBUKTI",
    title: "Pola Konten Terbukti",
    description: "Mengenali pola konten yang dapat digunakan sebagai sumber ide dan pembelajaran.",
  },
  {
    slug: "operasional-template",
    lessonNumber: "11",
    chapter: "11 / OPERASIONAL & TEMPLATE",
    title: "Operasional & Template",
    description: "Memahami aturan penggunaan template dan pembagian kerja dalam operasional konten.",
  },
  {
    slug: "cara-memakai-playbook",
    lessonNumber: "00",
    chapter: "00 / CARA MEMAKAI PLAYBOOK",
    title: "Cara Memakai Playbook",
    description: "Memahami struktur playbook, workflow, peran, dan cara menggunakan setiap bab.",
  },
];

async function main() {
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    for (const lesson of lessons) {
      const [existing] = await connection.execute(
        "SELECT id FROM lessons WHERE slug = ? LIMIT 1",
        [lesson.slug]
      );

      if (existing.length) {
        console.log(`EXISTS: ${lesson.lessonNumber} — ${lesson.title}`);
        continue;
      }

      await connection.execute(
        `INSERT INTO lessons
          (
            slug,
            lesson_number,
            chapter,
            title,
            description,
            video_id,
            video_url,
            status
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lesson.slug,
          lesson.lessonNumber,
          lesson.chapter,
          lesson.title,
          lesson.description,
          "",
          "",
          "draft",
        ]
      );

      console.log(`CREATED: ${lesson.lessonNumber} — ${lesson.title}`);
    }

    console.log("");
    console.log("DAFTAR LESSON:");

    const [rows] = await connection.execute(`
      SELECT
        lesson_number,
        slug,
        title,
        status
      FROM lessons
      ORDER BY CAST(lesson_number AS UNSIGNED)
    `);

    console.table(rows);
  } catch (error) {
    console.error("GAGAL:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();