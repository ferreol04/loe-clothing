import { useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
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

  // Remonte en haut de page à chaque changement de route (React Router ne
  // le fait pas automatiquement, contrairement à une navigation classique).
  // useLayoutEffect : appliqué avant peinture, pour éviter tout flash de
  // l'ancienne position de scroll sur le nouveau contenu.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
      <BackToTopButton />
      <CartDrawer onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  )
}
