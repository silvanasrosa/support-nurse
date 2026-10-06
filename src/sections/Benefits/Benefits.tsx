import { ChatCircleText } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { benefits } from '@/content/benefits'
import { BenefitCard, BentoCard, UrgencyCard } from './BenefitCards'
import { ReportPhone } from './ReportPhone'

const ease = [0.16, 1, 0.3, 1] as const

/** Card grande (azul): relatorio diario, com o celular mostrando a conversa chegando. */
function ReportCard({ className = '' }: { className?: string }) {
  const r = benefits.report
  return (
    <BentoCard className={`bg-navy text-white ${className}`}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:110px] opacity-70" />
      <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-brand-blue/40 blur-3xl" />
      <div className="relative flex h-full flex-col gap-8 p-7 lg:p-8">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-gold/20 text-gold ring-1 ring-gold/35">
            <ChatCircleText size={26} weight="duotone" />
          </span>
          <h3 className="mt-5 text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.1]">{r.title}</h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-white/75">{r.text}</p>
        </div>
        <div className="mt-auto">
          <ReportPhone />
        </div>
      </div>
    </BentoCard>
  )
}

/**
 * Secao "O que a familia recebe": mosaico com os 6 beneficios do contrato.
 * Destaques: celular com o relatorio diario chegando (coluna inteira da esquerda) e foto da central 24h
 * com relogio ao vivo. Os outros 4 sao cards de vidro com brilho que segue o mouse.
 * Desktop: 3 colunas. Tablet: 2. Celular: 1.
 */
export function Benefits() {
  return (
    <section id="beneficios" className="relative overflow-x-clip py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute top-32 -right-40 size-[30rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-20 -left-40 size-[30rem] rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="site-gutter relative">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow={benefits.eyebrow} title={benefits.title} accent={benefits.titleAccent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-xl text-[1.05rem] leading-relaxed text-graphite/85 md:text-lg"
          >
            {benefits.intro}
          </motion.p>
        </div>

        {/* mosaico: lg = celular na coluna 1 (3 linhas) + foto em 2 colunas + 4 cards | md = 2 colunas */}
        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          <ReportCard className="md:row-span-2 lg:row-span-3" />
          <UrgencyCard className="lg:col-span-2" />
          <BenefitCard index={0} />
          <BenefitCard index={1} />
          <BenefitCard index={2} />
          <BenefitCard index={3} className="md:max-lg:col-span-2" />
        </div>
      </div>
    </section>
  )
}
