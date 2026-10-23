import { GoogleLogo, Quotes, Star, StarHalf } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { CountUp } from '@/components/ui/CountUp'
import { CtaButton } from '@/components/ui/CtaButton'
import { results, type Review } from '@/content/results'

const ease = [0.16, 1, 0.3, 1] as const

/** Estrelas de 0 a 5 (aceita meia estrela). */
export function Stars({ value, size = 18, className = '' }: { value: number; size?: number; className?: string }) {
  return (
    <span role="img" aria-label={`${value.toLocaleString('pt-BR')} de 5 estrelas`} className={`flex items-center gap-0.5 text-gold ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const left = value - i
        const Ico = left >= 1 ? Star : left >= 0.5 ? StarHalf : Star
        return <Ico key={i} aria-hidden size={size} weight={left >= 0.5 ? 'fill' : 'regular'} className={left < 0.5 ? 'opacity-40' : ''} />
      })}
    </span>
  )
}

/** Anel que se completa ate o valor (em %), com o numero contando no meio. */
function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative mx-auto grid size-44 shrink-0 place-items-center sm:size-52">
      <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 size-full -rotate-90">
        <circle cx="100" cy="100" r="88" fill="none" strokeWidth="9" className="stroke-white/10" />
        <motion.circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className="stroke-gold drop-shadow-[0_0_10px_rgba(236,171,91,0.55)]"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: value / 100 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.8, ease, delay: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <span className="block text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">até</span>
        <span className="block font-display text-[3.4rem] leading-none text-gold sm:text-[3.9rem]">
          <CountUp to={value} suffix="%" delay={0.3} />
        </span>
        <span className="mt-1 block text-xs text-white/70">{label}</span>
      </div>
    </div>
  )
}

/** Card azul do dado de pesquisa: anel com os 40% e a frase com a fonte. */
export function StudyCard({ className = '' }: { className?: string }) {
  const s = results.study
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease }}
      className={`relative isolate overflow-hidden rounded-[2rem] bg-navy text-white ${className}`}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:110px] opacity-70" />
      <div aria-hidden className="absolute -top-28 -left-20 -z-10 size-96 rounded-full bg-brand-blue/40 blur-3xl" />
      <div className="grid items-center gap-8 p-7 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12 lg:px-14 lg:py-12">
        <Gauge value={s.value} label={s.label} />
        <div>
          <blockquote className="font-display text-[clamp(1.45rem,2.6vw,2.35rem)] leading-[1.22] italic">
            “{s.before} <span className="text-gold not-italic">{s.highlight}</span> {s.after}”
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] text-white/55 uppercase">
            <span aria-hidden className="h-px w-8 bg-gold/70" />
            Fonte: {s.source}
          </figcaption>
        </div>
      </div>
    </motion.figure>
  )
}

/** Card do perfil no Google: nota, estrelas, total de avaliacoes e o botao para ver todas. */
export function GoogleCard({ className = '' }: { className?: string }) {
  const g = results.google
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease }}
      className={`glass-liquid flex flex-col rounded-[2rem] p-7 md:max-lg:flex-row md:max-lg:items-end md:max-lg:gap-10 lg:p-8 ${className}`}
    >
      <div className="shrink-0">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-navy/70 uppercase">
          <GoogleLogo aria-hidden size={18} weight="bold" />
          {g.eyebrow}
        </p>
        <div className="mt-6 flex items-end gap-4">
          <span className="font-display text-[4.6rem] leading-[0.8] text-navy">{g.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</span>
          <div className="pb-1">
            <Stars value={g.rating} size={20} />
            <p className="mt-1.5 text-sm font-medium text-graphite/75">{g.count} avaliações</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-graphite/60">{g.category}</p>
      </div>
      <div className="flex flex-1 flex-col">
        <div aria-hidden className="my-6 h-px bg-gradient-to-r from-gold/50 via-navy/10 to-transparent md:max-lg:hidden" />
        <p className="text-[15px] leading-relaxed text-graphite/80">{g.text}</p>
        <div className="mt-auto pt-7">
          <CtaButton href={g.url} external>
            {g.cta}
          </CtaButton>
        </div>
      </div>
    </motion.div>
  )
}

/** Uma avaliacao do Google: foto, nome, estrelas e o texto como foi publicado. */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="glass-liquid relative flex h-full flex-col rounded-[2rem] p-7 lg:p-8">
      <Quotes aria-hidden size={72} weight="fill" className="absolute top-5 right-5 size-12 text-gold/15 sm:right-6 sm:size-[72px]" />
      <header className="flex items-center gap-3 pr-10 sm:pr-14">
        <img src={review.photo} alt="" width={44} height={44} loading="lazy" decoding="async" className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white" />
        <div className="min-w-0">
          <p className="leading-tight font-semibold text-navy">{review.name}</p>
          <p className="text-xs text-graphite/60">{review.meta}</p>
        </div>
      </header>
      <Stars value={review.rating} className="mt-5" />
      <p className="mt-3 text-[15px] leading-relaxed text-graphite/85">{review.text}</p>
      <footer className="mt-auto flex items-center gap-1.5 pt-6 text-xs text-graphite/55">
        <GoogleLogo aria-hidden size={14} weight="bold" />
        Avaliação publicada no Google
      </footer>
    </article>
  )
}
