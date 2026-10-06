import { motion } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { team } from '@/content/team'
import { GuaranteeNote, GuaranteeSeals } from './Guarantees'
import { RoleGrid } from './RoleGrid'
import { Training } from './Training'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Secao "Equipe" (cartao azul-marinho, como o catalogo):
 * equipe multiprofissional (8 funcoes com foto), onde a equipe se formou e garantias.
 * A fundadora tem secao propria (sections/Founder). Cada bloco e um componente: da para remover ou reordenar aqui.
 */
export function Team() {
  const { staff } = team
  return (
    <section id="equipe" className="px-2 sm:px-3">
      <div className="card-gutter relative isolate overflow-clip rounded-[28px] bg-navy py-20 text-white md:rounded-[36px] md:py-28">
        {/* fundo: ondas + brilhos */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:120px]" />
        <div aria-hidden className="absolute -top-40 left-[-10%] -z-10 size-[36rem] rounded-full bg-brand-blue/25 blur-3xl" />
        <div aria-hidden className="absolute top-[45%] right-[-12%] -z-10 size-[32rem] rounded-full bg-gold/10 blur-3xl" />
        <div aria-hidden className="absolute bottom-[-10rem] left-[20%] -z-10 size-[30rem] rounded-full bg-brand-blue/20 blur-3xl" />

        {/* cabecalho */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading tone="dark" eyebrow={staff.eyebrow} title={staff.title} accent={staff.titleAccent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-xl text-[1.05rem] leading-relaxed text-white/75"
          >
            {staff.intro}
          </motion.p>
        </div>

        <div className="mt-12 md:mt-16">
          <RoleGrid />
        </div>

        {/* tablet e desktop: "onde nossa equipe se formou" (65%) + selos de garantia empilhados (35%) */}
        <div className="mt-20 grid gap-4 md:mt-28 md:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] md:gap-5">
          <Training />
          <GuaranteeSeals />
        </div>

        {/* nota sobre a equipe: largura toda */}
        <GuaranteeNote className="mt-10 md:mt-14" />
      </div>
    </section>
  )
}
