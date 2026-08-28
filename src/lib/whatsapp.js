import { currency } from './format'

export { buildMapsLink } from './maps'

/** Construit un lien wa.me avec message pré-rempli. */
export function buildWhatsAppLink(phoneNumber, message = '') {
  if (!phoneNumber) return '#'
  const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
  const params = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digitsOnly}${params}`
}

/**
 * Construit le message récapitulatif de commande envoyé via WhatsApp.
 * order = {
 *   items: [{ name, size, color, quantity, price }],
 *   total: number,
 *   mode: 'delivery' | 'pickup',
 *   phone: string,
 *   locationText?: string,   // adresse manuelle
 *   mapsLink?: string,       // position GPS
 * }
 */
export function buildOrderMessage(order) {
  const lines = ['Bonjour, je souhaite passer la commande suivante :', '']

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.name}*`)
    if (item.size) lines.push(`   Taille : ${item.size}`)
    if (item.color) lines.push(`   Couleur : ${item.color}`)
    lines.push(`   Quantité : ${item.quantity}`)
    lines.push(`   Prix unitaire : ${currency.format(item.price)}`)
    lines.push(`   Sous-total : ${currency.format(item.price * item.quantity)}`)
    lines.push('')
  })

  lines.push(`Total : ${currency.format(order.total)}`, '')

  if (order.mode === 'delivery') {
    lines.push('Mode de commande : Livraison')
    lines.push(`Téléphone : ${order.phone}`)
    if (order.mapsLink) {
      lines.push(`Position : ${order.mapsLink}`)
    } else if (order.locationText) {
      lines.push(`Adresse : ${order.locationText}`)
    }
  } else {
    lines.push('Mode de commande : Retrait en boutique')
    lines.push(`Téléphone : ${order.phone}`)
  }

  return lines.join('\n')
}
