import { CaretDown, MapPin } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { CtaButton } from '@/components/ui/CtaButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { areas, regions } from '@/content/areas'
import { HeroHeader } from '@/sections/Hero/HeroHeader'

const ease = [0.16, 1, 0.3, 1] as const

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
      <motion.span className="block" initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay }}>
        {children}
      </motion.span>
    </span>
  )
}

/** Abertura: header integrado, texto a esquerda e painel azul com os numeros da cobertura. */
export function AreasHero() {
  const a = areas
  return (
    <section id="inicio" className="p-2 sm:p-3">
      <div className="relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[#f7f8fd] shadow-[0_30px_80px_rgba(36,43,85,0.12)] md:grid md:min-h-[min(calc(100svh-1.5rem),max(520px,60vw))] md:grid-cols-[52fr_48fr] md:grid-rows-[auto_1fr] md:rounded-[36px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-[4%] size-[22rem] rounded-full bg-brand-blue/30 blur-3xl [animation:drift-a_16s_ease-in-out_infinite]" />
          <div className="absolute top-[2%] left-[26%] size-[18rem] rounded-full bg-gold/35 blur-3xl [animation:drift-b_19s_ease-in-out_infinite]" />
        </div>

        {/* painel azul: coluna da direita no tablet/desktop, bloco abaixo do texto no celular */}
        <motion.div
          initial={{ opacity: 0, x: '10%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.05 }}
          className="relative order-3 mx-2 mb-2 overflow-hidden rounded-[24px] bg-navy sm:mx-3 sm:mb-3 md:absolute md:inset-y-0 md:right-0 md:m-0 md:w-[48%] md:rounded-none md:rounded-r-[36px]"
        >
          <div aria-hidden className="absolute inset-0 bg-[image:var(--pattern-ondas)] bg-[length:110px] opacity-60" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-navy/80 to-transparent" />
          <dl className="relative grid gap-6 px-7 py-10 sm:px-10 md:absolute md:inset-x-0 md:bottom-0 md:px-[12%] md:pb-[12%]">
            {a.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.6 + i * 0.12 }}
                className="border-b border-white/15 pb-6 last:border-0 last:pb-0"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-baseline gap-5">
                  <span className="min-w-[3.2ch] font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-none text-gold">{s.value}</span>
                  <span className="text-[15px] leading-snug text-white/80">{s.label}</span>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <HeroHeader />

        <div className="relative z-20 px-5 pt-10 pb-10 sm:px-8 md:col-start-1 md:row-start-2 md:self-center md:px-8 md:pt-6 md:pr-[6%] lg:px-10 xl:px-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-bronze uppercase"
          >
            <span aria-hidden className="h-px w-10 bg-gold" />
            {a.eyebrow}
          </motion.p>
          <h1 className="text-[clamp(2.6rem,11vw,4.4rem)] leading-[0.98] tracking-[-0.025em] text-navy md:text-[clamp(2.8rem,min(5vw,11svh),6rem)]">
            <Line delay={0.25}>{a.title}</Line>
            <Line delay={0.38}>
              <em className="text-bronze">{a.titleAccent}</em>
            </Line>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 }}
            className="mt-6 max-w-[34rem] text-[1.08rem] leading-relaxed text-graphite/85 lg:text-[1.15rem]"
          >
            {a.text}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.75 }} className="mt-7">
            <CtaButton href={a.cta.href}>{a.cta.label}</CtaButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** Lista das cidades por sub-regiao, em cartoes. */
export function AreasList() {
  const l = areas.list
  return (
    <section id="cidades" className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16">
        <SectionHeading eyebrow={l.eyebrow} title={l.title} accent={l.titleAccent} />
        <p className="max-w-[34rem] text-[1.05rem] leading-relaxed text-graphite/85">{l.intro}</p>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((r, i) => (
          <motion.li
            key={r.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
            className="rounded-[26px] bg-white/80 p-6 shadow-[0_20px_50px_rgba(36,43,85,0.08)] ring-1 ring-navy/[0.06] sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-gold">
                <MapPin size={18} weight="fill" />
              </span>
              <div>
                <h3 className="text-[1.45rem] leading-tight text-navy">{r.name}</h3>
                <p className="text-xs font-medium text-graphite/70">
                  {r.cities.length === 1 ? r.note : `${r.cities.length} municípios${r.note ? ` · ${r.note}` : ''}`}
                </p>
              </div>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {r.cities.map((c) => (
                <li key={c} className="rounded-full bg-navy-50 px-3 py-1.5 text-[13px] font-medium text-navy">
                  {c}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/** Faixa azul: o que se mantem fora da capital. */
export function AreasSame() {
  const s = areas.same
  return (
    <section className="p-2 sm:p-3">
      <div className="relative overflow-hidden rounded-[28px] bg-navy px-5 py-20 sm:px-8 md:rounded-[36px] md:py-24 lg:px-12">
        <div aria-hidden className="absolute inset-0 bg-[image:var(--pattern-ondas)] bg-[length:110px] opacity-40" />
        <div className="relative mx-auto max-w-[88rem]">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} tone="dark" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {s.items.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                className="glass-dark rounded-[24px] p-7"
              >
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <h3 className="mt-4 text-[1.35rem] leading-tight text-white">{it.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">{it.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Perguntas frequentes da regiao (abre e fecha com <details>: o texto fica sempre no HTML). */
export function AreasFaq() {
  const f = areas.faq
  return (
    <section id="faq" className="mx-auto grid max-w-[88rem] gap-10 px-5 py-20 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:py-28 lg:px-12">
      <SectionHeading eyebrow={f.eyebrow} title={f.title} accent={f.titleAccent} size="md" />
      <div className="divide-y divide-navy/10 border-y border-navy/10">
        {f.items.map((it) => (
          <details key={it.q} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.12rem] leading-snug font-medium text-navy [&::-webkit-details-marker]:hidden">
              {it.q}
              <CaretDown size={18} className="shrink-0 text-bronze transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-6 text-[15.5px] leading-relaxed text-graphite/85">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
