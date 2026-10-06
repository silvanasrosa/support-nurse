import { motion } from 'motion/react'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { team } from '@/content/team'

const ease = [0.16, 1, 0.3, 1] as const

/** Um hospital da faixa, com um losango dourado separando do proximo. */
function Chip({ name }: { name: string }) {
  return (
    <li className="flex shrink-0 items-center gap-6 pr-6">
      <span className="rounded-full px-6 py-3 font-display text-lg whitespace-nowrap text-white/90 ring-1 ring-white/20 md:text-xl">{name}</span>
      <span aria-hidden className="size-1.5 rotate-45 bg-gold/70" />
    </li>
  )
}

/**
 * "Onde nossa equipe se formou": painel de vidro com os hospitais passando numa faixa continua.
 * Com movimento reduzido, a faixa vira uma lista parada. showNames = false troca os nomes pelo texto generico.
 */
export function Training() {
  const t = team.training
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease }}
      className="glass-dark relative h-full overflow-hidden rounded-[2rem] py-10 md:py-12"
    >
      <div className="px-7 md:px-12">
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr] xl:items-end xl:gap-12">
          <div>
            <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
            <h3 className="text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05] text-white">{t.title}</h3>
          </div>
          <p className="max-w-xl text-[1.02rem] leading-relaxed text-white/75">{t.text}</p>
        </div>
      </div>

      {t.showNames ? (
        <>
          {/* faixa continua: a lista vem duplicada e anda metade da largura */}
          <div
            className="mt-10 overflow-hidden motion-reduce:hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)' }}
          >
            <ul aria-label="Hospitais onde nossa equipe se formou" className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...t.hospitals, ...t.hospitals].map((h, i) => (
                <Chip key={`${h}-${i}`} name={h} />
              ))}
            </ul>
          </div>
          {/* movimento reduzido: lista parada */}
          <ul className="mt-10 hidden flex-wrap gap-3 px-7 motion-reduce:flex md:px-12">
            {t.hospitals.map((h) => (
              <li key={h} className="rounded-full px-5 py-2.5 font-display text-lg text-white/90 ring-1 ring-white/20">
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-8 px-7 text-[15px] leading-relaxed text-white/70 md:px-12">
            <strong className="font-semibold text-white">{t.disclaimerStrong}</strong> {t.disclaimer}
          </p>
        </>
      ) : (
        <p className="mt-8 px-7 font-display text-xl text-white/90 md:px-12">{t.genericLabel}</p>
      )}
    </motion.div>
  )
}
