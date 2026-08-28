import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import heroModel from '../../assets/hero-model.jpg'

const titleVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function Hero() {
  const ref = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 120],
  )
  const imgParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 60],
  )

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center overflow-hidden"
    >
      {/* Fond — TODO: remplacer par un visuel de marque définitif */}
      <motion.div
        style={{ y: bgParallaxY }}
        className="absolute inset-0 -z-20 bg-cover bg-center"
      >
        <img
          src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="h-full w-full scale-110 object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(245,166,35,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(245,166,35,0.08),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-bg/80" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,var(--color-bg)_100%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-0 lg:px-8">
        {/* Texte */}
        <div className="max-w-xl">
          <motion.span
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Nouvelle collection
          </motion.span>

          <motion.h1
            custom={1}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 font-display text-5xl leading-[0.95] font-black tracking-tight uppercase sm:text-6xl lg:text-7xl"
          >
            Le style qui <span className="text-gradient-accent">vous ressemble</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-md text-base text-text-muted sm:text-lg"
          >
            Des pièces sélectionnées avec soin — vêtements, chaussures et
            accessoires — pour composer un vestiaire qui a du caractère.
          </motion.p>

          <motion.div
            custom={3}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to="/collections">
              <Button variant="primary" size="lg">
                Explorer la collection
                <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Visuel — TODO: remplacer par un visuel de marque définitif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto h-[60vh] w-full max-w-lg sm:h-[65vh] lg:h-[78vh]"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle,rgba(245,166,35,0.22),transparent_70%)] blur-2xl" />
          <motion.div
            style={{ y: imgParallaxY }}
            className="h-full w-full overflow-hidden rounded-3xl border border-border shadow-2xl"
          >
            <img
              src={heroModel}
              alt="Mannequin élégant en manteau camel, ambiance automnale"
              className="h-full w-full object-cover object-top"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-text-faint lg:block"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  )
}
