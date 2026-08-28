import { useCachedResource } from './useCachedResource'
import { supabase } from '../lib/supabaseClient'

async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data ?? []
}

/** Liste des catégories — mise en cache, invalidée automatiquement (voir lib/realtimeInvalidation). */
export function useCategories() {
  const { data, loading } = useCachedResource('categories:all', fetchCategories)
  return { categories: data ?? [], loading }
}
