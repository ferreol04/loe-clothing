import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { scrollToTop } from '../../lib/scroll'
import { useCartStore } from '../../store/cartStore'
import { BRAND_NAME, BRAND_TAGLINE } from '../../lib/brand'

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/collections', label: 'Collections' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const openCart = useCartStore((state) => state.openCart)
  const totalItems = useCartStore((state) => state.totalItems())
  const [bump, setBump] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Petit rebond du badge à chaque changement du nombre d'articles
  useEffect(() => {
    if (totalItems === 0) return
    setBump(true)
    const timeout = setTimeout(() => setBump(false), 300)
    return () => clearTimeout(timeout)
  }, [totalItems])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-out',
        scrolled
          ? 'border-b border-border bg-bg/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <NavLink to="/" onClick={scrollToTop} className="flex flex-col leading-none">
          <span className="font-display text-xl font-black tracking-tight text-text lg:text-2xl">
            {BRAND_NAME}
          </span>
          <span className="mt-1 text-[7px] font-semibold tracking-[0.18em] whitespace-nowrap text-text-faint uppercase sm:text-[9px] sm:tracking-[0.25em] lg:text-[10px] lg:tracking-[0.28em]">
            {BRAND_TAGLINE}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={scrollToTop}
              className={({ isActive }) =>
                cn(
                  'group relative py-1 text-sm font-medium tracking-wide text-text-muted transition-colors duration-200 hover:text-text',
                  isActive && 'text-text',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100',
                      isActive && 'scale-x-100',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label="Ouvrir le panier"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors duration-200 hover:bg-surface"
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: bump ? 1.25 : 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-bg"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors duration-200 hover:bg-surface md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-bg md:hidden"
          >
            <ul className="flex flex-col px-4 py-2 sm:px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => {
                      setMobileOpen(false)
                      scrollToTop()
                    }}
                    className={({ isActive }) =>
                      cn(
                        'block border-b border-border py-4 text-base font-medium text-text-muted',
                        isActive && 'text-text',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
