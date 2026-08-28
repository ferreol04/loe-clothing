import { NavLink } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsAppIcon } from '../ui/SocialIcons'
import { useSettings } from '../../hooks/useSettings'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { scrollToTop } from '../../lib/scroll'
import { BRAND_NAME, BRAND_TAGLINE } from '../../lib/brand'

export function Footer() {
  const year = new Date().getFullYear()
  const { settings, loading } = useSettings()
  const social = settings?.social_links ?? {}

  const socialLinks = [
    { key: 'instagram', href: social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { key: 'facebook', href: social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { key: 'tiktok', href: social.tiktok, label: 'TikTok', Icon: TiktokIcon },
    {
      key: 'whatsapp',
      href: settings?.whatsapp_number
        ? buildWhatsAppLink(settings.whatsapp_number)
        : null,
      label: 'WhatsApp',
      Icon: WhatsAppIcon,
    },
  ]

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl font-black tracking-tight">
            {BRAND_NAME}
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.28em] text-text-faint uppercase">
            {BRAND_TAGLINE}
          </p>
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            Une sélection soignée de vêtements, chaussures et accessoires,
            pensée pour durer.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-text uppercase">
            Navigation
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-text-muted">
            <li>
              <NavLink to="/" onClick={scrollToTop} className="transition-colors hover:text-accent">
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/collections"
                onClick={scrollToTop}
                className="transition-colors hover:text-accent"
              >
                Collections
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={scrollToTop}
                className="transition-colors hover:text-accent"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-text uppercase">
            Suivez-nous
          </h3>
          <div className="mt-4 flex gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 animate-pulse rounded-full bg-surface-hover"
                  />
                ))
              : socialLinks.map(({ key, href, label, Icon }) =>
                  href ? (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon size={18} />
                    </a>
                  ) : (
                    <button
                      key={key}
                      type="button"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon size={18} />
                    </button>
                  ),
                )}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs text-text-faint">
          © {year} {BRAND_NAME} — Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
