# Feuille de route — Boutique de mode en ligne

Référence : voir [CLAUDE.md](./CLAUDE.md) pour le contexte, la stack et le périmètre fonctionnel détaillé.

Statut des cases : `[ ]` à faire · `[~]` en cours · `[x]` fait

---

## Phase 0 — Cadrage & setup projet
- [x] Initialiser le dépôt git (`git init`, `.gitignore`)
- [x] Créer le projet React + Vite (`npm create vite@latest`)
- [x] Installer et configurer Tailwind CSS
- [x] Installer les dépendances : React Router, Zustand, Lucide React, Framer Motion, Supabase JS client
- [x] Créer le projet Supabase (organisation, projet, région)
- [x] Définir la structure de dossiers (`src/components`, `src/pages`, `src/store`, `src/lib`, `src/admin`, etc.)
- [x] Configurer les variables d'environnement (`.env.example`, client Supabase)
- [x] Linter en place (`oxlint`, fourni par le scaffold Vite)

**Livrable :** projet Vite qui démarre, connecté à Supabase, structure de dossiers posée.

---

## Phase 1 — Modèle de données Supabase ✅
- [x] Table `categories` (nom, slug, ordre, parent éventuel pour sous-catégories)
- [x] Table `products` (nom, description, catégorie, prix de base, statut, images)
- [x] Table `product_variants` (produit, taille, couleur, prix ajusté, stock)
- [x] Table `messages` (formulaire de contact/avis : nom, email, message, date)
- [x] Table `settings` (infos pratiques : adresse, horaires, téléphone WhatsApp, réseaux sociaux, coordonnées GPS boutique)
- [x] Bucket Supabase Storage pour les images produits
- [x] Politiques RLS (lecture publique catalogue, écriture réservée admin authentifié)
- [x] Activer Supabase Realtime sur `products`/`categories`/`settings`
- [x] Seed des 11 catégories du cahier des charges

_Voir [supabase/schema.sql](../supabase/schema.sql) et [supabase/seed.sql](../supabase/seed.sql)._

**Livrable :** schéma de base validé, RLS testées, données de démo insérées.

---

## Phase 2 — Design system & composants de base ✅
- [x] Palette de couleurs, typographie, espacements (tokens `@theme` Tailwind v4, thème sombre/ambre inspiré de la réf. fournie)
- [x] Composants UI de base : Button, Input, Select, Badge, Modal, Drawer
- [x] Navbar (états transparent/plein au scroll, menu mobile animé, badge panier animé)
- [x] Footer
- [x] Layout global (transitions de page Framer Motion) + React Router
- [x] Hook `useScrollReveal` (IntersectionObserver) pour animations au scroll
- [x] Respect `prefers-reduced-motion` centralisé (`usePrefersReducedMotion` + règle CSS globale)

_Bonus anticipé de la Phase 3 : store panier Zustand + Cart Drawer fonctionnel, nécessaires au badge de la navbar._

**Nom de marque : provisoire (`MODE.`)** — à remplacer dans [Navbar.jsx](../src/components/layout/Navbar.jsx) et [Footer.jsx](../src/components/layout/Footer.jsx) (recherche `BRAND_NAME`) une fois décidé.

**Livrable :** shell de site navigable (navbar/footer/layout) avec le style visuel validé.

---

## Phase 3 — Panier (Zustand)
- [x] Store Zustand + middleware `persist` (localStorage)
- [x] Actions : ajouter, modifier quantité, supprimer, vider
- [x] Sélecteurs : total, nombre d'articles
- [x] Cart Drawer : ouverture/fermeture (overlay, Échap, clic extérieur)
- [x] Animation d'apparition en cascade des articles
- [x] Badge panier animé (rebond au scroll/ajout)
- [x] État panier vide (illustration + lien Collections)
- [x] Adaptation tactile mobile (drawer pleine largeur, zones tactiles)
- [x] Bouton « Commander » branché sur le tunnel WhatsApp (Phase 5)

**Livrable :** panier fonctionnel de bout en bout, persistant, testable indépendamment du catalogue.

---

## Phase 4 — Catalogue public ✅
- [x] Page d'accueil (hero avec parallaxe, collections en vedette, "pourquoi nous choisir", "notre histoire", avis clients, CTA WhatsApp)
- [x] Page Collections : liste catégories, recherche instantanée (debounce + URL params), grille produits, pagination (12/page)
- [x] Carte produit (image, catégorie, nom, prix, ajout rapide panier avec micro-interaction)
- [x] Page fiche produit : galerie, sélection variante avec prix ajusté, description, ajout panier → ouverture drawer
- [x] Connexion des pages aux données Supabase (fetch + Realtime sur `categories`/`products`/`product_variants`/`settings`)
- [x] Page Contact (coordonnées, formulaire d'avis → Supabase, iframe Google Maps)

**Contenus à compléter côté admin une fois la Phase 6 prête :** produits/catégories réels (photos, prix, stock) et `settings` (adresse, téléphone, horaires, email dans `social_links`, latitude/longitude, `whatsapp_number`) — sans ça, l'accueil/collections/contact resteront vides ou incomplets même si le code fonctionne.

**TODO visuel restant :** image/vidéo réelle du hero et photo pour « Notre histoire » (actuellement des placeholders, recherche `TODO` dans [Hero.jsx](../src/components/home/Hero.jsx) et [OurStory.jsx](../src/components/home/OurStory.jsx)).

**Livrable :** parcours client complet, du hero jusqu'à la fiche produit, connecté aux vraies données.

---

## Phase 5 — Tunnel de commande WhatsApp ✅
- [x] Écran de choix du mode : Livraison / Retrait en boutique
- [x] Mode Livraison : téléphone + géolocalisation (`navigator.geolocation`) ou adresse manuelle
- [x] Mode Retrait : téléphone uniquement
- [x] Génération du message récapitulatif (articles, variantes, quantités, total, mode + infos)
- [x] Génération du lien `wa.me` pré-rempli et redirection (ouverture dans un nouvel onglet, panier vidé ensuite)
- [x] Gestion des erreurs (géoloc refusée → bascule possible vers adresse manuelle, téléphone invalide)
- [x] Responsive/tactile complet (boutons larges, modale scrollable sur mobile)

_Voir [CheckoutModal.jsx](../src/components/checkout/CheckoutModal.jsx), [useGeolocation.js](../src/hooks/useGeolocation.js), [whatsapp.js](../src/lib/whatsapp.js)._

**Livrable :** tunnel Commander → WhatsApp fonctionnel sur desktop et mobile, message correctement formaté.

---

## Phase 6 — Espace admin ✅
- [x] Authentification Supabase Auth (login, reset mot de passe)
- [x] Route protégée / layout admin
- [x] CRUD produits (infos, variantes couleur/taille, prix, stock, upload images)
- [x] CRUD catégories/sous-catégories
- [x] Liste des messages/avis (consultation + suppression)
- [x] Édition des infos pratiques (adresse, horaires, position, numéro WhatsApp, réseaux sociaux)
- [x] Vérification que les changements admin se répercutent en temps réel côté public (réutilise les hooks Realtime de la Phase 4)

_Voir [src/admin/](../src/admin/). Compte admin à créer manuellement dans Supabase (Authentication → Users), pas d'auto-inscription._

**Livrable :** admin autonome capable de gérer catalogue, messages et infos pratiques sans intervention technique.

---

## Phase 7 — Finitions transverses
- [x] Passe animations : audit fait — 15 animations sur 16 partagent déjà le même easing (`[0.16,1,0.3,1]`), la seule exception (`easeInOut` sur l'indicateur de scroll du hero) est volontaire. Rien à corriger.
- [x] Passe responsive (partielle) : zones tactiles du panier agrandies (36px → 44px sur +/-/suppression, sous le minimum recommandé) ; pas de largeurs fixes problématiques détectées ailleurs. **Reste à faire : test manuel sur vrais appareils (point suivant).**
- [x] SEO de base : composant `Seo` réutilisable (titre + meta description par page), `noindex` sur l'admin/404, balises Open Graph, structure sémantique déjà correcte (header/nav/main/footer)
- [x] Performances : découpage du code par route (lazy loading, admin jamais chargé par un visiteur public), chunks vendor séparés (React/Framer Motion/Supabase mis en cache indépendamment), `loading="lazy"` complété sur les images restantes. Bundle principal réduit de ~725 Ko à ~30 Ko.
- [x] Sécurité : RLS revues (aucune faille trouvée — lecture publique limitée aux tables catalogue/settings, écriture réservée à l'admin authentifié, messages non lisibles publiquement), anti-spam ajouté au formulaire de contact (piège à robots + délai minimum), limites de longueur sur les champs du formulaire (site + base)
- [ ] Tests manuels multi-device (desktop, tablette, mobile réel) — **à faire par l'utilisateur**, voir la checklist de test donnée précédemment dans la conversation

**Nouvelles migrations à exécuter (Supabase → SQL Editor) :**
- [supabase/migrations/003-messages-length-limits.sql](../supabase/migrations/003-messages-length-limits.sql)

**Livrable :** site prêt pour la mise en production, validé sur les critères qualité du CLAUDE.md — en attente uniquement des tests manuels multi-device.

---

## Phase 8 — Déploiement
- [ ] Configuration projet Vercel (variables d'env production)
- [ ] Déploiement Supabase (RLS finales, sauvegarde)
- [ ] Domaine personnalisé (si applicable)
- [ ] Recette finale en production
- [ ] Passation à l'admin (accès, mot de passe, mini-guide d'utilisation de l'espace admin)

**Livrable :** site en ligne, admin formé, projet livré.

---

## Notes de suivi
_(à compléter au fil du projet : décisions prises, blocages, écarts par rapport au plan)_
