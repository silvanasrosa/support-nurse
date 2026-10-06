import { ArrowRight, ClipboardText, HouseLine, Phone, Stethoscope } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { howItWorks, type StepIcon } from '@/content/howItWorks'
import { FAQ_OPEN } from '@/sections/Faq/Faq'

const ICONS: Record<StepIcon, Icon> = { phone: Phone, stethoscope: Stethoscope, clipboard: ClipboardText, house: HouseLine }

type Step = (typeof howItWorks.steps)[number]

/** Foto da etapa: ganha cor e perde o zoom quando o orbe chega (active). */
function StepPhoto({ step, num, active }: { step: Step; num: string; active: boolean }) {
  return (
    <PhotoSlot
      src={step.image}
      alt={step.alt}
      icon={ICONS[step.icon]}
      label={`Foto ${num}`}
      className={`transition-[transform,filter] duration-[1400ms] ease-out-expo ${active ? 'scale-100 grayscale-0' : 'scale-110 grayscale-[0.7]'}`}
    />
  )
}

/**
 * Card de uma etapa: foto grande com selo numerado, titulo e texto.
 * Apagado ate o orbe da linha chegar (active). Celular: foto em cima. Tablet: foto ao lado. Desktop: coluna.
 */
export function StepCard({ step, index, active }: { step: Step; index: number; active: boolean }) {
  const num = String(index + 1).padStart(2, '0')
  const hl = 'highlight' in step && step.highlight
  return (
    <article
      data-pulse-node
      className={`flex h-full flex-col rounded-[28px] bg-white/85 p-2.5 ring-1 transition-[opacity,box-shadow] duration-700 md:max-lg:flex-row ${
        active ? 'opacity-100' : 'opacity-50'
      } ${hl ? 'shadow-[0_24px_60px_-28px_rgba(236,171,91,0.65)] ring-gold/55' : 'shadow-[0_24px_60px_-30px_rgba(36,43,85,0.35)] ring-navy/[0.07]'}`}
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-[22px] bg-navy-50 md:max-lg:aspect-auto md:max-lg:min-h-[15rem] md:max-lg:w-[46%]">
        <StepPhoto step={step} num={num} active={active} />
        <span
          className={`absolute top-3 left-3 flex items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-[11px] font-semibold tracking-[0.16em] uppercase ${
            hl ? 'bg-gold text-navy' : 'bg-navy/55 text-white ring-1 ring-white/20 backdrop-blur-md'
          }`}
        >
          <span className={`grid size-7 place-items-center rounded-full font-display text-sm tracking-normal ${hl ? 'bg-navy text-gold' : 'bg-white/15 text-gold'}`}>
            {num}
          </span>
          Etapa
        </span>
      </div>
      <div className="flex flex-1 flex-col px-4 pt-5 pb-5 md:max-lg:justify-center md:max-lg:px-7">
        <h3 className="text-[1.4rem] leading-[1.15] text-navy">{step.title}</h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-graphite/80">{step.text}</p>
        {/* ex.: entrevista: leva a pergunta do FAQ com o que a coordenadora avalia, ja aberta (o FAQ abre e rola) */}
        {'link' in step && step.link && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent(FAQ_OPEN, { detail: step.link.faq }))}
            className="group/link mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-bronze transition-colors hover:text-navy"
          >
            {step.link.label}
            <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover/link:translate-x-1" />
          </button>
        )}
      </div>
    </article>
  )
}
