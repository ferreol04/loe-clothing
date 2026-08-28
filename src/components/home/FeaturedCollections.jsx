import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFeaturedProducts } from '../../hooks/useFeaturedProducts'
import { ProductCard } from '../product/ProductCard'
import { Reveal } from '../ui/Reveal'

function SeeAllLink({ className }) {
  return (
    <Link
      to="/collections"
      className={`group flex items-center gap-2 text-sm font-semibold text-accent ${className ?? ''}`}
    >
      Voir toutes les collections
      <ArrowRight
        size={16}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  )
}

export function FeaturedCollections() {
  const { products, loading } = useFeaturedProducts(4)

  if (!loading && products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Collections sélectionnées
          </h2>
          <p className="mt-2 max-w-md text-text-muted">
            Nos pièces phares du moment, à ne pas manquer.
          </p>
        </div>
        {/* Desktop : à côté du titre. Masqué sur mobile, reporté sous la grille. */}
        <SeeAllLink className="hidden sm:flex" />
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-surface"
              />
            ))
          : products.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
      </div>

      {/* Mobile uniquement : sous la grille de produits. */}
      <SeeAllLink className="mt-8 flex justify-center sm:hidden" />
    </section>
  )
}
