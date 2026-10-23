import { motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { FloatingPill } from '@/components/ui/FloatingPill'
import { hero } from '@/content/hero'
import { canUseWebGL } from '@/lib/webgl'

const SymbolScene = lazy(() => import('@/components/three/SymbolScene'))

const ease = [0.16, 1, 0.3, 1] as const

function Symbol3D() {
  const reduce = !!useReducedMotion()
  const [ok] = useState(canUseWebGL)

  const fallback = (
    <img src="/logos/simbolo-prata.webp" alt="" className="mx-auto h-[70%] w-auto self-center object-contain" />
  )

  return (
    <div className="absolute inset-0 grid">
      {ok ? <Suspense fallback={fallback}><SymbolScene reduce={reduce} /></Suspense> : fallback}
    </div>
  )
}

/** Palco central: sobrepoe a divisoria entre fundo claro e painel escuro. Recebe foto recortada ou o simbolo 3D. */
export function HeroStage() {
  return (
    <div className="relative z-10 mx-2 min-h-[22rem] overflow-hidden rounded-b-[28px] bg-navy max-md:order-4 sm:mx-3 sm:min-h-[30rem] md:col-start-2 md:row-span-3 md:row-start-1 md:m-0 md:mt-[5%] md:min-h-0 md:overflow-visible md:rounded-none md:bg-transparent">
      {/* Fundo do painel no mobile */}
      <div className="absolute inset-0 bg-[image:var(--pattern-ondas)] bg-[length:100px] bg-[position:left_top] md:hidden" />

      {/* Halo e aneis */}
      <motion.div
        aria-hidden
        className="absolute inset-x-[-8%] bottom-0 top-[4%] rounded-t-full md:inset-x-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 42%, rgba(255,255,255,0.55), rgba(19,112,181,0.28) 55%, transparent 75%)',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease, delay: 0.3 }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        {[0.62, 0.84].map((s, i) => (
          <motion.span
            key={s}
            className="absolute aspect-square w-[78%] rounded-full border border-white/30"
            style={{ scale: s }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
          />
        ))}
      </div>

      {/* Foto recortada OU simbolo 3D */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease, delay: 0.45 }}
      >
        {hero.portrait ? (
          <img
            src={hero.portrait}
            srcSet={hero.portraitSrcSet}
            sizes="(min-width: 768px) 46vw, 80vw"
            width={1086}
            height={1448}
            alt="Enfermeira da Support Nurse sorrindo, de braços cruzados"
            fetchPriority="high"
            className="absolute bottom-0 left-1/2 h-[96%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_30px_40px_rgba(15,19,48,0.35)] md:h-auto md:max-h-[97%] md:w-[46vw]"
          />
        ) : (
          <Symbol3D />
        )}
      </motion.div>

      {hero.pills.map((p, i) => (
        <FloatingPill key={p.label} {...p} delay={i * 0.18} />
      ))}
    </div>
  )
}
