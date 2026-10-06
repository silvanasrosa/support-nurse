import { MapPin } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { CtaButton } from '@/components/ui/CtaButton'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { aboutPage } from '@/content/aboutPage'
import { HeroHeader } from '@/sections/Hero/HeroHeader'

const ease = [0.16, 1, 0.3, 1] as const

function Line({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`-mb-[0.1em] block overflow-hidden pb-[0.1em] ${className}`}>
      <motion.span className="block" initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay }}>
        {children}
      </motion.span>
    </span>
  )
}

/** Faixa de numeros do esboco (15 anos, 24h, 100%...), no vidro da hero. */
function StatsStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 0.9 }}
      className="nav-ring nav-ring-card w-full"
    >
      <dl className="glass-liquid grid grid-cols-2 gap-x-4 gap-y-5 rounded-[1.725rem] px-5 py-5 sm:grid-cols-3 sm:px-7 md:grid-cols-6 md:gap-x-4 md:px-5 lg:gap-x-5 lg:px-6">
        {aboutPage.stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block text-[1.7rem] leading-none font-semibold tracking-tight text-brand-blue md:max-lg:text-[1.4rem] lg:text-[1.85rem]">{s.value}</span>
              <span className="mt-2 block text-[11px] leading-snug font-medium text-navy/75 md:max-lg:text-[10px]">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}

/**
 * Abertura da pagina "Quem somos", no mesmo desenho da hero: header integrado, fundo claro a esquerda e, no
 * lugar do painel azul (48% da direita), a foto real da recepcao inteira. Esquerda: selo, "Conheca a Support
 * Nurse.", texto e botao. Embaixo, a faixa de numeros na largura toda, por cima das duas colunas.
 * Celular: texto, foto e numeros em coluna.
 */
export function AboutHero() {
  const p = aboutPage
  return (
    <section id="inicio" className="p-2 sm:p-3">
      <div className="relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[#f7f8fd] shadow-[0_30px_80px_rgba(36,43,85,0.12)] md:grid md:min-h-[min(calc(100svh-1.5rem),max(560px,72vw))] md:grid-cols-[38fr_30fr_32fr] md:grid-rows-[auto_1fr_auto] md:rounded-[36px]">
        {/* painel da direita (tablet e desktop): a foto da recepcao inteira, no lugar do azul da hero */}
        <motion.div
          initial={{ x: '14%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.05 }}
          className="absolute inset-y-0 right-0 z-0 hidden w-[48%] overflow-hidden rounded-r-[36px] bg-navy md:block"
        >
          <PhotoSlot src={p.photo.src} alt={p.photo.alt} icon={MapPin} label="Foto da recepção" tone="dark" loading="eager" className="object-[22%_45%]" />
          {/* sombra no alto para os botoes do header e embaixo para a faixa de numeros */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-navy/75 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/60 to-transparent" />
        </motion.div>
        {/* brilhos do lado claro */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-[4%] size-[22rem] rounded-full bg-brand-blue/30 blur-3xl [animation:drift-a_16s_ease-in-out_infinite]" />
          <div className="absolute top-[2%] left-[26%] size-[18rem] rounded-full bg-gold/35 blur-3xl [animation:drift-b_19s_ease-in-out_infinite]" />
        </div>

        <HeroHeader />

        {/* texto */}
        <div className="relative z-20 px-5 pt-10 sm:px-8 md:col-span-2 md:col-start-1 md:row-start-2 md:self-center md:px-8 md:pt-6 md:pr-[4%] lg:px-10 xl:px-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-bronze uppercase"
          >
            <span aria-hidden className="h-px w-10 bg-gold" />
            {p.eyebrow}
          </motion.p>
          <h1 className="text-[clamp(3rem,14vw,5.2rem)] leading-[0.95] tracking-[-0.025em] text-navy md:text-[clamp(3rem,min(6.4vw,14svh),8.2rem)]">
            <Line delay={0.25}>{p.title}</Line>
            <Line delay={0.38}>
              <em className="text-bronze">{p.titleAccent}</em>
            </Line>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 }}
            className="mt-6 max-w-[34rem] text-[1.1rem] leading-relaxed text-graphite/85 md:max-w-[min(34rem,72%)] lg:text-[1.2rem]"
          >
            {p.text} <span className="font-semibold text-navy">{p.founded}</span>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.75 }} className="mt-7">
            <CtaButton href={p.cta.href}>{p.cta.label}</CtaButton>
          </motion.div>
        </div>

        {/* celular: a foto entre o texto e os numeros */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.45 }}
          className="relative z-20 mx-5 mt-10 aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_rgba(10,14,40,0.3)] sm:mx-8 md:hidden"
        >
          <PhotoSlot src={p.photo.src} alt={p.photo.alt} icon={MapPin} label="Foto da recepção" tone="dark" loading="eager" className="object-[24%_40%]" />
        </motion.div>

        {/* numeros: na largura toda, por cima das duas colunas */}
        <div className="relative z-20 px-5 pt-6 pb-5 sm:px-8 sm:pb-6 md:col-span-3 md:col-start-1 md:row-start-3 md:self-end md:px-8 md:pt-7 md:pb-6 lg:px-10 lg:pb-8 xl:px-14">
          <StatsStrip />
        </div>
      </div>
    </section>
  )
}
