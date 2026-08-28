# Boutique de mode en ligne — Guide projet

Ce fichier sert de référence pour Claude Code lors du développement du projet. Il décrit le contexte, le périmètre fonctionnel et la stack technique à respecter.

## 1. Contexte et objectifs

Site vitrine & e-commerce pour une boutique de mode en ligne, avec un tunnel de commande via WhatsApp (pas de paiement en ligne intégré).

**Objectifs :**
- Présenter la marque et son univers de manière professionnelle.
- Permettre une navigation produit fluide par catégorie.
- Simplifier la commande via un tunnel panier → WhatsApp.
- Offrir à l'administrateur une gestion autonome du catalogue et des messages, sans compétence technique.

**Cible :** clientèle grand public (vêtements, chaussures, accessoires).

**Approche de conception : desktop-first.** Les maquettes et le développement démarrent par le rendu desktop (grand écran). La responsivité mobile est ensuite intégrée directement dans le code (media queries, layout flexible, zones tactiles adaptées) — pas comme une étape séparée ou secondaire, car la majorité des achats se font depuis mobile. Chaque composant doit être pensé dès le départ pour bien fonctionner aussi bien à la souris (desktop) qu'au doigt (mobile) : tailles de boutons, sélecteurs de couleur/taille, tunnel de commande WhatsApp, navigation.

## 2. Stack technique

| Domaine | Choix |
| --- | --- |
| Frontend | React + Vite |
| Styles | Tailwind CSS |
| Icônes | Lucide React |
| Navigation | React Router |
| État global panier | Zustand + middleware `persist` (sauvegarde automatique en `localStorage`) |
| Backend / DB | Supabase (Postgres) |
| Authentification admin | Supabase Auth (email / mot de passe) |
| Stockage images | Supabase Storage |
| Hébergement frontend | Vercel |
| Géolocalisation | API navigateur `navigator.geolocation` |
| Carte | Google Maps (iframe) |
| Commande | Génération d'un lien `wa.me` avec message pré-rempli |
| Animations | Framer Motion (transitions de page, apparitions, drawer, menus) + `IntersectionObserver` pour les animations au scroll |

**Principe clé :** toute modification effectuée côté admin (produits, catégories, infos pratiques) doit se refléter en temps réel côté catalogue public (via Supabase realtime ou refetch au chargement).

## 3. Structure fonctionnelle

### 3.1 Page d'accueil
- Navbar : logo, Accueil, Collections, Contact + icône panier (badge avec le nombre d'articles) qui ouvre le **cart drawer** au clic, visible et accessible depuis toutes les pages.
- Bannière principale : visuel d'en-tête présentant l'univers de la marque.
- Collections en vedette : sélection de produits phares, lien vers la fiche produit.
- Section "Pourquoi choisir la marque".
- Section "Notre histoire".
- Section "Avis clients" (témoignages statiques ou issus des avis).
- Bloc d'appel à l'action "Nous contacter" → lien direct vers une conversation WhatsApp.
- Footer : liens utiles, réseaux sociaux, mentions légales, coordonnées.

### 3.2 Page collections (catalogue)
- Navbar identique.
- Accroche en haut de page.
- Barre de recherche instantanée (nom, catégorie, mot-clé).
- Catégories : Vestes, Chemises, Polos, T-shirts, Pantalons chino, Jeans (pantalons, shorts), Sneakers/Baskets, Chaussures habillées, Montres, Colliers & Chaînes, Pulls & Cardigans.
- Carte produit : photo du produit, catégorie, nom, prix, bouton d'ajout rapide au panier.
- Pagination ( 12 Produits par page ).
- Footer identique.

### 3.3 Fiche produit détaillée
- Photo du produit.
- Prix ajusté selon la taille sélectionnée.
- Description détaillée.
- Tailles disponibles.
- Bouton d'ajout au panier → ajoute l'article et ouvre automatiquement le cart drawer pour confirmation visuelle.

### 3.4 Cart drawer (tiroir panier)
Pas de page panier dédiée : le panier est un **tiroir latéral (drawer)** qui s'ouvre en surimpression depuis n'importe quelle page, sans navigation ni rechargement.

- Déclenchement : clic sur l'icône panier de la navbar, ou automatiquement après un ajout au panier.
- Ouverture en glissement depuis le bord (droite sur desktop), avec overlay assombrissant le reste de la page ; fermeture au clic sur l'overlay, sur une icône « fermer », ou via la touche Échap.
- Récapitulatif : image, variante (taille), quantité modifiable, prix unitaire, sous-total — pour chaque article.
- Gestion 100 % autonome par le client directement dans le drawer : modification de quantité, suppression d'un article, vidage complet du panier.
- **Aucune création de compte nécessaire.**
- Sauvegarde locale sur l'appareil du client (`localStorage` via Zustand `persist`), persistante d'une visite à l'autre et restituée automatiquement à l'ouverture du drawer.
- Calcul automatique du total, affiché en bas du drawer.
- Bouton **« Commander »** en bas du drawer, qui lance le tunnel de commande WhatsApp (voir 3.5).
- Sur mobile : le drawer occupe la largeur totale (ou quasi) de l'écran, avec zones tactiles suffisamment grandes pour les boutons +/- de quantité et la suppression d'article.
- Panier vide : message et illustration incitant à parcourir les collections, avec lien vers la page Collections.

### 3.5 Tunnel de commande WhatsApp
Le bouton **« Commander »** (dans le cart drawer) n'ouvre pas WhatsApp directement. Il présente d'abord un choix entre **deux modes de commande** :

**Mode "Livraison" :**
- Numéro de téléphone (obligatoire).
- Localisation, transmise soit par :
  - partage de la position GPS (via `navigator.geolocation`) → génère un lien Google Maps intégré au message, soit
  - une indication manuelle en texte libre (adresse tapée par le client).

**Mode "Retrait en boutique" :**
- Numéro de téléphone uniquement (utilisé pour prévenir le client quand la commande est prête).

Une fois le mode choisi et les informations renseignées, un message récapitulatif est généré (articles, variantes, quantités, total, mode de commande + infos associées) et transmis via un lien `wa.me` pré-rempli.

### 3.6 Page contact
- Coordonnées : téléphone, e-mail, adresse, horaires d'ouverture.
- Formulaire d'avis / suggestion : envoyé et stocké dans Supabase, consultable côté admin.
- Carte interactive Google Maps (iframe) localisant la boutique physique.

### 3.7 Espace d'administration

**Rôles de l'administrateur :**
- Se connecter à l'espace d'administration (Supabase Auth email/mot de passe).
- Réinitialiser son mot de passe en cas d'oubli.
- Gérer les produits : créer, modifier, supprimer (photos, variantes couleur/taille, prix, description, stock).
- Gérer les catégories et sous-catégories : créer, organiser, supprimer.
- Consulter et supprimer les messages/suggestions envoyés par les visiteurs via le formulaire de contact.
- Mettre à jour les informations pratiques : adresse, horaires, position géographique, numéro WhatsApp de commande, liens réseaux sociaux.

**Hors périmètre (ne pas développer) :**
- Pas de gestion des commandes (les commandes se font uniquement via WhatsApp, hors du système).
- Pas de modération/publication d'avis (juste consultation + suppression des messages).


## 4. Direction artistique & expérience d'interaction

Le site doit se démarquer d'un template générique : niveau de finition premium, digne d'une marque de mode. Chaque composant listé ci-dessous est à traiter avec le même soin, sur desktop comme sur mobile (animations allégées ou simplifiées sur mobile pour préserver la fluidité).

### 4.1 Navbar
- Navbar soignée et discrète au repos, qui se démarque à l'usage : fond transparent sur le hero puis fond plein (+ légère ombre/blur) au scroll, avec transition fluide entre les deux états.
- Liens avec effet de soulignement animé ou de fond progressif au survol (pas juste un changement de couleur brut).
- Icône panier avec badge animé (petit rebond/scale) à chaque ajout d'article.
- Menu mobile : ouverture animée (slide ou fade + stagger sur les liens), icône burger qui se transforme en croix.

### 4.2 Hero (bannière principale)
- Visuel plein écran ou quasi, qui capte l'attention immédiatement : image/vidéo de haute qualité, éventuellement effet de parallaxe léger au scroll (le visuel se déplace plus lentement que le contenu).
- Titre et sous-titre avec apparition progressive (fade + léger déplacement vertical) au chargement, en cascade (titre, puis sous-titre, puis CTA).
- CTA principal bien visible, avec un hover marqué (changement de fond, légère élévation/scale, transition fluide).
- Éventuel indicateur de scroll animé (flèche ou trait qui pulse doucement) pour inciter à découvrir la suite.

### 4.3 Sections & mise en page générale
- Espacement généreux et cohérent entre les sections (rythme vertical régulier), pour une lecture aérée et premium.
- Chaque section (« Pourquoi choisir la marque », « Notre histoire », « Avis clients », collections en vedette, etc.) apparaît progressivement au scroll (fade-in + translation légère) via `IntersectionObserver`, avec un léger effet de stagger quand plusieurs éléments composent la section (cartes, témoignages, images).
- Grilles de produits/contenus propres et alignées, avec un espacement (gap) homogène, responsive (nombre de colonnes qui s'adapte par breakpoint).
- Transitions fluides entre les pages (fade ou slide léger lors des changements de route).

### 4.4 Cartes (produits, avis, valeurs de la marque…)
- Design élégant : coins arrondis cohérents, ombre légère au repos, ombre plus marquée + légère élévation (translateY négatif) au survol.
- Image produit avec effet de zoom doux au survol (scale léger, overflow hidden pour un cadrage propre).
- Transitions fluides sur tous les effets de survol (aucun changement brutal, easing doux, durée courte ~200-300ms).

### 4.5 Boutons & CTA
- États clairs et réactifs : hover, focus, active/pressed (léger scale-down au clic pour un retour tactile).
- CTA principaux mis en valeur par leur position (visibles sans excès de scroll) et leur contraste ; CTA secondaires plus discrets.
- Boutons d'ajout au panier avec micro-interaction de confirmation (icône qui change temporairement, léger effet de « pop »).

### 4.6 Cart drawer & menus
- Ouverture/fermeture du cart drawer et des menus (mobile, filtres) animées en glissement fluide, avec l'overlay qui apparaît en fondu en même temps.
- Éléments à l'intérieur du drawer (articles du panier) qui apparaissent en cascade légère à l'ouverture plutôt que d'un bloc.

### 4.7 Principes généraux d'animation
- Cohérence des easings et durées dans tout le site (par exemple easing doux type `ease-out`, durées courtes 150-350ms pour les micro-interactions, un peu plus longues pour les transitions de page/section).
- Toutes les animations doivent rester subtiles et fonctionnelles : elles guident l'œil et valorisent le contenu, sans jamais ralentir l'utilisateur ni nuire à la lisibilité.
- Respect de la préférence système `prefers-reduced-motion` : désactiver ou réduire fortement les animations non essentielles pour les utilisateurs qui le demandent.
- Sur mobile : parallaxe et effets lourds limités ou désactivés si besoin pour préserver les performances ; les apparitions au scroll et les hovers adaptés au tactile (états `active` plutôt que `hover`) restent actifs.

## 5. Contraintes transverses

- **Desktop-first en conception**, mais **entièrement responsive dans le code** : tous les composants Tailwind doivent utiliser les breakpoints (`sm:`, `md:`, `lg:`) pour garantir un rendu mobile fluide et confortable au doigt (boutons, sélecteurs de variante, tunnel WhatsApp), même si le point de départ visuel est le grand écran.
- Pas de compte client — aucune authentification côté visiteur.
- Performances : compression des images, chargement optimisé (Supabase Storage + lazy loading) — important aussi sur mobile où la connexion peut être plus lente.
- SEO de base : titres, meta descriptions, balisage sémantique.
- Sécurité : accès admin protégé (Supabase Auth), formulaires protégés contre le spam.
