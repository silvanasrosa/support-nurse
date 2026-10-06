import { motion } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { about } from '@/content/about'
import { FactCard, MapPanel } from './AboutParts'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Secao de transparencia da pagina "Quem somos", em cartao azul-marinho como a equipe: os 6 dados que a familia consegue
 * conferir (desde quando, equipe, CNPJ, endereco, contrato), entrando em cascata, e o mapa escuro com o endereco.
 * Desktop: dados em 2 colunas + mapa a direita. Celular e tablet: dados e, embaixo, o mapa.
 */
export function About() {
  return (
    <section id="transparencia" className="px-2 sm:px-3">
      <div className="card-gutter relative isolate overflow-clip rounded-[28px] bg-navy py-20 text-white md:rounded-[36px] md:py-28">
        {/* fundo: ondas + brilhos */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:120px]" />
        <div aria-hidden className="absolute -top-40 right-[-10%] -z-10 size-[36rem] rounded-full bg-brand-blue/25 blur-3xl" />
        <div aria-hidden className="absolute bottom-[-12rem] left-[-8%] -z-10 size-[32rem] rounded-full bg-gold/10 blur-3xl" />

        {/* cabecalho */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading tone="dark" eyebrow={about.eyebrow} title={about.title} accent={about.titleAccent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-xl text-[1.05rem] leading-relaxed text-white/75"
          >
            {about.intro}
          </motion.p>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-5">
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid gap-4 sm:grid-cols-2 lg:gap-5"
          >
            {about.facts.map((f) => (
              <FactCard key={f.label} fact={f} />
            ))}
          </motion.ul>
          <MapPanel />
        </div>
      </div>
    </section>
  )
}
