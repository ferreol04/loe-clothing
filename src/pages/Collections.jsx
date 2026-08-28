import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/product/ProductCard'
import { Pagination } from '../components/product/Pagination'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/Seo'
import { cn } from '../lib/cn'

export function Collections() {
  const { categories, loading: categoriesLoading } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const categorySlug = searchParams.get('categorie')
  const page = Number(searchParams.get('page') ?? 1)

  const activeCategory = categories.find((c) => c.slug === categorySlug)

  // Remonte en haut de page à chaque changement de page (numéro ou flèche),
  // déclenché après coup une fois la page réellement mise à jour — évite
  // toute course avec la mise à jour de l'URL.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  // Debounce de la recherche instantanée
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (search) next.set('q', search)
      else next.delete('q')
      next.delete('page')
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const { products, totalPages, loading } = useProducts({
    page,
    search,
    categoryId: activeCategory?.id ?? null,
  })

  function setCategory(slug) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (slug) next.set('categorie', slug)
      else next.delete('categorie')
      next.delete('page')
      return next
    })
  }

  function setPage(nextPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(nextPage))
      return next
    })
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Seo
        title="Collections"
        description="Parcourez toutes nos collections de vêtements, chaussures et accessoires. Recherchez et filtrez par catégorie."
      />
      <Reveal>
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
          Collections
        </h1>
        <p className="mt-3 max-w-xl text-text-muted">
          Parcourez l'ensemble de nos pièces, filtrez par catégorie ou
          recherchez directement ce que vous cherchez.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="relative mt-8 max-w-md">
        <Search
          size={18}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-text-faint"
        />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher un produit, une catégorie…"
          className="w-full rounded-full border border-border-strong bg-surface py-3 pr-10 pl-11 text-sm text-text outline-none transition-colors duration-200 placeholder:text-text-faint focus:border-accent"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            aria-label="Effacer la recherche"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-text-faint hover:text-text"
          >
            <X size={16} />
          </button>
        )}
      </Reveal>

      <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200',
            !categorySlug
              ? 'border-accent bg-accent text-bg'
              : 'border-border-strong text-text-muted hover:border-accent hover:text-text',
          )}
        >
          Tout
        </button>
        {categoriesLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 animate-pulse rounded-full bg-surface"
              />
            ))
          : categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.slug)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                  categorySlug === cat.slug
                    ? 'border-accent bg-accent text-bg'
                    : 'border-border-strong text-text-muted hover:border-accent hover:text-text',
                )}
              >
                {cat.name}
              </button>
            ))}
      </Reveal>

      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-surface"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-text-muted">
            Aucun produit ne correspond à votre recherche.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 0.04, 0.3)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  )
}
