import { useCachedResource } from './useCachedResource'
import { supabase } from '../lib/supabaseClient'

async function fetchProduct(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}

/** Fiche produit unique (par slug) — mise en cache par slug. */
export function useProduct(slug) {
  const key = slug ? `product:${slug}` : 'product:__none__'
  const { data, loading } = useCachedResource(key, () =>
    slug ? fetchProduct(slug) : Promise.resolve(null),
  )

  return {
    product: data ?? null,
    loading: Boolean(slug) && loading,
    notFound: Boolean(slug) && !loading && data == null,
  }
}
