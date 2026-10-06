import { motion } from 'motion/react'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { finalCta } from '@/content/finalCta'
import { site } from '@/content/site'
import { PreAssessment } from './PreAssessment'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Chamada final (#contato), em cartao azul-marinho: a esquerda o convite do esboco, a frase do plano sob medida e
 * a central 24h; a direita a pre-avaliacao que monta a mensagem do WhatsApp. Celular e tablet: um embaixo do outro.
 */
export function FinalCta() {
  return (
    <section id="contato" className="px-2 sm:px-3">
      <div className="card-gutter relative isolate overflow-clip rounded-[28px] bg-navy py-20 text-white md:rounded-[36px] md:py-28">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:120px]" />
        <div aria-hidden className="absolute -top-40 left-[-8%] -z-10 size-[36rem] rounded-full bg-brand-blue/30 blur-3xl" />
        <div aria-hidden className="absolute right-[-10%] bottom-[-14rem] -z-10 size-[34rem] rounded-full bg-gold/15 blur-3xl" />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-24">
          <div>
            <SectionHeading tone="dark" eyebrow={finalCta.eyebrow} title={finalCta.title} accent={finalCta.titleAccent} />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/75"
            >
              {finalCta.text}
            </motion.p>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="mt-8 max-w-xl border-l-2 border-gold pl-5 font-display text-[1.35rem] leading-snug text-white italic md:text-[1.55rem]"
            >
              {finalCta.quote}
            </motion.blockquote>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: 0.3 }}
              className="mt-9"
            >
              <p className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">
                <span className="relative grid size-2.5 place-items-center">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative size-2 rounded-full bg-emerald-400" />
                </span>
                {finalCta.phoneLabel}
              </p>
              <PhoneButton label={site.phone.label} href={site.phone.href} />
            </motion.div>
          </div>

          <PreAssessment />
        </div>
      </div>
    </section>
  )
}
