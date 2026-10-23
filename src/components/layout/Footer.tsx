import {
  ArrowUp,
  EnvelopeSimple,
  FacebookLogo,
  GoogleLogo,
  InstagramLogo,
  MapPin,
  PhoneCall,
  PinterestLogo,
  ThreadsLogo,
  TiktokLogo,
  WhatsappLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { footer, homeHref, site } from '@/content/site'
import { scrollToY } from '@/lib/scroll'

/** Ano do copyright (lido ao carregar a pagina). */
const YEAR = new Date().getFullYear()

const SOCIAL: { href: string; label: string; Icon: Icon }[] = [
  { href: site.social.instagram, label: 'Instagram', Icon: InstagramLogo },
  { href: site.social.facebook, label: 'Facebook', Icon: FacebookLogo },
  { href: site.social.youtube, label: 'YouTube', Icon: YoutubeLogo },
  { href: site.social.tiktok, label: 'TikTok', Icon: TiktokLogo },
  { href: site.social.threads, label: 'Threads', Icon: ThreadsLogo },
  { href: site.social.pinterest, label: 'Pinterest', Icon: PinterestLogo },
  { href: site.social.google, label: 'Google', Icon: GoogleLogo },
]

/**
 * Rodape (as duas paginas): marca, texto e redes; colunas Servicos e Empresa; contato completo; e a faixa de
 * confianca embaixo (CNPJ, fundacao). Links "#secao" levam para a pagina inicial quando estamos em outra pagina.
 */
export function Footer() {
  const contact = [
    { Icon: PhoneCall, label: `Central 24h · ${site.phone.label}`, href: site.phone.href },
    { Icon: WhatsappLogo, label: `WhatsApp · ${site.whatsapp.label}`, href: site.whatsapp.href, external: true },
    { Icon: EnvelopeSimple, label: site.email, href: `mailto:${site.email}` },
  ]
  return (
    <footer className="px-2 pt-2 pb-2 sm:px-3 sm:pt-3 sm:pb-3">
      <div className="card-gutter relative isolate overflow-clip rounded-[28px] bg-navy-900 pt-16 pb-8 text-white md:rounded-[36px] md:pt-20">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:120px] opacity-40" />
        <div aria-hidden className="absolute -top-48 right-[-10%] -z-10 size-[34rem] rounded-full bg-brand-blue/20 blur-3xl" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1fr_1.4fr] lg:gap-10">
          {/* marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href={homeHref('#inicio')} aria-label="Support Nurse, início" className="inline-block">
              <img src="/logos/horizontal-branco.svg" alt="Support Nurse Home Care Premium" className="h-12 w-auto" />
            </a>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">{footer.about}</p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {SOCIAL.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="grid size-10 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/15 transition-colors duration-300 hover:bg-gold hover:text-navy hover:ring-gold"
                  >
                    <Icon size={18} weight="fill" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* servicos e empresa */}
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={homeHref(l.href)} className="text-[15px] text-white/75 transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* contato */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">Fale conosco</p>
            <ul className="mt-5 space-y-3.5">
              {contact.map(({ Icon, label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="flex items-center gap-3 text-[15px] text-white/80 transition-colors hover:text-white"
                  >
                    <Icon size={18} weight="duotone" className="shrink-0 text-gold" />
                    <span className="break-all sm:break-normal">{label}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3 text-[15px] leading-relaxed text-white/80">
                <MapPin size={18} weight="duotone" className="mt-1 shrink-0 text-gold" />
                <address className="not-italic">
                  {site.address.full.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* faixa de confianca */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs leading-relaxed text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {YEAR} Support Nurse Home Care Premium · CNPJ {site.cnpj}
          </p>
          <div className="flex items-center justify-between gap-6 md:justify-end">
            <a
              href={footer.credits.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${footer.credits.label} ${footer.credits.name}`}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <span>{footer.credits.label}</span>
              <img src={footer.credits.logo} alt={footer.credits.name} loading="lazy" decoding="async" className="h-12 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => scrollToY(0, 1.6)}
              aria-label="Voltar ao topo"
              title="Voltar ao topo"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/15 transition-colors duration-300 hover:bg-gold hover:text-navy hover:ring-gold"
            >
              <ArrowUp size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
