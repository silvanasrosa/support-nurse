import { ArrowUpRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'

type Props = {
  href: string
  children: string
  /** texto curto exibido no celular (abaixo de 640px) */
  shortLabel?: string
  className?: string
  variant?: 'navy' | 'gold'
  /** abre em nova aba (WhatsApp, redes) */
  external?: boolean
}

const VARIANTS = {
  navy: { pill: 'bg-gradient-to-r from-navy via-navy-600 to-brand-blue text-white shadow-[0_12px_30px_rgba(36,43,85,0.35)]', dot: 'bg-white text-navy' },
  gold: { pill: 'bg-gold text-navy shadow-[0_12px_30px_rgba(236,171,91,0.3)]', dot: 'bg-navy text-white' },
}

/** Botao pilula com degrade e circulo de icone, como na referencia. */
export function CtaButton({ href, children, shortLabel, className = '', variant = 'navy', external = false }: Props) {
  const v = VARIANTS[variant]
  return (
    <motion.a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center gap-4 overflow-hidden rounded-full py-1.5 pr-1.5 pl-6 text-sm font-semibold tracking-wide ${v.pill} ${className}`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ x: '-120%' }}
        variants={{ hover: { x: '120%', transition: { duration: 0.9, ease: 'easeInOut' } } }}
      />
      {shortLabel ? (
        <>
          <span className="relative whitespace-nowrap sm:hidden">{shortLabel}</span>
          <span className="relative hidden sm:inline">{children}</span>
        </>
      ) : (
        <span className="relative">{children}</span>
      )}
      <motion.span
        className={`relative grid size-10 shrink-0 place-items-center rounded-full ${v.dot}`}
        variants={{ hover: { rotate: 45 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <ArrowUpRight size={18} weight="bold" />
      </motion.span>
    </motion.a>
  )
}
