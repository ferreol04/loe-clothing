import { Reveal } from '../ui/Reveal'
import ourStoryImage from '../../assets/Notrehistoire.jpg'

export function OurStory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <Reveal className="order-2 aspect-3/4 overflow-hidden rounded-2xl bg-surface lg:order-1">
          <img
            src={ourStoryImage}
            alt="Portrait élégant, lunettes ambrées et bijoux dorés"
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Notre histoire
          </h2>
          <p className="mt-4 text-text-muted">
            Cette marque est née d'une passion pour la mode, mais aussi d'une
            vision : celle de construire quelque chose qui nous ressemble.
          </p>
          <p className="mt-4 text-text-muted">
            Nous croyons que s'habiller ne consiste pas simplement à porter
            un vêtement. C'est une manière d'exprimer sa personnalité, son
            ambition et la façon dont on veut être perçu. C'est pourquoi nous
            recherchons des pièces qui associent style, élégance et
            caractère.
          </p>
          <p className="mt-4 text-text-muted">
            Notre univers est inspiré par ce que nous aimons : la mode, le
            goût du détail, l'élégance et cette volonté constante de viser
            plus haut. Chaque pièce proposée s'inscrit dans cette vision :
            permettre à chacun de construire un style qui lui ressemble et
            dans lequel il peut avancer avec confiance.
          </p>
          <p className="mt-4 text-text-muted">
            Plus qu'une boutique, nous voulons construire une marque avec une
            identité forte, une relation de proximité avec nos clients et
            une ambition qui va au-delà du simple fait de vendre des
            vêtements.
          </p>
          <p className="mt-8 font-display text-xl leading-snug font-black tracking-tight text-text sm:text-2xl">
            Bien s'habiller. <span className="text-accent">Affirmer son style.</span> Viser
            plus haut.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
