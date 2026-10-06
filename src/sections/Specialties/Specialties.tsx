import { ArrowUpRight, Bed, CheckCircle, Clock, FirstAidKit, HandHeart, MapPin, Stethoscope, Syringe } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { CtaButton } from '@/components/ui/CtaButton'
import { GlassModal } from '@/components/ui/GlassModal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { specialties, type SpecialtyIcon } from '@/content/specialties'
import { gsap } from '@/lib/scroll'

const ease = [0.16, 1, 0.3, 1] as const

const ICONS: Record<SpecialtyIcon, Icon> = { firstAid: FirstAidKit, bed: Bed, heart: HandHeart, syringe: Syringe }
const SEAL_ICONS: Record<string, Icon> = { stethoscope: Stethoscope, clock: Clock, map: MapPin }

type Item = (typeof specialties.items)[number]

function SpecialtyCard({ item, index, onOpen }: { item: Item; index: number; onOpen: () => void }) {
  const Ico = ICONS[item.icon as SpecialtyIcon]
  const num = String(index + 1).padStart(2, '0')
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className="group h-full">
      <div className="nav-ring nav-ring-card nav-ring-solid h-full">
        <div className="glass-liquid relative flex h-full flex-col overflow-hidden rounded-[1.725rem] p-6 sm:p-7">
          {/* numeral fantasma */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-2 right-4 font-display text-[5.5rem] leading-none text-navy/[0.07] transition-colors duration-500 group-hover:text-gold/45 md:text-[6.5rem]"
          >
            {num}
          </span>

          <span className="relative grid size-14 place-items-center rounded-2xl bg-white/75 text-navy shadow-[0_8px_20px_rgba(36,43,85,0.10)] ring-1 ring-white transition-colors duration-500 group-hover:text-bronze">
            <Ico size={28} weight="duotone" />
          </span>

          <h3 className="relative mt-7 text-[1.55rem] leading-[1.12] text-navy md:mt-8">{item.title}</h3>
          <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-graphite/85">{item.text}</p>

          <button
            type="button"
            onClick={onOpen}
            className="relative mt-6 inline-flex w-fit items-center gap-3 rounded-full text-sm font-semibold text-navy"
          >
            Ver protocolo
            <span className="grid size-9 place-items-center rounded-full bg-navy text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-gold group-hover:text-navy">
              <ArrowUpRight size={16} weight="bold" />
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Secao "Alta complexidade": 4 especialidades.
 * Desktop: 4 colunas. Tablet: 2x2. Celular: cards empilhados (encavalam ao rolar, com GSAP ScrollTrigger).
 */
export function Specialties() {
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Item | null>(null)
  const openIndex = open ? specialties.items.findIndex((i) => i.id === open.id) : -1

  // Celular: o card de baixo encolhe e escurece enquanto o proximo sobe por cima dele
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const mm = gsap.matchMedia()
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-stack-card]'))
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        const inner = card.querySelector<HTMLElement>('[data-stack-inner]')
        // fromTo: sem o valor inicial explicito o GSAP interpola o filtro a partir de 0 (card fica preto)
        gsap.fromTo(inner, { scale: 1, filter: 'brightness(1) saturate(1)' }, {
          scale: 0.9 + i * 0.015,
          filter: 'brightness(0.93) saturate(0.85)',
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=120', scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="especialidades" className="relative overflow-x-clip py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute top-24 -right-32 size-[28rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-10 -left-40 size-[30rem] rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="site-gutter relative">
        {/* cabecalho */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow={specialties.eyebrow} title={specialties.title} accent={specialties.titleAccent} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            <p className="max-w-xl text-[1.05rem] leading-relaxed text-graphite/85 md:text-lg">{specialties.intro}</p>
            {/* auto-fit: os selos quebram de linha antes de apertar o texto */}
            <ul className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(10.5rem,1fr))] gap-3">
              {specialties.seals.map((seal) => {
                const Ico = SEAL_ICONS[seal.icon]
                return (
                  <li key={seal.label} className="glass-liquid flex items-center gap-3 rounded-2xl px-4 py-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/20 text-bronze">
                      <Ico size={20} weight="duotone" />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block font-display text-xl text-navy">{seal.value}</span>
                      <span className="block text-xs break-words text-graphite/75 [hyphens:auto]">{seal.label}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>

        {/* cards */}
        <div ref={listRef} className="mt-14 md:mt-20 md:grid md:grid-cols-2 md:gap-5 xl:grid-cols-4">
          {specialties.items.map((item, i) => (
            <motion.div
              key={item.id}
              data-stack-card
              style={{ '--stack-top': `calc(1.25rem + ${i * 16}px)` } as CSSProperties}
              className="mb-5 max-md:sticky max-md:top-(--stack-top) md:mb-0"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: 0.08 * i }}
            >
              <div data-stack-inner className="h-full">
                <SpecialtyCard item={item} index={i} onOpen={() => setOpen(item)} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* protocolo */}
      <GlassModal open={!!open} onClose={() => setOpen(null)} label={open ? `Protocolo: ${open.title}` : 'Protocolo'}>
        {open && (
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-bronze uppercase">
              <span aria-hidden className="h-px w-8 bg-gold" />
              Protocolo {String(openIndex + 1).padStart(2, '0')}
            </p>
            <h3 className="pr-10 text-[2rem] leading-[1.08] text-navy">{open.title}</h3>
            <p className="mt-3 text-graphite/85">{open.protocol.lead}</p>
            <ul className="mt-6 space-y-3">
              {open.protocol.list.map((li) => (
                <li key={li} className="flex items-start gap-3 text-[15px] text-navy">
                  <CheckCircle size={22} weight="duotone" className="mt-px shrink-0 text-gold" />
                  {li}
                </li>
              ))}
            </ul>
            <div className="mt-8" onClick={() => setOpen(null)}>
              <CtaButton href={specialties.protocolCta.href}>{specialties.protocolCta.label}</CtaButton>
            </div>
          </div>
        )}
      </GlassModal>
    </section>
  )
}
