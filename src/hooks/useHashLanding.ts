import { useEffect } from 'react'
import { jumpToY, ScrollTrigger } from '@/lib/scroll'

/** A chegada com ancora acontece uma vez por carregamento da pagina. */
let landed = false

/**
 * Chegada com ancora na URL (ex.: vindo da pagina "Quem somos" para "/#especialidades"): o navegador tenta ir
 * para a secao antes de o React montar a pagina e nao a encontra. Aqui, quando a pagina esta montada (ready),
 * espera as fontes e o layout assentarem, recalcula as secoes presas na rolagem e vai direto para a secao.
 */
export function useHashLanding(ready: boolean) {
  useEffect(() => {
    if (!ready || landed) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    let cancelled = false
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    const go = async () => {
      await document.fonts?.ready
      await frame()
      if (cancelled) return
      ScrollTrigger.refresh()
      await frame()
      const el = document.getElementById(id)
      // (o StrictMode monta o efeito duas vezes: so a ultima montagem, a que nao foi cancelada, faz a rolagem)
      if (!el || cancelled || landed) return
      landed = true
      jumpToY(el.getBoundingClientRect().top + window.scrollY)
    }
    go()
    return () => {
      cancelled = true
    }
  }, [ready])
}
