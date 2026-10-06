import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/** Instancia unica da rolagem suave (para pausar em modais etc.). */
let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}

/** Trava/destrava a rolagem da pagina (modais, menu). */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) instance?.stop()
  else instance?.start()
}

/** Rola ate uma posicao absoluta da pagina (pela rolagem suave quando ativa). */
export function scrollToY(y: number, duration = 1.2) {
  if (instance) instance.scrollTo(y, { duration })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

/** Vai direto para uma posicao, sem animacao (mantendo a rolagem suave sincronizada). */
export function jumpToY(y: number) {
  if (instance) instance.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
}

export { gsap, ScrollTrigger }
