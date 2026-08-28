import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

/** Bloque l'accès aux routes admin tant qu'aucune session n'est active. */
export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 size={24} className="animate-spin text-text-faint" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/connexion" replace />
  }

  return <Outlet />
}
