import { Check, Copy, Phone } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { copyText } from '@/lib/clipboard'

const COPIED = 'Número copiado'

type Props = {
  label: string
  href: string
  className?: string
}

/**
 * Pilula de telefone (fundo escuro): o numero liga direto (tel:) e o circulo da direita copia o numero,
 * para quem prefere colar no discador ou esta no computador. Ao copiar, o texto vira "Numero copiado".
 */
export function PhoneButton({ label, href, className = '' }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    if (!(await copyText(label))) return
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className={`relative inline-flex items-center rounded-full p-1.5 ring-1 ring-white/25 ring-inset ${className}`}>
      <a
        href={href}
        className="flex flex-1 items-center gap-2.5 self-stretch pr-4 pl-[18px] text-sm font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 hover:text-gold"
      >
        <Phone size={18} weight="bold" className="shrink-0" />
        {/* ao copiar, o numero vira o aviso por alguns segundos (copias invisiveis reservam a largura do maior) */}
        <span className="grid">
          <span aria-hidden className="invisible [grid-area:1/1]">{label}</span>
          <span aria-hidden className="invisible [grid-area:1/1]">{COPIED}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'ok' : 'num'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`[grid-area:1/1] ${copied ? 'text-gold' : ''}`}
            >
              {copied ? COPIED : label}
            </motion.span>
          </AnimatePresence>
        </span>
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? COPIED : 'Copiar número'}
        title="Copiar número"
        className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
          copied ? 'bg-gold text-navy' : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'ok' : 'copy'}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid place-items-center"
          >
            {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* aviso para leitores de tela */}
      <span aria-live="polite" className="sr-only">
        {copied ? COPIED : ''}
      </span>
    </div>
  )
}
