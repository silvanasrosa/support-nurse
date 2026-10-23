import { Footer } from '@/components/layout/Footer'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { useHashLanding } from '@/hooks/useHashLanding'
import { Hero } from '@/sections/Hero/Hero'
import { Benefits } from '@/sections/Benefits/Benefits'
import { Catalog } from '@/sections/Catalog/Catalog'
import { Faq } from '@/sections/Faq/Faq'
import { FinalCta } from '@/sections/FinalCta/FinalCta'
import { Founder } from '@/sections/Founder/Founder'
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks'
import { Results } from '@/sections/Results/Results'
import { Team } from '@/sections/Team/Team'
import { Specialties } from '@/sections/Specialties/Specialties'

export { SmoothScroll } from '@/components/layout/SmoothScroll'

/**
 * Secoes da pagina inicial. Ficam num pacote separado (com GSAP, Lenis etc.), baixado em paralelo
 * enquanto a abertura roda: o preloader aparece sem esperar por esse codigo.
 */
export default function HomeSections() {
  // chegou com ancora (ex.: menu da pagina Quem somos): vai para a secao quando as secoes estiverem montadas
  useHashLanding(true)

  return (
    <>
      <main>
        <Hero />
        <Specialties />
        <Catalog />
        <HowItWorks />
        <Founder />
        <Team />
        <Benefits />
        <Results />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
