/** Lien Google Maps à partir de coordonnées GPS. */
export function buildMapsLink(latitude, longitude) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}
