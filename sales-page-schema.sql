USE creator_studio;

CREATE TABLE IF NOT EXISTS sales_page_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

  hero_eyebrow VARCHAR(255) NOT NULL DEFAULT 'RIZMAGO LAB STUDIO',
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  hero_cta_text VARCHAR(255) NOT NULL DEFAULT 'KUNCI HARGA Rp199.000',
  hero_cta_url VARCHAR(500) NOT NULL DEFAULT 'https://lynk.id/a/1911036127',

  early_bird_price INT UNSIGNED NOT NULL DEFAULT 99000,
  early_bird_status VARCHAR(50) NOT NULL DEFAULT 'SOLD OUT',

  current_price INT UNSIGNED NOT NULL DEFAULT 199000,
  current_regular_price INT UNSIGNED NOT NULL DEFAULT 499000,

  next_batch_price INT UNSIGNED NOT NULL DEFAULT 499000,

  countdown_enabled TINYINT(1) NOT NULL DEFAULT 1,
  countdown_minutes INT UNSIGNED NOT NULL DEFAULT 30,

  urgency_title VARCHAR(255) NOT NULL DEFAULT 'Harga Rp199K dikunci selama',
  urgency_description TEXT NOT NULL DEFAULT 'Harga batch sekarang akan berakhir setelah window promo selesai.',

  value_title VARCHAR(255) NOT NULL DEFAULT 'Bukan cuma beli materi. Kamu mendapatkan sistem.',
  value_description TEXT NOT NULL,

  bonus_title VARCHAR(255) NOT NULL DEFAULT 'Plus bonus untuk mempercepat eksekusi.',
  bonus_description TEXT NOT NULL,

  final_title VARCHAR(255) NOT NULL DEFAULT 'Kamu bisa masuk sekarang di Rp199K.',
  final_description TEXT NOT NULL DEFAULT 'Atau menunggu batch berikutnya dan membayar Rp499K.',

  final_cta_text VARCHAR(255) NOT NULL DEFAULT 'KUNCI HARGA Rp199.000',
  final_cta_url VARCHAR(500) NOT NULL DEFAULT 'https://lynk.id/a/1911036127',

  is_published TINYINT(1) NOT NULL DEFAULT 1,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sales_page_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_type ENUM('value','bonus') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  value_amount INT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_sales_items_section (section_type),
  KEY idx_sales_items_sort (section_type, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO sales_page_settings (
  hero_title,
  hero_description,
  value_description,
  bonus_description
)
SELECT
  'Early Bird sudah habis. Harga berikutnya naik.',
  'Kamu masih punya kesempatan masuk di harga batch sekarang. Bangun sistem content creation dari fondasi sampai evaluasi dalam satu alur yang jelas.',
  'Satu alur belajar untuk membantu kamu memahami proses content creation dari fondasi sampai evaluasi.',
  'Gunakan tools pendukung untuk membantu menerapkan sistem yang dipelajari.'
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_settings
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'value', '11-Step Content System',
  'Workflow dari fondasi, audience, riset, planning, produksi sampai evaluasi.',
  NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items WHERE section_type = 'value'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'value', 'Video Lessons',
  'Materi video untuk memahami setiap tahap secara bertahap dan terstruktur.',
  NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items
  WHERE section_type = 'value' AND title = 'Video Lessons'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'value', 'Learning Materials',
  'Materi pendukung yang bisa digunakan kembali saat perlu review.',
  NULL, 3
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items
  WHERE section_type = 'value' AND title = 'Learning Materials'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'value', '60 Flashcards',
  'Latihan recall untuk membantu menguatkan pemahaman setelah belajar.',
  NULL, 4
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items
  WHERE section_type = 'value' AND title = '60 Flashcards'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'value', 'Quiz & Learning Check',
  'Cek pemahaman setelah menyelesaikan materi.',
  NULL, 5
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items
  WHERE section_type = 'value' AND title = 'Quiz & Learning Check'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'bonus', 'Content Planning Framework',
  'Struktur untuk membantu mengubah ide menjadi rencana konten yang lebih jelas.',
  NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items WHERE section_type = 'bonus'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'bonus', 'Content Workflow Reference',
  'Referensi alur kerja agar proses produksi tidak berjalan secara acak.',
  NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items
  WHERE section_type = 'bonus' AND title = 'Content Workflow Reference'
);

INSERT INTO sales_page_items
  (section_type, title, description, value_amount, sort_order)
SELECT 'bonus', '60 Learning Flashcards',
  'Deck flashcard untuk mengulang konsep penting dengan cepat.',
  NULL, 3
WHERE NOT EXISTS (
  SELECT 1 FROM sales_page_items
  WHERE section_type = 'bonus' AND title = '60 Learning Flashcards'
);