import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Layout } from '../components/layout/Layout'

// Pages publiques — chargées à la demande (une par route).
const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })))
const Collections = lazy(() =>
  import('../pages/Collections').then((m) => ({ default: m.Collections })),
)
const ProductDetail = lazy(() =>
  import('../pages/ProductDetail').then((m) => ({ default: m.ProductDetail })),
)
const Contact = lazy(() => import('../pages/Contact').then((m) => ({ default: m.Contact })))
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })))

// Espace admin — jamais téléchargé par un visiteur public.
const RequireAuth = lazy(() =>
  import('../admin/RequireAuth').then((m) => ({ default: m.RequireAuth })),
)
const AdminLayout = lazy(() =>
  import('../admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const Login = lazy(() => import('../admin/pages/Login').then((m) => ({ default: m.Login })))
const ForgotPassword = lazy(() =>
  import('../admin/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })),
)
const ResetPassword = lazy(() =>
  import('../admin/pages/ResetPassword').then((m) => ({ default: m.ResetPassword })),
)
const ProductsList = lazy(() =>
  import('../admin/pages/ProductsList').then((m) => ({ default: m.ProductsList })),
)
const ProductForm = lazy(() =>
  import('../admin/pages/ProductForm').then((m) => ({ default: m.ProductForm })),
)
const CategoriesList = lazy(() =>
  import('../admin/pages/CategoriesList').then((m) => ({ default: m.CategoriesList })),
)
const MessagesList = lazy(() =>
  import('../admin/pages/MessagesList').then((m) => ({ default: m.MessagesList })),
)
const SettingsForm = lazy(() =>
  import('../admin/pages/SettingsForm').then((m) => ({ default: m.SettingsForm })),
)

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 size={24} className="animate-spin text-text-faint" />
    </div>
  )
}

/** Enveloppe un élément lazy dans son propre Suspense. */
function lazyRoute(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: lazyRoute(<Home />) },
      { path: 'collections', element: lazyRoute(<Collections />) },
      { path: 'produits/:slug', element: lazyRoute(<ProductDetail />) },
      { path: 'contact', element: lazyRoute(<Contact />) },
      { path: '*', element: lazyRoute(<NotFound />) },
    ],
  },

  // Authentification admin (hors layout public)
  { path: '/admin/connexion', element: lazyRoute(<Login />) },
  { path: '/admin/mot-de-passe-oublie', element: lazyRoute(<ForgotPassword />) },
  { path: '/admin/reinitialiser-mot-de-passe', element: lazyRoute(<ResetPassword />) },

  // Espace admin protégé
  {
    path: '/admin',
    element: lazyRoute(<RequireAuth />),
    children: [
      {
        element: lazyRoute(<AdminLayout />),
        children: [
          { index: true, element: <Navigate to="/admin/produits" replace /> },
          { path: 'produits', element: lazyRoute(<ProductsList />) },
          { path: 'produits/:id', element: lazyRoute(<ProductForm />) },
          { path: 'categories', element: lazyRoute(<CategoriesList />) },
          { path: 'messages', element: lazyRoute(<MessagesList />) },
          { path: 'parametres', element: lazyRoute(<SettingsForm />) },
        ],
      },
    ],
  },
])
