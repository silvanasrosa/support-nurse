import { createContext, useContext } from 'react'

/**
 * Estado da abertura (preloader do eletrocardiograma).
 * - intro: so o preloader na tela (a hero ainda nao foi montada)
 * - reveal: a hero monta e o orbe do preloader voa ate o titulo
 * - done: abertura concluida (orbe do titulo visivel)
 */
export type IntroPhase = 'intro' | 'reveal' | 'done'

export const IntroContext = createContext<{ phase: IntroPhase; played: boolean }>({ phase: 'done', played: false })

export const useIntro = () => useContext(IntroContext)

const KEY = 'sn-intro-seen'

/** Mostra a abertura so na primeira visita da sessao e nunca para quem pede menos movimento. */
let decided: boolean | null = null // decidido uma vez por carregamento (o StrictMode chama o inicializador 2x)

export function shouldPlayIntro() {
  if (decided !== null) return decided
  decided = true
  try {
    if (new URLSearchParams(window.location.search).has('intro')) return (decided = true) // ?intro forca a abertura
    if (window.location.hash) return (decided = false) // chegou com ancora (ex.: link do menu de outra pagina): vai direto
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return (decided = false)
    if (sessionStorage.getItem(KEY)) return (decided = false)
    sessionStorage.setItem(KEY, '1')
  } catch {
    // sem sessionStorage (modo privado etc.): mostra a abertura mesmo assim
  }
  return decided
}

/** Posicao de layout (ignora transforms de animacao), relativa a janela. */
export function layoutRect(el: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x: x - window.scrollX, y: y - window.scrollY, w: el.offsetWidth, h: el.offsetHeight }
}
