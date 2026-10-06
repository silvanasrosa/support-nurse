import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

type Props = { to: number; suffix?: string; duration?: number; delay?: number; className?: string }

export function CountUp({ to, suffix = '', duration = 1.8, delay = 0.9, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = `${to.toLocaleString('pt-BR')}${suffix}`
      return
    }
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v).toLocaleString('pt-BR')}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduce, to, suffix, duration, delay])

  return (
    <span ref={ref} className={className}>
      {`0${suffix}`}
    </span>
  )
}
