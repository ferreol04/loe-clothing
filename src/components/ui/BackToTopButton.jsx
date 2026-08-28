import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { scrollToTop } from '../../lib/scroll'

// Repli pour les pages sans section CTA WhatsApp (ex. Collections, fiche produit).
const FALLBACK_SHOW_AFTER_PX = 900

/**
 * Bouton flottant « retour en haut ». Apparaît précisément à partir de la
 * section CTA WhatsApp (#cta-whatsapp) quand elle existe sur la page, plutôt
 * qu'après une distance de défilement arbitraire — et disparaît si on
 * remonte au-dessus. Sur les pages sans cette section, repli sur un seuil
 * de défilement généreux (proche du bas de page).
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setVisible(false)

    function handleScroll() {
      const target = document.getElementById('cta-whatsapp')
      if (target) {
        const rect = target.getBoundingClientRect()
        setVisible(rect.top <= window.innerHeight)
      } else {
        setVisible(window.scrollY > FALLBACK_SHOW_AFTER_PX)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [location.pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Remonter en haut de page"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 bottom-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface/95 text-text shadow-lg backdrop-blur-md transition-colors hover:border-accent hover:text-accent sm:right-6 sm:bottom-6"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
