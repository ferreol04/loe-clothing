import { useEffect } from 'react'
import { BRAND_NAME } from '../lib/brand'

const SITE_NAME = BRAND_NAME
const DEFAULT_DESCRIPTION =
  'Boutique de mode en ligne — découvrez nos collections de vêtements, chaussures et accessoires, et commandez directement via WhatsApp.'

/**
 * Gère le titre de l'onglet et la meta description par page (SPA sans
 * dépendance externe type react-helmet).
 */
export function Seo({ title, description = DEFAULT_DESCRIPTION, noindex = false }) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME

    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', description)

    let robotsTag = document.querySelector('meta[name="robots"]')
    if (!robotsTag) {
      robotsTag = document.createElement('meta')
      robotsTag.setAttribute('name', 'robots')
      document.head.appendChild(robotsTag)
    }
    robotsTag.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, noindex])

  return null
}
