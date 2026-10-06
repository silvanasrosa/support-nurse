import { ArrowDown, Armchair, Bandaids, Brain, CheckCircle, FirstAidKit, ForkKnife, HandHeart, Minus, PersonSimpleWalk, Plus, Syringe, Wind } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type Ref, type RefObject } from 'react'
import { CtaButton } from '@/components/ui/CtaButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { catalog, type CatalogIcon } from '@/content/catalog'
import { useMedia } from '@/hooks/useMedia'
import { useScrollSteps } from './useScrollSteps'

const ease = [0.16, 1, 0.3, 1] as const

const ICONS: Record<CatalogIcon, Icon> = {
  firstAid: FirstAidKit,
  brain: Brain,
  wind: Wind,
  nutrition: ForkKnife,
  syringe: Syringe,
  bandaids: Bandaids,
  walk: PersonSimpleWalk,
  handHeart: HandHeart,
  armchair: Armchair,
}

type Area = (typeof catalog.areas)[number]
const num = (i: number) => String(i + 1).padStart(2, '0')
const COUNT = catalog.areas.length

/* Rolagem em etapas: liga so com movimento permitido. STEP = rolagem (em svh) por especialidade. */
const DESKTOP = { query: '(min-width: 768px) and (prefers-reduced-motion: no-preference)', step: 30 }
const MOBILE = { query: '(max-width: 767px) and (prefers-reduced-motion: no-preference)', step: 38 }
/*
 * Quadro preso no desktop (especialidades + chamada + botao): gruda a 2rem do topo.
 * Se for mais alto que a tela, sobe o necessario para o rodape (chamada e botao) continuar a vista.
 * --frame-h vem do useScrollSteps.
 */
const DESKTOP_FRAME: CSSProperties = { top: 'min(2rem, calc(100svh - var(--frame-h, 0px) - 1rem))' }

/** Espacador da trilha: a rolagem que acontece com o quadro preso. */
function TrackSpacer({ step }: { step: number }) {
  return <div aria-hidden style={{ height: `${(COUNT - 1) * step}svh` }} />
}

/** Lista de itens de uma area (marcadores dourados). */
function AreaItems({ area, columns = false }: { area: Area; columns?: boolean }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3.5 ${columns ? 'lg:grid-cols-2' : ''}`}>
      {area.items.map((it, i) => (
        <motion.li
          key={it}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.1 + i * 0.05 }}
          className="flex items-start gap-3 text-[15px] leading-snug text-white/85"
        >
          <CheckCircle size={22} weight="duotone" className="mt-px shrink-0 text-gold" />
          {it}
        </motion.li>
      ))}
    </ul>
  )
}

/** Conteudo do painel de uma area (desktop). */
function AreaPanel({ area, index }: { area: Area; index: number }) {
  const Ico = ICONS[area.icon]
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute -top-10 -right-2 font-display text-[11rem] leading-none text-white/[0.05]">
        {num(index)}
      </span>
      <span className="grid size-14 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/30">
        <Ico size={30} weight="duotone" />
      </span>
      <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-gold uppercase md:short:mt-4">{area.name}</p>
      <h3 className="mt-2 max-w-xl text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.1] text-white">{area.headline}</h3>
      <div aria-hidden className="my-7 h-px w-full bg-gradient-to-r from-gold/50 via-white/15 to-transparent md:short:my-5" />
      <AreaItems area={area} columns />
    </div>
  )
}

/** Botao redondo de pular, com anel dourado que acompanha o progresso pelas especialidades. */
function SkipControl({ ringRef, onSkip, className = '' }: { ringRef: Ref<SVGCircleElement>; onSkip: () => void; className?: string }) {
  return (
    <div className={`flex shrink-0 justify-center ${className}`}>
      <button
        type="button"
        onClick={onSkip}
        aria-label={catalog.skipLabel}
        title={catalog.skipLabel}
        className="group relative grid size-14 place-items-center rounded-full bg-white/[0.08] text-white/85 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.14] hover:text-gold"
      >
        <svg aria-hidden viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
          <circle cx="28" cy="28" r="27" fill="none" strokeWidth="2" className="stroke-white/20" />
          <circle
            ref={ringRef}
            cx="28"
            cy="28"
            r="27"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            className="stroke-gold"
          />
        </svg>
        <ArrowDown size={20} weight="bold" className="transition-transform duration-300 group-hover:translate-y-0.5" />
      </button>
    </div>
  )
}

/** Tablet e desktop: abas verticais + painel de vidro. A rolagem troca a area enquanto o bloco fica preso. */
function CatalogTabs({ active, goTo }: { active: number; goTo: (i: number) => void }) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const area = catalog.areas[active]

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (active + dir + COUNT) % COUNT
    goTo(next)
    tabs.current[next]?.focus({ preventScroll: true })
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(15rem,0.85fr)_1.6fr] lg:gap-8">
      <div role="tablist" aria-orientation="vertical" aria-label="Áreas clínicas" onKeyDown={onKey} className="flex flex-col gap-1.5">
        {catalog.areas.map((a, i) => {
          const TabIco = ICONS[a.icon]
          const selected = i === active
          return (
            <button
              key={a.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              role="tab"
              id={`tab-${a.id}`}
              aria-selected={selected}
              aria-controls="catalog-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => goTo(i)}
              className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 md:short:py-2 ${
                selected ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="catalog-tab"
                  className="glass-dark absolute inset-0 rounded-2xl ring-1 ring-gold/40"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <span className={`relative w-7 font-display text-sm ${selected ? 'text-gold' : 'text-white/40'}`}>{num(i)}</span>
              <TabIco size={22} weight="duotone" className={`relative shrink-0 ${selected ? 'text-gold' : ''}`} />
              <span className="relative text-[15px] font-medium">{a.name}</span>
            </button>
          )
        })}
      </div>

      <div
        id="catalog-panel"
        role="tabpanel"
        aria-labelledby={`tab-${area.id}`}
        className="glass-dark relative overflow-hidden rounded-[2rem] p-8 lg:p-11 md:short:lg:p-8"
      >
        {/* copias invisiveis de todas as areas na mesma celula: o painel fica com a altura da maior e nada pula ao trocar */}
        <div className="grid">
          {catalog.areas.map((a, i) => (
            <div key={a.id} aria-hidden className="invisible [grid-area:1/1]">
              <AreaPanel area={a} index={i} />
            </div>
          ))}
          <AnimatePresence mode="wait">
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
              transition={{ duration: 0.4, ease }}
              className="[grid-area:1/1]"
            >
              <AreaPanel area={area} index={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/**
 * Celular: acordeao. Com a rolagem em etapas, arrastar a tela abre uma especialidade por vez
 * e o botao do rodape leva direto a faixa de chamada (ctaRef).
 */
function CatalogAccordion({ ctaRef }: { ctaRef: RefObject<HTMLDivElement | null> }) {
  const scrollMode = useMedia(MOBILE.query)
  const { active, goTo, skip, trackRef, frameRef, ringRef } = useScrollSteps(COUNT, scrollMode)
  const [manual, setManual] = useState<number | null>(0)
  const open = scrollMode ? active : manual
  const viewRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)

  // a lista sobe dentro do quadro para manter a area aberta a vista (a anterior aparece pela metade)
  useLayoutEffect(() => {
    const view = viewRef.current
    const list = listRef.current
    if (!scrollMode || !view || !list) return
    const FADE = 40
    const measure = () => {
      // altura de cada item fechado (nomes longos quebram em 2 linhas em telas estreitas)
      const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-acc-btn]'), (b) => b.offsetHeight + 2) // +2: borda
      if (!rows.length) return
      const gap = parseFloat(getComputedStyle(list).rowGap) || 0
      const body = list.querySelector<HTMLElement>(`[data-acc-body="${active}"]`)
      const top = rows.slice(0, active).reduce((s, h) => s + h + gap, 0)
      const prev = active > 0 ? rows[active - 1] + gap : 0
      const total = rows.reduce((s, h) => s + h + gap, -gap) + (body?.offsetHeight ?? 0) + FADE
      const max = Math.max(0, total - view.clientHeight)
      setShift(Math.min(Math.max(0, top - prev * 0.55), max))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(view)
    return () => ro.disconnect()
  }, [scrollMode, active])

  const fade = scrollMode
    ? shift > 0
      ? 'linear-gradient(to bottom, transparent, #000 2.5rem, #000 calc(100% - 2.5rem), transparent)'
      : 'linear-gradient(to bottom, #000 calc(100% - 2.5rem), transparent)'
    : undefined

  return (
    <div ref={trackRef} className="md:hidden">
      <div ref={frameRef} className={scrollMode ? 'sticky top-0 flex h-svh flex-col pt-5 pb-5' : ''}>
        <div ref={viewRef} className={scrollMode ? 'relative min-h-0 flex-1 overflow-hidden' : ''} style={{ maskImage: fade, WebkitMaskImage: fade }}>
          <motion.div
            ref={listRef}
            animate={{ y: scrollMode ? -shift : 0 }}
            transition={{ duration: 0.5, ease }}
            className={`flex flex-col ${scrollMode ? 'gap-2' : 'gap-2.5'}`}
          >
            {catalog.areas.map((a, i) => {
              const Ico = ICONS[a.icon]
              const isOpen = open === i
              return (
                <div key={a.id} className={`glass-dark overflow-hidden rounded-2xl transition-shadow ${isOpen ? 'ring-1 ring-gold/40' : ''}`}>
                  <button
                    type="button"
                    data-acc-btn
                    aria-expanded={isOpen}
                    aria-controls={`acc-${a.id}`}
                    onClick={() => (scrollMode ? goTo(i) : setManual(isOpen ? null : i))}
                    className={`flex w-full items-center gap-3.5 px-4 text-left ${scrollMode ? 'py-3' : 'py-4'}`}
                  >
                    <span className={`w-6 font-display text-sm ${isOpen ? 'text-gold' : 'text-white/40'}`}>{num(i)}</span>
                    <Ico size={22} weight="duotone" className={isOpen ? 'text-gold' : 'text-white/70'} />
                    <span className="flex-1 text-[15px] font-medium text-white">{a.name}</span>
                    <span className="grid size-8 place-items-center rounded-full bg-white/10 text-white">
                      {isOpen ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`acc-${a.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                      >
                        <div data-acc-body={i} className="px-5 pt-1 pb-6">
                          <h3 className="mb-4 text-xl leading-snug text-white">{a.headline}</h3>
                          <AreaItems area={a} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        </div>

        {scrollMode && <SkipControl ringRef={ringRef} onSkip={() => skip(ctaRef.current)} className="pt-4" />}
      </div>
      {scrollMode && <TrackSpacer step={MOBILE.step} />}
    </div>
  )
}

/** Faixa de chamada (quote + botao dourado). md:short compacta em telas baixas. */
function CtaBand({ className = '', ref }: { className?: string; ref?: Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease }}
      className={`flex flex-col gap-7 rounded-[2rem] border border-gold/35 bg-white/[0.06] p-7 backdrop-blur-md md:p-10 md:short:gap-5 md:short:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10 ${className}`}
    >
      <p className="max-w-3xl font-display text-xl leading-snug text-white italic md:text-2xl md:short:text-xl">“{catalog.cta.quote}”</p>
      <CtaButton href={catalog.cta.href} shortLabel={catalog.cta.shortLabel} variant="gold" className="shrink-0 self-start lg:self-auto">
        {catalog.cta.label}
      </CtaButton>
    </motion.div>
  )
}

/**
 * Secao "Catalogo": 9 areas clinicas sobre fundo azul-marinho.
 * Tablet e desktop: abas + painel. Celular: acordeao. Nos dois, a rolagem passa pelas areas com o bloco
 * preso na tela. Tablet e desktop: especialidades, chamada e botao de pular grudam juntos no topo;
 * o botao vai para a proxima secao. Celular: o botao fica no rodape do acordeao e vai para a chamada.
 */
export function Catalog() {
  const deskMode = useMedia(DESKTOP.query)
  const { active, goTo, skip, trackRef, frameRef, ringRef } = useScrollSteps(COUNT, deskMode)
  const ctaRef = useRef<HTMLDivElement>(null)

  return (
    <section id="catalogo" className="px-2 sm:px-3">
      {/* overflow-clip (e nao hidden): recorta os brilhos sem quebrar o position sticky do bloco preso */}
      <div className="card-gutter relative isolate overflow-clip rounded-[28px] bg-navy py-20 text-white md:rounded-[36px] md:pt-28 md:pb-14">
        {/* fundo: ondas + brilhos */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:120px]" />
        <div aria-hidden className="absolute -top-40 right-[-10%] -z-10 size-[36rem] rounded-full bg-brand-blue/30 blur-3xl" />
        <div aria-hidden className="absolute bottom-[-12rem] left-[-8%] -z-10 size-[30rem] rounded-full bg-gold/10 blur-3xl" />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading tone="dark" eyebrow={catalog.eyebrow} title={catalog.title} accent={catalog.titleAccent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-xl text-[1.05rem] leading-relaxed text-white/75"
          >
            {catalog.intro}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="mt-10 md:mt-12"
        >
          {/* tablet e desktop: especialidades + chamada + botao, presos juntos no topo */}
          <div ref={trackRef} className="hidden md:block">
            <div ref={frameRef} className={deskMode ? 'sticky' : ''} style={deskMode ? DESKTOP_FRAME : undefined}>
              <CatalogTabs active={active} goTo={goTo} />
              <CtaBand className="mt-14 md:short:mt-6" />
              {deskMode && <SkipControl ringRef={ringRef} onSkip={() => skip()} className="mt-8 md:short:mt-5" />}
            </div>
            {deskMode && <TrackSpacer step={DESKTOP.step} />}
          </div>

          {/* celular: acordeao preso; a chamada vem depois */}
          <div className="md:hidden">
            <CatalogAccordion ctaRef={ctaRef} />
            <CtaBand ref={ctaRef} className="mt-10" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
