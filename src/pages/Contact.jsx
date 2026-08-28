import { useLayoutEffect, useRef, useState } from 'react'
import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { ReviewForm } from '../components/ReviewForm'
import { CtaWhatsappCard } from '../components/home/CtaWhatsappCard'
import { Seo } from '../components/Seo'
import { buildMapsLink } from '../lib/maps'

// Doit correspondre au gap-8 (32px) entre la carte et le CTA ci-dessous.
const MAP_CTA_GAP = 32

export function Contact() {
  const { settings, loading } = useSettings()

  const hasPosition = settings?.latitude != null && settings?.longitude != null
  const mapSrc = hasPosition
    ? `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&z=15&output=embed`
    : null
  const mapsLink = hasPosition ? buildMapsLink(settings.latitude, settings.longitude) : null

  const gridRef = useRef(null)
  const nameFieldRef = useRef(null)
  const messageFieldRef = useRef(null)
  const [heights, setHeights] = useState({ map: null, cta: null })

  // Aligne la carte + le CTA sur la position exacte des champs Nom/Message
  // du formulaire d'avis (top du champ Nom → bas du champ Message).
  useLayoutEffect(() => {
    // Attend la fin du chargement des infos pratiques : mesurer avant
    // ferait une première passe sur un contenu incomplet (effet de "saut").
    if (loading) return

    function measure() {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches
      if (!isDesktop) {
        setHeights({ map: null, cta: null })
        return
      }

      const grid = gridRef.current
      const nameEl = nameFieldRef.current
      const messageEl = messageFieldRef.current
      if (!grid || !nameEl || !messageEl) return

      const gridTop = grid.getBoundingClientRect().top
      const nameTop = nameEl.getBoundingClientRect().top
      const messageBottom = messageEl.getBoundingClientRect().bottom

      setHeights({
        map: Math.max(0, nameTop - gridTop - MAP_CTA_GAP),
        cta: Math.max(0, messageBottom - nameTop),
      })
    }

    measure()
    // Les apparitions au scroll (Framer Motion) et le chargement asynchrone
    // des infos pratiques peuvent décaler les champs après le premier rendu.
    const timeout = setTimeout(measure, 800)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', measure)
    }
  }, [settings, loading])

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Seo
        title="Contact"
        description="Coordonnées, horaires et localisation de la boutique. Envoyez-nous un avis ou contactez-nous directement sur WhatsApp."
      />
      <div>
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
          Contact
        </h1>
        <p className="mt-3 max-w-xl text-text-muted">
          Une question, une suggestion ? Écrivez-nous ou passez nous voir en
          boutique.
        </p>
      </div>

      <div ref={gridRef} className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <ContactRow icon={MapPin} label="Adresse" value={settings?.address} loading={loading} />
            <ContactRow icon={Phone} label="Téléphone" value={settings?.phone} loading={loading} />
            <ContactRow
              icon={Mail}
              label="E-mail"
              value={settings?.social_links?.email}
              loading={loading}
            />
            <ContactRow
              icon={Clock}
              label="Horaires"
              value={settings?.opening_hours}
              loading={loading}
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-text uppercase">
              Laissez-nous un avis
            </h2>
            <div className="mt-4">
              <ReviewForm nameFieldRef={nameFieldRef} messageFieldRef={messageFieldRef} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div
            style={heights.map != null ? { height: heights.map } : undefined}
            className="group relative aspect-square shrink-0 overflow-hidden rounded-2xl bg-surface lg:aspect-auto lg:h-72"
          >
            {loading ? (
              <div className="h-full w-full animate-pulse bg-surface-hover" />
            ) : mapSrc ? (
              <>
                <iframe
                  title="Localisation de la boutique"
                  src={mapSrc}
                  className="pointer-events-none h-full w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ouvrir la position de la boutique dans Google Maps"
                  className="absolute inset-0"
                >
                  <span className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-bg/90 px-4 py-2.5 text-sm font-medium text-text opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    <ExternalLink size={15} />
                    Ouvrir dans Google Maps
                  </span>
                </a>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-faint">
                Localisation à venir
              </div>
            )}
          </div>

          <CtaWhatsappCard
            animated={false}
            style={heights.cta != null ? { height: heights.cta } : undefined}
          />
        </div>
      </div>
    </section>
  )
}

function ContactRow({ icon: Icon, label, value, loading }) {
  if (loading) {
    return (
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-surface-hover" />
        <div className="flex flex-col gap-2 pt-1">
          <div className="h-3 w-16 animate-pulse rounded bg-surface-hover" />
          <div className="h-4 w-40 animate-pulse rounded bg-surface-hover" />
        </div>
      </div>
    )
  }

  if (!value) return null

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium tracking-wide text-text-faint uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-text">{value}</p>
      </div>
    </div>
  )
}
