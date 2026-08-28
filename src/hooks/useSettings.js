import { useCachedResource } from './useCachedResource'
import { supabase } from '../lib/supabaseClient'

async function fetchSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}

/** Infos pratiques — mises en cache, invalidées automatiquement (voir lib/realtimeInvalidation). */
export function useSettings() {
  const { data, loading } = useCachedResource('settings:main', fetchSettings)
  return { settings: data ?? null, loading }
}
