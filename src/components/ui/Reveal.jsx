import { motion } from 'framer-motion'
import { useScrollReveal, revealVariants } from '../../hooks/useScrollReveal'

/** Enveloppe un bloc pour le faire apparaître (fade + translation) au scroll. */
export function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
  const { ref, isVisible } = useScrollReveal()
  const Component = motion[as] ?? motion.div

  return (
    <Component
      ref={ref}
      className={className}
      variants={revealVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Component>
  )
}
