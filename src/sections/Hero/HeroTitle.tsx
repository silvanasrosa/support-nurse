import { motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { CtaButton } from '@/components/ui/CtaButton'
import { useIntro } from '@/components/layout/intro'
import { hero } from '@/content/hero'

const ease = [0.16, 1, 0.3, 1] as const

const SymbolOrb = lazy(() => import('@/components/three/SymbolOrb'))

function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Orbe 3D que substitui o primeiro "o" do titulo (assinatura da referencia): esfera com o simbolo da marca embutido. */
function Orb() {
  const reduce = !!useReducedMotion()
  const [webgl] = useState(canUseWebGL)
  // Com a abertura, o orbe chega voando do preloader: aqui ele so aparece quando o voo termina
  const intro = useIntro()
  const fromIntro = intro.played
  const sphere = (
    <span
      className="block size-full rounded-full"
      style={{ background: 'radial-gradient(circle at 30% 24%, #9fb4f0 0%, #4a64b8 28%, #2a3470 62%, #181d44 100%)' }}
    />
  )
  return (
    <motion.span
      aria-hidden
      data-intro-orb
      className="relative mx-[0.02em] inline-block size-[0.7em] -translate-y-[0.02em] align-middle"
      style={{
        filter: 'drop-shadow(0 0.06em 0.12em rgba(36,43,85,0.4))',
        opacity: fromIntro && intro.phase !== 'done' ? 0 : 1,
      }}
      initial={fromIntro ? false : { scale: 0, rotate: -90 }}
      animate={reduce ? { scale: 1 } : { scale: 1, rotate: 0, y: [0, -3, 0] }}
      transition={{
        scale: { type: 'spring', stiffness: 200, damping: 14, delay: 0.7 },
        rotate: { duration: 1, ease, delay: 0.7 },
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: fromIntro ? 1.2 : 1.6 },
      }}
    >
      {webgl ? (
        <Suspense fallback={sphere}>
          <SymbolOrb reduce={reduce} />
        </Suspense>
      ) : (
        sphere
      )}
    </motion.span>
  )
}

function Line({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '112%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function HeroTitle() {
  const i = hero.title.indexOf('o')
  const before = hero.title.slice(0, i)
  const after = hero.title.slice(i + 1)

  return (
    <div className="px-5 pt-8 sm:px-8 md:col-span-2 md:col-start-1 md:row-start-2 md:self-center md:px-8 md:pt-0 lg:px-10 xl:px-14">
      <h1
        aria-label={`${hero.title} ${hero.titleAccent}`}
        className="relative z-20 text-[clamp(3.1rem,15.5vw,5.6rem)] leading-[0.94] tracking-[-0.025em] text-navy sm:text-[clamp(4rem,13vw,6.5rem)] md:text-[clamp(3.1rem,min(7.4vw,17svh),9.4rem)]"
      >
        <Line delay={0.25}>
          {before}
          <Orb />
          {after}
        </Line>
        {/* O tamanho e a altura de linha ficam no bloco (nao no <em>) para a linha nao herdar a altura do titulo principal */}
        <Line delay={0.38} className="-mt-[0.1em] text-[0.6em] leading-[1.1]">
          <em className="text-bronze">{hero.titleAccent}</em>
        </Line>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.75 }}
        className="relative z-20 mt-5 max-w-[24rem] text-[1.2rem] leading-snug font-medium text-navy sm:text-[1.35rem] md:mt-6 md:max-w-[16.5rem] lg:max-w-[19rem] md:text-[clamp(1.05rem,1.65vw,1.6rem)] xl:max-w-[26rem]"
      >
        {hero.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.9 }}
        className="relative z-20 mt-7 md:mt-6 lg:mt-8"
      >
        <CtaButton href={hero.cta.href}>{hero.cta.label}</CtaButton>
      </motion.div>
    </div>
  )
}
