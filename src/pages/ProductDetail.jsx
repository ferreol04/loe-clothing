import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, ShoppingBag } from 'lucide-react'
import { useProduct } from '../hooks/useProduct'
import { useCartStore } from '../store/cartStore'
import { Button } from '../components/ui/Button'
import { Seo } from '../components/Seo'
import { currency } from '../lib/format'
import { cn } from '../lib/cn'

export function ProductDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { product, loading, notFound } = useProduct(slug)

  // Retour contextuel : accueil si le produit a été ouvert depuis les
  // collections en vedette, collections sinon (comportement par défaut,
  // y compris en cas d'accès direct via lien partagé).
  const cameFromApp = Boolean(location.state?.from)
  const backTo = location.state?.from === 'home' ? '/' : '/collections'
  const backLabel = location.state?.from === 'home' ? "Retour à l'accueil" : 'Retour aux collections'

  // Navigation arrière réelle (history back) quand on sait d'où vient le
  // visiteur : la position de scroll exacte est alors restaurée sur la
  // page précédente. Sinon (accès direct/lien partagé), on pousse vers la
  // destination par défaut, sans position à restaurer.
  function handleBack(event) {
    if (!cameFromApp) return
    event.preventDefault()
    navigate(-1)
  }
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!product) return
    setActiveImage(0)
    const firstAvailable = product.variants?.find((v) => v.stock == null || v.stock > 0)
    setSelectedVariantId(firstAvailable?.id ?? product.variants?.[0]?.id ?? null)
  }, [product])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-surface" />
          <div className="flex flex-col gap-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-surface" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-surface" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl font-black">
          Produit introuvable
        </h1>
        <Link to="/collections">
          <Button variant="secondary">Retour aux collections</Button>
        </Link>
      </div>
    )
  }

  const variant = product.variants?.find((v) => v.id === selectedVariantId)
  const displayPrice = variant?.price ?? product.base_price
  const images = product.images?.length ? product.images : [null]
  const canAdd = variant && (variant.stock == null || variant.stock > 0)

  function handleAddToCart() {
    if (!canAdd) return
    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        image: product.images?.[0],
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title={product.name}
        description={
          product.description ||
          `${product.name} — ${currency.format(product.base_price)}. Commandez directement via WhatsApp.`
        }
      />
      <Link
        to={backTo}
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-text-muted transition-colors hover:text-text"
      >
        <ChevronLeft size={16} />
        {backLabel}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Galerie */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
            {images[activeImage] && (
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 overflow-hidden rounded-xl border-2 bg-surface transition-colors',
                    activeImage === i
                      ? 'border-accent'
                      : 'border-transparent',
                  )}
                >
                  {img && (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos produit */}
        <div>
          {product.category?.name && (
            <span className="text-xs font-medium tracking-wide text-text-faint uppercase">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-bold text-accent">
            {currency.format(displayPrice)}
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-text-muted">
              {product.description}
            </p>
          )}

          {product.variants?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold tracking-wide text-text uppercase">
                Tailles disponibles
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const label = [v.size, v.color].filter(Boolean).join(' · ')
                  const outOfStock = v.stock != null && v.stock <= 0
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        'min-w-[3.5rem] rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-200',
                        outOfStock &&
                          'cursor-not-allowed border-border text-text-faint line-through',
                        !outOfStock &&
                          selectedVariantId === v.id &&
                          'border-accent bg-accent text-bg',
                        !outOfStock &&
                          selectedVariantId !== v.id &&
                          'border-border-strong text-text hover:border-accent',
                      )}
                    >
                      {label || 'Unique'}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="mt-8 w-full sm:w-auto"
            disabled={!canAdd}
            onClick={handleAddToCart}
          >
            {justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
            {canAdd ? 'Ajouter au panier' : 'Rupture de stock'}
          </Button>
        </div>
      </div>
    </div>
  )
}
