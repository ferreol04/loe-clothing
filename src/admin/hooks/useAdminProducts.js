import { useEffect, useState } from 'react'
import { generateId } from '../../lib/id'
import { supabase } from '../../lib/supabaseClient'

/** Liste complète des produits (actifs et inactifs) pour l'espace admin. */
export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name), variants:product_variants(*)')
      .order('created_at', { ascending: false })

    if (error) console.error('Erreur chargement produits (admin) :', error)
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()

    const channel = supabase
      .channel(`admin-products-${generateId()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        fetchProducts,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_variants' },
        fetchProducts,
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { products, loading, refetch: fetchProducts }
}
