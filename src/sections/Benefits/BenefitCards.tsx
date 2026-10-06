import { ArrowsClockwise, ClipboardText, Headset, Heartbeat, Pill } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { benefits, type BenefitIcon } from '@/content/benefits'
import { useClock } from '@/hooks/useClock'

const ease = [0.16, 1, 0.3, 1] as const

const ICONS: Record<BenefitIcon, Icon> = { clipboard: ClipboardText, swap: ArrowsClockwise, heartbeat: Heartbeat, pill: Pill }

/** Moldura dos cards do mosaico: entra ao aparecer e tem um brilho dourado que segue o mouse. */
export function BentoCard({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${e.clientX - r.left}px`)
    el.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay }}
      className={`group relative isolate overflow-hidden rounded-[2rem] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(260px circle at var(--gx, 50%) var(--gy, 50%), rgba(236,171,91,0.22), transparent 65%)' }}
      />
      {children}
    </motion.div>
  )
}

/** Card de beneficio: vidro claro, icone dourado, titulo e texto. */
export function BenefitCard({ index, className = '' }: { index: number; className?: string }) {
  const item = benefits.items[index]
  const Ico = ICONS[item.icon]
  return (
    <BentoCard className={`glass-liquid ${className}`} delay={0.06 * index}>
      <div className="relative flex h-full flex-col p-7 lg:p-8">
        <span className="grid size-12 place-items-center rounded-2xl bg-gold/15 text-bronze ring-1 ring-gold/30">
          <Ico size={26} weight="duotone" />
        </span>
        <h3 className="mt-6 text-[1.45rem] leading-[1.15] text-navy">{item.title}</h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-graphite/80">{item.text}</p>
      </div>
    </BentoCard>
  )
}

/**
 * Card da central de urgencia: foto da recepcao, relogio ao vivo e o texto no azul.
 * A foto e mais alta que o card, entao ela e recortada para mostrar a logo e a atendente ao telefone, sem texto
 * por cima das pessoas: no celular e no tablet fica em cima; no desktop ocupa a esquerda e o texto vai para a direita.
 */
export function UrgencyCard({ className = '' }: { className?: string }) {
  const u = benefits.urgency
  const now = useClock()
  return (
    <BentoCard className={`flex flex-col bg-navy text-white lg:min-h-[22rem] lg:flex-row ${className}`} delay={0.05}>
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden lg:aspect-auto lg:w-[58%]">
        <PhotoSlot
          src={u.image}
          alt={u.alt}
          icon={Headset}
          label="Foto da central 24h"
          tone="dark"
          className="object-[22%_30%] transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
        />
        {/* emenda com o azul: embaixo no celular e no tablet, a direita no desktop */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-navy via-transparent via-45% lg:bg-gradient-to-l lg:via-transparent lg:via-40%"
        />
      </div>

      <div className="relative z-20 flex flex-1 flex-col justify-end p-7 pt-1 lg:p-8 lg:pt-24">
        {/* relogio ao vivo: acima do icone no celular e no tablet (no alto ele cobriria a logo da foto);
            no desktop, no canto de cima do painel */}
        <div className="mb-6 flex w-fit items-center gap-3 rounded-full bg-navy/55 py-2 pr-4 pl-3 ring-1 ring-white/20 backdrop-blur-md lg:absolute lg:top-5 lg:right-5 lg:mb-0">
          <span className="relative grid size-3 place-items-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative size-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg">Agora, {now}</span>
            <span className="block text-[11px] text-white/70">{u.live}</span>
          </span>
        </div>
        <span className="grid size-12 place-items-center rounded-2xl bg-gold/20 text-gold ring-1 ring-gold/35 backdrop-blur-sm">
          <Headset size={26} weight="duotone" />
        </span>
        <h3 className="mt-5 text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.1]">{u.title}</h3>
        <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-white/80">{u.text}</p>
      </div>
    </BentoCard>
  )
}
