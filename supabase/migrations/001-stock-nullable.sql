-- ============================================================
-- Rend le stock optionnel : NULL = disponible (non suivi),
-- un nombre = quantité suivie (0 ou moins = rupture).
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================

alter table product_variants
  alter column stock drop not null,
  alter column stock drop default;
