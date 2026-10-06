// Secao de transparencia da pagina "Quem somos" (/quem-somos/): dados que a familia consegue conferir
// (texto do esboco, sem travessoes)

export type AboutIcon = 'clock' | 'certificate' | 'team' | 'id' | 'pin' | 'contract'

const MAPS_URL = 'https://maps.app.goo.gl/ZTNZp4aNoYUADB217'

export const about = {
  eyebrow: 'Transparência',
  title: 'Operação, endereço e continuidade.',
  titleAccent: 'Porque premium também é aquilo que a família consegue verificar.',
  intro:
    'Uma empresa de home care entra na sua casa. Antes disso, você tem o direito de saber quem ela é, onde fica e há quanto tempo está em operação. Está tudo aqui.',

  // data de abertura (CNPJ): o card mostra ha quanto tempo a operacao esta ativa, contando ate hoje
  since: '2011-05-10',

  facts: [
    { icon: 'clock' as AboutIcon, label: 'Operação contínua', value: 'Desde 10/05/2011', live: true },
    { icon: 'certificate' as AboutIcon, label: 'Equipe certificada', value: 'Fixos e freelancers', detail: 'Todos supervisionados pela coordenação clínica.' },
    { icon: 'team' as AboutIcon, label: 'Multidisciplinar', value: '8 categorias profissionais', detail: 'Em um só time, sob o mesmo plano de cuidados.' },
    {
      icon: 'id' as AboutIcon,
      label: 'CNPJ',
      value: '15.082.143/0001-67',
      detail: 'Support Nurse Home Care Premium',
      copy: '15.082.143/0001-67',
    },
    {
      icon: 'pin' as AboutIcon,
      label: 'Endereço',
      value: 'R. Augusta, 101, 15º andar, sala 1507',
      detail: "Edifício Ca'd'Oro · Consolação, São Paulo · 01305-000",
      link: { label: 'Ver no mapa', href: MAPS_URL },
    },
    { icon: 'contract' as AboutIcon, label: 'Contrato transparente', value: 'Plano de cuidados por escrito', detail: 'Sem letra miúda: o que, quando e por quem.' },
  ] as AboutFact[],

  map: {
    // mapa ilustrativo (sem interacao); o botao abre o perfil no Google Maps
    query: 'Rua Augusta, 101 - Consolação, São Paulo - SP, 01305-000',
    title: 'Mapa com a localização da Support Nurse na Rua Augusta, 101',
    label: 'Venha nos conhecer',
    place: "Edifício Ca'd'Oro, 15º andar",
    street: 'R. Augusta, 101 · Consolação, SP',
    cta: 'Abrir no Google Maps',
    ctaShort: 'Abrir no mapa',
    url: MAPS_URL,
  },
}

export type AboutFact = {
  icon: AboutIcon
  label: string
  value: string
  detail?: string
  /** mostra ha quanto tempo a operacao esta ativa (a partir de about.since) */
  live?: boolean
  /** botao de copiar (ex.: CNPJ) */
  copy?: string
  link?: { label: string; href: string }
}
