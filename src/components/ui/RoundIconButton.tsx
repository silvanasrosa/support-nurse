import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  href: string
  label: string
  tone?: 'dark' | 'light' | 'white' | 'gold' | 'glass' | 'adaptive'
  children: ReactNode
  className?: string
}

const tones = {
  dark: 'bg-navy-900 text-white hover:bg-black',
  gold: 'bg-gold text-navy hover:bg-gold-600',
  glass: 'bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md hover:bg-gold hover:text-navy hover:ring-gold',
  // fundo claro no smartphone (header sobre area clara) e vidro escuro a partir do tablet (sobre o painel azul)
  adaptive:
    'bg-white/70 text-navy ring-1 ring-white shadow-[0_2px_10px_rgba(36,43,85,0.12)] backdrop-blur-md hover:bg-gold hover:text-navy hover:ring-gold md:bg-white/15 md:text-white md:shadow-none md:ring-white/25',
  light: 'bg-white/25 text-white hover:bg-white/40 backdrop-blur-md',
  white: 'bg-white text-navy hover:bg-navy-50 shadow-[0_2px_10px_rgba(36,43,85,0.14)]',
}

export function RoundIconButton({ href, label, tone = 'dark', children, className = '' }: Props) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors sm:size-11 ${tones[tone]} ${className}`}
    >
      {children}
    </motion.a>
  )
}
