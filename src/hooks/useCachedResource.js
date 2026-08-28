import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { fetchIfNeeded, getSnapshot, subscribe } from '../lib/resourceCache'

/**
 * Lit une ressource depuis le cache partagé (voir lib/resourceCache) et la
 * demande si elle n'y est pas encore. Plusieurs composants utilisant la
 * même `key` partagent la même donnée et se re-rendent ensemble quand
 * elle change (invalidation Realtime, minuterie de secours...).
 */
export function useCachedResource(key, fetcher) {
  const subscribeToKey = useCallback((cb) => subscribe(key, cb), [key])
  const getKeySnapshot = useCallback(() => getSnapshot(key), [key])

  const entry = useSyncExternalStore(subscribeToKey, getKeySnapshot)

  useEffect(() => {
    fetchIfNeeded(key, fetcher)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return {
    data: entry?.data,
    loading: entry?.data === undefined && entry?.error == null,
    error: entry?.error ?? null,
  }
}
