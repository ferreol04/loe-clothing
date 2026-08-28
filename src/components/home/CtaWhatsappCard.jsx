import { MessageCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { useSettings } from '../../hooks/useSettings'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { cn } from '../../lib/cn'

/**
 * Carte CTA « Une question ? Écrivez-nous. » — réutilisée sur l'accueil et
 * la page Contact. `animated={false}` désactive l'apparition au scroll
 * (utilisé sur la page Contact, qui n'a pas cet effet).
 */
export function CtaWhatsappCard({ className, style, animated = true }) {
  const { settings, loading } = useSettings()
  const link = buildWhatsAppLink(
    settings?.whatsapp_number,
    "Bonjour, j'aimerais avoir plus d'informations sur vos produits.",
  )

  const Wrapper = animated ? Reveal : 'div'

  return (
    <Wrapper
      id="cta-whatsapp"
      style={style}
      className={cn(
        'relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border border-border px-6 py-16 text-center',
        className,
      )}
    >
      {/* Halo ambré diffus en fond, plutôt qu'un aplat gris plat */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(245,166,35,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
        <MessageCircle size={26} />
      </div>
      <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
        Une question ? Écrivez-nous.
      </h2>
      <p className="max-w-md text-text-muted">
        Notre équipe vous répond directement sur WhatsApp, sans détour.
      </p>
      {loading ? (
        <div className="h-13 w-64 max-w-full animate-pulse rounded-full bg-surface-hover" />
      ) : (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button variant="accent" size="lg">
            Nous contacter sur WhatsApp
          </Button>
        </a>
      )}
    </Wrapper>
  )
}
