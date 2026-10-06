import { Phone } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { CtaButton } from '@/components/ui/CtaButton'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { site } from '@/content/site'

const ease = [0.16, 1, 0.3, 1] as const

type Props = {
  title: string
  text: string
  whatsappLabel: string
  /** ancora (ex.: "contato", para o botao "Conte-nos o que precisa" rolar ate aqui) */
  id?: string
  className?: string
}

/** Faixa azul de contato: icone de telefone, chamada e os botoes de WhatsApp e telefone (com copiar). */
export function ContactBand({ title, text, whatsappLabel, id, className = '' }: Props) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease }}
      className={`relative isolate flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-navy p-7 text-white md:p-10 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--pattern-ondas)] bg-[length:120px] opacity-60" />
      {/* celular: icone em cima e texto embaixo; a partir de sm, lado a lado */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
          <Phone size={26} weight="duotone" />
        </span>
        <div>
          <p className="font-display text-2xl leading-tight md:text-[1.75rem]">{title}</p>
          <p className="mt-1 text-[15px] text-white/70">{text}</p>
        </div>
      </div>
      {/* celular: botoes empilhados | tablet: lado a lado dividindo a largura do card | desktop: tamanho natural */}
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:flex lg:shrink-0 lg:flex-row lg:items-center">
        <CtaButton href={site.whatsapp.href} external variant="gold" className="w-full justify-between lg:w-auto lg:justify-start">
          {whatsappLabel}
        </CtaButton>
        <PhoneButton label={site.phone.label} href={site.phone.href} className="w-full lg:w-auto" />
      </div>
    </motion.div>
  )
}
