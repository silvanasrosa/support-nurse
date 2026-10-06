import { Checks, ClipboardText } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { CtaButton } from '@/components/ui/CtaButton'
import { finalCta } from '@/content/finalCta'
import { whatsappWith } from '@/content/site'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Pre-avaliacao: a familia toca nas respostas (hospital ou casa, mobilidade, horas, dispositivos) e elas viram a
 * mensagem do WhatsApp para a coordenadora, que aparece montada no balao. O site nao guarda nada.
 */
export function PreAssessment({ className = '' }: { className?: string }) {
  const { form, questions } = finalCta
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const lines = questions.filter((q) => answers[q.id] !== undefined).map((q) => `${q.prefix}: ${q.options[answers[q.id]].text}.`)
  const message = [form.intro, ...lines].join('\n')
  const pick = (id: string, i: number) => setAnswers((a) => (a[id] === i ? Object.fromEntries(Object.entries(a).filter(([k]) => k !== id)) : { ...a, [id]: i }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay: 0.1 }}
      className={`rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/12 backdrop-blur-md sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/30">
          <ClipboardText size={26} weight="duotone" />
        </span>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">{form.eyebrow}</p>
          <p className="mt-1 font-display text-[1.45rem] leading-tight text-white">{form.title}</p>
          <p className="mt-1 text-sm text-white/65">{form.text}</p>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="mb-2.5 text-sm font-medium text-white/85">{q.label}</legend>
            <div role="radiogroup" aria-label={q.label} className="flex flex-wrap gap-2">
              {q.options.map((o, i) => {
                const on = answers[q.id] === i
                return (
                  <button
                    key={o.label}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => pick(q.id, i)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-all duration-300 ${
                      on ? 'bg-gold text-navy shadow-[0_8px_20px_rgba(236,171,91,0.3)] ring-gold' : 'bg-white/5 text-white/85 ring-white/15 hover:bg-white/10 hover:ring-white/30'
                    }`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* a mensagem montada, num balao como o do WhatsApp */}
      <div className="mt-7">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">{form.preview}</p>
        <div className="relative rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-4 pt-3 pb-2 text-[13.5px] leading-relaxed text-[#111b21] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
          <p>{form.intro}</p>
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.p
                key={l}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                {l}
              </motion.p>
            ))}
          </AnimatePresence>
          <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
            agora <Checks size={14} weight="bold" className="text-[#53bdeb]" />
          </p>
        </div>
      </div>

      <CtaButton href={whatsappWith(message)} external variant="gold" className="mt-6 w-full justify-between">
        {form.cta}
      </CtaButton>
    </motion.div>
  )
}
