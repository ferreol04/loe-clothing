import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-text text-bg hover:bg-accent-light',
  secondary:
    'bg-transparent text-text border border-border-strong hover:border-accent hover:text-accent',
  accent:
    'bg-accent text-bg hover:bg-accent-light',
  ghost:
    'bg-transparent text-text-muted hover:text-text',
  danger:
    'bg-red-500 text-white hover:bg-red-400',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

/**
 * Bouton pilule avec micro-interactions : hover fluide (élévation légère) +
 * scale-down au clic pour le retour tactile.
 */
export function Button({
  as: Component = motion.button,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Component>
  )
}
