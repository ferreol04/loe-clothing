-- ============================================================
-- Données de départ — catégories du cahier des charges
-- À exécuter APRÈS schema.sql
-- ============================================================

insert into categories (name, slug, display_order) values
  ('Vestes', 'vestes', 1),
  ('Chemises', 'chemises', 2),
  ('Polos', 'polos', 3),
  ('T-shirts', 't-shirts', 4),
  ('Pantalons chino', 'pantalons-chino', 5),
  ('Jeans', 'jeans', 6),
  ('Sneakers & Baskets', 'sneakers-baskets', 7),
  ('Chaussures habillées', 'chaussures-habillees', 8),
  ('Montres', 'montres', 9),
  ('Colliers & Chaînes', 'colliers-chaines', 10),
  ('Pulls & Cardigans', 'pulls-cardigans', 11)
on conflict (slug) do nothing;
