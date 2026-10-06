import { animate, motion, useMotionValue } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { layoutRect, type IntroPhase } from './intro'

const SymbolOrb = lazy(() => import('@/components/three/SymbolOrb'))

/*
 * Abertura (~6s): uma enfermeira empurra uma senhora na cadeira de rodas da esquerda ate o centro da tela.
 * Ilustracao vetorial "flat" (formas cheias, sem contorno), nas cores da marca.
 * A enfermeira caminha, as rodas giram conforme a distancia, a senhora mexe a cabeca de leve
 * e o cubo da roda grande e o orbe da marca, que no fim voa ate o "o" do titulo.
 */

// Area do desenho (coordenadas do SVG)
const OX = 110
const OY = 48
const VB_W = 400
const VB_H = 547

const WHEEL = { cx: 280, cy: 482, roll: 98 } // roda grande: centro e raio de rolamento
const CASTER = { cx: 438, cy: 562, roll: 18 }
const HIP = { x: 190, y: 335 } // quadril da enfermeira
const THIGH = 118 // quadril -> joelho
const SHIN_FOOT = 127 // joelho -> sola do sapato
const GROUND = 580
const SHOULDER = { x: 207, y: 152 }
const HAND = { x: 240, y: 287 } // mao presa na manopla
const NECK_LADY = { x: 320, y: 252 } // pivo da cabeca da senhora
const STRIDE = 240 // distancia (unidades do desenho) por ciclo de passada (2 passos)
const GROUP_CENTER = 318 // centro horizontal do grupo

const START = 0.35 // s
const WALK = 4.3 // s
const PAUSE = 0.35 // s
const FLIGHT = 1.0 // s  (total ~6s)

// Paleta (marca)
const C = {
  navy: '#242b55',
  navyDeep: '#151a3a',
  navySoft: '#3a4590',
  navySoftHi: '#4a57a6',
  blue: '#1370b5',
  blueDark: '#0e5a93',
  gold: '#ecab5b',
  goldDark: '#d8913a',
  bronze: '#935f37',
  skin: '#f2c9a8',
  skinShade: '#e2ad88',
  scrub: '#cfe0f2',
  scrubShade: '#b5cbe6',
  scrubPants: '#dbe8f5',
  scrubPantsBack: '#c2d6ec',
  hair: '#f4f5f9',
  hairShade: '#dde1ea',
}

type Props = {
  phase: IntroPhase
  onReveal: () => void
  onDone: () => void
}

/** Perna da enfermeira (coxa, canela e sapato), formas cheias; gira no quadril e no joelho. */
function Leg({ thighRef, kneeRef, back = false }: { thighRef: React.Ref<SVGGElement>; kneeRef: React.Ref<SVGGElement>; back?: boolean }) {
  const pants = back ? C.scrubPantsBack : C.scrubPants
  return (
    <g ref={thighRef} transform={`translate(${HIP.x} ${HIP.y})`}>
      <path d="M-18 -6 C-18 -14 18 -14 18 -6 L13 114 C13 123 -13 123 -13 114 Z" fill={pants} />
      <g ref={kneeRef} transform={`translate(0 ${THIGH})`}>
        <path d="M-13 -4 C-13 -10 13 -10 13 -4 L10 108 C10 114 -10 114 -10 108 Z" fill={pants} />
        <rect x="-7" y="107" width="14" height="10" rx="4" fill={back ? C.skinShade : C.skin} />
        <path d="M-9 113 C-11 122 -7 127 1 127 L25 127 C30 127 30 120 21 118 C12 116 7 114 3 111 Z" fill={back ? C.navyDeep : C.navy} />
      </g>
    </g>
  )
}

export function PreloaderWheelchair({ phase, onReveal, onDone }: Props) {
  const [vw, setVw] = useState(() => window.innerWidth)
  const [vh, setVh] = useState(() => window.innerHeight)
  const [fading, setFading] = useState(false)

  // Tamanho da cena: limitado pela altura (desktop) e pela largura (celular)
  const W = Math.round(Math.min(vw * 0.86, (vh * 0.62 * VB_W) / VB_H, 520))
  const H = Math.round((W * VB_H) / VB_W)
  const k = W / VB_W
  const top = Math.round(vh / 2 - H / 2)
  const startX = -W * 1.05
  const endX = vw / 2 - (GROUP_CENTER - OX) * k
  const orbS = Math.round(34 * k) // diametro do orbe no cubo da roda
  const hubX = (WHEEL.cx - OX) * k
  const hubY = top + (WHEEL.cy - OY) * k

  const sceneX = useMotionValue(startX)
  const orbX = useMotionValue(startX + hubX - orbS / 2)
  const orbY = useMotionValue(hubY - orbS / 2)
  const orbRot = useMotionValue(0)
  const orbScale = useMotionValue(1)
  const groundScale = useMotionValue(0)

  const nurseRef = useRef<SVGGElement>(null)
  const nurseHeadRef = useRef<SVGGElement>(null)
  const upperArmRef = useRef<SVGPathElement>(null)
  const foreArmRef = useRef<SVGPathElement>(null)
  const backArmRef = useRef<SVGPathElement>(null)
  const legARef = useRef<SVGGElement>(null)
  const kneeARef = useRef<SVGGElement>(null)
  const legBRef = useRef<SVGGElement>(null)
  const kneeBRef = useRef<SVGGElement>(null)
  const wheelRef = useRef<SVGGElement>(null)
  const casterRef = useRef<SVGGElement>(null)
  const ladyRef = useRef<SVGGElement>(null)
  const ladyHeadRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Cabeca da senhora: balanco leve e continuo (olha em volta), mesmo parada
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      const t = (now - t0) / 1000
      const angle = 3.2 * Math.sin(t * 1.15) + 1.4 * Math.sin(t * 2.7 + 1)
      const nod = 1.2 * Math.sin(t * 1.9)
      ladyHeadRef.current?.setAttribute('transform', `rotate(${angle} ${NECK_LADY.x} ${NECK_LADY.y}) translate(0 ${nod * 0.6})`)
      nurseHeadRef.current?.setAttribute('transform', `rotate(${1.2 * Math.sin(t * 0.9 + 2)} 202 120)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // 1) Caminhada: da esquerda (fora da tela) ate o centro
  useEffect(() => {
    let last = performance.now()
    let lastP = 0
    let amp = 0
    const pose = (dist: number, a: number) => {
      const phi = (dist / STRIDE) * Math.PI * 2
      const s = Math.sin(phi)
      const c = Math.cos(phi)
      // pernas alternadas (negativo = para frente) e joelho dobrando na fase de balanco
      const thA = -17 * s * a
      const thB = 17 * s * a
      const knA = (3 + 26 * Math.max(0, c)) * a
      const knB = (3 + 26 * Math.max(0, -c)) * a
      legARef.current?.setAttribute('transform', `translate(${HIP.x} ${HIP.y}) rotate(${thA})`)
      legBRef.current?.setAttribute('transform', `translate(${HIP.x} ${HIP.y}) rotate(${thB})`)
      kneeARef.current?.setAttribute('transform', `translate(0 ${THIGH}) rotate(${knA})`)
      kneeBRef.current?.setAttribute('transform', `translate(0 ${THIGH}) rotate(${knB})`)
      // o pe mais baixo (perna de apoio) sempre encosta no chao: o corpo desce o quanto for preciso
      const rad = Math.PI / 180
      const foot = (th: number, kn: number) => HIP.y + THIGH * Math.cos(th * rad) + SHIN_FOOT * Math.cos((th + kn) * rad)
      const dy = GROUND - Math.max(foot(thA, knA), foot(thB, knB))
      nurseRef.current?.setAttribute('transform', `translate(0 ${dy})`)
      // braco: ombro acompanha o corpo, mao fica presa na manopla
      const sy = SHOULDER.y + dy
      const ex = (SHOULDER.x + HAND.x) / 2 + 4
      const ey = (sy + HAND.y) / 2 + 6
      upperArmRef.current?.setAttribute('d', `M${SHOULDER.x} ${sy} L${ex} ${ey}`)
      foreArmRef.current?.setAttribute('d', `M${ex} ${ey} L${HAND.x} ${HAND.y}`)
      backArmRef.current?.setAttribute('d', `M${SHOULDER.x - 18} ${sy + 46} L${HAND.x - 8} ${HAND.y - 3}`)
      ladyRef.current?.setAttribute('transform', `translate(0 ${-0.8 * Math.abs(Math.sin(phi * 0.5)) * a})`)
      // rodas: giram conforme a distancia (rolamento sem deslizar)
      const wheelDeg = (dist / (2 * Math.PI * WHEEL.roll)) * 360
      wheelRef.current?.setAttribute('transform', `rotate(${wheelDeg} ${WHEEL.cx} ${WHEEL.cy})`)
      casterRef.current?.setAttribute('transform', `rotate(${(dist / (2 * Math.PI * CASTER.roll)) * 360} ${CASTER.cx} ${CASTER.cy})`)
      return wheelDeg
    }
    pose(0, 0)
    const ground = animate(groundScale, 1, { duration: 1.2, delay: 0.1, ease: [0.65, 0, 0.35, 1] })
    const walk = animate(0, 1, {
      duration: WALK,
      delay: START,
      ease: [0.3, 0.05, 0.28, 1],
      onUpdate: (p) => {
        const now = performance.now()
        const dt = Math.max((now - last) / 1000, 1e-3)
        const speed = (p - lastP) / dt / (1 / WALK) // 1 = velocidade media
        last = now
        lastP = p
        amp += (Math.min(1, speed * 0.9) - amp) * 0.25 // a passada some suavemente ao frear
        const xPx = startX + (endX - startX) * p
        sceneX.set(xPx)
        const deg = pose((xPx - startX) / k, amp)
        orbX.set(xPx + hubX - orbS / 2)
        orbRot.set(deg)
      },
      onComplete: () => {
        const settle = animate(amp, 0, { duration: 0.3, onUpdate: (a) => pose((endX - startX) / k, a) })
        window.setTimeout(() => {
          settle.stop()
          onReveal()
        }, PAUSE * 1000)
      },
    })
    return () => {
      ground.stop()
      walk.stop()
    }
    // a caminhada roda uma vez so, com as medidas do inicio
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Voo: o orbe sai do cubo da roda e pousa no "o" do titulo
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
      const ease = [0.65, 0, 0.2, 1] as const
      const upright = Math.round(orbRot.get() / 360) * 360 // termina com o simbolo em pe
      setFading(true)
      stops = [
        animate(orbX, r.x + r.w / 2 - orbS / 2, { duration: FLIGHT, ease }).stop,
        animate(orbY, [orbY.get(), orbY.get() - 70 * k, r.y + r.h / 2 - orbS / 2], { duration: FLIGHT, ease, times: [0, 0.3, 1] }).stop,
        animate(orbRot, upright, { duration: FLIGHT, ease }).stop,
        animate(orbScale, r.w / orbS, { duration: FLIGHT, ease, onComplete: onDone }).stop,
      ]
    }
    raf = requestAnimationFrame(fly)
    return () => {
      cancelAnimationFrame(raf)
      stops.forEach((s) => s())
    }
  }, [phase, k, orbS, orbX, orbY, orbRot, orbScale, onDone])

  const groundY = top + (580 - OY) * k

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" role="status" aria-label="Carregando Support Nurse">
      <motion.div
        className="absolute inset-0 bg-[#f3f5fb]"
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FLIGHT * 0.8, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="absolute -top-24 left-[8%] size-[26rem] rounded-full bg-brand-blue/15 blur-3xl" />
        <div className="absolute right-[10%] bottom-[-6rem] size-[24rem] rounded-full bg-gold/20 blur-3xl" />

        {/* Linha do chao */}
        <motion.div
          className="absolute left-0 h-px w-full origin-left"
          style={{
            top: groundY,
            scaleX: groundScale,
            background: `linear-gradient(90deg, transparent, ${C.navy}26 18%, ${C.gold}99 50%, ${C.navy}26 82%, transparent)`,
          }}
        />

        <motion.div className="absolute left-0" style={{ top, width: W, height: H, x: sceneX }}>
          <svg viewBox={`${OX} ${OY} ${VB_W} ${VB_H}`} width={W} height={H} aria-hidden overflow="visible">
            {/* sombra no chao */}
            <ellipse cx="306" cy="582" rx="196" ry="8" fill={C.navy} opacity="0.08" />

            {/* ================= Enfermeira ================= */}
            <g ref={nurseRef}>
              {/* braco de tras (segura a manopla, atras do corpo) */}
              <path ref={backArmRef} stroke={C.skinShade} strokeWidth="14" strokeLinecap="round" fill="none" />
              <Leg thighRef={legBRef} kneeRef={kneeBRef} back />
              <Leg thighRef={legARef} kneeRef={kneeARef} />

              {/* blusa do uniforme */}
              <path d="M168 142 C160 172 157 240 159 300 C160 318 162 330 165 342 L226 342 C228 322 228 300 226 270 C224 220 221 172 214 146 C205 137 181 136 168 142 Z" fill={C.scrub} />
              <path d="M168 142 C160 172 157 240 159 300 C160 318 162 330 165 342 L180 342 C175 292 174 206 182 146 Z" fill={C.scrubShade} />
              <path d="M191 140 L201 163 L211 140 Z" fill={C.skin} />
              <rect x="170" y="290" width="27" height="23" rx="5" fill="#e4eef9" />
              <circle cx="215" cy="176" r="3.2" fill={C.gold} />

              {/* cabeca (balanco sutil) */}
              <g ref={nurseHeadRef}>
                <path d="M196 108 L213 108 L215 142 C209 147 199 147 193 142 Z" fill={C.skin} />
                <path d="M196 112 C202 121 210 121 214 116 L214 125 C208 129 201 129 196 124 Z" fill={C.skinShade} opacity="0.55" />
                <ellipse cx="206" cy="96" rx="21" ry="24" fill={C.skin} />
                <path d="M226 92 C231 96 231 101 225 103 Z" fill={C.skin} />
                <path d="M186 104 C181 79 195 66 213 68 C225 70 231 80 229 90 C221 84 207 84 199 92 C195 98 193 108 192 118 C188 115 186 110 186 104 Z" fill={C.navy} />
                <circle cx="181" cy="86" r="13" fill={C.navy} />
                <ellipse cx="196" cy="100" rx="4" ry="6" fill={C.skinShade} />
              </g>

            </g>
            {/* braco da frente: manga curta + antebraco ate a manopla (ombro acompanha o corpo) */}
            <path ref={foreArmRef} stroke={C.skin} strokeWidth="15" strokeLinecap="round" fill="none" />
            <path ref={upperArmRef} stroke={C.scrub} strokeWidth="24" strokeLinecap="round" fill="none" />

            {/* ================= Cadeira (fundo) ================= */}
            <g strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M252 294 C258 310 263 346 268 402" stroke={C.blueDark} strokeWidth="9" />
              <path d="M255 300 L268 300 L278 396 L266 396 Z" fill={C.navySoft} stroke="none" />
            </g>
            {/* manopla com a mao da enfermeira */}
            <path d="M226 290 L254 290" stroke={C.navyDeep} strokeWidth="11" strokeLinecap="round" />
            <circle cx="240" cy="287" r="9.5" fill={C.skin} />

            {/* ================= Senhora ================= */}
            <g ref={ladyRef}>
              {/* tronco: blusa dourada + vestido */}
              <path d="M298 270 C285 300 283 352 289 402 L362 402 C364 352 358 300 342 274 C331 262 308 262 298 270 Z" fill={C.gold} />
              <path d="M298 270 C285 300 283 352 289 402 L304 402 C300 350 302 300 312 266 C306 265 301 267 298 270 Z" fill={C.goldDark} />
              <path d="M318 282 C309 320 306 362 306 402 L363 402 C363 360 357 318 345 286 C336 280 325 279 318 282 Z" fill={C.navySoft} />

              {/* cabeca (balanco leve, olhando em volta) */}
              <g ref={ladyHeadRef}>
                <path d="M312 236 L329 236 L331 270 C325 275 316 275 310 270 Z" fill={C.skin} />
                <path d="M312 240 C318 249 326 249 330 244 L330 253 C324 257 317 257 312 252 Z" fill={C.skinShade} opacity="0.55" />
                <ellipse cx="324" cy="222" rx="23" ry="25" fill={C.skin} />
                {/* nariz de perfil */}
                <path d="M345 219 C351 223 351 229 345 231 Z" fill={C.skin} />
                {/* cabelo branco cobrindo o alto da cabeca, com coque */}
                <path d="M348 212 C347 195 333 186 318 187 C303 189 296 203 298 221 C299 232 302 241 307 246 C306 233 309 221 317 213 C327 205 339 205 348 212 Z" fill={C.hair} />
                <path d="M298 221 C297 205 303 194 313 189 C305 201 304 218 308 236 C306 241 307 244 307 246 C302 241 299 232 298 221 Z" fill={C.hairShade} />
                <path d="M318 196 C326 194 336 196 342 202" stroke={C.hairShade} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="309" cy="185" r="13" fill={C.hair} />
                <path d="M299 190 C303 196 311 198 317 194" stroke={C.hairShade} strokeWidth="3" fill="none" strokeLinecap="round" />
                <ellipse cx="315" cy="195" rx="5" ry="2.8" fill={C.gold} />
                <ellipse cx="316" cy="226" rx="4" ry="6" fill={C.skinShade} />
                <circle cx="341" cy="226" r="6.5" fill="rgba(255,255,255,0.35)" stroke={C.navy} strokeWidth="2" />
                <path d="M334 225 L320 223" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round" />
              </g>

              {/* colo e pernas: saia do vestido */}
              <path d="M290 392 C330 385 402 388 440 400 C455 405 461 420 459 440 L468 528 C452 534 432 534 420 530 L411 448 C381 446 331 448 301 444 C290 440 285 414 290 392 Z" fill={C.navySoft} />
              <path d="M292 392 C332 386 402 389 440 401 C448 404 453 409 456 416 C420 406 350 402 294 410 Z" fill={C.navySoftHi} opacity="0.8" />
              <rect x="427" y="518" width="14" height="14" rx="5" fill={C.skin} />
              <path d="M422 528 C422 538 427 542 437 542 L472 542 C477 542 477 533 468 531 C456 528 446 525 437 523 Z" fill={C.bronze} />

              {/* braco sobre o colo */}
              <path d="M327 284 L336 348" stroke={C.gold} strokeWidth="22" strokeLinecap="round" />
              <path d="M336 350 L392 384" stroke={C.skin} strokeWidth="15" strokeLinecap="round" />
              <circle cx="396" cy="386" r="10" fill={C.skin} />
            </g>

            {/* ================= Cadeira (frente) ================= */}
            <g strokeLinecap="round" strokeLinejoin="round" fill="none">
              <rect x="262" y="390" width="140" height="16" rx="8" fill={C.navy} stroke="none" />
              <path d="M275 364 L394 364" stroke={C.blue} strokeWidth="8" />
              <path d="M286 359 L386 359" stroke={C.navyDeep} strokeWidth="9" />
              <path d="M394 364 L399 406" stroke={C.blue} strokeWidth="8" />
              <path d="M399 406 L431 520" stroke={C.blue} strokeWidth="8" />
              <path d="M406 408 L452 524" stroke={C.blueDark} strokeWidth="7" />
              <path d="M440 530 L488 530" stroke={C.navyDeep} strokeWidth="9" />
              <path d="M431 520 L437 546" stroke={C.blue} strokeWidth="6" />
              <path d="M286 404 L281 470" stroke={C.blue} strokeWidth="7" />
            </g>

            {/* roda grande (gira) */}
            <g ref={wheelRef}>
              <circle cx={WHEEL.cx} cy={WHEEL.cy} r="86" fill="rgba(255,255,255,0.18)" />
              {Array.from({ length: 16 }, (_, i) => {
                const a = (i / 16) * Math.PI * 2
                return (
                  <line
                    key={i}
                    x1={WHEEL.cx + Math.cos(a) * 16}
                    y1={WHEEL.cy + Math.sin(a) * 16}
                    x2={WHEEL.cx + Math.cos(a) * 82}
                    y2={WHEEL.cy + Math.sin(a) * 82}
                    stroke="#b9c3d8"
                    strokeWidth="1.6"
                  />
                )
              })}
              <circle cx={WHEEL.cx} cy={WHEEL.cy} r="75" fill="none" stroke="#9aa8c4" strokeWidth="3" />
              <circle cx={WHEEL.cx} cy={WHEEL.cy} r="84" fill="none" stroke={C.gold} strokeWidth="3" />
              <circle cx={WHEEL.cx} cy={WHEEL.cy} r="92" fill="none" stroke={C.navyDeep} strokeWidth="12" />
              <circle cx={WHEEL.cx} cy={WHEEL.cy} r="17" fill={C.navy} />
            </g>

            {/* rodinha da frente (gira) */}
            <g ref={casterRef}>
              <circle cx={CASTER.cx} cy={CASTER.cy} r="18" fill={C.navyDeep} />
              <circle cx={CASTER.cx} cy={CASTER.cy} r="9" fill="#2c3466" />
              <rect x={CASTER.cx - 1.5} y={CASTER.cy - 15} width="3" height="8" rx="1.5" fill={C.gold} />
              <circle cx={CASTER.cx} cy={CASTER.cy} r="4" fill={C.gold} />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Orbe da marca no cubo da roda: acompanha a cadeira e depois voa ate o titulo */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: orbX, y: orbY, rotate: orbRot, scale: orbScale, width: orbS, height: orbS, filter: 'drop-shadow(0 4px 10px rgba(36,43,85,0.35))' }}
        aria-hidden
      >
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
