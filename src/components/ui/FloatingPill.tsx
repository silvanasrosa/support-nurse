import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

type PillProps = {
  label: string
  /** Lado em que fica o ponto de ancoragem */
  dot?: 'left' | 'right'
  /** defasa a flutuacao entre pilulas vizinhas */
  delay?: number
  /** sm = versao compacta, para fileiras de pilulas */
  size?: 'md' | 'sm'
  className?: string
}

const PILL_SIZES = {
  md: 'gap-2.5 py-2 pr-4 pl-4 text-[13px] sm:text-sm',
  sm: 'gap-2 py-1.5 pr-3.5 pl-3 text-[13px]',
}

/** Pilula de vidro com ponto pulsante, flutuando de leve (o desenho das pilulas da hero). */
export function GlassPill({ label, dot = 'left', delay = 0, size = 'md', className = '' }: PillProps) {
  const reduce = useReducedMotion()
  const Dot = (
    <span className="relative grid size-3 place-items-center">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-navy/40" />
      <span className="relative size-2.5 rounded-full bg-navy" />
    </span>
  )
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
      className={`glass flex w-fit items-center rounded-full font-medium whitespace-nowrap text-navy ${PILL_SIZES[size]} ${className}`}
    >
      {dot === 'left' && Dot}
      {label}
      {dot === 'right' && Dot}
    </motion.div>
  )
}

type Props = {
  label: string
  /** Lado em que fica o ponto de ancoragem */
  dot: 'left' | 'right'
  /** Posicao (% do palco) a partir do tablet */
  x: number
  y: number
  /** Posicao (% do palco) em smartphones, onde o palco e um bloco proprio */
  mobile?: { x: number; y: number }
  delay?: number
  className?: string
}

/** Rotulo de vidro flutuante com ponto, como "Reliability" na referencia (posicionado no palco da hero). */
export function FloatingPill({ label, dot, x, y, mobile, delay = 0, className = '' }: Props) {
  return (
    <motion.div
      className={`absolute top-(--my) left-(--mx) z-20 md:top-(--py) md:left-(--px) ${className}`}
      style={
        {
          '--px': `${x}%`,
          '--py': `${y}%`,
          '--mx': `${mobile?.x ?? x}%`,
          '--my': `${mobile?.y ?? y}%`,
        } as CSSProperties
      }
      initial={{ opacity: 0, scale: 0.7, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 1.1 + delay }}
    >
      <GlassPill label={label} dot={dot} delay={delay} />
    </motion.div>
  )
}
