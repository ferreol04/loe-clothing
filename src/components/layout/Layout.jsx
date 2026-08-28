import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CartDrawer } from '../cart/CartDrawer'
import { CheckoutModal } from '../checkout/CheckoutModal'
import { BackToTopButton } from '../ui/BackToTopButton'
import { useCartStore } from '../../store/cartStore'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export function Layout() {
  const location = useLocation()
  const closeCart = useCartStore((state) => state.closeCart)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  function handleCheckout() {
    closeCart()
    setCheckoutOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 pt-16 lg:pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
      {/* Remonte en haut sur une nouvelle navigation, restaure la position
          de scroll exacte sur un retour arrière (bouton "Retour", navigateur).
          Clé par pathname seul (sans les paramètres ?page=/?categorie=/?q=) :
          sinon chaque changement de pagination sur Collections serait traité
          comme une page jamais vue et remonterait instantanément en haut,
          juste avant que son propre scroll fluide ne s'exécute — l'annulant. */}
      <ScrollRestoration getKey={(loc) => loc.pathname} />
      <BackToTopButton />
      <CartDrawer onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  )
}
