import { supabase } from './supabaseClient'
import { generateId } from './id'
import { invalidateByPrefix } from './resourceCache'

const FIFTEEN_MINUTES = 15 * 60 * 1000

let started = false

/**
 * Met en place UNE seule fois (pour toute la session) les abonnements
 * Realtime qui invalident le cache partagé quand les données changent côté
 * admin, plus une minuterie de secours toutes les 15 minutes (au cas où un
 * événement Realtime serait manqué, ex. coupure réseau passagère).
 */
export function initRealtimeInvalidation() {
  if (started) return
  started = true

  supabase
    .channel(`cache-invalidation-${generateId()}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        invalidateByPrefix('products:')
        invalidateByPrefix('product:')
        invalidateByPrefix('featured-products:')
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'product_variants' },
      () => {
        invalidateByPrefix('products:')
        invalidateByPrefix('product:')
        invalidateByPrefix('featured-products:')
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'categories' },
      () => {
        invalidateByPrefix('categories:')
        // Les cartes produit affichent le nom de catégorie : on rafraîchit
        // aussi les listes pour refléter un renommage éventuel.
        invalidateByPrefix('products:')
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'settings' },
      () => invalidateByPrefix('settings:'),
    )
    .subscribe()

  setInterval(() => {
    invalidateByPrefix('')
  }, FIFTEEN_MINUTES)
}
