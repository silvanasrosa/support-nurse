import { ChatCircleDots, Check, Plus } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { CtaButton } from '@/components/ui/CtaButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { faq, type FaqItem } from '@/content/faq'
import { site } from '@/content/site'
import { scrollToY } from '@/lib/scroll'

const ease = [0.16, 1, 0.3, 1] as const

/** Evento para abrir uma pergunta de outro lugar da pagina (ex.: "Veja o que avaliamos" no Como funciona). */
export const FAQ_OPEN = 'faq:open'

const ids = faq.items.map((i) => i.id)
const fromHash = () => {
  const h = decodeURIComponent(window.location.hash.slice(1))
  return ids.includes(h) ? h : null
}

function Answer({ item }: { item: FaqItem }) {
  return (
    <div className="space-y-3 pr-2 pb-7 pl-11 text-[15.5px] leading-relaxed text-graphite/85 md:pr-16 md:pl-14">
      {item.a.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {item.checklist && (
        <ol className="!mt-5 grid gap-2.5">
          {item.checklist.map((c, i) => (
            <motion.li
              key={c}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-navy/[0.06]"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold text-navy">
                <Check size={12} weight="bold" />
              </span>
              <span className="text-[15px] leading-snug text-navy">
                <span className="mr-2 font-display text-gold">{String(i + 1).padStart(2, '0')}</span>
                {c}
              </span>
            </motion.li>
          ))}
        </ol>
      )}
      {item.after && <p className="!mt-5 font-medium text-navy">{item.after}</p>}
    </div>
  )
}

function Item({ item, index, open, onToggle }: { item: FaqItem; index: number; open: boolean; onToggle: () => void }) {
  const panel = `${item.id}-resposta`
  return (
    <motion.li
      id={item.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease, delay: Math.min(index, 4) * 0.05 }}
      className="border-b border-navy/10"
    >
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={panel} className="group flex w-full items-center gap-4 py-6 text-left md:gap-6">
          <span className="w-7 shrink-0 font-display text-sm text-gold tabular-nums md:w-8">{String(index + 1).padStart(2, '0')}</span>
          <span className={`flex-1 font-display text-[1.18rem] leading-snug transition-colors md:text-[1.35rem] ${open ? 'text-navy' : 'text-navy/85 group-hover:text-navy'}`}>
            {item.q}
          </span>
          <span
            aria-hidden
            className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 ${
              open ? 'rotate-45 bg-gold text-navy ring-gold' : 'text-navy ring-navy/15 group-hover:bg-navy group-hover:text-white group-hover:ring-navy'
            }`}
          >
            <Plus size={18} weight="bold" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panel}
            role="region"
            aria-label={item.q}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <Answer item={item} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

/**
 * Secao "Perguntas frequentes" (#faq): cabecalho fixo a esquerda (desktop) com o card de duvidas e as perguntas em
 * acordeao (uma aberta por vez) a direita. Cada pergunta tem ancora (#avaliacao etc.): o link abre a resposta.
 */
export function Faq() {
  const [open, setOpen] = useState<string | null>(() => fromHash() ?? faq.items[0].id)

  // abre a pergunta quando a ancora muda ou quando outro componente pede (evento FAQ_OPEN)
  useEffect(() => {
    const onHash = () => {
      const id = fromHash()
      if (id) setOpen(id)
    }
    // pedido de outro componente: abre e rola ate a pergunta, descontando a resposta aberta acima dela, que fecha
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const item = document.getElementById(id)
      if (!item) return
      const openLi = document.querySelector<HTMLElement>('#faq button[aria-expanded="true"]')?.closest('li')
      const above = openLi && openLi !== item && openLi.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING
      const shift = above ? (openLi.querySelector<HTMLElement>('[role="region"]')?.offsetHeight ?? 0) : 0
      const y = item.getBoundingClientRect().top + window.scrollY - shift - 24
      setOpen(id)
      scrollToY(y)
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener(FAQ_OPEN, onOpen)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener(FAQ_OPEN, onOpen)
    }
  }, [])

  return (
    <section id="faq" className="relative overflow-x-clip py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute top-20 -left-40 size-[30rem] rounded-full bg-brand-blue/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-10 size-[30rem] rounded-full bg-gold/15 blur-3xl" />

      <div className="site-gutter relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading size="md" eyebrow={faq.eyebrow} title={faq.title} accent={faq.titleAccent} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="glass-liquid mt-10 rounded-[2rem] p-6 md:p-7"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-bronze ring-1 ring-gold/30">
                <ChatCircleDots size={26} weight="duotone" />
              </span>
              <div>
                <p className="font-display text-[1.35rem] leading-tight text-navy">{faq.more.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-graphite/80">{faq.more.text}</p>
              </div>
            </div>
            <CtaButton href={site.whatsapp.href} external className="mt-6">
              {faq.more.cta}
            </CtaButton>
          </motion.div>
        </div>

        <ul className="border-t border-navy/10">
          {faq.items.map((item, i) => (
            <Item key={item.id} item={item} index={i} open={open === item.id} onToggle={() => setOpen(open === item.id ? null : item.id)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
