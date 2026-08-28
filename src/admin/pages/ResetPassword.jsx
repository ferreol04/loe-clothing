import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Seo } from '../../components/Seo'
import { useAuth } from '../../hooks/useAuth'

export function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setSubmitting(true)
    const { error } = await updatePassword(password)
    setSubmitting(false)

    if (error) {
      setError("Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.")
      return
    }
    navigate('/admin/produits', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <Seo title="Nouveau mot de passe" noindex />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-black tracking-tight">
          Nouveau mot de passe
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Choisissez un nouveau mot de passe pour votre compte admin.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="password"
            type="password"
            label="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            id="confirm"
            type="password"
            label="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" disabled={submitting}>
            <KeyRound size={16} />
            {submitting ? 'Mise à jour…' : 'Mettre à jour'}
          </Button>
        </form>
      </div>
    </div>
  )
}
