import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { supabase } from '../lib/supabaseClient'

const initialForm = { name: '', email: '', message: '' }

// Délai minimum avant qu'un envoi soit considéré comme humain (les robots
// remplissent et soumettent les formulaires quasi instantanément).
const MIN_SUBMIT_DELAY_MS = 1500

export function ReviewForm({ nameFieldRef, messageFieldRef } = {}) {
  const [form, setForm] = useState(initialForm)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const mountedAt = useRef(Date.now())

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.message.trim()) return

    // Anti-spam silencieux : un champ piège rempli ou un envoi trop rapide
    // trahit un robot. On feint le succès sans rien enregistrer.
    const isBot =
      honeypot.trim() !== '' || Date.now() - mountedAt.current < MIN_SUBMIT_DELAY_MS
    if (isBot) {
      setStatus('success')
      setForm(initialForm)
      setTimeout(() => setStatus('idle'), 4000)
      return
    }

    setStatus('sending')
    const { error } = await supabase.from('messages').insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      message: form.message.trim(),
    })

    if (error) {
      console.error('Erreur envoi message :', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
      return
    }

    setStatus('success')
    setForm(initialForm)
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Piège à robots : invisible et ignoré des humains, jamais rempli. */}
      <div
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="website">Site web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Input
        ref={nameFieldRef}
        id="name"
        label="Nom (optionnel)"
        placeholder="Votre nom"
        maxLength={100}
        value={form.name}
        onChange={handleChange('name')}
      />
      <Input
        id="email"
        type="email"
        label="E-mail (optionnel)"
        placeholder="vous@exemple.com"
        maxLength={255}
        value={form.email}
        onChange={handleChange('email')}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-text-muted">
          Message
        </label>
        <textarea
          ref={messageFieldRef}
          id="message"
          rows={5}
          placeholder="Votre avis ou votre suggestion…"
          maxLength={2000}
          value={form.message}
          onChange={handleChange('message')}
          required
          className="resize-none rounded-xl border border-border-strong bg-surface px-4 py-3 text-text outline-none transition-colors duration-200 placeholder:text-text-faint focus:border-accent"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={status === 'sending'}
        className="self-start"
      >
        <Send size={16} />
        {status === 'sending' ? 'Envoi…' : 'Envoyer'}
      </Button>

      {status === 'success' && (
        <p className="text-sm text-emerald-400">
          Merci, votre message a bien été envoyé.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400">
          Une erreur est survenue, merci de réessayer.
        </p>
      )}
    </form>
  )
}
