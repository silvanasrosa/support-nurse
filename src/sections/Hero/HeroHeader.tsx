import { FacebookLogo, InstagramLogo, List, MapPin, PhoneCall, TiktokLogo, WhatsappLogo, X, YoutubeLogo } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { RoundIconButton } from '@/components/ui/RoundIconButton'
import { homeHref, nav, site } from '@/content/site'
import { applyRingPath } from '@/lib/bridgeRing'

const ease = [0.16, 1, 0.3, 1] as const

function Logo({ className = '' }: { className?: string }) {
  return (
    <a href={homeHref('#inicio')} aria-label="Support Nurse, início" className={`shrink-0 ${className}`}>
      {/* Smartphone: so o simbolo (libera espaco para as redes, como no header da HBO Max). Tablet em diante: logo completo. */}
      <img src="/logos/simbolo-prata.svg" alt="Support Nurse" width={40} height={40} className="size-10 md:hidden" />
      <img src="/logos/horizontal-azul.svg" alt="Support Nurse Home Care Premium" width={153} height={40} className="hidden h-10 w-auto md:block" />
    </a>
  )
}

function Burger({ onClick, open, className = '', cut }: { onClick: () => void; open: boolean; className?: string; cut?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={open}
      data-cut={cut}
      whileTap={{ scale: 0.92 }}
      className={`glass-liquid grid size-11 shrink-0 place-items-center rounded-full text-navy sm:size-12 ${className}`}
    >
      {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
    </motion.button>
  )
}

/**
 * Header integrado a hero: no desktop vira dois grupos que entram direto na grade da hero
 * (esquerda sobre o fundo claro, direita sobre o painel escuro). No mobile, uma unica linha.
 */
export function HeroHeader() {
  const [open, setOpen] = useState(false)
  const ringRef = useRef<HTMLDivElement>(null)

  // Contorno do anel: cada bloco (hamburguer, links, contato) tem as pontas arredondadas e os blocos
  // se ligam por uma "ponte" estreita com cantos concavos arredondados (efeito metaball).
  useLayoutEffect(() => {
    const ring = ringRef.current
    if (!ring) return
    const measure = () => {
      const burger = ring.querySelector<HTMLElement>('[data-cut="after"]')
      const contact = ring.querySelector<HTMLElement>('[data-cut="before"]')
      const firstLink = ring.querySelector<HTMLElement>('nav li')
      const beforeContact = contact?.previousElementSibling as HTMLElement | null
      if (!burger || !contact || !firstLink || !beforeContact || contact.offsetParent === null) {
        applyRingPath(ring, null)
        return
      }
      const W = ring.offsetWidth
      const H = ring.offsetHeight
      const R = H / 2 // raio das pontas de cada bloco
      const f = 8 // raio do arredondamento concavo da ponte
      const pad = R - burger.offsetHeight / 2 // folga entre o item e a borda do anel
      // centros das pontas arredondadas, sobre o eixo horizontal
      const c1 = burger.offsetLeft + burger.offsetWidth / 2
      const c2 = firstLink.offsetLeft + R - pad
      const c3 = beforeContact.offsetLeft + beforeContact.offsetWidth - R + pad
      const c4 = contact.offsetLeft + R - pad
      const c5 = W - R

      // Pontos de tangencia entre as duas pontas (raio R) e o circulo de concordancia (raio f)
      const neck = (xa: number, xb: number, top: boolean) => {
        const half = (xb - xa) / 2
        const hF = Math.sqrt(Math.max((R + f) ** 2 - half ** 2, 0))
        const fx = xa + half
        const fy = top ? R - hF : R + hF
        const k = R / (R + f)
        const ty = R + (fy - R) * k
        return { a: [xa + (fx - xa) * k, ty], b: [xb + (fx - xb) * k, ty] }
      }
      const n = (v: number) => v.toFixed(2)
      const t12 = neck(c1, c2, true)
      const t34 = neck(c3, c4, true)
      const b34 = neck(c3, c4, false)
      const b12 = neck(c1, c2, false)
      const path = [
        `M ${n(c1)} 0`,
        `A ${R} ${R} 0 0 1 ${n(t12.a[0])} ${n(t12.a[1])}`,
        `A ${f} ${f} 0 0 0 ${n(t12.b[0])} ${n(t12.b[1])}`,
        `A ${R} ${R} 0 0 1 ${n(c2)} 0`,
        `L ${n(c3)} 0`,
        `A ${R} ${R} 0 0 1 ${n(t34.a[0])} ${n(t34.a[1])}`,
        `A ${f} ${f} 0 0 0 ${n(t34.b[0])} ${n(t34.b[1])}`,
        `A ${R} ${R} 0 0 1 ${n(c4)} 0`,
        `L ${n(c5)} 0`,
        `A ${R} ${R} 0 0 1 ${n(c5)} ${H}`,
        `L ${n(c4)} ${H}`,
        `A ${R} ${R} 0 0 1 ${n(b34.b[0])} ${n(b34.b[1])}`,
        `A ${f} ${f} 0 0 0 ${n(b34.a[0])} ${n(b34.a[1])}`,
        `A ${R} ${R} 0 0 1 ${n(c3)} ${H}`,
        `L ${n(c2)} ${H}`,
        `A ${R} ${R} 0 0 1 ${n(b12.b[0])} ${n(b12.b[1])}`,
        `A ${f} ${f} 0 0 0 ${n(b12.a[0])} ${n(b12.a[1])}`,
        `A ${R} ${R} 0 0 1 ${n(c1)} ${H}`,
        `A ${R} ${R} 0 0 1 ${n(c1)} 0`,
        'Z',
      ].join(' ')
      applyRingPath(ring, path)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ring)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="relative z-30 flex items-center justify-between gap-2 px-5 pt-4 sm:px-8 sm:pt-6 md:contents"
      >
        {/* Grupo esquerdo */}
        <div className="relative z-30 flex items-center gap-2.5 sm:gap-4 md:col-span-2 md:col-start-1 md:row-start-1 md:gap-5 md:self-start md:px-8 md:pt-6 lg:px-10 lg:pt-8 xl:px-14">
          <Logo className="order-2 md:order-none" />
          {/* Menu: um unico "entalhe" (anel rebaixado) abraca hamburguer, links e contato; itens em vidro liquido */}
          <div ref={ringRef} className="nav-ring order-1 flex items-center gap-2.5 md:order-none xl:gap-5">
            <Burger onClick={() => setOpen(true)} open={false} className="!size-12" cut="after" />
            <nav aria-label="Principal" className="hidden xl:block">
              <ul className="m-0 flex list-none items-center gap-1.5 p-0">
                {nav.map((item) => (
                  <li key={item.href} data-cut={item.highlight ? 'before' : undefined} className={item.highlight ? 'ml-3.5' : undefined}>
                    <motion.a
                      href={homeHref(item.href)}
                      whileHover={{ y: -1.5 }}
                      className={`glass-liquid block rounded-full px-5 py-3 text-sm font-medium whitespace-nowrap text-navy ${
                        item.highlight ? 'glass-liquid-accent px-6' : ''
                      }`}
                    >
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Grupo direito */}
        <div className="relative z-30 flex items-center gap-2 sm:gap-3 md:col-start-3 md:row-start-1 md:justify-end md:self-start md:px-8 md:pt-6 lg:px-10 lg:pt-8 xl:px-14">
          {/* endereco so em telas bem largas: entre 1280 e 1535px os 5 links do menu ocupam esse espaco */}
          <address className="mr-2 hidden items-start gap-2 text-xs leading-snug text-white not-italic 2xl:flex">
            <MapPin size={16} weight="duotone" className="mt-0.5 text-gold" />
            <span>
              {site.address.line1}
              <br />
              <span className="text-white/70">{site.address.line2}</span>
            </span>
          </address>
          <RoundIconButton href={site.phone.href} label={`Ligar ${site.phone.label}`} tone="gold">
            <PhoneCall size={18} weight="fill" />
          </RoundIconButton>
          <RoundIconButton href={site.whatsapp.href} label="WhatsApp" tone="adaptive">
            <WhatsappLogo size={20} weight="fill" />
          </RoundIconButton>
          <RoundIconButton href={site.social.instagram} label="Instagram" tone="adaptive">
            <InstagramLogo size={19} weight="fill" />
          </RoundIconButton>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-navy/95 p-6 backdrop-blur-xl"
            style={{ backgroundImage: 'var(--pattern-ondas)', backgroundBlendMode: 'soft-light' }}
          >
            <div className="flex items-center justify-between">
              <img src="/logos/horizontal-branco.svg" alt="Support Nurse" width={153} height={40} className="h-10 w-auto" />
              <Burger onClick={() => setOpen(false)} open />
            </div>
            <nav className="my-auto flex flex-col gap-2">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={homeHref(item.href)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.07 }}
                  className="font-display text-4xl text-white sm:text-5xl"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <a href={site.phone.href} className="glass-dark flex items-center justify-between rounded-2xl px-5 py-4 text-white">
              <span className="text-sm text-white/70">Central 24h</span>
              <span className="font-semibold">{site.phone.label}</span>
            </a>
            <div className="mt-4 flex gap-3">
              {[
                { href: site.whatsapp.href, label: 'WhatsApp', Icon: WhatsappLogo },
                { href: site.social.instagram, label: 'Instagram', Icon: InstagramLogo },
                { href: site.social.facebook, label: 'Facebook', Icon: FacebookLogo },
                { href: site.social.youtube, label: 'YouTube', Icon: YoutubeLogo },
                { href: site.social.tiktok, label: 'TikTok', Icon: TiktokLogo },
              ].map(({ href, label, Icon }) => (
                <RoundIconButton key={label} href={href} label={label} tone="glass">
                  <Icon size={19} weight="fill" />
                </RoundIconButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
