import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { useHashLanding } from '@/hooks/useHashLanding'
import { AreasFaq, AreasHero, AreasList, AreasSame } from '@/sections/Areas/Areas'
import { FinalCta } from '@/sections/FinalCta/FinalCta'

/** Pagina "Areas atendidas" (/areas-atendidas/): capital e Grande SP, o que se mantem fora da capital, perguntas e contato. */
export default function AreasPage() {
  useHashLanding(true)
  return (
    <>
      <SmoothScroll />
      <main>
        <AreasHero />
        <AreasList />
        <AreasSame />
        <AreasFaq />
        <div className="pt-2 sm:pt-3">
          <FinalCta />
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
