import { CountUp } from '@/components/ui/CountUp'
import { GlassPill } from '@/components/ui/FloatingPill'
import { founder } from '@/content/founder'

type Tone = 'light' | 'dark'

/**
 * Titulo da fundadora: selo, frase de abertura e o nome grande.
 * fluid (desktop): tamanhos vem das variaveis --f-name, --f-lead e --f-lead-w, calculadas pelo espaco livre
 * ate a foto. data-f-eyebrow / data-f-lead / data-f-name sao os alvos da animacao.
 * As classes md:max-lg sao do tablet, onde o cartao e mais baixo (como a hero) e os textos ficam menores.
 */
export function FounderHead({ tone, fluid = false }: { tone: Tone; fluid?: boolean }) {
  const dark = tone === 'dark'
  return (
    <>
      <p
        data-f-eyebrow
        className={`mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase md:max-lg:mb-3 md:max-lg:gap-2 md:max-lg:text-[10px] md:max-lg:tracking-[0.14em] ${
          dark ? 'text-gold' : 'text-bronze'
        }`}
      >
        <span aria-hidden className="h-px w-10 bg-gold md:max-lg:w-6" />
        {founder.eyebrow}
      </p>
      <h2 className="font-display">
        <span
          data-f-lead
          className={`block leading-[1.12] ${dark ? 'text-white/90' : 'text-navy'} ${
            fluid ? 'max-w-(--f-lead-w) text-[length:var(--f-lead,2rem)]' : 'max-w-[23rem] text-[1.6rem]'
          }`}
        >
          {founder.lead}
        </span>
        <em
          data-f-name
          className={`mt-3 block leading-[0.92] tracking-[-0.02em] md:max-lg:mt-2 ${dark ? 'text-gold' : 'text-bronze'} ${
            fluid ? 'origin-top-left text-[length:var(--f-name,7rem)]' : 'text-[clamp(3.6rem,17vw,5.5rem)]'
          }`}
        >
          {/* w-fit: cada linha mede so o texto (no desktop o "Felix." sobe para o lado do "Cassia" no fim) */}
          <span data-f-n1 className="block w-fit">
            {founder.name[0]}
          </span>{' '}
          <span data-f-n2 className="block w-fit">
            {founder.name[1]}
          </span>
        </em>
      </h2>
    </>
  )
}

/** Texto de apoio no estilo do painel lateral da hero: titulo maior, filete dourado e texto menor. */
export function FounderSideText({ tone }: { tone: Tone }) {
  const dark = tone === 'dark'
  return (
    <div>
      <p
        className={`font-display text-[clamp(1.6rem,2.3vw,2.6rem)] leading-[1.05] whitespace-pre-line md:max-lg:text-[1.1rem] ${dark ? 'text-white' : 'text-navy'}`}
      >
        {founder.side.title}
      </p>
      <div aria-hidden className="my-4 h-0.5 w-14 bg-gold md:max-lg:my-3 md:max-lg:w-10" />
      <p className={`max-w-md text-sm leading-relaxed md:max-lg:text-[12px] xl:text-[15px] ${dark ? 'text-white/75' : 'text-graphite/80'}`}>
        {founder.side.text}
      </p>
    </div>
  )
}

/**
 * Cargos da Cassia nas pilulas de vidro da hero.
 * row = lado a lado (quebram de linha se faltar espaco); sem row, em coluna levemente desencontrada (flutuando).
 */
export function FounderRoles({ row = false, className = '' }: { row?: boolean; className?: string }) {
  const offsets = row ? [''] : ['ml-0', 'ml-10', 'ml-4']
  return (
    <ul aria-label="Cargos" className={`flex ${row ? 'flex-wrap gap-2' : 'flex-col gap-3'} ${className}`}>
      {founder.side.roles.map((r, i) => (
        <li key={r} className={offsets[i % offsets.length]}>
          <GlassPill label={r} delay={i * 0.35} size={row ? 'sm' : 'md'} />
        </li>
      ))}
    </ul>
  )
}

/** Cartao de estatisticas no mesmo desenho da hero: anel entalhado com o bloco de vidro dentro. */
export function FounderStats({ className = '' }: { className?: string }) {
  const { stats } = founder
  return (
    <div className={`nav-ring nav-ring-card w-full sm:w-fit ${className}`}>
      <div className="glass-liquid rounded-[1.725rem] px-5 py-4 sm:px-7 sm:py-5 md:max-lg:px-4 md:max-lg:py-3">
        <div className="mb-3 flex items-center justify-between gap-6 md:max-lg:mb-2">
          <p className="text-xs font-medium text-graphite/75 sm:text-[13px] md:max-lg:text-[11px]">{stats.caption}</p>
          <span aria-hidden className="relative h-[15px] w-[28px] rounded-full bg-brand-blue/90">
            <span className="absolute top-[3.5px] right-[3.5px] size-2 rounded-full bg-white" />
          </span>
        </div>
        <dl className="grid grid-cols-3 gap-4 sm:gap-9 md:max-lg:gap-4">
          {stats.items.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label.replace('\n', ' ')}</dt>
              <dd>
                <div className="text-[1.65rem] leading-none font-semibold tracking-tight text-brand-blue sm:text-[2.2rem] md:max-lg:text-[1.6rem]">
                  <CountUp to={s.value} suffix={s.suffix} delay={0.2} />
                </div>
                <div className="mt-2 text-[10.5px] leading-tight font-medium whitespace-pre-line text-navy/80 sm:text-xs md:max-lg:mt-1.5 md:max-lg:text-[10px]" aria-hidden>
                  {s.label}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

/** Biografia. Cada filho direto entra em sequencia na animacao (data-f-bio). */
export function FounderBio({ tone }: { tone: Tone }) {
  const { bio } = founder
  const dark = tone === 'dark'
  return (
    <>
      <p
        className={`flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase md:max-lg:gap-2 md:max-lg:text-[10px] ${dark ? 'text-gold' : 'text-bronze'}`}
      >
        <span aria-hidden className="h-px w-10 bg-gold md:max-lg:w-6" />
        {bio.eyebrow}
      </p>
      <h3
        className={`mt-5 text-[clamp(1.9rem,min(3.3vw,6svh),3.4rem)] leading-[1.05] tracking-[-0.01em] md:max-lg:mt-3 md:max-lg:text-[1.4rem] ${
          dark ? 'text-white' : 'text-navy'
        }`}
      >
        {bio.title} <em className={dark ? 'text-gold' : 'text-bronze'}>{bio.titleAccent}</em>
      </h3>
      <div className="mt-6 grid gap-4 md:max-lg:mt-3 md:max-lg:gap-2.5 xl:grid-cols-2 xl:gap-8">
        {bio.paragraphs.map((p) => (
          <p key={p} className={`text-[15px] leading-relaxed md:max-lg:text-[12px] ${dark ? 'text-white/75' : 'text-graphite/85'}`}>
            {p}
          </p>
        ))}
      </div>
      <div
        aria-hidden
        className={`my-6 h-px w-full bg-gradient-to-r from-gold/50 to-transparent md:max-lg:my-3 ${dark ? 'via-white/15' : 'via-navy/10'}`}
      />
      <dl className="grid gap-5 sm:grid-cols-2 md:max-lg:gap-4">
        {bio.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-[11px] font-semibold tracking-[0.16em] text-gold uppercase md:max-lg:text-[9.5px]">{f.label}</dt>
            <dd className={`mt-1.5 text-[14px] leading-relaxed md:max-lg:mt-1 md:max-lg:text-[11.5px] ${dark ? 'text-white/70' : 'text-graphite/80'}`}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  )
}
