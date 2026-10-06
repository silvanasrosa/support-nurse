import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const ease = [0.16, 1, 0.3, 1] as const

type Props = {
  eyebrow: string
  title: string
  accent?: string
  className?: string
  children?: ReactNode
  /** dark = sobre fundo azul-marinho */
  tone?: 'light' | 'dark'
  /** md = titulo menor, para colunas estreitas (ex.: FAQ) */
  size?: 'lg' | 'md'
}

/** Selo das secoes: filete dourado + texto em caixa alta. */
export function Eyebrow({ children, tone = 'light', className = '' }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease }}
      className={`mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase ${tone === 'dark' ? 'text-gold' : 'text-bronze'} ${className}`}
    >
      <span aria-hidden className="h-px w-10 bg-gold" />
      {children}
    </motion.p>
  )
}

/** Cabecalho padrao das secoes: selo com filete dourado, titulo em DM Serif e destaque em italico bronze. */
export function SectionHeading({ eyebrow, title, accent, className = '', children, tone = 'light', size = 'lg' }: Props) {
  const dark = tone === 'dark'
  return (
    <div className={className}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease, delay: 0.05 }}
        className={`leading-[1.02] tracking-[-0.02em] ${size === 'md' ? 'text-[clamp(2.1rem,3.6vw,3.1rem)]' : 'text-[clamp(2.2rem,5vw,4rem)]'} ${dark ? 'text-white' : 'text-navy'}`}
      >
        {title}
        {accent && (
          <>
            {' '}
            <em className={dark ? 'text-gold' : 'text-bronze'}>{accent}</em>
          </>
        )}
      </motion.h2>
      {children}
    </div>
  )
}
