import { useEffect, useState } from 'react'
import { Loader2, MapPin, Save, TriangleAlert } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import { useGeolocation } from '../../hooks/useGeolocation'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import { buildMapsLink } from '../../lib/maps'

export function SettingsForm() {
  const { settings, loading } = useSettings()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('idle') // idle | success | error
  const geolocation = useGeolocation()

  useEffect(() => {
    if (settings) {
      setForm({
        address: settings.address ?? '',
        opening_hours: settings.opening_hours ?? '',
        phone: settings.phone ?? '',
        whatsapp_number: settings.whatsapp_number ?? '',
        latitude: settings.latitude ?? null,
        longitude: settings.longitude ?? null,
        email: settings.social_links?.email ?? '',
        instagram: settings.social_links?.instagram ?? '',
        facebook: settings.social_links?.facebook ?? '',
        tiktok: settings.social_links?.tiktok ?? '',
      })
    }
  }, [settings])

  // Dès que la géolocalisation aboutit, on met à jour la position du formulaire.
  useEffect(() => {
    if (geolocation.status === 'success' && geolocation.coords) {
      setForm((f) => ({
        ...f,
        latitude: geolocation.coords.latitude,
        longitude: geolocation.coords.longitude,
      }))
    }
  }, [geolocation.status, geolocation.coords])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('idle')

    const { error } = await supabase
      .from('settings')
      .update({
        address: form.address || null,
        opening_hours: form.opening_hours || null,
        phone: form.phone || null,
        whatsapp_number: form.whatsapp_number || null,
        latitude: form.latitude,
        longitude: form.longitude,
        social_links: {
          email: form.email || undefined,
          instagram: form.instagram || undefined,
          facebook: form.facebook || undefined,
          tiktok: form.tiktok || undefined,
        },
      })
      .eq('id', 1)

    setSaving(false)
    setStatus(error ? 'error' : 'success')
    setTimeout(() => setStatus('idle'), 4000)
  }

  if (loading || !form) {
    return (
      <div className="max-w-2xl">
        <div className="h-8 w-48 animate-pulse rounded bg-surface" />
        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-surface" />
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-13 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      </div>
    )
  }

  const hasPosition = form.latitude != null && form.longitude != null
  const whatsappDigits = form.whatsapp_number.replace(/[^\d]/g, '')
  const whatsappSeemsIncomplete =
    whatsappDigits.length > 0 && whatsappDigits.length < 10

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-black tracking-tight">
        Infos pratiques
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Ces informations sont affichées sur le site public (page Contact, CTA WhatsApp).
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input id="address" label="Adresse" value={form.address} onChange={update('address')} />
        <Input
          id="opening_hours"
          label="Horaires d'ouverture"
          placeholder="Lun–Sam, 9h–19h"
          value={form.opening_hours}
          onChange={update('opening_hours')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="phone" label="Téléphone" value={form.phone} onChange={update('phone')} />
          <div className="flex flex-col gap-1.5">
            <Input
              id="whatsapp_number"
              label="Numéro WhatsApp (commandes)"
              placeholder="+229 01 XX XX XX XX"
              value={form.whatsapp_number}
              onChange={update('whatsapp_number')}
            />
            <p className="text-xs text-text-faint">
              Format international complet obligatoire, indicatif pays inclus
              (ex. <span className="font-mono">+229</span> pour le Bénin) —
              sinon WhatsApp ne reconnaît pas le numéro.
            </p>
            {whatsappSeemsIncomplete && (
              <p className="flex items-center gap-1.5 text-xs text-amber-400">
                <TriangleAlert size={13} />
                Ce numéro semble incomplet — vérifiez qu'il inclut bien
                l'indicatif du pays.
              </p>
            )}
          </div>
        </div>

        <Input id="email" type="email" label="E-mail de contact" value={form.email} onChange={update('email')} />

        {/* Position de la boutique */}
        <div className="flex flex-col gap-2 rounded-xl border border-border-strong p-4">
          <label className="text-sm font-medium text-text-muted">
            Position de la boutique
          </label>
          <p className="text-xs text-text-faint">
            Utilisée pour afficher la carte sur la page Contact. Récupérez la
            position depuis l'appareil sur lequel se trouve la boutique.
          </p>

          {hasPosition && (
            <a
              href={buildMapsLink(form.latitude, form.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-light"
            >
              <MapPin size={15} />
              {Number(form.latitude).toFixed(5)}, {Number(form.longitude).toFixed(5)} — voir sur Google Maps
            </a>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-fit"
            onClick={geolocation.requestLocation}
            disabled={geolocation.status === 'loading'}
          >
            {geolocation.status === 'loading' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <MapPin size={15} />
            )}
            {hasPosition ? 'Mettre à jour ma position' : 'Récupérer ma position actuelle'}
          </Button>

          {geolocation.status === 'error' && (
            <p className="text-sm text-red-400">{geolocation.error}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="instagram"
            label="Lien Instagram"
            value={form.instagram}
            onChange={update('instagram')}
          />
          <Input
            id="facebook"
            label="Lien Facebook"
            value={form.facebook}
            onChange={update('facebook')}
          />
          <Input
            id="tiktok"
            label="Lien TikTok"
            value={form.tiktok}
            onChange={update('tiktok')}
          />
        </div>

        {status === 'success' && (
          <p className="text-sm text-emerald-400">Informations mises à jour.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">Une erreur est survenue.</p>
        )}

        <Button type="submit" variant="primary" disabled={saving} className="w-fit">
          <Save size={16} />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </form>
    </div>
  )
}
