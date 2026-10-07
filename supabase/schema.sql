create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  whatsapp text default '',
  password_hash text not null,
  avatar text,
  role text not null default 'user',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx
  on public.users (email);

create table if not exists public.user_sessions (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists user_sessions_token_hash_idx
  on public.user_sessions (token_hash);

create index if not exists user_sessions_user_id_idx
  on public.user_sessions (user_id);

create index if not exists user_sessions_expires_at_idx
  on public.user_sessions (expires_at);

create table if not exists public.sales_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.sales_settings (key, value)
values
  ('current_price', '199000'),
  ('current_regular_price', '499000'),
  ('early_bird_price', '99000'),
  ('next_batch_price', '499000'),
  ('countdown_enabled', 'true'),
  ('countdown_minutes', '30'),
  ('lynk_url', 'https://lynk.id/a/1911036127')
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

create table if not exists public.lessons (
  id text primary key,
  slug text unique,
  number text,
  chapter text,
  title text not null,
  description text,
  video_id text,
  video_url text,
  status text not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_status_sort_idx
  on public.lessons (status, sort_order);

create table if not exists public.flashcards (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0
);

create index if not exists flashcards_lesson_sort_idx
  on public.flashcards (lesson_id, sort_order);

create table if not exists public.materials (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  title text not null,
  content text not null,
  sort_order integer not null default 0
);

create index if not exists materials_lesson_sort_idx
  on public.materials (lesson_id, sort_order);

create table if not exists public.quiz_questions (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  question text not null,
  explanation text,
  sort_order integer not null default 0
);

create index if not exists quiz_questions_lesson_sort_idx
  on public.quiz_questions (lesson_id, sort_order);

create table if not exists public.quiz_options (
  id text primary key,
  question_id text not null references public.quiz_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0
);

create index if not exists quiz_options_question_sort_idx
  on public.quiz_options (question_id, sort_order);

create table if not exists public.leads (
  id text primary key,
  timestamp timestamptz not null default now(),
  nama text not null,
  whatsapp text not null,
  email text not null,
  harga_hold numeric not null default 0,
  price_held_until timestamptz,
  source text not null default 'landing',
  status text not null default 'registered'
);

create index if not exists leads_email_idx
  on public.leads (email);

create index if not exists leads_created_idx
  on public.leads (timestamp desc);

create table if not exists public.orders (
  id text primary key,
  lead_id text,
  user_id text,
  nama text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  amount numeric not null default 0,
  payment_status text not null default 'pending',
  payment_reference text not null default '',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orders_lead_idx
  on public.orders (lead_id);

create index if not exists orders_user_idx
  on public.orders (user_id);

alter table public.users enable row level security;
alter table public.user_sessions enable row level security;
alter table public.sales_settings enable row level security;
alter table public.lessons enable row level security;
alter table public.flashcards enable row level security;
alter table public.materials enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.leads enable row level security;
alter table public.orders enable row level security;
