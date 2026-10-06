import { motion } from 'motion/react'
import { useState } from 'react'
import { ContactBand } from '@/components/ui/ContactBand'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { howItWorks } from '@/content/howItWorks'
import { useMedia } from '@/hooks/useMedia'
import { PULSE_BAND, PulseTrack } from './PulseTrack'
import { StepCard } from './StepCard'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Secao "Como funciona": 4 etapas com foto, ligadas pela linha do batimento (a mesma do preloader).
 * A linha se desenha com a rolagem e o orbe acende cada etapa ao passar.
 * Desktop: 4 colunas com a linha por cima. Tablet e celular: linha vertical a esquerda.
 */
export function HowItWorks() {
  const vertical = !useMedia('(min-width: 1024px)')
  const [active, setActive] = useState(0)
  const { closing } = howItWorks

  return (
    <section id="como-funciona" className="relative overflow-x-clip py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute top-40 -left-40 size-[30rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-24 size-[28rem] rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="site-gutter relative">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} accent={howItWorks.titleAccent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-xl text-[1.05rem] leading-relaxed text-graphite/85 md:text-lg"
          >
            {howItWorks.intro}
          </motion.p>
        </div>

        {/* trilha: a linha mede os cards (data-pulse-node) dentro deste container */}
        <div className={`relative mt-12 md:mt-16 ${vertical ? 'pl-11 md:pl-16' : ''}`} style={vertical ? undefined : { paddingTop: PULSE_BAND }}>
          <PulseTrack vertical={vertical} active={active} onActive={setActive} />
          <div className={vertical ? 'flex flex-col gap-5' : 'grid grid-cols-4 gap-5'}>
            {howItWorks.steps.map((step, i) => (
              <StepCard key={step.id} step={step} index={i} active={i < active} />
            ))}
          </div>
        </div>

        {/* fechamento: o primeiro passo */}
        <ContactBand title={closing.title} text={closing.text} whatsappLabel={closing.whatsappLabel} className="mt-12 md:mt-16" />
      </div>
    </section>
  )
}
