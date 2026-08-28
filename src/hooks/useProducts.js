import { useCachedResource } from './useCachedResource'
import { supabase } from '../lib/supabaseClient'

const PAGE_SIZE = 12

async function fetchProducts({ page, search, categoryId }) {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select('*, category:categories(id, name, slug), variants:product_variants(*)', {
      count: 'exact',
    })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search.trim()) {
    query = query.ilike('name', `%${search.trim()}%`)
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error, count } = await query
  if (error) throw error

  return { products: data ?? [], totalCount: count ?? 0 }
}

/**
 * Liste paginée des produits actifs, avec recherche instantanée et filtre
 * par catégorie — mise en cache par combinaison page/recherche/catégorie,
 * invalidée automatiquement dès qu'un produit change côté admin.
 */
export function useProducts({ page = 1, search = '', categoryId = null } = {}) {
  const key = `products:${page}:${search.trim().toLowerCase()}:${categoryId ?? ''}`
  const { data, loading } = useCachedResource(key, () =>
    fetchProducts({ page, search, categoryId }),
  )

  const products = data?.products ?? []
  const totalCount = data?.totalCount ?? 0

  return {
    products,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    loading,
    pageSize: PAGE_SIZE,
  }
}
