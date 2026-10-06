import { useCallback, useEffect, useMemo, useState } from 'react'
import { IntroContext, shouldPlayIntro, type IntroPhase } from '@/components/layout/intro'
import { Footer } from '@/components/layout/Footer'
import { Preloader } from '@/components/layout/Preloader'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
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

export default function App() {
  const [played] = useState(shouldPlayIntro)
  const [phase, setPhase] = useState<IntroPhase>(played ? 'intro' : 'done')

  const onReveal = useCallback(() => setPhase('reveal'), [])
  const onDone = useCallback(() => setPhase('done'), [])

  // Trava a rolagem durante a abertura
  useEffect(() => {
    document.documentElement.style.overflow = phase === 'done' ? '' : 'hidden'
  }, [phase])

  const intro = useMemo(() => ({ phase, played }), [phase, played])

  // chegou com ancora (ex.: menu da pagina Quem somos): vai para a secao quando as secoes estiverem montadas
  useHashLanding(phase !== 'intro')

  return (
    <IntroContext.Provider value={intro}>
      <SmoothScroll />
      {phase !== 'done' && <Preloader phase={phase} onReveal={onReveal} onDone={onDone} />}
      <main>
        {phase !== 'intro' && (
          <>
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
          </>
        )}
      </main>
      {phase !== 'intro' && (
        <>
          <Footer />
          <WhatsAppFab />
        </>
      )}
    </IntroContext.Provider>
  )
}
