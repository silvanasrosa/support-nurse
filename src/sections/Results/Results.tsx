import { SectionHeading } from '@/components/ui/SectionHeading'
import { results } from '@/content/results'
import { ReviewCarousel } from './ReviewCarousel'
import { GoogleCard, StudyCard } from './ResultsParts'

/**
 * Secao "Resultados" (prova social): dado de pesquisa com o anel de 40% e as avaliacoes reais do Google
 * (nota do perfil + carrossel com os comentarios). Fica depois de "O que a familia recebe".
 * Desktop: card do Google a esquerda e carrossel a direita. Tablet e celular: um embaixo do outro.
 */
export function Results() {
  return (
    <section id="resultados" className="relative overflow-x-clip py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-40 size-[30rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-10 size-[30rem] rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="site-gutter relative">
        <SectionHeading eyebrow={results.eyebrow} title={results.title} accent={results.titleAccent} className="max-w-4xl" />

        <StudyCard className="mt-12 md:mt-16" />

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
          <GoogleCard />
          <ReviewCarousel reviews={results.reviews} />
        </div>
      </div>
    </section>
  )
}
