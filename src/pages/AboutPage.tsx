import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { useHashLanding } from '@/hooks/useHashLanding'
import { About } from '@/sections/About/About'
import { AboutHero } from '@/sections/AboutHero/AboutHero'
import { FinalCta } from '@/sections/FinalCta/FinalCta'
import { Founder } from '@/sections/Founder/Founder'
import { Team } from '@/sections/Team/Team'

/**
 * Pagina "Quem somos" (/quem-somos/): abertura com a recepcao e os numeros, transparencia (dados + mapa),
 * a fundadora, a equipe e a chamada final (#contato). Reaproveita as secoes da pagina inicial: e so reordenar
 * ou tirar aqui.
 */
export default function AboutPage() {
  useHashLanding(true)
  return (
    <>
      <SmoothScroll />
      <main>
        <AboutHero />
        <div className="py-2 sm:py-3">
          <About />
        </div>
        <Founder />
        <Team />
        <div className="pt-2 sm:pt-3">
          <FinalCta />
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
