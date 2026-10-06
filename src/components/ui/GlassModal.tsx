import { X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { lockScroll } from '@/lib/scroll'

type Props = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}

/** Modal em vidro: fecha no X, no Esc e clicando fora. Trava a rolagem enquanto aberto. */
export function GlassModal({ open, onClose, label, children }: Props) {
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 cursor-default bg-navy/45 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88svh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-[#f7f8fd]/95 p-7 shadow-[0_40px_100px_rgba(15,19,48,0.45)] ring-1 ring-white sm:p-10"
          >
            {/* o .glass-liquid fixa position: relative, por isso o posicionamento fica no wrapper */}
            <div className="absolute top-5 right-5">
              <button type="button" onClick={onClose} aria-label="Fechar" className="glass-liquid grid size-10 place-items-center rounded-full text-navy">
                <X size={18} weight="bold" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
