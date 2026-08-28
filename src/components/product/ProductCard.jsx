import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { currency } from '../../lib/format'
import { useCartStore } from '../../store/cartStore'

/**
 * Sélectionne la variante à ajouter en un clic : la première disponible.
 * `stock` non renseigné (null) = disponible ; un nombre ≤ 0 = rupture.
 */
function pickQuickAddVariant(variants = []) {
  return variants.find((v) => v.stock == null || v.stock > 0) ?? null
}

export function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const [justAdded, setJustAdded] = useState(false)

  const variant = pickQuickAddVariant(product.variants)
  const displayPrice = variant?.price ?? product.base_price
  const image = product.images?.[0]

  function handleQuickAdd(event) {
    event.preventDefault()
    if (!variant) return

    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        image,
        size: variant.size,
        color: variant.color,
        price: variant.price ?? product.base_price,
      },
      1,
    )

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
    openCart()
  }

  return (
    <Link
      to={`/produits/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-hover">
        {image && (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}

        <motion.button
          type="button"
          onClick={handleQuickAdd}
          disabled={!variant}
          aria-label="Ajouter au panier"
          whileTap={{ scale: 0.9 }}
          className="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full bg-text text-bg shadow-lg transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {justAdded ? <Check size={18} /> : <Plus size={18} />}
        </motion.button>
      </div>

      <div className="flex flex-col gap-1 p-4">
        {product.category?.name && (
          <span className="text-xs font-medium tracking-wide text-text-faint uppercase">
            {product.category.name}
          </span>
        )}
        <h3 className="truncate text-sm font-semibold text-text">
          {product.name}
        </h3>
        <span className="text-sm font-bold text-accent">
          {currency.format(displayPrice)}
        </span>
      </div>
    </Link>
  )
}
