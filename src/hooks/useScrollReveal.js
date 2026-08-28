import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Déclenche une apparition (fade + translation) quand l'élément entre dans
 * le viewport, via IntersectionObserver. Respecte prefers-reduced-motion
 * (l'élément est alors visible immédiatement, sans animation).
 *
 * Usage :
 *   const { ref, isVisible } = useScrollReveal()
 *   <motion.div ref={ref} animate={isVisible ? 'visible' : 'hidden'} ... />
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -80px 0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, prefersReducedMotion])

  return { ref, isVisible }
}

/** Variants Framer Motion prêts à l'emploi pour un fade + translation vers le haut. */
export const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

/** Variante "conteneur" pour un effet de stagger sur les enfants directs. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}
