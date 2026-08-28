import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Reveal } from '../ui/Reveal'
import { staggerContainer, revealVariants, useScrollReveal } from '../../hooks/useScrollReveal'

const TESTIMONIALS = [
  {
    name: 'Aïcha D.',
    text: 'On sent tout de suite que chaque pièce a été pensée avec soin, pas juste mise en rayon. Je porte du LØÉ et ça se voit dans l\'allure.',
    rating: 5,
  },
  {
    name: 'Steve K.',
    text: "Enfin une marque avec une vraie identité. Les coupes, les matières, l'attitude... on ne s'habille plus pareil après.",
    rating: 5,
  },
  {
    name: 'Nadia F.',
    text: "Commande passée un soir sur WhatsApp, mais ce qui m'a marquée c'est le style : élégant, jamais surchargé, exactement mon univers.",
    rating: 4,
  },
]

export function Testimonials() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Ce qu'en disent nos clients
          </h2>
        </Reveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={revealVariants}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < t.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-text-muted">
                « {t.text} »
              </p>
              <p className="mt-4 text-sm font-semibold text-text">
                {t.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
