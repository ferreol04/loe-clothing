import { Seo } from '../components/Seo'
import { Hero } from '../components/home/Hero'
import { FeaturedCollections } from '../components/home/FeaturedCollections'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { OurStory } from '../components/home/OurStory'
import { Testimonials } from '../components/home/Testimonials'
import { CtaWhatsapp } from '../components/home/CtaWhatsapp'

export function Home() {
  return (
    <>
      <Seo
        title="Accueil"
        description="Une sélection soignée de vêtements, chaussures et accessoires. Découvrez nos collections et commandez directement via WhatsApp."
      />
      <Hero />
      <FeaturedCollections />
      <WhyChooseUs />
      <OurStory />
      <Testimonials />
      <CtaWhatsapp />
    </>
  )
}
