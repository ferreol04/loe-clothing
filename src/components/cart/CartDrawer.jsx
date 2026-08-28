import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Drawer } from '../ui/Drawer'
import { Button } from '../ui/Button'
import { useCartStore } from '../../store/cartStore'
import { currency } from '../../lib/format'

export function CartDrawer({ onCheckout }) {
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const totalPrice = useCartStore((state) => state.totalPrice())

  const isEmpty = items.length === 0

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title="Votre panier"
      footer={
        !isEmpty && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{currency.format(totalPrice)}</span>
            </div>
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={onCheckout}
            >
              Commander
            </Button>
          </div>
        )
      }
    >
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-hover">
            <ShoppingBag size={28} className="text-text-faint" />
          </div>
          <p className="text-text-muted">
            Votre panier est vide pour le moment.
          </p>
          <Link to="/collections" onClick={closeCart}>
            <Button variant="secondary" size="sm">
              Découvrir les collections
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {items.map((item, i) => (
              <motion.li
                key={item.variantId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      aria-label="Supprimer l'article"
                      className="-m-2 flex h-9 w-9 shrink-0 items-center justify-center text-text-faint transition-colors hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-text-muted">
                    {[item.size, item.color].filter(Boolean).join(' · ')}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full border border-border-strong">
                      <button
                        type="button"
                        aria-label="Diminuer la quantité"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="flex h-11 w-11 items-center justify-center text-text active:scale-90 transition-transform"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Augmenter la quantité"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="flex h-11 w-11 items-center justify-center text-text active:scale-90 transition-transform"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold">
                      {currency.format(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  )
}
