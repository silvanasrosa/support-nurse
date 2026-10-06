import { Play } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'
import { CountUp } from '@/components/ui/CountUp'
import { hero } from '@/content/hero'
import { applyRingPath } from '@/lib/bridgeRing'

const ease = [0.16, 1, 0.3, 1] as const

/** Quanto a curva entre os cards e concava (0 a 1). 1 = as duas curvas se encontram formando um U. */
const CONCAVE = 0.94

/** Miniatura estilizada do tour virtual (usa video quando informado em content/hero.ts). */
function Thumb() {
  const { video } = hero.stats
  // Recorte concavo no canto superior direito (assinatura da referencia), onde mora o botao de play
  const notch = 'radial-gradient(circle 32px at calc(100% - 22px) 22px, transparent 31px, #000 32.5px)'
  return (
    <div className="group relative h-48 w-full shrink-0 sm:h-auto sm:w-[9.5rem] sm:self-stretch md:max-lg:hidden">
      <div
        className="absolute inset-0 overflow-hidden rounded-[1.725rem]"
        style={{ maskImage: notch, WebkitMaskImage: notch }}
      >
        {/* Cena: corredor clinico em azul, feito em CSS ate haver a foto da recepcao */}
        <span
          aria-hidden
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{
            background:
              'radial-gradient(120% 70% at 50% 108%, rgba(236,171,91,0.55), transparent 55%), linear-gradient(180deg, #c8dcef 0%, #7fa8cf 38%, #2f5f94 70%, #1f3a63 100%)',
          }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-[34%] h-[36%] opacity-70"
          style={{
            background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 2px, transparent 2px 22px)',
            maskImage: 'linear-gradient(180deg, transparent, #000 40%, transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 40%, transparent)',
          }}
        />
        <span aria-hidden className="absolute top-[18%] left-[28%] h-[26%] w-[40%] rounded-[3px] bg-white/55 blur-[2px]" />
        {video && <video src={video} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />}
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-white/10" />
        <span className="absolute bottom-2 left-0 w-full text-center text-[10px] font-medium tracking-wide text-white/90">
          Tour virtual
        </span>
        <span aria-hidden className="absolute right-2.5 bottom-2.5 size-1.5 rounded-full bg-white/90" />
      </div>

      <button
        type="button"
        aria-label="Assistir ao tour virtual da recepção"
        className="absolute top-0.5 right-0.5 grid size-10 place-items-center rounded-full bg-white text-brand-blue shadow-[0_6px_16px_rgba(36,43,85,0.18)] transition-transform duration-300 hover:scale-110"
      >
        <Play size={14} weight="fill" />
      </button>
    </div>
  )
}

/** Cartao de vidro etereo, canto inferior esquerdo: miniatura de video + numeros em azul. */
export function HeroStats() {
  const { stats } = hero
  const ringRef = useRef<HTMLDivElement>(null)

  // Mesma "ponte" curva do menu: dois blocos arredondados ligados por um pescoco estreito com cantos concavos
  useLayoutEffect(() => {
    const ring = ringRef.current
    if (!ring) return
    const measure = () => {
      const [thumb, panel] = Array.from(ring.children).filter((c) => !(c instanceof SVGElement)) as HTMLElement[]
      const sideBySide =
        thumb && panel && thumb.offsetParent !== null && panel.offsetLeft >= thumb.offsetLeft + thumb.offsetWidth
      if (!sideBySide) {
        applyRingPath(ring, null)
        return
      }
      const W = ring.offsetWidth
      const H = ring.offsetHeight
      const Rc = parseFloat(getComputedStyle(ring).borderTopLeftRadius) || 33.6 // raio dos cantos de cada bloco
      const pad = thumb.offsetLeft // espessura do anel em volta de cada bloco
      if (panel.offsetLeft - (thumb.offsetLeft + thumb.offsetWidth) < 2 * pad + 4) {
        applyRingPath(ring, null)
        return
      }
      const xl = thumb.offsetLeft + thumb.offsetWidth + pad // borda direita do bloco da miniatura
      const xr = panel.offsetLeft - pad // borda esquerda do bloco dos numeros

      // Profundidade da curva = altura do bloco de texto (topo do titulo / base dos rotulos)
      const caption = panel.querySelector('p')
      const list = panel.querySelector('dl')
      const clampDepth = (d: number) => Math.min(Math.max(d, 4), Rc)
      const nTop = clampDepth(panel.offsetTop + (caption?.offsetTop ?? Rc))
      const nBot = clampDepth(H - (panel.offsetTop + (list ? list.offsetTop + list.offsetHeight : H - Rc)))

      // Os cantos do anel na curva tem o mesmo raio dos cantos de fora (concentricos aos cards).
      // O arco do canto e interrompido e concorda com uma curva concava larga (raio fc) que desce ate a ponte;
      // fc e calculado para as duas curvas quase se encontrarem no meio: o vao vira um "U" arredondado.
      const cl = xl - Rc // centro x do canto do bloco da esquerda
      const cr = xr + Rc // centro x do canto do bloco da direita
      const half = (cr - cl) / 2
      const joint = (depth: number) => {
        const fMax = (half ** 2 / depth + depth) / 2 - Rc // raio em que as duas curvas se tocam no meio
        const fc = Math.max(2, fMax * CONCAVE)
        const dy = depth - fc - Rc // centro da concordancia em relacao ao centro do canto (<= 0)
        const dx = Math.sqrt(Math.max((Rc + fc) ** 2 - dy ** 2, 0))
        const k = Rc / (Rc + fc)
        return { f: fc, dx, tx: dx * k, ty: dy * k }
      }
      const t = joint(nTop)
      const bt = joint(nBot)
      const v = (x: number) => x.toFixed(2)
      const path = [
        `M ${v(Rc)} 0`,
        `L ${v(cl)} 0`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(cl + t.tx)} ${v(Rc + t.ty)}`,
        `A ${v(t.f)} ${v(t.f)} 0 0 0 ${v(cl + t.dx)} ${v(nTop)}`,
        `L ${v(cr - t.dx)} ${v(nTop)}`,
        `A ${v(t.f)} ${v(t.f)} 0 0 0 ${v(cr - t.tx)} ${v(Rc + t.ty)}`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(cr)} 0`,
        `L ${v(W - Rc)} 0`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(W)} ${v(Rc)}`,
        `L ${v(W)} ${v(H - Rc)}`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(W - Rc)} ${v(H)}`,
        `L ${v(cr)} ${v(H)}`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(cr - bt.tx)} ${v(H - Rc - bt.ty)}`,
        `A ${v(bt.f)} ${v(bt.f)} 0 0 0 ${v(cr - bt.dx)} ${v(H - nBot)}`,
        `L ${v(cl + bt.dx)} ${v(H - nBot)}`,
        `A ${v(bt.f)} ${v(bt.f)} 0 0 0 ${v(cl + bt.tx)} ${v(H - Rc - bt.ty)}`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(cl)} ${v(H)}`,
        `L ${v(Rc)} ${v(H)}`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 0 ${v(H - Rc)}`,
        `L 0 ${v(Rc)}`,
        `A ${v(Rc)} ${v(Rc)} 0 0 1 ${v(Rc)} 0`,
        'Z',
      ].join(' ')
      applyRingPath(ring, path)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ring)
    return () => ro.disconnect()
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 1 }}
      className="relative z-20 px-5 pb-4 max-md:order-5 max-md:mt-3 sm:px-8 sm:pb-6 md:col-span-2 md:col-start-1 md:row-start-3 md:self-end md:px-8 md:pb-6 lg:px-10 lg:pb-8 xl:px-14"
    >
      {/* Mesmo desenho do menu: anel entalhado (rebaixado) com blocos de vidro liquido dentro */}
      <div ref={ringRef} className="nav-ring nav-ring-card flex w-full flex-col items-stretch gap-2 sm:flex-row sm:gap-[1.9rem] md:w-fit">
        <Thumb />

        <div className="glass-liquid min-w-0 flex-1 rounded-[1.725rem] px-5 py-3.5 sm:px-6 md:px-4 lg:px-6">
          <div className="mb-2.5 flex items-center justify-between gap-6">
            <p className="text-[11px] font-medium text-graphite/75 sm:text-xs">{stats.caption}</p>
            <span aria-hidden className="relative hidden h-[14px] w-[26px] rounded-full bg-brand-blue/90 sm:block">
              <span className="absolute top-[3px] right-[3px] size-2 rounded-full bg-white" />
            </span>
          </div>

          <dl className="grid grid-cols-3 gap-3 sm:gap-7 md:gap-4 lg:gap-7">
            {stats.items.map((s) => (
              <div key={s.suffix + s.value} className="text-center">
                <dt className="sr-only">{s.label.replace('\n', ' ')}</dt>
                <dd>
                  <div className="text-[1.65rem] leading-none font-semibold tracking-tight text-brand-blue sm:text-[2rem] md:text-[1.6rem] lg:text-[2rem]">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1.5 text-[10px] leading-tight font-medium whitespace-pre-line text-navy/80 sm:text-[11px]" aria-hidden>
                    {s.label}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </motion.div>
  )
}
