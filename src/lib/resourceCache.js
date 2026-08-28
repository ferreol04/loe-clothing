/**
 * Cache en mémoire partagé entre tous les composants, avec dédoublonnage
 * des requêtes concurrentes et invalidation ciblée par préfixe de clé.
 *
 * Principe : chaque ressource (catégories, produits, réglages...) est
 * stockée sous une clé. Un composant qui la demande reçoit la version en
 * cache instantanément si elle existe déjà ; sinon une seule requête réseau
 * est lancée, partagée par tous les abonnés simultanés. Le cache n'est
 * rafraîchi que lorsqu'on l'invalide explicitement (changement Realtime,
 * minuterie de secours) — jamais simplement parce qu'un composant remonte.
 */

const state = new Map() // key -> { data, loading, error, promise, fetcher, fetchedAt }
const listeners = new Map() // key -> Set<callback>

function notify(key) {
  listeners.get(key)?.forEach((cb) => cb())
}

function setEntry(key, patch) {
  const prev = state.get(key) ?? {}
  state.set(key, { ...prev, ...patch })
  notify(key)
}

export function getSnapshot(key) {
  return state.get(key)
}

export function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key).add(callback)
  return () => {
    listeners.get(key)?.delete(callback)
  }
}

/**
 * Retourne les données en cache si présentes, sinon lance `fetcher()` (une
 * seule fois même si plusieurs composants le demandent en même temps).
 * `force: true` relance la requête même si une version est déjà en cache.
 */
export function fetchIfNeeded(key, fetcher, { force = false } = {}) {
  const entry = state.get(key)

  if (!force) {
    if (entry?.promise) return entry.promise
    if (entry?.data !== undefined) return Promise.resolve(entry.data)
  } else if (entry?.promise) {
    // Une requête est déjà en vol : pas la peine d'en relancer une deuxième.
    return entry.promise
  }

  const promise = fetcher()
    .then((data) => {
      setEntry(key, {
        data,
        loading: false,
        error: null,
        promise: null,
        fetcher,
        fetchedAt: Date.now(),
      })
      return data
    })
    .catch((error) => {
      setEntry(key, { error, loading: false, promise: null, fetcher })
      throw error
    })

  setEntry(key, { loading: entry?.data === undefined, promise, fetcher })
  return promise
}

/** Invalide (et relance) toutes les entrées dont la clé commence par `prefix`. */
export function invalidateByPrefix(prefix) {
  for (const [key, entry] of state.entries()) {
    if (key.startsWith(prefix) && entry.fetcher) {
      fetchIfNeeded(key, entry.fetcher, { force: true })
    }
  }
}
