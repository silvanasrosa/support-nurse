import { WhatsappLogo } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '@/content/site'

/**
 * Botao flutuante do WhatsApp (canto de baixo a direita, nas duas paginas). Aparece depois da abertura e some
 * enquanto a chamada final (#contato) esta na tela, onde os botoes de contato ja estao.
 */
export function WhatsAppFab() {
  const [past, setPast] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    // a secao de contato pode montar depois (abertura): procura de novo ate achar
    let io: IntersectionObserver | null = null
    const watch = () => {
      const el = document.getElementById('contato')
      if (!el) return false
      io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.25 })
      io.observe(el)
      return true
    }
    const retry = watch() ? 0 : window.setInterval(() => watch() && window.clearInterval(retry), 1000)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(retry)
      io?.disconnect()
    }
  }, [])

  const show = past && !atContact
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="fab"
          href={site.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a coordenadora no WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="group fixed right-4 bottom-4 z-40 flex items-center gap-3 sm:right-6 sm:bottom-6"
        >
          <span className="pointer-events-none hidden translate-x-2 rounded-full bg-navy px-4 py-2 text-sm font-medium whitespace-nowrap text-white opacity-0 shadow-[0_10px_30px_rgba(36,43,85,0.3)] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
            Fale com a coordenadora
          </span>
          <span className="relative grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition-transform duration-300 group-hover:scale-105">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.4s]" />
            <WhatsappLogo size={30} weight="fill" className="relative" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
