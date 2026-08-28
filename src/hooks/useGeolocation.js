import { useState } from 'react'

/** Récupère la position GPS du client via l'API navigateur, à la demande. */
export function useGeolocation() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus('error')
      setError("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }

    setStatus('loading')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setStatus('success')
      },
      (err) => {
        setStatus('error')
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Position refusée. Vous pouvez indiquer votre adresse manuellement."
            : 'Impossible de récupérer votre position pour le moment.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function reset() {
    setStatus('idle')
    setCoords(null)
    setError(null)
  }

  return { status, coords, error, requestLocation, reset }
}
