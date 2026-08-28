import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Seo } from '../../components/Seo'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const { isAuthenticated, loading, signIn } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    const from = location.state?.from ?? '/admin/produits'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError('Identifiants incorrects. Merci de réessayer.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <Seo title="Connexion admin" noindex />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-black tracking-tight">
          Espace admin
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Connectez-vous pour gérer la boutique.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="E-mail"
            placeholder="admin@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" size="md" disabled={submitting}>
            <LogIn size={16} />
            {submitting ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>

        <Link
          to="/admin/mot-de-passe-oublie"
          className="mt-4 block text-center text-sm text-text-muted transition-colors hover:text-accent"
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  )
}
