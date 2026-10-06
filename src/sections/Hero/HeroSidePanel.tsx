import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { hero } from '@/content/hero'

const ease = [0.16, 1, 0.3, 1] as const

/** Texto de apoio da area escura (direita) */
export function HeroSidePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease, delay: 0.8 }}
      className="relative z-20 mx-2 mt-6 rounded-t-[28px] bg-navy bg-[image:var(--pattern-ondas)] bg-[length:100px] bg-[position:left_bottom] px-6 pt-8 pb-4 text-white max-md:order-3 sm:mx-3 sm:px-10 md:rounded-none md:bg-none md:col-start-3 md:row-start-2 md:m-0 md:self-center md:max-lg:mt-[6%] md:max-lg:self-start md:bg-transparent md:py-0 md:pr-[3vw] md:pl-[4vw] lg:pr-[3.4vw] lg:pl-[5.6vw]"
    >
      <h2 className="text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.05] whitespace-pre-line md:text-[clamp(1.15rem,2.15vw,2.5rem)]">
        {hero.side.title}
      </h2>
      <div aria-hidden className="my-4 h-0.5 w-14 bg-gold" />
      <p className="max-w-md text-sm leading-relaxed text-white/75 md:hidden lg:block lg:text-[13px] xl:text-sm">{hero.side.text}</p>
    </motion.div>
  )
}

export function HeroFeedback() {
  const { feedback } = hero
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 1.1 }}
      className="relative z-20 hidden items-center justify-end gap-4 px-6 pb-6 text-white md:col-start-3 lg:px-10 lg:pb-8 md:row-start-3 md:flex md:self-end xl:px-14"
    >
      <p className="hidden text-right text-xs leading-snug text-white/80 xl:block [text-shadow:0_1px_8px_rgba(15,19,48,0.6)]">
        {feedback.text}
        <br />
        <strong className="font-semibold text-white">{feedback.strong}</strong>
      </p>
      <div className="flex -space-x-2">
        {feedback.clients.map((c, i) => (
          <motion.img
            key={c.name}
            src={c.photo}
            alt={c.name}
            title={c.name}
            width={36}
            height={36}
            loading="lazy"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 1.3 + i * 0.1 }}
            whileHover={{ y: -3, zIndex: 10 }}
            className="relative size-9 rounded-full object-cover ring-2 ring-navy"
          />
        ))}
      </div>
      <a
        href="#resultados"
        aria-label="Ver resultados"
        className="grid size-9 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-navy"
      >
        <ArrowRight size={16} weight="bold" />
      </a>
    </motion.div>
  )
}
