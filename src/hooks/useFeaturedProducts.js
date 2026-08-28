import { useCachedResource } from './useCachedResource'
import { supabase } from '../lib/supabaseClient'

async function fetchFeatured(limit) {
  const selectColumns =
    '*, category:categories(id, name, slug), variants:product_variants(*)'

  const { data: featured, error: featuredError } = await supabase
    .from('products')
    .select(selectColumns)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (featuredError) throw featuredError

  let combined = featured ?? []

  // Complète avec les produits les plus récents s'il n'y a pas assez de
  // produits vedette pour remplir les emplacements de l'accueil.
  const missing = limit - combined.length
  if (missing > 0) {
    let fallbackQuery = supabase
      .from('products')
      .select(selectColumns)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(missing)

    const excludeIds = combined.map((p) => p.id)
    if (excludeIds.length > 0) {
      fallbackQuery = fallbackQuery.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data: fallback, error: fallbackError } = await fallbackQuery
    if (fallbackError) throw fallbackError
    combined = [...combined, ...(fallback ?? [])]
  }

  return combined
}

/** Produits vedette (+ complément récents) — mis en cache par limite demandée. */
export function useFeaturedProducts(limit = 4) {
  const { data, loading } = useCachedResource(`featured-products:${limit}`, () =>
    fetchFeatured(limit),
  )
  return { products: data ?? [], loading }
}
