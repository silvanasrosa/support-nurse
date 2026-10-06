import { animate, motion, useMotionValue } from 'motion/react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { layoutRect, type IntroPhase } from './intro'

const SymbolOrb = lazy(() => import('@/components/three/SymbolOrb'))

/**
 * Tracado do eletrocardiograma em coordenadas normalizadas:
 * u = 0..100 (horizontal), v = -1..1 (vertical, negativo = para cima).
 * Linha reta, onda P, dois batimentos (pico R e queda S), ondas T e volta a linha de base.
 */
const ECG: Array<[string, ...number[]]> = [
  ['M', 0, 0],
  ['L', 18, 0],
  ['C', 20.5, 0, 21.5, -0.05, 22.6, -0.16],
  ['L', 24.6, 0.14],
  ['L', 28, -1],
  ['L', 31.2, 0.86],
  ['C', 32.4, 0.22, 33.2, 0.02, 35.4, 0.02],
  ['C', 36.8, 0.02, 37.8, -0.04, 39, -0.17],
  ['C', 40.8, 0.06, 43.4, 0.06, 45.4, -0.17],
  ['L', 47.4, 0.04],
  ['L', 50.6, -1.04],
  ['L', 53.2, 0.96],
  ['C', 54.2, 0.3, 54.8, -0.15, 56, -0.15],
  ['C', 57.6, 0.02, 59.2, 0.02, 60.6, -0.15],
  ['C', 63.4, 0.02, 70, 0.02, 100, 0],
]

// Duracao total ~4s: 0.2s de espera + tracado + voo
const DRAW = 2.75 // s: tempo do tracado ate o orbe chegar a 70% da tela
const FLIGHT = 0.95 // s: voo do orbe ate o titulo

type Props = {
  phase: IntroPhase
  onReveal: () => void
  onDone: () => void
}

export function PreloaderEcg({ phase, onReveal, onDone }: Props) {
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const [vw, setVw] = useState(() => window.innerWidth)
  const [vh, setVh] = useState(() => window.innerHeight)
  const [lineOut, setLineOut] = useState(false)
  const [fading, setFading] = useState(false)

  const x = useMotionValue(-200)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const S = Math.round(Math.min(96, Math.max(52, vw * 0.07))) // tamanho do orbe no preloader

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Tracado em pixels: comeca fora da tela (esquerda) e termina em 70% da largura
  const d = useMemo(() => {
    const x0 = -0.12 * vw
    const x1 = 0.7 * vw
    const cy = vh * 0.5
    const amp = Math.min(vh * 0.2, 190)
    const px = (u: number) => (x0 + (u / 100) * (x1 - x0)).toFixed(1)
    const py = (v: number) => (cy + v * amp).toFixed(1)
    return ECG.map(([cmd, ...n]) => {
      const pts: string[] = []
      for (let i = 0; i < n.length; i += 2) pts.push(`${px(n[i])} ${py(n[i + 1])}`)
      return `${cmd} ${pts.join(' ')}`
    }).join(' ')
  }, [vw, vh])

  // 1) Tracado: o orbe "puxa" a linha da esquerda ate 70% da tela
  useEffect(() => {
    const path = pathRef.current
    const glow = glowRef.current
    if (!path || !glow) return
    const len = path.getTotalLength()
    for (const p of [path, glow]) {
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
    }
    const controls = animate(0, 1, {
      duration: DRAW,
      delay: 0.2,
      ease: [0.42, 0, 0.25, 1],
      onUpdate: (t) => {
        const pt = path.getPointAtLength(t * len)
        x.set(pt.x - S / 2)
        y.set(pt.y - S / 2)
        const off = `${len * (1 - t)}`
        path.style.strokeDashoffset = off
        glow.style.strokeDashoffset = off
      },
      onComplete: () => {
        setLineOut(true) // apaga o eletro
        window.setTimeout(onReveal, 120) // monta a hero e inicia o voo
      },
    })
    return () => controls.stop()
    // o tracado roda uma vez so
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Voo: o orbe encolhe e pousa no "o" do titulo
  useEffect(() => {
    if (phase !== 'reveal') return
    let raf = 0
    let stops: Array<() => void> = []
    const fly = () => {
      const target = document.querySelector<HTMLElement>('[data-intro-orb]')
      if (!target) {
        raf = requestAnimationFrame(fly)
        return
      }
      const r = layoutRect(target)
      const k = r.w / S
      const ease = [0.65, 0, 0.2, 1] as const
      setFading(true)
      stops = [
        animate(x, r.x + r.w / 2 - S / 2, { duration: FLIGHT, ease }).stop,
        animate(y, r.y + r.h / 2 - S / 2, { duration: FLIGHT, ease }).stop,
        animate(scale, k, { duration: FLIGHT, ease, onComplete: onDone }).stop,
      ]
    }
    raf = requestAnimationFrame(fly)
    return () => {
      cancelAnimationFrame(raf)
      stops.forEach((s) => s())
    }
  }, [phase, S, x, y, scale, onDone])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" role="status" aria-label="Carregando Support Nurse">
      {/* Fundo claro, igual ao da hero: o orbe pousa no titulo sem troca de cor */}
      <motion.div
        className="absolute inset-0 bg-[#f3f5fb]"
        initial={{ opacity: 1 }}
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FLIGHT * 0.85, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="absolute -top-24 left-[8%] size-[26rem] rounded-full bg-brand-blue/15 blur-3xl" />
        <div className="absolute right-[10%] bottom-[-6rem] size-[24rem] rounded-full bg-gold/20 blur-3xl" />
      </motion.div>

      {/* Eletrocardiograma: linha azul-marinho com brilho dourado */}
      <motion.svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 ${vw} ${vh}`}
        animate={{ opacity: lineOut ? 0 : 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        aria-hidden
      >
        <defs>
          <filter id="ecg-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <linearGradient id="ecg-fade" x1="0" x2={vw * 0.7} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#242b55" stopOpacity="0" />
            <stop offset="0.25" stopColor="#242b55" stopOpacity="0.85" />
            <stop offset="1" stopColor="#242b55" />
          </linearGradient>
        </defs>
        <path ref={glowRef} d={d} fill="none" stroke="#ecab5b" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" filter="url(#ecg-glow)" />
        <path ref={pathRef} d={d} fill="none" stroke="url(#ecg-fade)" strokeWidth={vw < 640 ? 3 : 4} strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>

      {/* Orbe: o mesmo do titulo, na ponta do tracado */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x, y, scale, width: S, height: S, transformOrigin: 'center', filter: 'drop-shadow(0 10px 24px rgba(36,43,85,0.35))' }}
        aria-hidden
      >
        {/* Esfera em CSS por baixo: aparece enquanto o 3D carrega e fica coberta por ele depois */}
        <span
          className="absolute inset-[3%] rounded-full"
          style={{ background: 'radial-gradient(circle at 30% 24%, #9fb4f0 0%, #4a64b8 28%, #2a3470 62%, #181d44 100%)' }}
        />
        <Suspense fallback={null}>
          <SymbolOrb />
        </Suspense>
      </motion.div>
    </div>
  )
}

