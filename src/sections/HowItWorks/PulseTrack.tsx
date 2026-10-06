import { useLayoutEffect, useRef, useState } from 'react'
import { CssOrb } from '@/components/ui/CssOrb'
import { gsap } from '@/lib/scroll'

/** Desktop: altura da faixa acima dos cards onde corre a linha. */
export const PULSE_BAND = 88
/** Vertical: distancia do no ao topo do card (altura do selo da etapa). */
const NODE_TOP = 44

type Geo = { w: number; h: number; d: string; nodes: number[]; apex: Array<[number, number]> }

/*
 * Batimento ao longo do eixo principal ("main"): reta com um pico por etapa.
 * Os pontos sempre avancam no eixo principal, entao da para achar o comprimento de cada no por busca binaria.
 * Offsets em px no eixo principal; desvios em unidades da amplitude (negativo = pico).
 */
const SPIKE: Array<[string, ...number[]]> = [
  ['L', -30, 0],
  ['Q', -24, -0.18, -18, 0],
  ['L', -9, 0],
  ['L', -5, 0.25],
  ['L', 0, -1],
  ['L', 5, 0.5],
  ['L', 9, 0],
  ['Q', 18, -0.25, 27, 0],
]

function buildPath(vertical: boolean, len: number, base: number, amp: number, nodes: number[]) {
  // horizontal: pico para cima | vertical: pico para a direita (lado dos cards)
  const dir = vertical ? -1 : 1
  const pt = (m: number, c: number) => (vertical ? `${c.toFixed(1)} ${m.toFixed(1)}` : `${m.toFixed(1)} ${c.toFixed(1)}`)
  let d = `M ${pt(0, base)}`
  for (const n of nodes) {
    for (const [cmd, ...v] of SPIKE) {
      const pairs: string[] = []
      for (let i = 0; i < v.length; i += 2) pairs.push(pt(n + v[i], base + dir * amp * v[i + 1]))
      d += ` ${cmd} ${pairs.join(' ')}`
    }
  }
  return `${d} L ${pt(len, base)}`
}

/** Comprimento da linha ate a posicao "main" (busca binaria; o eixo principal so avanca). */
function lengthAt(path: SVGPathElement, total: number, main: number, vertical: boolean) {
  let lo = 0
  let hi = total
  for (let k = 0; k < 24; k++) {
    const mid = (lo + hi) / 2
    const p = path.getPointAtLength(mid)
    if ((vertical ? p.y : p.x) < main - 0.5) lo = mid
    else hi = mid
  }
  return hi
}

type Props = {
  vertical: boolean
  active: number
  onActive: (count: number) => void
}

/**
 * Linha do batimento que se desenha com a rolagem, com o orbe correndo por ela.
 * Fica dentro do container da trilha (position relative) e mede os cards marcados com data-pulse-node.
 * onActive recebe quantas etapas o orbe ja alcancou.
 */
export function PulseTrack({ vertical, active, onActive }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geo | null>(null)
  const S = vertical ? 32 : 44 // orbe

  // geometria: posicao de cada card em relacao ao container
  useLayoutEffect(() => {
    const box = svgRef.current?.parentElement
    if (!box) return
    const measure = () => {
      const b = box.getBoundingClientRect()
      const cards = Array.from(box.querySelectorAll<HTMLElement>('[data-pulse-node]'))
      if (!cards.length) return
      const rects = cards.map((c) => c.getBoundingClientRect())
      const nodes = rects.map((r) => (vertical ? r.top - b.top + NODE_TOP : r.left - b.left + r.width / 2))
      // vertical: a linha corre no meio da margem esquerda; horizontal: no meio da faixa de cima
      const base = vertical ? (rects[0].left - b.left) * 0.4 : PULSE_BAND / 2
      const amp = vertical ? Math.min(13, base * 0.75) : 24
      setGeo({
        w: b.width,
        h: b.height,
        nodes,
        d: buildPath(vertical, vertical ? b.height : b.width, base, amp, nodes),
        apex: nodes.map((n) => (vertical ? [base + amp, n] : [n, base - amp])),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [vertical])

  // rolagem: desenha a linha, move o orbe e acende as etapas
  useLayoutEffect(() => {
    const line = lineRef.current
    const glow = glowRef.current
    const orb = orbRef.current
    const box = svgRef.current?.parentElement
    if (!geo || !line || !glow || !orb || !box) return
    const total = line.getTotalLength()
    const marks = geo.nodes.map((n) => lengthAt(line, total, n, vertical) / total)
    line.style.strokeDasharray = glow.style.strokeDasharray = String(total)
    let last = -1
    const render = (p: number) => {
      const off = String(total * (1 - p))
      line.style.strokeDashoffset = glow.style.strokeDashoffset = off
      const pt = line.getPointAtLength(p * total)
      orb.style.transform = `translate(${pt.x - S / 2}px, ${pt.y - S / 2}px)`
      const count = marks.filter((m) => m <= p + 0.002).length
      if (count !== last) {
        last = count
        onActive(count)
      }
    }

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const proxy = { p: 0 }
      render(0)
      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => render(proxy.p),
        scrollTrigger: {
          trigger: box,
          // vertical: o orbe fica parado a 60% da altura da tela enquanto a pagina rola
          start: vertical ? 'top 60%' : 'top 78%',
          end: vertical ? 'bottom 60%' : 'bottom 62%',
          scrub: 0.6,
        },
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      render(1)
      orb.style.opacity = '0'
      return () => {
        orb.style.opacity = ''
      }
    })
    return () => mm.revert()
  }, [geo, vertical, S, onActive])

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 overflow-visible"
        width={geo?.w ?? 0}
        height={geo?.h ?? 0}
        viewBox={`0 0 ${geo?.w ?? 0} ${geo?.h ?? 0}`}
      >
        <defs>
          <filter id="pulse-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {geo && (
          <>
            <path d={geo.d} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="stroke-navy/10" />
            <path ref={glowRef} d={geo.d} fill="none" strokeWidth={vertical ? 7 : 9} strokeLinecap="round" strokeLinejoin="round" className="stroke-gold/50" filter="url(#pulse-glow)" />
            <path ref={lineRef} d={geo.d} fill="none" strokeWidth={vertical ? 2.5 : 3} strokeLinecap="round" strokeLinejoin="round" className="stroke-navy" />
            {/* ponto dourado no topo de cada pico ja alcancado */}
            {geo.apex.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={vertical ? 3.5 : 4.5}
                className="fill-gold transition-[opacity,transform] duration-500 ease-out-expo"
                style={{ opacity: i < active ? 1 : 0, transform: i < active ? 'scale(1)' : 'scale(0.2)', transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            ))}
          </>
        )}
      </svg>
      <div ref={orbRef} aria-hidden className="pointer-events-none absolute top-0 left-0 z-20" style={{ width: S, height: S, opacity: geo ? undefined : 0 }}>
        <CssOrb className="size-full" />
      </div>
    </>
  )
}
