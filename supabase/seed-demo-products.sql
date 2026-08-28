-- ============================================================
-- Produits de démonstration — un produit par catégorie du
-- cahier des charges, images Pexels vérifiées (libres de droits).
-- À exécuter APRÈS schema.sql et seed.sql.
-- ============================================================

-- ------------------------------------------------------------
-- Vestes
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Veste croisée bleu marine', 'veste-croisee-bleu-marine',
    'Une veste structurée à la coupe soignée, parfaite pour une allure élégante en toute circonstance.',
    42000,
    array['https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'vestes'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('S', 4), ('M', 8), ('L', 5), ('XL', 2)) as v(size, stock);

-- ------------------------------------------------------------
-- Chemises
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Chemise à carreaux fines rayures', 'chemise-carreaux-fines-rayures',
    'Chemise en coton doux à motif discret, coupe ajustée. Idéale du bureau au dîner.',
    15000,
    array['https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'chemises'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('S', 6), ('M', 10), ('L', 7), ('XL', 3)) as v(size, stock);

-- ------------------------------------------------------------
-- Polos
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Polo casual col ouvert', 'polo-casual-col-ouvert',
    'Un polo léger et confortable, coupe décontractée pour un style facile à porter au quotidien.',
    12000,
    array['https://images.pexels.com/photos/2896840/pexels-photo-2896840.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'polos'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('S', 5), ('M', 9), ('L', 6)) as v(size, stock);

-- ------------------------------------------------------------
-- T-shirts
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'T-shirt essentiel noir', 't-shirt-essentiel-noir',
    'Le basique indispensable : coton épais, coupe droite, pour un look propre en toute occasion.',
    8000,
    array['https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 't-shirts'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('S', 10), ('M', 15), ('L', 12), ('XL', 6)) as v(size, stock);

-- ------------------------------------------------------------
-- Pantalons chino
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Pantalon chino coupe ajustée', 'pantalon-chino-coupe-ajustee',
    'Chino polyvalent à la coupe ajustée, aussi à l''aise en semaine que le week-end.',
    19000,
    array['https://images.pexels.com/photos/2897521/pexels-photo-2897521.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'pantalons-chino'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('38', 4), ('40', 7), ('42', 6), ('44', 3)) as v(size, stock);

-- ------------------------------------------------------------
-- Jeans
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Jean brut coupe droite', 'jean-brut-coupe-droite',
    'Denim résistant à la teinte profonde, coupe droite intemporelle.',
    22000,
    array['https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'jeans'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('38', 5), ('40', 8), ('42', 6), ('44', 2)) as v(size, stock);

-- ------------------------------------------------------------
-- Sneakers & Baskets
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Sneakers montantes grises', 'sneakers-montantes-grises',
    'Sneakers montantes au style épuré, semelle confortable pour un usage quotidien.',
    28000,
    array['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'sneakers-baskets'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('40', 4), ('41', 6), ('42', 7), ('43', 5), ('44', 2)) as v(size, stock);

-- ------------------------------------------------------------
-- Chaussures habillées
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Derbies cuir noir', 'derbies-cuir-noir',
    'Des derbies en cuir véritable, finition brillante, pour une allure soignée en toute élégance.',
    35000,
    array['https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'chaussures-habillees'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('40', 3), ('41', 5), ('42', 6), ('43', 4)) as v(size, stock);

-- ------------------------------------------------------------
-- Montres
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Montre chronographe acier', 'montre-chronographe-acier',
    'Montre chronographe au bracelet acier, cadran gris anthracite, pour un style résolument classique.',
    55000,
    array['https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'montres'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, null, 6 from p;

-- ------------------------------------------------------------
-- Colliers & Chaînes
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Collier fin doré', 'collier-fin-dore',
    'Un collier délicat au fini doré, à porter seul ou superposé pour twister une tenue simple.',
    14000,
    array['https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'colliers-chaines'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, null, 9 from p;

-- ------------------------------------------------------------
-- Pulls & Cardigans
-- ------------------------------------------------------------
with p as (
  insert into products (category_id, name, slug, description, base_price, images)
  select id, 'Sweat à capuche gris chiné', 'sweat-capuche-gris-chine',
    'Sweat à capuche doux et chaud, coupe confortable, l''essentiel pour les journées fraîches.',
    18000,
    array['https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1000']
  from categories where slug = 'pulls-cardigans'
  returning id
)
insert into product_variants (product_id, size, stock)
select id, size, stock from p, (values ('S', 4), ('M', 7), ('L', 5)) as v(size, stock);
