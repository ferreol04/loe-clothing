/**
 * Génère un identifiant unique.
 * `crypto.randomUUID()` n'est disponible que dans un contexte sécurisé
 * (HTTPS ou localhost) — sur un appareil mobile accédant au site en HTTP
 * via une IP locale (ex. test réseau pendant le développement), l'API est
 * absente. On bascule alors sur un identifiant suffisamment unique pour nos
 * besoins (noms de canaux Realtime, clés React, noms de fichiers).
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
