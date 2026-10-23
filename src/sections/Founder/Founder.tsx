import { motion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'
import { founder } from '@/content/founder'
import { useMedia } from '@/hooks/useMedia'
import { gsap, ScrollTrigger } from '@/lib/scroll'
import { FounderBio, FounderHead, FounderRoles, FounderSideText, FounderStats } from './FounderParts'

const ease = [0.16, 1, 0.3, 1] as const

/** Rolagem (em svh) com a tela inicial parada antes de a animacao comecar (tempo para ler, uns 3 giros do mouse). */
const SCROLL_HOLD = 35
/** Rolagem (em svh) da animacao em si. */
const SCROLL_ANIM = 140
/** Mesma altura de cartao da hero: tela cheia, mas sem esticar demais em tablets em pe. */
const CARD_H = 'min(calc(100svh - 1.5rem), max(560px, 72vw))'
/** Moldura presa na rolagem: o cartao + a margem de cima e de baixo (como a hero). */
const FRAME_H = `calc(${CARD_H} + 1.5rem)`
/** Coluna branca da esquerda no fim da animacao (o azul fica com o resto). */
const COL = 0.4
/** Azul do painel ocupa: inicio = metade esquerda | fim = 60% da direita. */
const CLIP_FROM = 'inset(0% 50% 0% 0%)'
/** recorte do azul a partir das duas bordas (em %), animadas em ritmos diferentes */
const clipOf = (left: number, right: number) => `inset(0% ${right}% 0% ${left}%)`

/** Marca d'agua "Desde 2011" (vertical, na borda direita): tamanho usado tambem para afastar a biografia dela.
 *  Vem da variavel --mark do cartao (menor no tablet, onde a coluna da biografia e mais estreita). */
const MARK_SIZE = 'var(--mark)'

/** "Desde 2011" vertical e bem suave. Uma copia por camada: troca de cor quando o azul passa por cima. */
function YearMark({ tone }: { tone: 'light' | 'dark' }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-1/2 right-[1.5%] -translate-y-1/2 rotate-180 font-display leading-none whitespace-nowrap [writing-mode:vertical-rl] ${
        tone === 'dark' ? 'text-white/[0.06]' : 'text-navy/[0.06]'
      }`}
      style={{ fontSize: MARK_SIZE }}
    >
      Desde {founder.side.year}
    </span>
  )
}

/** Luz suave atras da foto para a silhueta se destacar do azul. */
const HALO = 'radial-gradient(closest-side, rgba(255,255,255,0.30), rgba(19,112,181,0.22) 55%, transparent)'

/** Fundo da camada azul: ondas + brilho (como o painel da hero). */
function NavyBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 bg-[image:var(--pattern-ondas)] bg-[length:120px]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_25%,rgba(19,112,181,0.4),transparent_70%)]" />
    </>
  )
}

/**
 * Tablet e desktop (a partir de 768px, como a hero): cartao preso na rolagem.
 * Inicio: azul a esquerda (titulo grande e estatisticas), Cassia de terninho no centro, texto de apoio e
 * cargos a direita. Rolando: o azul desliza para 60% da direita e a esquerda vira branca (40%); a frase de
 * abertura some e o nome sobe e fica numa linha so (o "Felix." encaixa ao lado do "Cassia"), trocando de cor
 * exatamente na borda que passa (duas copias, uma por camada); a Cassia vai para baixo do nome, grande,
 * trocando de foto; a biografia entra da direita junto com o azul.
 * As estatisticas ficam onde estao. No tablet os textos sao menores (classes md:max-lg).
 */
function FounderPinned({ reduce }: { reduce: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const card = cardRef.current
    if (!track || !card) return
    const mm = gsap.matchMedia()
    mm.add({ pin: '(min-width: 768px)', tab: '(max-width: 1023.98px)', still: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { pin, tab, still } = ctx.conditions as { pin: boolean; tab: boolean; still: boolean }
      if (!pin) return
      const q = gsap.utils.selector(card)
      const head = q('[data-f-head]')[0] as HTMLElement
      const lead = head?.querySelector<HTMLElement>('[data-f-lead]')
      const name = head?.querySelector<HTMLElement>('[data-f-name]')
      const n1 = head?.querySelector<HTMLElement>('[data-f-n1]')
      const n2 = head?.querySelector<HTMLElement>('[data-f-n2]')
      const photo = q('[data-f-photo]')[0] as HTMLElement
      const stats = q('[data-f-stats]')[0] as HTMLElement
      if (!head || !lead || !name || !n1 || !n2 || !photo || !stats) return

      // Tamanho do titulo pelo espaco livre entre a margem e a foto (como a hero, quase encostando nela),
      // e onde comeca o painel da direita (logo depois da foto). No tablet o titulo pode avancar sobre o canto
      // de cima da foto, que e transparente (o rosto comeca la pelo meio dela), para ficar maior.
      const fit = () => {
        const W = card.offsetWidth
        const free = W / 2 - photo.offsetWidth * (tab ? 0.24 : 0.5) - head.offsetLeft - (tab ? 16 : 24)
        let fName = Math.min(190, Math.max(tab ? 44 : 56, free / 2.65))
        let fLead = Math.min(46, Math.max(tab ? 16 : 22, free / 12.5))
        const apply = () => {
          card.style.setProperty('--f-name', `${Math.round(fName)}px`)
          card.style.setProperty('--f-lead', `${Math.round(fLead)}px`)
        }
        apply()
        card.style.setProperty('--f-lead-w', `${Math.round(free)}px`)
        // (no tablet o painel encosta um pouco na foto, como na hero: o ombro dela e estreito nessa altura)
        card.style.setProperty('--f-side-left', `${Math.round(W / 2 + (tab ? photo.offsetWidth * 0.44 : photo.offsetWidth / 2 + 28))}px`)
        // tablet (cartao mais baixo): o titulo encolhe ate caber acima das estatisticas
        for (let k = 0; tab && k < 10 && head.offsetTop + head.offsetHeight > stats.offsetTop - 16; k++) {
          fName = Math.max(40, fName * 0.92)
          fLead = Math.max(15, fLead * 0.95)
          apply()
        }
      }
      fit()

      // Estado final (offsets ignoram transforms, entao da para medir a qualquer momento)
      const geo = () => {
        const W = card.offsetWidth
        const H = card.offsetHeight
        const top = Math.max(28, Math.min(64, H * 0.07))
        const lift = top - head.offsetTop // o bloco todo sobe ate o topo
        const nameY = lift - (name.offsetTop - lead.offsetTop) // e o nome ocupa o lugar da frase, que some
        // nome numa linha so: "Felix." sobe para o lado do "Cassia" e o conjunto encolhe para caber na coluna
        const space = parseFloat(getComputedStyle(name).fontSize) * 0.26
        const n2x = n1.offsetWidth + space
        const n2y = n1.offsetTop - n2.offsetTop
        const sName = Math.min(1, (W * COL - head.offsetLeft - 24) / (n2x + n2.offsetWidth))
        const nameBottom = top + lead.offsetTop + n1.offsetHeight * sName
        // a foto sobe ate o nome; a margem transparente do topo da foto pode passar por tras dele.
        // Tablet: a foto pode passar da coluna branca e pegar um pouco do azul (fica maior e um pouco mais a direita)
        const ps = Math.min(
          1,
          (H - nameBottom - 6) / (photo.offsetHeight * (1 - founder.photos.bio.topGap * 0.9)),
          (W * COL * (tab ? 1.3 : 0.98)) / photo.offsetWidth,
        )
        return { lift, nameY, n2x, n2y, sName, px: W * COL * (tab ? 0.56 : 0.5) - W / 2, ps }
      }
      let g = geo()

      // lazy: false = o estado inicial de cada efeito e aplicado na hora, nao no fim do quadro. Com o atraso padrao,
      // ao recarregar ja rolado ele era aplicado depois de a animacao ir ao ponto certo e a devolvia ao inicio.
      const anim = gsap.timeline({ defaults: { ease: 'power2.inOut', lazy: false } })
      // painel da direita sai
      // Fundo azul: a borda direita corre rapido ate o fim do card (cobre o texto de apoio que sai e ja recebe
      // a biografia), e a borda esquerda vai no ritmo da Cassia e do nome ate os 40%
      const navy = q('[data-f-navy]')[0] as HTMLElement
      // um objeto por borda (dois tweens no mesmo objeto se atrapalham ao recalcular)
      const edgeL = { v: 0 }
      const edgeR = { v: 50 }
      const paint = () => {
        navy.style.clipPath = clipOf(edgeL.v, edgeR.v)
      }
      anim
        .fromTo(q('[data-f-side]'), { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 60, duration: 0.16, ease: 'power1.in' }, 0)
        .fromTo(edgeR, { v: 50 }, { v: 0, duration: 0.2, ease: 'power2.inOut', onUpdate: paint }, 0)
        .fromTo(edgeL, { v: 0 }, { v: COL * 100, duration: 0.6, onUpdate: paint }, 0.02)
        // titulo: frase some, nome sobe e continua grande
        .fromTo(q('[data-f-eyebrow]'), { y: 0 }, { y: () => g.lift, duration: 0.6 }, 0.02)
        .fromTo(q('[data-f-lead]'), { y: 0, autoAlpha: 1 }, { y: () => g.lift, autoAlpha: 0, duration: 0.24, ease: 'power1.in' }, 0.02)
        .fromTo(q('[data-f-name]'), { y: 0, scale: 1 }, { y: () => g.nameY, scale: () => g.sName, duration: 0.6 }, 0.02)
        // "Felix." anda para a direita primeiro e sobe depois: desliza para o lado sem passar por cima do "Cassia"
        .fromTo(q('[data-f-n2]'), { x: 0 }, { x: () => g.n2x, duration: 0.5, ease: 'power3.out' }, 0.02)
        .fromTo(q('[data-f-n2]'), { y: 0 }, { y: () => g.n2y, duration: 0.5, ease: 'power3.in' }, 0.12)
        // foto: vai para baixo do nome
        .fromTo(photo, { x: 0, scale: 1 }, { x: () => g.px, scale: () => g.ps, duration: 0.6 }, 0.02)
        // troca de foto: a segunda aparece por cima e logo depois a primeira some por completo
        // (escalonado para o fundo nao aparecer atraves das duas; o desfoque leve disfarca a sobreposicao)
        .fromTo(q('[data-f-v2]'), { autoAlpha: 0, filter: 'blur(8px)' }, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.09, ease: 'none' }, 0.24)
        .fromTo(q('[data-f-v1]'), { autoAlpha: 1, filter: 'blur(0px)' }, { autoAlpha: 0, filter: 'blur(8px)', duration: 0.07, ease: 'none' }, 0.28)
        .fromTo(q('[data-f-halo]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12, ease: 'none' }, 0.24)
        // biografia: entra pela direita logo atras da borda do azul, enquanto o texto de apoio some
        .fromTo(q('[data-f-bio] > *'), { autoAlpha: 0, x: 160 }, { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.04, ease: 'power3.out' }, 0.06)
        .to({}, { duration: 0.14 }) // segura o estado final antes de soltar a secao

      // pausa no inicio: a tela inicial fica parada por SCROLL_HOLD antes de a animacao comecar
      const tl = gsap.timeline({ paused: true })
      tl.to({}, { duration: (anim.duration() * SCROLL_HOLD) / SCROLL_ANIM }).add(anim)

      // o tamanho do titulo e o painel acompanham a tela
      const ro = new ResizeObserver(() => {
        fit()
        g = geo()
        if (still) tl.invalidate().progress(0).progress(1)
        else ScrollTrigger.refresh()
      })
      ro.observe(card)

      if (still) {
        // movimento reduzido: mostra direto o estado final, sem prender a tela
        tl.progress(1)
        return () => ro.disconnect()
      }

      // o cartao fica preso centralizado na tela (no tablet ele e mais baixo que ela): a animacao vai do
      // momento em que ele chega ao centro ate o fim da trilha
      const frame = card.parentElement as HTMLElement
      const pinTop = () => parseFloat(getComputedStyle(frame).top) || 0
      const st = ScrollTrigger.create({
        trigger: track,
        start: () => `top ${pinTop()}px`,
        end: () => `bottom ${pinTop() + frame.offsetHeight}px`,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          fit()
          g = geo()
        },
      })
      // Cada recalculo do ScrollTrigger (fontes, tela, restauracao da rolagem ao recarregar no meio da pagina)
      // desfaz a animacao para medir a pagina; se a rolagem nao mudou, ela nao e reaplicada e a secao fica no
      // estado inicial. No quadro seguinte (depois do recalculo), forca o redesenho no ponto da rolagem atual:
      // passa pelo inicio e pelo fim (um efeito ja terminado so e redesenhado se o tempo voltar para antes dele).
      let raf = 0
      const sync = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const p = st.progress
          tl.progress(0).progress(1).progress(p)
          paint()
        })
      }
      ScrollTrigger.addEventListener('refresh', sync)
      // as fontes mudam a largura do titulo: recalcula quando carregarem
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      return () => {
        ScrollTrigger.removeEventListener('refresh', sync)
        cancelAnimationFrame(raf)
        ro.disconnect()
        st.kill()
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={trackRef} className="relative hidden md:block" style={{ height: reduce ? FRAME_H : `calc(${FRAME_H} + ${SCROLL_HOLD + SCROLL_ANIM}svh)` }}>
      {/* moldura da altura do cartao (sem sobra acima e abaixo entre as secoes), presa no centro da tela */}
      <div className="sticky flex items-center py-3" style={{ height: FRAME_H, top: `calc((100svh - ${FRAME_H}) / 2)` }}>
        <div
          ref={cardRef}
          className="relative isolate w-full overflow-hidden rounded-[36px] bg-[#f7f8fd] shadow-[0_30px_80px_rgba(36,43,85,0.12)] [--mark:clamp(2.5rem,5vw,3rem)] lg:[--mark:clamp(4.5rem,min(9vw,16svh),9rem)]"
          style={{ height: CARD_H }}
        >
          {/* brilhos do lado claro */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-[8%] right-[6%] size-[22rem] rounded-full bg-gold/25 blur-3xl [animation:drift-a_18s_ease-in-out_infinite]" />
            <div className="absolute -bottom-24 left-[4%] size-[22rem] rounded-full bg-brand-blue/20 blur-3xl [animation:drift-b_21s_ease-in-out_infinite]" />
          </div>

          {/* camada clara: titulo em azul-marinho + painel da direita */}
          <div className="absolute inset-0">
            <div data-f-head className="absolute top-[12%] left-7 lg:left-10 xl:left-14">
              <FounderHead tone="light" fluid />
            </div>

            {/* painel da direita, colado na foto como na hero: texto de apoio e cargos lado a lado embaixo,
                o grupo centralizado na altura do card (o texto comeca perto da altura do rosto da Cassia) */}
            <div data-f-side className="absolute inset-y-0 right-[calc(1.5%_+_var(--mark)_+_0.25rem)] left-(--f-side-left) flex flex-col justify-center gap-5 lg:right-[2.5%] lg:gap-9">
              <FounderSideText tone="light" />
              <FounderRoles row />
            </div>
            <YearMark tone="light" />
          </div>

          {/* camada azul (recortada): copia clara do titulo + biografia */}
          <div data-f-navy className="absolute inset-0 bg-navy text-white" style={{ clipPath: CLIP_FROM }}>
            <NavyBackdrop />
            <div data-f-head aria-hidden className="absolute top-[12%] left-7 lg:left-10 xl:left-14">
              <FounderHead tone="dark" fluid />
            </div>
            <YearMark tone="dark" />
            {/* ate xl, a biografia centraliza acima das estatisticas (que ficam no canto e poderiam encostar nela;
                no tablet, mais alta, porque o cartao e mais baixo);
                a margem direita deixa livre a faixa do "Desde 2011" */}
            <div
              data-f-bio
              className="absolute top-0 right-0 bottom-[30%] left-[40%] flex flex-col justify-center px-[6%] lg:bottom-[22%] xl:bottom-0 xl:px-[7%] xl:pb-[3%] [&>*]:invisible"
              style={{ paddingRight: `calc(1.5% + ${MARK_SIZE} + 1.5rem)` }}
            >
              <FounderBio tone="dark" />
            </div>
          </div>

          {/* Cassia: comeca no centro (terninho) e termina na coluna branca (estetoscopio) */}
          <div
            data-f-photo
            className="pointer-events-none absolute bottom-0 left-1/2 z-20 origin-bottom -translate-x-1/2"
            style={{ height: 'min(86%, 56vw)', aspectRatio: '1086 / 1448' }}
          >
            <div data-f-halo aria-hidden className="absolute top-[4%] left-1/2 aspect-square w-[118%] -translate-x-1/2 rounded-full" style={{ background: HALO }} />
            <img data-f-v1 src={founder.photos.intro.src} alt={founder.photos.intro.alt} width={1086} height={1448} decoding="async" className="absolute inset-0 size-full object-contain object-bottom" />
            <img
              data-f-v2
              src={founder.photos.bio.src}
              alt={founder.photos.bio.alt}
              width={1086}
              height={1448}
              decoding="async"
              className="invisible absolute inset-0 size-full object-contain object-bottom opacity-0"
            />
          </div>

          {/* estatisticas: ficam paradas no canto */}
          <div data-f-stats className="absolute bottom-5 left-7 z-30 lg:bottom-8 lg:left-10 xl:left-14">
            <FounderStats />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Celular: empilhado e sem prender a tela. Bloco azul com a primeira foto; bloco branco com a segunda e a biografia. */
function FounderStacked() {
  return (
    <div className="space-y-2 md:hidden">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-navy px-6 pt-14 text-white">
        <div aria-hidden className="absolute inset-0 -z-10">
          <NavyBackdrop />
        </div>
        <FounderHead tone="dark" />
        <div className="mt-8">
          <FounderSideText tone="dark" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, ease }}
          className="relative mx-auto mt-8 w-[min(100%,22rem)]"
          style={{ aspectRatio: '1086 / 1448' }}
        >
          <div aria-hidden className="absolute top-[4%] left-1/2 aspect-square w-[118%] -translate-x-1/2 rounded-full" style={{ background: HALO }} />
          <img src={founder.photos.intro.src} alt={founder.photos.intro.alt} width={1086} height={1448} loading="lazy" decoding="async" className="absolute inset-0 size-full object-contain object-bottom" />
          <FounderRoles className="absolute top-[38%] right-0 items-end [&_li]:ml-0" />
        </motion.div>
        <div className="relative z-10 -mx-3 -mt-20 pb-3">
          <FounderStats />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-white px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, ease }}
          className="relative mx-auto mb-10 aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-[24px] bg-gradient-to-b from-navy-50 to-[#f6eee2]"
        >
          <img
            src={founder.photos.bio.src}
            alt={founder.photos.bio.alt}
            loading="lazy"
            decoding="async"
            className="absolute bottom-0 left-1/2 h-[96%] max-w-none -translate-x-1/2 object-contain object-bottom"
          />
        </motion.div>
        <FounderBio tone="light" />
      </div>
    </div>
  )
}

/** Secao "Fundadora": Cassia Felix. Fica entre "Como funciona" e "Equipe". */
export function Founder() {
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  return (
    <section id="fundadora" className="px-2 sm:px-3">
      <FounderPinned reduce={reduce} />
      <FounderStacked />
    </section>
  )
}
