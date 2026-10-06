import { motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { ContactBand } from '@/components/ui/ContactBand'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { howItWorks } from '@/content/howItWorks'
import { useMedia } from '@/hooks/useMedia'
import { ScrollTrigger } from '@/lib/scroll'
import { PIN_HOLD, PULSE_BAND, PulseTrack } from './PulseTrack'
import { StepCard } from './StepCard'

const ease = [0.16, 1, 0.3, 1] as const
/** Desktop: rolagem (em svh) com a linha do tempo correndo e os cards presos na tela (depois, mais PIN_HOLD parado). */
const PIN_SCROLL = 110

/**
 * Secao "Como funciona": 4 etapas com foto, ligadas pela linha do batimento (a mesma do preloader).
 * A linha se desenha com a rolagem e o orbe acende cada etapa ao passar.
 * Desktop: 4 colunas com a linha por cima; a linha e os cards ficam presos no meio da tela enquanto a linha
 * avanca e soltam quando a ultima etapa acende. Tablet e celular: linha vertical a esquerda, sem prender.
 */
export function HowItWorks() {
  const vertical = !useMedia('(min-width: 1024px)')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const pinned = !vertical && !reduce
  const [active, setActive] = useState(0)
  const { closing } = howItWorks
  const pinRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  // a trilha presa tem a altura do container + a rolagem; a altura dele entra numa variavel CSS
  useLayoutEffect(() => {
    const pin = pinRef.current
    const frame = frameRef.current
    if (!pinned || !pin || !frame) return
    const ro = new ResizeObserver(() => {
      pin.style.setProperty('--frame-h', `${frame.offsetHeight}px`)
      ScrollTrigger.refresh()
    })
    ro.observe(frame)
    return () => ro.disconnect()
  }, [pinned])

  const track = (
    <>
      <PulseTrack vertical={vertical} active={active} onActive={setActive} />
      <div className={vertical ? 'flex flex-col gap-5' : 'grid grid-cols-4 gap-5'}>
        {howItWorks.steps.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} active={i < active} />
        ))}
      </div>
    </>
  )

  return (
    <section id="como-funciona" className="relative overflow-x-clip py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute top-40 -left-40 size-[30rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-24 size-[28rem] rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="site-gutter relative">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} accent={howItWorks.titleAccent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-xl text-[1.05rem] leading-relaxed text-graphite/85 md:text-lg"
          >
            {howItWorks.intro}
          </motion.p>
        </div>

        {/* trilha: a linha mede os cards (data-pulse-node) dentro deste container.
            Desktop: o container fica preso no meio da tela (sticky) dentro de uma trilha mais alta */}
        {pinned ? (
          <div ref={pinRef} className="relative mt-16" style={{ height: `calc(var(--frame-h, 640px) + ${PIN_SCROLL}svh + ${PIN_HOLD}px)` }}>
            <div
              ref={frameRef}
              className="sticky"
              style={{ top: 'max(1rem, calc((100svh - var(--frame-h, 640px)) / 2))', paddingTop: PULSE_BAND }}
            >
              {track}
            </div>
          </div>
        ) : (
          <div className={`relative mt-12 md:mt-16 ${vertical ? 'pl-11 md:pl-16' : ''}`} style={vertical ? undefined : { paddingTop: PULSE_BAND }}>
            {track}
          </div>
        )}

        {/* fechamento: o primeiro passo */}
        <ContactBand title={closing.title} text={closing.text} whatsappLabel={closing.whatsappLabel} className="mt-12 md:mt-16" />
      </div>
    </section>
  )
}
