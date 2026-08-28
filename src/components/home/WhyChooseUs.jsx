import { Award, Clock, ShieldCheck, Sparkles } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { staggerContainer, revealVariants } from '../../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Qualité contrôlée',
    text: 'Chaque pièce est sélectionnée pour sa qualité de matière et de finition.',
  },
  {
    icon: Award,
    title: 'Sélection exigeante',
    text: 'Un catalogue pensé pour durer, loin des tendances jetables.',
  },
  {
    icon: Clock,
    title: 'Nouveautés régulières',
    text: 'De nouvelles pièces ajoutées en continu, à suivre de près.',
  },
  {
    icon: Sparkles,
    title: 'Service attentif',
    text: 'Une commande simple et directe, accompagnée du premier au dernier message.',
  },
]

export function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Pourquoi nous choisir
          </h2>
          <p className="mt-2 text-text-muted">
            L'exigence dans les moindres détails.
          </p>
        </Reveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={revealVariants}
              className="rounded-2xl border border-border bg-surface p-6 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-text">
                {title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
