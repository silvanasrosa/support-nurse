import { ArrowLeft, BatteryFull, Check, Checks, DotsThreeVertical, Microphone, Phone, Smiley, VideoCamera, WifiHigh } from '@phosphor-icons/react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { benefits, type ChatMessage } from '@/content/benefits'
import { useClock } from '@/hooks/useClock'

const ease = [0.16, 1, 0.3, 1] as const
const TYPING_MS = 1100 // "digitando..." antes de cada mensagem
const GAP_MS = 500 // pausa depois de cada mensagem
const BASE_W = 312 // largura do aparelho em que a conversa foi desenhada; menor que isso, a tela encolhe junto

/*
 * Mockup: imagem do aparelho (moldura com a tela transparente) por cima de uma "tela" em HTML.
 * A tela ocupa a area transparente da moldura (medida na imagem de 910x1796).
 */
const SHELL = { src: '/images/beneficios/celular.webp', ratio: '910 / 1796' }
const SCREEN = { left: '8.68%', top: '4.18%', width: '83.08%', height: '91.09%', radius: '15% / 7.6%' }

/** Cores do app de conversa (modo claro). */
const WA = { header: '#008069', out: '#d9fdd3', read: '#53bdeb', mic: '#00a884' }

/** "Rabinho" do balao, no canto de cima. */
function Tail({ side, color = '#ffffff' }: { side: 'left' | 'right'; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 8 13" className={`absolute top-0 h-[13px] w-2 ${side === 'left' ? '-left-2' : '-right-2 -scale-x-100'}`}>
      <path d="M8 0H1.53C.33 0-.27 1.38.53 2.27L8 10.6V0Z" fill={color} />
    </svg>
  )
}

/** "Digitando..." num balao de entrada. */
function Typing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="relative flex w-fit items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
      aria-hidden
    >
      <Tail side="left" />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-[#8696a0]"
          animate={{ y: [0, -2.5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  )
}

/** Hora do balao (e os dois checks azuis, na mensagem da familia). */
function Meta({ m, className = '' }: { m: ChatMessage; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[8.5px] leading-none whitespace-nowrap text-[#667781] ${className}`}>
      {m.time}
      {m.from === 'family' && <Checks size={12} weight="bold" style={{ color: WA.read }} />}
    </span>
  )
}

/**
 * Um balao da conversa: equipe a esquerda (branco), familia a direita (verde claro, com os dois checks azuis).
 * Como no app, a hora fica no fim da ultima linha do texto: uma copia invisivel dela reserva o lugar
 * e, se nao couber, a linha quebra e a hora desce sozinha.
 */
function Bubble({ m, first }: { m: ChatMessage; first: boolean }) {
  const family = m.from === 'family'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease }}
      className={`relative max-w-[86%] rounded-lg px-2.5 py-1.5 text-[11.5px] leading-[1.4] text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
        family ? 'ml-auto' : ''
      } ${first ? (family ? 'rounded-tr-none' : 'rounded-tl-none') : ''}`}
      style={{ background: family ? WA.out : '#fff' }}
    >
      {first && <Tail side={family ? 'right' : 'left'} color={family ? WA.out : '#fff'} />}
      {m.text && (
        <p className={m.check ? 'flex items-start gap-1.5' : ''}>
          {m.check && (
            <span className="mt-[1.5px] grid size-3.5 shrink-0 place-items-center rounded-full text-white" style={{ background: WA.mic }}>
              <Check size={9} weight="bold" />
            </span>
          )}
          <span>
            {m.text}
            <Meta m={m} className="invisible ml-2.5" />
          </span>
        </p>
      )}
      {m.vitals && (
        <>
          <dl className="grid grid-cols-2 gap-1">
            {m.vitals.map(([k, v]) => (
              <div key={k} className="rounded-md bg-[#f0f2f5] px-2 py-1">
                <dt className="text-[8.5px] font-medium text-[#667781]">{k}</dt>
                <dd className="text-[13px] leading-tight font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-0.5 text-right">
            <Meta m={m} />
          </p>
        </>
      )}
      {m.text && <Meta m={m} className="absolute right-2 bottom-[5px]" />}
    </motion.div>
  )
}

/**
 * Celular com a conversa do relatorio diario (mockup real: moldura em imagem + tela em HTML).
 * As mensagens chegam uma a uma, com "digitando..." antes, quando o card entra na tela.
 */
export function ReportPhone() {
  const { chat } = benefits.report
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const now = useClock()
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const screenRef = useRef<HTMLDivElement>(null)

  // aparelho menor (tablet, celular): a conversa encolhe na mesma proporcao, sem quebrar as linhas de outro jeito
  useEffect(() => {
    const wrap = ref.current
    const screen = screenRef.current
    if (!wrap || !screen) return
    const ro = new ResizeObserver(() => {
      screen.style.zoom = String(Math.min(1, wrap.offsetWidth / BASE_W))
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reduce) return
    let cancelled = false
    const timers: number[] = []
    const next = (i: number) => {
      if (cancelled || i >= chat.messages.length) return
      setTyping(true)
      timers.push(
        window.setTimeout(() => {
          setTyping(false)
          setShown(i + 1)
          timers.push(window.setTimeout(() => next(i + 1), GAP_MS))
        }, TYPING_MS),
      )
    }
    next(0)
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [inView, reduce, chat.messages.length])

  const visible = reduce ? chat.messages.length : shown
  const nextFrom = chat.messages[visible]?.from
  const teamTyping = typing && nextFrom === 'team'

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[17.5rem] drop-shadow-[0_40px_50px_rgba(10,14,40,0.45)] xl:max-w-[19.5rem]">
      <div className="relative w-full" style={{ aspectRatio: SHELL.ratio }}>
        {/* tela */}
        <div
          ref={screenRef}
          className="absolute flex flex-col overflow-hidden bg-[#efeae2]"
          style={{ left: SCREEN.left, top: SCREEN.top, width: SCREEN.width, height: SCREEN.height, borderRadius: SCREEN.radius }}
        >
          <div aria-hidden className="absolute inset-0 bg-cover bg-top opacity-90" style={{ backgroundImage: 'url(/images/beneficios/chat-fundo.webp)' }} />

          {/* barra de status (a ilha da moldura fica no meio) */}
          <div
            className="relative z-10 flex h-[6.5%] shrink-0 items-end justify-between px-[9%] pb-0.5 text-[10px] font-semibold text-white"
            style={{ background: WA.header }}
          >
            <span>{now}</span>
            <span className="flex items-center gap-1">
              <WifiHigh size={11} weight="bold" />
              <BatteryFull size={13} weight="fill" />
            </span>
          </div>

          {/* cabecalho da conversa */}
          <div className="relative z-10 flex shrink-0 items-center gap-1.5 px-2 py-1.5 text-white" style={{ background: WA.header }}>
            <ArrowLeft size={14} weight="bold" />
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy ring-1 ring-white/30">
              <img src="/logos/simbolo-branco.svg" alt="" width={16} height={16} className="size-4" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[11.5px] font-semibold">{chat.name}</span>
              <span className="block truncate text-[9px] text-white/80">{teamTyping ? 'digitando...' : 'online'}</span>
            </span>
            <span className="flex items-center gap-2 text-white/95">
              <VideoCamera size={14} weight="fill" />
              <Phone size={13} weight="fill" />
              <DotsThreeVertical size={14} weight="bold" />
            </span>
          </div>

          {/* conversa: alinhada embaixo; quando enche, as mensagens mais antigas somem pelo alto */}
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end gap-1 overflow-hidden px-2.5 py-2">
            <p className="mx-auto mb-auto rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-medium text-[#54656f] shadow-sm">Hoje</p>
            {chat.messages.slice(0, visible).map((m, i, arr) => (
              <Bubble key={i} m={m} first={i === 0 || arr[i - 1].from !== m.from} />
            ))}
            <AnimatePresence>{teamTyping && <Typing key="typing" />}</AnimatePresence>
          </div>

          {/* barra de digitacao */}
          <div className="relative z-10 flex shrink-0 items-center gap-1.5 px-2 pt-1 pb-3">
            <span className="flex h-7 flex-1 items-center gap-1.5 rounded-full bg-white px-2.5 text-[10px] text-[#8696a0] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
              <Smiley size={13} />
              Mensagem
            </span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full text-white" style={{ background: WA.mic }}>
              <Microphone size={13} weight="fill" />
            </span>
          </div>
        </div>

        {/* moldura do aparelho por cima da tela */}
        <img src={SHELL.src} alt="" aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full object-contain select-none" />
      </div>
    </div>
  )
}
