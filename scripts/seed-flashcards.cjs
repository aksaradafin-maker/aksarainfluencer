const mysql = require("mysql2/promise");

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "creator_studio",
};

const decks = {
  "fondasi": [
    {
      question: "Apa tujuan utama sebuah content plan?",
      answer: "Memberi arah kerja konten dari tujuan sampai evaluasi agar produksi tidak berjalan secara acak.",
    },
    {
      question: "Apa tiga tujuan ngonten yang dibahas dalam playbook?",
      answer: "Launch, sustain, dan personal branding.",
    },
    {
      question: "Apa perbedaan actionable metric dan vanity metric?",
      answer: "Actionable metric membantu mengambil keputusan, sedangkan vanity metric bisa terlihat bagus tetapi belum tentu membantu menentukan tindakan.",
    },
    {
      question: "Apa saja yang perlu diaudit sebelum produksi konten?",
      answer: "Aset, fasilitas, tim, timeline, dan winning content yang sudah pernah terbukti.",
    },
    {
      question: "Apa prinsip penting dalam melakukan improvement?",
      answer: "Hal yang bisa diukur dapat dievaluasi sehingga bisa diperbaiki secara lebih terarah.",
    },
  ],

  "target-audience": [
    {
      question: "Apa itu target audience?",
      answer: "Orang yang menjadi sasaran utama dari komunikasi dan konten yang dibuat.",
    },
    {
      question: "Kenapa target audience penting?",
      answer: "Target audience membantu menentukan arah pesan, topik, dan pendekatan konten.",
    },
    {
      question: "Mulai dari apa saat menentukan target audience?",
      answer: "Mulai dari kebutuhan, masalah, atau konteks audience yang ingin dibantu.",
    },
    {
      question: "Apa yang perlu dipahami dari target audience?",
      answer: "Kebutuhan, masalah, konteks, dan kondisi yang relevan dengan mereka.",
    },
    {
      question: "Target audience sebaiknya menjadi dasar untuk apa?",
      answer: "Menentukan arah komunikasi dan konten agar pesan lebih relevan.",
    },
  ],

  "riset-benchmarking": [
    {
      question: "Apa tujuan riset dalam proses content planning?",
      answer: "Menemukan insight yang dapat digunakan sebagai dasar membuat keputusan konten.",
    },
    {
      question: "Apa saja bagian akun yang dapat dibedah saat benchmarking?",
      answer: "Bio, highlight, content pillar, frekuensi, caption, dan komentar.",
    },
    {
      question: "Kenapa benchmarking tidak cukup hanya melihat feed?",
      answer: "Karena insight juga dapat muncul dari Story, Reels, live, iklan, testimoni, dan kanal lainnya.",
    },
    {
      question: "Apa perbedaan fase launching dan sustain?",
      answer: "Launching berfokus membangun momentum, sedangkan sustain berfokus menjaga dan mengembangkan performa.",
    },
    {
      question: "Berapa batas benchmark yang disarankan?",
      answer: "Maksimal tiga benchmark agar analisis tetap fokus dan dapat dibandingkan dengan jelas.",
    },
  ],

  "content-pillar": [
    {
      question: "Apa tiga tipe selling dalam content pillar?",
      answer: "Soft selling, hard selling, dan passive selling.",
    },
    {
      question: "Apa fungsi content pillar?",
      answer: "Mengelompokkan arah dan jenis konten agar produksi lebih terarah.",
    },
    {
      question: "Apa yang dimaksud Golden Pillars?",
      answer: "Kerangka tiga kelompok pillar yang digunakan untuk membantu mengatur fokus konten.",
    },
    {
      question: "Mengapa persentase content pillar perlu ditentukan?",
      answer: "Agar distribusi konten sesuai dengan tujuan dan tidak berjalan secara acak.",
    },
    {
      question: "Berapa porsi yang dapat digunakan untuk eksperimen?",
      answer: "Sekitar 10–20% dapat dialokasikan untuk menguji ide atau pendekatan baru.",
    },
  ],

  "perencanaan": [
    {
      question: "Apa perbedaan konten event dan konten rutin?",
      answer: "Konten event berkaitan dengan momen tertentu, sedangkan konten rutin dibuat sebagai aktivitas berkelanjutan.",
    },
    {
      question: "Apa fungsi Calendar?",
      answer: "Menentukan kapan konten direncanakan dan dipublikasikan.",
    },
    {
      question: "Apa fungsi Content Plan?",
      answer: "Mengelola detail produksi, approval, upload, dan evaluasi konten.",
    },
    {
      question: "Mengapa tanggal penting perlu dimasukkan ke perencanaan?",
      answer: "Agar konten yang berkaitan dengan momen tersebut dapat dipersiapkan sebelum waktunya.",
    },
    {
      question: "Apa target waktu persiapan yang disebut dalam playbook?",
      answer: "H-7 untuk kebutuhan tertentu dalam proses perencanaan.",
    },
  ],

  "copywriting-hook": [
    {
      question: "Apa struktur script yang digunakan dalam playbook?",
      answer: "Hook, Pain, Content/Solution, Debrief, dan CTA.",
    },
    {
      question: "Apa fungsi hook?",
      answer: "Membuka konten dengan alasan yang membuat audience tertarik untuk melanjutkan.",
    },
    {
      question: "Apa fungsi bagian Pain?",
      answer: "Mengangkat masalah atau kondisi yang relevan dengan audience.",
    },
    {
      question: "Apa fungsi Content/Solution?",
      answer: "Memberikan isi utama, penjelasan, atau solusi dari masalah yang dibahas.",
    },
    {
      question: "Apa fungsi CTA?",
      answer: "Mengarahkan audience pada tindakan yang diharapkan setelah melihat konten.",
    },
  ],

  "desain-produksi": [
    {
      question: "Apa fungsi margin dalam desain konten?",
      answer: "Memberikan ruang agar elemen tidak terlalu mepet dan komposisi lebih nyaman dilihat.",
    },
    {
      question: "Apa fungsi hierarki visual?",
      answer: "Membantu audience memahami urutan informasi dari yang paling penting sampai informasi pendukung.",
    },
    {
      question: "Apa yang perlu dibedakan dalam hierarki teks?",
      answer: "Title, subtitle, dan isi perlu memiliki perbedaan visual yang jelas.",
    },
    {
      question: "Apa fungsi brief desain?",
      answer: "Memberikan arahan yang jelas kepada desainer sebelum proses produksi.",
    },
    {
      question: "Bagaimana revisi desain sebaiknya dikelola?",
      answer: "Gunakan komentar dan tag agar perubahan, konteks, dan pihak yang perlu menindaklanjuti tetap jelas.",
    },
  ],

  "approval-arsip-upload": [
    {
      question: "Apa fungsi approval dalam workflow konten?",
      answer: "Memastikan konten sudah siap sebelum masuk ke tahap berikutnya.",
    },
    {
      question: "Kenapa aset final perlu diarsipkan?",
      answer: "Agar aset mudah ditemukan kembali dan dapat digunakan untuk kebutuhan berikutnya.",
    },
    {
      question: "Apa yang dimaksud schedule dalam workflow?",
      answer: "Menentukan waktu publikasi konten sebelum konten benar-benar tayang.",
    },
    {
      question: "Berapa rentang waktu persiapan upload yang disebut?",
      answer: "Sekitar 3–7 hari sebelum upload untuk SOP waktu tertentu.",
    },
    {
      question: "Apa tujuan checklist sebelum upload?",
      answer: "Memastikan elemen penting seperti aset, caption, approval, dan link sudah siap.",
    },
  ],

  "evaluasi-report": [
    {
      question: "Kapan evaluasi per konten dilakukan?",
      answer: "Playbook menggunakan H+7 sebagai acuan evaluasi per konten.",
    },
    {
      question: "Apa yang dicatat saat evaluasi konten?",
      answer: "Metrik performa dan evaluasi deskriptif terhadap hasil konten.",
    },
    {
      question: "Apa tiga pertanyaan dasar dalam evaluasi?",
      answer: "Apa yang berhasil, apa yang tidak berhasil, dan apa yang perlu diperbaiki.",
    },
    {
      question: "Apa fungsi report bulanan?",
      answer: "Merangkum performa konten dan membantu menentukan keputusan untuk periode berikutnya.",
    },
    {
      question: "Apa fungsi filter pada report?",
      answer: "Membantu melihat data berdasarkan periode, platform, atau PIC.",
    },
  ],

  "pola-konten": [
    {
      question: "Apa itu konten UGC atau testimoni?",
      answer: "Konten yang menggunakan pengalaman, cerita, atau bukti dari pengguna.",
    },
    {
      question: "Apa kekuatan pola before-after?",
      answer: "Menunjukkan perubahan atau perbandingan sehingga hasil lebih mudah dipahami.",
    },
    {
      question: "Apa fungsi studi kasus sebagai ide konten?",
      answer: "Mengubah pengalaman atau hasil tertentu menjadi bahan pembelajaran bagi audience.",
    },
    {
      question: "Apa yang dimaksud pola visual produk?",
      answer: "Konten yang menjadikan visual produk sebagai bagian utama dalam menyampaikan pesan.",
    },
    {
      question: "Apa prinsip menggunakan studi kasus brand?",
      answer: "Gunakan sebagai pembelajaran dan tulis ulang sesuai konteks, bukan menyalin materi secara verbatim.",
    },
  ],

  "operasional-template": [
    {
      question: "Kenapa aturan kapitalisasi nama perlu konsisten?",
      answer: "Agar input dan pengelolaan template tetap rapi dan mudah dibaca.",
    },
    {
      question: "Apa yang dimaksud area otomatis dalam template?",
      answer: "Bagian template yang terhubung dengan sistem dan tidak seharusnya diedit sembarangan.",
    },
    {
      question: "Kenapa peran dan tanggung jawab perlu jelas?",
      answer: "Agar setiap tahap workflow memiliki pemilik yang jelas dan tidak terjadi pekerjaan yang terlewat.",
    },
    {
      question: "Apa perbedaan hide dan hapus dalam penggunaan template?",
      answer: "Hide menyembunyikan bagian tanpa menghilangkan struktur, sedangkan hapus menghilangkan bagian tersebut.",
    },
    {
      question: "Apa batas slot yang disebut dalam template?",
      answer: "Template memiliki batas 200 slot; angka ini mengikuti aturan sumber template.",
    },
  ],
};

async function main() {
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    await connection.beginTransaction();

    let totalInserted = 0;

    for (const [slug, cards] of Object.entries(decks)) {
      const [lessons] = await connection.execute(
        "SELECT id, title FROM lessons WHERE slug = ? LIMIT 1",
        [slug]
      );

      if (!lessons.length) {
        console.log(`SKIP: lesson '${slug}' tidak ditemukan.`);
        continue;
      }

      const lessonId = lessons[0].id;

      await connection.execute(
        "DELETE FROM flashcards WHERE lesson_id = ?",
        [lessonId]
      );

      for (let i = 0; i < cards.length; i++) {
        await connection.execute(
          `INSERT INTO flashcards
            (lesson_id, sort_order, question, answer)
           VALUES (?, ?, ?, ?)`,
          [
            lessonId,
            i + 1,
            cards[i].question,
            cards[i].answer,
          ]
        );

        totalInserted++;
      }

      console.log(
        `OK: ${slug} — ${cards.length} flashcard`
      );
    }

    await connection.commit();

    console.log("");
    console.log(`TOTAL FLASHCARD: ${totalInserted}`);
    console.log("");

    const [rows] = await connection.execute(`
      SELECT
        l.lesson_number,
        l.slug,
        l.title,
        COUNT(f.id) AS flashcards
      FROM lessons l
      LEFT JOIN flashcards f
        ON f.lesson_id = l.id
      GROUP BY
        l.id,
        l.lesson_number,
        l.slug,
        l.title
      ORDER BY l.lesson_number
    `);

    console.table(rows);
  } catch (error) {
    await connection.rollback();
    console.error("SEED GAGAL:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();