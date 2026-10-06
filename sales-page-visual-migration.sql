USE creator_studio;

ALTER TABLE sales_page_settings
  ADD COLUMN IF NOT EXISTS background_type ENUM('color','image','video') NOT NULL DEFAULT 'color',
  ADD COLUMN IF NOT EXISTS background_media_url VARCHAR(1000) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS background_color VARCHAR(30) NOT NULL DEFAULT '#07090D',
  ADD COLUMN IF NOT EXISTS background_overlay_color VARCHAR(30) NOT NULL DEFAULT '#07090D',
  ADD COLUMN IF NOT EXISTS background_overlay_opacity DECIMAL(4,3) NOT NULL DEFAULT 0.62,

  ADD COLUMN IF NOT EXISTS accent_color VARCHAR(30) NOT NULL DEFAULT '#9FB4CE',
  ADD COLUMN IF NOT EXISTS danger_color VARCHAR(30) NOT NULL DEFAULT '#FF5757',

  ADD COLUMN IF NOT EXISTS container_max_width INT UNSIGNED NOT NULL DEFAULT 1180,
  ADD COLUMN IF NOT EXISTS container_radius INT UNSIGNED NOT NULL DEFAULT 18,
  ADD COLUMN IF NOT EXISTS container_opacity DECIMAL(4,3) NOT NULL DEFAULT 0.82,
  ADD COLUMN IF NOT EXISTS container_border_opacity DECIMAL(4,3) NOT NULL DEFAULT 0.14,

  ADD COLUMN IF NOT EXISTS page_surface_color VARCHAR(30) NOT NULL DEFAULT '#0D1118';

UPDATE sales_page_settings
SET
  background_type = COALESCE(background_type, 'color'),
  background_color = COALESCE(NULLIF(background_color, ''), '#07090D'),
  background_overlay_color = COALESCE(NULLIF(background_overlay_color, ''), '#07090D'),
  accent_color = COALESCE(NULLIF(accent_color, ''), '#9FB4CE'),
  danger_color = COALESCE(NULLIF(danger_color, ''), '#FF5757'),
  page_surface_color = COALESCE(NULLIF(page_surface_color, ''), '#0D1118'),
  container_max_width = COALESCE(container_max_width, 1180),
  container_radius = COALESCE(container_radius, 18),
  container_opacity = COALESCE(container_opacity, 0.82),
  container_border_opacity = COALESCE(container_border_opacity, 0.14);