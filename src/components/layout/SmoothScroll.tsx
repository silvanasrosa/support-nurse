import Lenis from 'lenis'
import { useEffect } from 'react'
import { ScrollTrigger, setLenis } from '@/lib/scroll'

/** Rolagem suave (Lenis) sincronizada com o GSAP ScrollTrigger. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
