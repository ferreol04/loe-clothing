import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Mail } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Seo } from '../../components/Seo'
import { useAuth } from '../../hooks/useAuth'

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await requestPasswordReset(email)
    setStatus(error ? 'error' : 'sent')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <Seo title="Mot de passe oublié" noindex />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <Link
          to="/admin/connexion"
          className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
        >
          <ChevronLeft size={16} />
          Retour
        </Link>

        <h1 className="mt-4 font-display text-2xl font-black tracking-tight">
          Mot de passe oublié
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Recevez un lien de réinitialisation par e-mail.
        </p>

        {status === 'sent' ? (
          <p className="mt-6 text-sm text-emerald-400">
            E-mail envoyé. Vérifiez votre boîte de réception.
          </p>
        ) : (
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
            {status === 'error' && (
              <p className="text-sm text-red-400">
                Une erreur est survenue, merci de réessayer.
              </p>
            )}
            <Button type="submit" variant="primary" disabled={status === 'sending'}>
              <Mail size={16} />
              {status === 'sending' ? 'Envoi…' : 'Envoyer le lien'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
