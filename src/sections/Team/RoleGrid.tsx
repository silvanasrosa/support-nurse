import { ArrowUpRight, Carrot, ChatsCircle, Hand, PersonSimpleTaiChi, Pill, Stethoscope, Tooth, Waveform } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { GlassModal } from '@/components/ui/GlassModal'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { team, type RoleIcon } from '@/content/team'

const ease = [0.16, 1, 0.3, 1] as const

const ICONS: Record<RoleIcon, Icon> = {
  stethoscope: Stethoscope,
  physio: PersonSimpleTaiChi,
  nutrition: Carrot,
  speech: Waveform,
  psychology: ChatsCircle,
  occupational: Hand,
  technician: Pill,
  dental: Tooth,
}

type Role = (typeof team.staff.roles)[number]
const num = (i: number) => String(i + 1).padStart(2, '0')

/**
 * Card de funcao: foto vertical com titulo sobre degrade azul.
 * Com mouse (hover), a descricao sobe sobre a foto. Toque ou clique abre o modal com a descricao completa.
 */
function RoleCard({ role, index, onOpen }: { role: Role; index: number; onOpen: () => void }) {
  const Ico = ICONS[role.icon]
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease, delay: (index % 4) * 0.08 }}
      aria-label={`${role.title}: ver descrição`}
      className="group relative isolate aspect-[4/3] w-full overflow-hidden rounded-[22px] text-left ring-1 ring-white/12 sm:w-[calc((100%-1rem)/2)] md:rounded-[26px] xl:w-[calc((100%-2.5rem)/3)] 2xl:w-[calc((100%-3.75rem)/4)]"
    >
      <PhotoSlot
        src={role.photo}
        alt={role.alt}
        icon={Ico}
        label={`Foto ${num(index)}`}
        tone="dark"
        className="transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
      />
      {/* degrade: mais alto no hover para a descricao ficar legivel */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div aria-hidden className="absolute inset-0 bg-navy/0 transition-colors duration-500 group-hover:bg-navy/35" />

      <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-gold group-hover:text-navy md:top-4 md:right-4">
        <ArrowUpRight size={16} weight="bold" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <span className="mb-3 grid size-10 place-items-center rounded-xl bg-gold/20 text-gold ring-1 ring-gold/35 backdrop-blur-sm md:size-11">
          <Ico size={22} weight="duotone" />
        </span>
        <p className="font-display text-[1.15rem] leading-[1.15] text-white md:text-[1.35rem]">{role.title}</p>
        {/* descricao: so aparece com mouse (o hover do Tailwind v4 ja ignora telas de toque) */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out-expo group-hover:grid-rows-[1fr]">
          <p className="overflow-hidden text-[13.5px] leading-relaxed text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="block pt-2">{role.text}</span>
          </p>
        </div>
      </div>
    </motion.button>
  )
}

/**
 * Grade das 8 funcoes em cards 4:3: 1 coluna no celular, 2 no tablet, 3 no notebook (ultima linha centralizada)
 * e 4 em telas grandes. Modal com a descricao.
 */
export function RoleGrid() {
  const [open, setOpen] = useState<number | null>(null)
  const role = open !== null ? team.staff.roles[open] : null
  const Ico = role ? ICONS[role.icon] : null

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 xl:gap-5">
        {team.staff.roles.map((r, i) => (
          <RoleCard key={r.id} role={r} index={i} onOpen={() => setOpen(i)} />
        ))}
      </div>

      <GlassModal open={!!role} onClose={() => setOpen(null)} label={role ? role.title : 'Função'}>
        {role && Ico && open !== null && (
          <div>
            <div className="relative -mx-1 mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-navy-50">
              <PhotoSlot src={role.photo} alt={role.alt} icon={Ico} label={`Foto ${num(open)}`} />
            </div>
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-bronze uppercase">
              <span aria-hidden className="h-px w-8 bg-gold" />
              Equipe multiprofissional
            </p>
            <h3 className="flex items-center gap-3 pr-10 text-[1.9rem] leading-[1.1] text-navy">
              <Ico size={28} weight="duotone" className="shrink-0 text-bronze" />
              {role.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite/85">{role.text}</p>
          </div>
        )}
      </GlassModal>
    </>
  )
}
