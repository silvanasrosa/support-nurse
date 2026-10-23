import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { IntroContext, shouldPlayIntro, type IntroPhase } from '@/components/layout/intro'
import { Preloader } from '@/components/layout/Preloader'

// O download das secoes comeca ja, junto com o preloader (nao espera a abertura terminar)
const sections = import('./HomeSections')
const HomeSections = lazy(() => sections)
const SmoothScroll = lazy(() => sections.then((m) => ({ default: m.SmoothScroll })))

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

  return (
    <IntroContext.Provider value={intro}>
      <Suspense fallback={null}>
        <SmoothScroll />
      </Suspense>
      {phase !== 'done' && <Preloader phase={phase} onReveal={onReveal} onDone={onDone} />}
      {phase !== 'intro' && (
        <Suspense fallback={<main />}>
          <HomeSections />
        </Suspense>
      )}
    </IntroContext.Provider>
  )
}
