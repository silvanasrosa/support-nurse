import { motion } from 'motion/react'
import { HeroHeader } from './HeroHeader'
import { HeroFeedback, HeroSidePanel } from './HeroSidePanel'
import { HeroStage } from './HeroStage'
import { HeroStats } from './HeroStats'
import { HeroTitle } from './HeroTitle'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Hero com header integrado. Desktop: grade 38/30/32 com painel escuro ocupando os 48% da direita
 * e o palco central cruzando a divisoria. Abaixo de md (smartphones): coluna unica, painel escuro em bloco.
 */
export function Hero() {
  return (
    <section id="inicio" className="p-2 sm:p-3">
      <div className="relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[#f7f8fd] shadow-[0_30px_80px_rgba(36,43,85,0.12)] md:grid md:min-h-[min(calc(100svh-1.5rem),max(560px,72vw))] md:grid-cols-[38fr_30fr_32fr] md:grid-rows-[auto_1fr_auto] md:rounded-[36px]">
        {/* Painel escuro (desktop) */}
        <motion.div
          aria-hidden
          initial={{ x: '14%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.05 }}
          className="absolute inset-y-0 right-0 z-0 hidden w-[48%] overflow-hidden rounded-r-[36px] bg-navy md:block"
        >
          <div className="absolute inset-0 bg-[image:var(--pattern-ondas)] bg-[length:120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_20%,rgba(19,112,181,0.45),transparent_70%)]" />
        </motion.div>

        {/* Orbes de cor em deriva lenta: dao o que o vidro do menu refrata (efeito de video translucido) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-[4%] size-[22rem] rounded-full bg-brand-blue/30 blur-3xl [animation:drift-a_16s_ease-in-out_infinite]" />
          <div className="absolute top-[2%] left-[26%] size-[18rem] rounded-full bg-gold/35 blur-3xl [animation:drift-b_19s_ease-in-out_infinite]" />
          <div className="absolute top-[30%] -left-16 size-[20rem] rounded-full bg-navy/20 blur-3xl [animation:drift-b_23s_ease-in-out_infinite]" />
        </div>

        <HeroHeader />
        <HeroTitle />
        <HeroStage />
        <HeroSidePanel />
        <HeroStats />
        <HeroFeedback />
      </div>
    </section>
  )
}
