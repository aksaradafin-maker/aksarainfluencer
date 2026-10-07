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
  const { appsScriptPost } = await import("./apps-script-client.cjs");
  for (const lesson of lessons) {
    const result = await appsScriptPost({
      action: "save_lesson",
      slug: lesson.slug,
      lesson,
    });

    if (!result.lesson) {
      throw new Error(`Apps Script tidak mengembalikan lesson ${lesson.slug}.`);
    }

    console.log(`Seeded: ${lesson.lessonNumber} / ${lesson.title}`);
  }

  console.log("");
  console.log("SEED BERHASIL.");
}

main().catch((error) => {
  console.error("");
  console.error("SEED GAGAL:");
  console.error(error);
  process.exitCode = 1;
});