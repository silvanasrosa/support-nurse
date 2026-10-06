import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger, scrollToY } from '@/lib/scroll'

/**
 * Rolagem em etapas: o quadro (frameRef) fica preso com position sticky dentro da trilha (trackRef,
 * quadro + espacador) e o progresso da rolagem escolhe o item ativo. ringRef recebe o progresso
 * (stroke-dashoffset 1 a 0). O quadro ganha a variavel --frame-h (sua altura) para calcular o "top" do sticky.
 * Desligado (enabled = false), vira uma selecao comum.
 */
export function useScrollSteps(count: number, enabled: boolean) {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const frozen = useRef(false)
  const timer = useRef(0)

  const select = useCallback((i: number) => {
    activeRef.current = i
    setActive(i)
  }, [])

  useLayoutEffect(() => {
    const track = trackRef.current
    const frame = frameRef.current
    if (!enabled || !track || !frame) return
    const st = ScrollTrigger.create({
      trigger: track,
      // comeca quando o quadro gruda (respeita o "top" do sticky, que pode ser negativo) e dura o que sobra da trilha
      start: () => `top ${parseFloat(getComputedStyle(frame).top) || 0}px`,
      end: () => `+=${track.offsetHeight - frame.offsetHeight}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        ringRef.current?.style.setProperty('stroke-dashoffset', String(1 - self.progress))
        if (frozen.current) return
        const i = Math.round(self.progress * (count - 1))
        if (i !== activeRef.current) select(i)
      },
    })
    trigger.current = st
    // altura do quadro para o "top" centralizado; recalcula os gatilhos quando ela muda
    const ro = new ResizeObserver(() => {
      frame.style.setProperty('--frame-h', `${frame.offsetHeight}px`)
      ScrollTrigger.refresh()
    })
    ro.observe(frame)
    return () => {
      ro.disconnect()
      frame.style.removeProperty('--frame-h')
      st.kill()
      trigger.current = null
      frozen.current = false
      window.clearTimeout(timer.current)
    }
  }, [enabled, count, select])

  /** Rolagem programada: congela a troca de itens no caminho e sincroniza ao terminar. */
  const glide = useCallback(
    (y: number, duration: number) => {
      frozen.current = true
      window.clearTimeout(timer.current)
      scrollToY(y, duration)
      timer.current = window.setTimeout(() => {
        frozen.current = false
        const st = trigger.current
        if (st) select(Math.round(st.progress * (count - 1)))
      }, duration * 1000 + 120)
    },
    [count, select],
  )

  /** Vai para o item i (com a trilha ativa, rola ate a posicao dele). */
  const goTo = useCallback(
    (i: number) => {
      select(i)
      const st = trigger.current
      if (st) glide(st.start + (i / (count - 1)) * (st.end - st.start), 0.9)
    },
    [count, glide, select],
  )

  /** Pula a trilha: ate o elemento indicado (centralizado na tela) ou, sem ele, ate o fim da secao (inicio da proxima). */
  const skip = useCallback(
    (to?: HTMLElement | null) => {
      if (to) {
        const r = to.getBoundingClientRect()
        glide(r.top + window.scrollY - Math.max(16, (window.innerHeight - r.height) / 2), 1.2)
        return
      }
      const section = trackRef.current?.closest('section')
      if (section) glide(section.getBoundingClientRect().bottom + window.scrollY, 1.4)
    },
    [glide],
  )

  return { active, goTo, skip, trackRef, frameRef, ringRef }
}
