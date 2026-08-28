-- ============================================================
-- Boutique de mode en ligne — schéma initial
-- À coller dans Supabase → SQL Editor → New query → Run
-- ============================================================

-- Extension pour générer des UUID
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. CATEGORIES
-- ------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. PRODUCTS
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric(10, 2) not null check (base_price >= 0),
  images text[] not null default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false, -- choisi par l'admin pour l'accueil
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);

-- ------------------------------------------------------------
-- 3. PRODUCT VARIANTS (taille / couleur / prix ajusté / stock)
-- ------------------------------------------------------------
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  color text,
  price numeric(10, 2) check (price >= 0), -- null = utilise base_price du produit
  stock integer check (stock >= 0), -- null = disponible (non suivi) ; un nombre = rupture si <= 0
  sku text,
  created_at timestamptz not null default now()
);

create index if not exists idx_variants_product on product_variants(product_id);

-- ------------------------------------------------------------
-- 4. MESSAGES (formulaire de contact / avis)
-- ------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 100),
  email text check (email is null or char_length(email) <= 255),
  message text not null check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. SETTINGS (infos pratiques — ligne unique)
-- ------------------------------------------------------------
create table if not exists settings (
  id integer primary key default 1 check (id = 1), -- force une seule ligne
  address text,
  opening_hours text,
  phone text,
  whatsapp_number text,
  latitude double precision,
  longitude double precision,
  social_links jsonb not null default '{}'::jsonb, -- ex: {"instagram": "...", "facebook": "..."}
  updated_at timestamptz not null default now()
);

-- Ligne par défaut (à compléter depuis l'admin)
insert into settings (id) values (1)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Trigger updated_at
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_settings_updated_at on settings;
create trigger trg_settings_updated_at
  before update on settings
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table messages enable row level security;
alter table settings enable row level security;

-- Lecture publique : catégories, produits, variantes, settings
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read variants" on product_variants for select using (true);
create policy "public read settings" on settings for select using (true);

-- Écriture réservée aux admins connectés (Supabase Auth)
create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write variants" on product_variants for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Messages : n'importe qui peut envoyer un message (formulaire public),
-- mais seul un admin connecté peut les lire ou les supprimer.
create policy "public insert messages" on messages for insert
  with check (true);
create policy "admin read messages" on messages for select
  using (auth.role() = 'authenticated');
create policy "admin delete messages" on messages for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- REALTIME (pour refléter les changements admin côté public)
-- ============================================================
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table product_variants;
alter publication supabase_realtime add table settings;

-- ============================================================
-- STORAGE (bucket images produits)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin upload product images" on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin update product images" on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin delete product images" on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
