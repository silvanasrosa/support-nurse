import { ArrowUpRight, Certificate, Check, ClockCountdown, Copy, IdentificationCard, MapPin, Scroll, UsersThree } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CtaButton } from '@/components/ui/CtaButton'
import { about, type AboutFact, type AboutIcon } from '@/content/about'
import { copyText } from '@/lib/clipboard'

const ease = [0.16, 1, 0.3, 1] as const

const ICONS: Record<AboutIcon, Icon> = {
  clock: ClockCountdown,
  certificate: Certificate,
  team: UsersThree,
  id: IdentificationCard,
  pin: MapPin,
  contract: Scroll,
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** Tempo de operacao desde a abertura, em anos, meses e dias (ex.: "15 anos, 4 meses e 25 dias"). */
function operatingFor(iso: string, now = new Date()) {
  const s = new Date(`${iso}T00:00:00`)
  let y = now.getFullYear() - s.getFullYear()
  let m = now.getMonth() - s.getMonth()
  let d = now.getDate() - s.getDate()
  if (d < 0) {
    m -= 1
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (m < 0) {
    y -= 1
    m += 12
  }
  const parts = [plural(y, 'ano', 'anos'), m ? plural(m, 'mês', 'meses') : '', d ? plural(d, 'dia', 'dias') : ''].filter(Boolean)
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} e ${parts.at(-1)}` : parts[0]
}

/** Botao pequeno de copiar (ex.: CNPJ), com aviso "Copiado" por alguns segundos. */
function CopyChip({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const onCopy = async () => {
    if (!(await copyText(text))) return
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition-colors duration-300 ${
        copied ? 'bg-gold text-navy ring-gold' : 'bg-white/5 text-white/85 ring-white/15 hover:bg-white/10'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={copied ? 'ok' : 'copy'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.16 }}>
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
        </motion.span>
      </AnimatePresence>
      {copied ? 'Copiado' : label}
      <span aria-live="polite" className="sr-only">
        {copied ? `${label}: copiado` : ''}
      </span>
    </button>
  )
}

/** Card de um dado verificavel: icone dourado, rotulo, valor e detalhe; alguns tem acao (copiar, abrir mapa). */
export function FactCard({ fact }: { fact: AboutFact }) {
  const Ico = ICONS[fact.icon]
  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
      className="group relative flex flex-col rounded-[1.6rem] bg-white/[0.045] p-6 ring-1 ring-white/10 backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.08] hover:ring-gold/35 lg:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
          <Ico size={22} weight="duotone" />
        </span>
        <span className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">{fact.label}</span>
      </div>
      <p className="mt-5 font-display text-[1.35rem] leading-snug text-white">{fact.value}</p>
      {fact.live ? (
        <p className="mt-1.5 text-sm leading-relaxed text-white/65">
          <span className="text-white/90">{operatingFor(about.since)}</span> atendendo em São Paulo.
        </p>
      ) : (
        fact.detail && <p className="mt-1.5 text-sm leading-relaxed text-white/65">{fact.detail}</p>
      )}
      {(fact.copy || fact.link) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {fact.copy && <CopyChip text={fact.copy} label={`Copiar ${fact.label}`} />}
          {fact.link && (
            <a
              href={fact.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/15 transition-colors duration-300 hover:bg-white/10"
            >
              {fact.link.label}
              <ArrowUpRight size={14} weight="bold" />
            </a>
          )}
        </div>
      )}
    </motion.li>
  )
}

/**
 * Mapa escuro com a localizacao (Google Maps incorporado, so ilustrativo: sem interacao, para nao prender a
 * rolagem da pagina) e o cartao com o endereco e o botao que abre o perfil no Google Maps.
 */
export function MapPanel({ className = '' }: { className?: string }) {
  const m = about.map
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay: 0.15 }}
      className={`relative isolate min-h-[27rem] overflow-hidden rounded-[1.75rem] bg-navy-900 ring-1 ring-white/10 ${className}`}
    >
      <iframe
        title={m.title}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(m.query)}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        className="pointer-events-none absolute inset-x-0 -top-[110px] -z-10 h-[calc(100%+110px)] w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.55)_brightness(0.9)_contrast(0.95)]"
      />
      {/* (o mapa sobe 110px: a caixa de endereco que o Google poe no canto de cima fica escondida, e o pino vai
          para a parte de cima, acima do cartao com o endereco; a marca do Google embaixo continua visivel) */}
      {/* tinta azul por cima do mapa e degrade para o cartao de baixo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy/35 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/10 to-navy/30" />

      <div className="flex h-full flex-col justify-end p-4 sm:p-5">
        <div className="rounded-[1.4rem] bg-navy/70 p-5 ring-1 ring-white/15 backdrop-blur-md sm:max-w-md sm:p-6 lg:max-w-none">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">{m.label}</p>
          <p className="mt-2 font-display text-xl leading-snug text-white">{m.place}</p>
          <p className="mt-1 text-sm text-white/65">{m.street}</p>
          <CtaButton href={m.url} external variant="gold" shortLabel={m.ctaShort} className="mt-5">
            {m.cta}
          </CtaButton>
        </div>
      </div>
    </motion.div>
  )
}
