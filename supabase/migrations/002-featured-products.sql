-- ============================================================
-- Ajoute un indicateur "produit vedette" choisi manuellement par
-- l'admin, pour la section "Collections en vedette" de l'accueil.
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================

alter table products
  add column if not exists is_featured boolean not null default false;

create index if not exists idx_products_featured on products(is_featured);
