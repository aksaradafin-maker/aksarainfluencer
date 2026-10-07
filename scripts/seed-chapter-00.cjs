async function main() {
  const { appsScriptGet, appsScriptPost } = await import("./apps-script-client.cjs");
  const slug = "cara-memakai-playbook";
  const result = await appsScriptGet({ action: "get_lesson", slug });

  if (!result.lesson) {
    throw new Error(`Lesson ${slug} tidak ditemukan.`);
  }

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

  const lesson = result.lesson;
  const saved = await appsScriptPost({
    action: "save_lesson",
    slug,
    lesson: {
      ...lesson,
      flashcards: cards.map(([question, answer]) => ({ question, answer })),
    },
  });

  console.log(`TOTAL FLASHCARD: ${saved.lesson?.flashcards?.length ?? cards.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});