# LØÉ — Clothing & Lifestyle

Boutique de mode en ligne avec tunnel de commande via WhatsApp (pas de paiement en ligne intégré).

## Stack

- **Frontend** : React + Vite, Tailwind CSS
- **État panier** : Zustand (`persist` → localStorage)
- **Backend** : Supabase (Postgres, Auth, Storage, Realtime)
- **Hébergement** : Vercel

## Démarrage local

```bash
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

## Base de données

Le schéma complet (tables, RLS, storage) est dans [`supabase/schema.sql`](supabase/schema.sql) — à exécuter dans l'éditeur SQL du projet Supabase. Le dossier [`supabase/migrations`](supabase/migrations) garde l'historique des évolutions déjà intégrées au schéma principal.

## Build & déploiement

```bash
npm run build
```

Déployé sur Vercel (voir [`vercel.json`](vercel.json) pour le fallback SPA de React Router). Voir [`ROADMAP.md`](ROADMAP.md) pour le détail des phases du projet.
