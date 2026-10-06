import { Certificate, ClockCountdown, ShieldCheck } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { team, type SealIcon } from '@/content/team'

const ease = [0.16, 1, 0.3, 1] as const
const ICONS: Record<SealIcon, Icon> = { clock: ClockCountdown, shield: ShieldCheck, certificate: Certificate }

/**
 * Selos de garantia da equipe, empilhados: no tablet e desktop ficam na coluna da direita (35%),
 * dividindo a altura do painel "Onde nossa equipe se formou". No tablet (coluna estreita) o icone vai para cima.
 */
export function GuaranteeSeals({ className = '' }: { className?: string }) {
  const { seals } = team.guarantees
  return (
    <ul className={`grid gap-3 md:auto-rows-fr md:gap-4 ${className}`}>
      {seals.map((s, i) => {
        const Ico = ICONS[s.icon]
        return (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            className="flex items-center gap-4 rounded-[1.5rem] bg-white/[0.06] p-4 ring-1 ring-white/12 md:gap-5 md:px-6 md:py-5 md:max-lg:flex-col md:max-lg:items-start md:max-lg:justify-center md:max-lg:gap-3"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30 md:size-14">
              <Ico size={26} weight="duotone" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg text-white md:text-xl">{s.title}</span>
              <span className="mt-1 block text-[13px] text-white/60">{s.text}</span>
            </span>
          </motion.li>
        )
      })}
    </ul>
  )
}

/** Nota completa sobre a equipe, com filete dourado, ocupando a largura toda da secao. */
export function GuaranteeNote({ className = '' }: { className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay: 0.1 }}
      className={`border-l-2 border-gold/60 pl-6 text-[15px] leading-relaxed text-white/75 md:text-base ${className}`}
    >
      {team.guarantees.note}
    </motion.p>
  )
}
