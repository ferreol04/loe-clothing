import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Seo } from '../components/Seo'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <Seo title="Page introuvable" noindex />
      <h1 className="font-display text-6xl font-black tracking-tight text-accent">
        404
      </h1>
      <p className="mt-4 text-text-muted">
        Cette page n'existe pas.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="secondary">Retour à l'accueil</Button>
      </Link>
    </section>
  )
}
