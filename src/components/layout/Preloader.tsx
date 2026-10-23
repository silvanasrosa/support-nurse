import { animate, motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { OrbStatic } from '@/components/ui/OrbStatic'
import { layoutRect, type IntroPhase } from './intro'

/*
 * Abertura (~4,5s):
 * 1. Um batimento cardiaco (linha grossa) entra pela esquerda, puxado pelo orbe da marca, ate o centro da tela.
 * 2. No centro o orbe se expande e cobre a tela de azul (como se entrassemos no vidro do orbe).
 * 3. O logo branco aparece por um instante.
 * 4. O azul colapsa em circulo ate o "o" do titulo, revelando a hero, e vira o orbe do titulo.
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

const DRAW = 2.2 // s: batimento ate o centro
const EXPAND = 0.7 // s: orbe cobre a tela
const HOLD = 0.6 // s: tela azul com o logo
const COLLAPSE = 0.9 // s: azul encolhe ate o titulo
const ORB_ONLY = 0.35 // s: no celular, tempo do orbe parado no centro antes de abrir

// Azul "vidro do orbe": navy com brilho suave
const ORB_FILL =
  'radial-gradient(120% 90% at 32% 26%, #4b5fae 0%, #2f3b80 28%, #242b55 55%, #181d44 80%, #121633 100%)'

type Props = {
  phase: IntroPhase
  onReveal: () => void
  onDone: () => void
}

export function Preloader({ phase, onReveal, onDone }: Props) {
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const [vw, setVw] = useState(() => window.innerWidth)
  const [vh, setVh] = useState(() => window.innerHeight)
  const [stage, setStage] = useState<'draw' | 'expand' | 'hold' | 'collapse'>('draw')

  const [noDraw] = useState(() => window.innerWidth < 768) // celular: sem o batimento
  const S = Math.round(Math.min(96, Math.max(54, vw * 0.07))) // orbe na ponta da linha
  const cx = vw / 2
  const cy = vh / 2
  const R = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) + 24 // raio que cobre a tela

  const x = useMotionValue(-200)
  const y = useMotionValue(cy - S / 2)
  const orbOpacity = useMotionValue(1)

  // Circulo azul (clip-path animado)
  const circR = useMotionValue(S / 2)
  const circX = useMotionValue(cx)
  const circY = useMotionValue(cy)
  const circOpacity = useMotionValue(0)
  const clip = useMotionTemplate`circle(${circR}px at ${circX}px ${circY}px)`

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Tracado: comeca fora da tela (esquerda) e termina no centro
  const d = useMemo(() => {
    const x0 = -0.14 * vw
    const x1 = 0.5 * vw
    const amp = Math.min(vh * 0.2, 180)
    const px = (u: number) => (x0 + (u / 100) * (x1 - x0)).toFixed(1)
    const py = (v: number) => (cy + v * amp).toFixed(1)
    return ECG.map(([cmd, ...n]) => {
      const pts: string[] = []
      for (let i = 0; i < n.length; i += 2) pts.push(`${px(n[i])} ${py(n[i + 1])}`)
      return `${cmd} ${pts.join(' ')}`
    }).join(' ')
  }, [vw, vh, cy])

  // 1) Batimento + 2) expansao + 3) logo
  // useLayoutEffect: o tracejado e escondido ANTES da primeira pintura (senao a linha completa pisca por um instante)
  useLayoutEffect(() => {
    const path = pathRef.current
    const glow = glowRef.current
    if (!path || !glow) return
    const len = path.getTotalLength()
    for (const p of [path, glow]) {
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
    }
    let stops: Array<() => void> = []
    let timer = 0
    // o orbe chega ao centro e se expande ate cobrir a tela
    const expand = () => {
      setStage('expand')
      circR.set(S / 2)
      circOpacity.set(1)
      const ease = [0.76, 0, 0.24, 1] as const
      stops = [
        animate(circR, R, { duration: EXPAND, ease }).stop,
        animate(orbOpacity, 0, { duration: EXPAND * 0.45, ease: 'easeOut' }).stop,
      ]
      timer = window.setTimeout(() => {
        setStage('hold')
        timer = window.setTimeout(onReveal, HOLD * 1000) // monta a hero e inicia o colapso
      }, EXPAND * 1000)
    }

    // Celular: sem o batimento (abertura mais curta, a primeira tela aparece antes). O orbe ja nasce no centro.
    if (noDraw) {
      x.set(cx - S / 2)
      y.set(cy - S / 2)
      timer = window.setTimeout(expand, ORB_ONLY * 1000)
      return () => {
        stops.forEach((s) => s())
        window.clearTimeout(timer)
      }
    }

    const draw = animate(0, 1, {
      duration: DRAW,
      delay: 0.2,
      ease: [0.42, 0, 0.3, 1],
      onUpdate: (t) => {
        const pt = path.getPointAtLength(t * len)
        x.set(pt.x - S / 2)
        y.set(pt.y - S / 2)
        const off = `${len * (1 - t)}`
        path.style.strokeDashoffset = off
        glow.style.strokeDashoffset = off
      },
      onComplete: expand,
    })
    return () => {
      draw.stop()
      stops.forEach((s) => s())
      window.clearTimeout(timer)
    }
    // a abertura roda uma vez so, com as medidas do inicio
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 4) Colapso: o azul encolhe em circulo ate o orbe do titulo
  useEffect(() => {
    if (phase !== 'reveal') return
    let raf = 0
    let stops: Array<() => void> = []
    const run = () => {
      const target = document.querySelector<HTMLElement>('[data-intro-orb]')
      if (!target) {
        raf = requestAnimationFrame(run)
        return
      }
      const r = layoutRect(target)
      const ease = [0.83, 0, 0.17, 1] as const
      setStage('collapse')
      stops = [
        animate(circR, r.w / 2, { duration: COLLAPSE, ease }).stop,
        animate(circX, r.x + r.w / 2, { duration: COLLAPSE, ease }).stop,
        animate(circY, r.y + r.h / 2, { duration: COLLAPSE, ease, onComplete: onDone }).stop,
        animate(circOpacity, 0, { duration: 0.18, delay: COLLAPSE - 0.12 }).stop,
      ]
    }
    raf = requestAnimationFrame(run)
    return () => {
      cancelAnimationFrame(raf)
      stops.forEach((s) => s())
    }
  }, [phase, circR, circX, circY, circOpacity, onDone])

  const lightVisible = stage === 'draw' || stage === 'expand'
  const thick = vw < 640 ? 4 : 6

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" role="status" aria-label="Carregando Support Nurse">
      {/* Camada clara: fundo, batimento e orbe (some quando o azul cobre a tela) */}
      <div className="absolute inset-0" style={{ visibility: lightVisible ? 'visible' : 'hidden' }}>
        <div className="absolute inset-0 bg-[#f3f5fb]">
          <div className="absolute -top-24 left-[8%] size-[26rem] rounded-full bg-brand-blue/15 blur-3xl" />
          <div className="absolute right-[10%] bottom-[-6rem] size-[24rem] rounded-full bg-gold/20 blur-3xl" />
        </div>

        <motion.svg
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${vw} ${vh}`}
          initial={noDraw ? { opacity: 0 } : undefined}
          animate={{ opacity: stage === 'draw' && !noDraw ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          aria-hidden
        >
          <defs>
            <filter id="ecg-glow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <linearGradient id="ecg-fade" x1="0" x2={vw * 0.5} y1="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#242b55" stopOpacity="0" />
              <stop offset="0.3" stopColor="#242b55" stopOpacity="0.9" />
              <stop offset="1" stopColor="#242b55" />
            </linearGradient>
          </defs>
          <path ref={glowRef} d={d} fill="none" stroke="#ecab5b" strokeOpacity="0.5" strokeWidth={thick * 2.6} strokeLinecap="round" strokeLinejoin="round" filter="url(#ecg-glow)" />
          <path ref={pathRef} d={d} fill="none" stroke="url(#ecg-fade)" strokeWidth={thick} strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        <motion.div
          className="absolute top-0 left-0"
          style={{ x, y, opacity: orbOpacity, width: S, height: S, filter: 'drop-shadow(0 10px 24px rgba(36,43,85,0.35))' }}
          aria-hidden
        >
          <span className="absolute inset-[3%]">
            <OrbStatic background={ORB_FILL} />
          </span>
        </motion.div>
      </div>

      {/* Circulo azul: nasce do orbe, cobre a tela e colapsa no titulo */}
      <motion.div className="absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip, opacity: circOpacity, background: ORB_FILL }} aria-hidden>
        <div className="absolute inset-0 bg-[image:var(--pattern-ondas)] bg-[length:120px] opacity-15 mix-blend-soft-light" />
        <div className="absolute inset-0 grid place-items-center">
          <motion.img
            src="/logos/horizontal-branco.svg"
            alt=""
            className="h-auto"
            style={{ width: 'min(360px, 62vw)' }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={stage === 'hold' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: stage === 'collapse' ? 0.9 : 0.94 }}
            transition={{ duration: stage === 'hold' ? 0.4 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>
    </div>
  )
}
