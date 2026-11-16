-- Skema awal PP. Roudlotut Tholibat. Aman dijalankan ulang lewat `npm run db:migrate`
-- (migrasi yang sudah berjalan dicatat di tabel schema_migrations).

create table admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table login_attempts (
  id bigserial primary key,
  key text not null,
  created_at timestamptz not null default now()
);
create index login_attempts_key_idx on login_attempts (key, created_at);

create table news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  category_id uuid references news_categories(id) on delete set null,
  cover_path text,
  cover_alt text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  author_id uuid references admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_listing_idx on news (status, published_at desc);

create table schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null default '',
  location text not null default '',
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'done', 'cancelled')),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);
create index schedules_starts_idx on schedules (starts_at);

create table gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  category_id uuid references gallery_categories(id) on delete set null,
  path text not null,
  thumb_path text not null,
  width int not null,
  height int not null,
  sort_order int not null default 0,
  show_on_home boolean not null default false,
  created_at timestamptz not null default now()
);
create index gallery_order_idx on gallery (sort_order, created_at);

create table settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table activity_log (
  id bigserial primary key,
  admin_id uuid references admins(id) on delete set null,
  admin_name text not null default '',
  action text not null,
  entity text not null,
  entity_title text not null default '',
  created_at timestamptz not null default now()
);
create index activity_log_idx on activity_log (created_at desc);

-- Keamanan: Supabase membuka semua tabel di skema public lewat Data API (kunci anon yang publik).
-- Mengaktifkan RLS tanpa policy menutup akses itu. Website ini hanya mengakses data lewat server
-- (DATABASE_URL), yang tidak terpengaruh RLS.
alter table admins enable row level security;
alter table login_attempts enable row level security;
alter table news_categories enable row level security;
alter table news enable row level security;
alter table schedules enable row level security;
alter table gallery_categories enable row level security;
alter table gallery enable row level security;
alter table settings enable row level security;
alter table activity_log enable row level security;

insert into news_categories (name, slug) values
  ('Pengumuman', 'pengumuman'), ('Kegiatan', 'kegiatan'), ('Pendidikan', 'pendidikan');
insert into gallery_categories (name, slug) values
  ('Kegiatan Santri', 'kegiatan-santri'), ('Pengajian', 'pengajian'), ('Lingkungan Pondok', 'lingkungan');
