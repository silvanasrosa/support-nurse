import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import type { Review } from '@/content/results'
import { ReviewCard } from './ResultsParts'

const ease = [0.16, 1, 0.3, 1] as const
/** Tempo de cada avaliacao no autoplay. */
const AUTOPLAY_MS = 5500

/**
 * Carrossel de avaliacoes: passa sozinho (autoplay), arrasta com o dedo (rolagem nativa com encaixe), com o mouse
 * (arrastar) ou pelas setas e pontos. O autoplay pausa com o mouse em cima, com o foco do teclado, enquanto
 * arrasta e fora da tela; no fim volta ao comeco. Desktop: 2 cards por vez. Celular: 1 com a ponta do proximo.
 */
export function ReviewCarousel({ reviews, className = '' }: { reviews: Review[]; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const glide = useRef<ReturnType<typeof animate> | null>(null)
  const reduce = useReducedMotion()
  const inView = useInView(rootRef, { margin: '-15% 0px' })
  const [dragging, setDragging] = useState(false)
  const [hold, setHold] = useState(false) // mouse em cima, foco ou dedo na tela
  const [cycle, setCycle] = useState(0) // reinicia a contagem do autoplay a cada acao
  // first = card mais a esquerda na tela (base das setas); active = ponto aceso (no fim da rolagem, o ultimo)
  const [pos, setPos] = useState({ first: 0, active: 0, start: true, end: false })

  const items = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[]

  // posicao atual lida da propria rolagem (serve tambem dentro do autoplay, sem depender do estado)
  const measure = useCallback(() => {
    const el = trackRef.current
    const list = Array.from(el?.children ?? []) as HTMLElement[]
    if (!el || !list.length) return { first: 0, active: 0, start: true, end: false }
    const off = (i: number) => list[i].offsetLeft - list[0].offsetLeft
    const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
    let first = 0
    list.forEach((_, i) => {
      if (Math.abs(off(i) - el.scrollLeft) < Math.abs(off(first) - el.scrollLeft)) first = i
    })
    return { first, active: end ? list.length - 1 : first, start: el.scrollLeft <= 4, end }
  }, [])
  const update = useCallback(() => setPos(measure()), [measure])

  // (no inicio a rolagem esta em 0, que e o estado inicial; depois, a rolagem e a tela atualizam)
  useEffect(() => {
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      glide.current?.stop()
    }
  }, [update])

  // desliza ate o card (animacao propria: a rolagem suave nativa nao anima em todo navegador, e o encaixe
  // fica desligado durante o movimento para nao puxar o card de volta)
  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current
      const list = items()
      if (!el || !list.length) return
      const k = Math.max(0, Math.min(list.length - 1, i))
      const to = Math.min(list[k].offsetLeft - list[0].offsetLeft, el.scrollWidth - el.clientWidth)
      glide.current?.stop()
      if (reduce) {
        el.scrollLeft = to
        return
      }
      el.style.scrollSnapType = 'none'
      glide.current = animate(el.scrollLeft, to, {
        duration: 0.8,
        ease,
        onUpdate: (v) => {
          el.scrollLeft = v
        },
        onComplete: () => {
          el.style.scrollSnapType = ''
        },
      })
    },
    [reduce],
  )

  // acao da pessoa: navega e reinicia a contagem do autoplay
  const nav = (i: number) => {
    goTo(i)
    setCycle((c) => c + 1)
  }

  // autoplay: avanca um card; no fim, volta ao primeiro
  const playing = !reduce && inView && !hold && !dragging
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => {
      const p = measure()
      goTo(p.end ? 0 : p.first + 1)
      setCycle((c) => c + 1)
    }, AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [playing, cycle, goTo, measure])

  // arrastar com o mouse (no toque a rolagem nativa ja faz isso)
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return
    glide.current?.stop()
    trackRef.current.style.scrollSnapType = ''
    if (e.pointerType !== 'mouse') {
      setHold(true) // dedo na tela: pausa ate soltar
      return
    }
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft }
    trackRef.current.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !trackRef.current) return
    trackRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') setHold(false)
    setCycle((c) => c + 1)
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    // encaixa no card mais perto ao soltar
    requestAnimationFrame(() => {
      const p = measure()
      goTo(p.end ? items().length - 1 : p.first)
    })
  }

  const arrow =
    'grid size-11 place-items-center rounded-full bg-white/70 text-navy ring-1 ring-navy/10 backdrop-blur transition hover:bg-navy hover:text-white disabled:pointer-events-none disabled:opacity-35'

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay: 0.1 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false)
      }}
      className={`flex min-w-0 flex-col ${className}`}
      aria-roledescription="carrossel"
      aria-label="Avaliações de clientes no Google"
    >
      <div
        ref={trackRef}
        onScroll={update}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`-my-4 flex flex-1 gap-5 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? 'cursor-grabbing snap-none select-none' : 'snap-x snap-mandatory lg:cursor-grab'
        }`}
      >
        {reviews.map((r) => (
          <div key={r.name} className="w-[86%] shrink-0 snap-start sm:w-[62%] md:w-[calc(50%-0.625rem)]">
            <ReviewCard review={r} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {reviews.map((r, i) => {
            const on = i === pos.active
            return (
              <button
                key={r.name}
                type="button"
                onClick={() => nav(i)}
                aria-label={`Ver a avaliação de ${r.name}`}
                aria-current={on}
                className="grid h-6 place-items-center"
              >
                <span className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-500 ${on ? 'w-8 bg-navy/20' : 'w-1.5 bg-navy/25'}`}>
                  {/* ponto aceso: enche durante o tempo do autoplay (cheio quando parado) */}
                  {on && (
                    <motion.span
                      key={`${cycle}-${playing}`}
                      className="absolute inset-0 origin-left rounded-full bg-navy"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: playing ? AUTOPLAY_MS / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => nav(pos.first - 1)} disabled={pos.start} aria-label="Avaliação anterior" className={arrow}>
            <CaretLeft size={18} weight="bold" />
          </button>
          <button type="button" onClick={() => nav(pos.first + 1)} disabled={pos.end} aria-label="Próxima avaliação" className={arrow}>
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
