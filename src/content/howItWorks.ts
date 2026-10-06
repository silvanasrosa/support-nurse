// Secao "Como funciona" (texto do esboco, sem travessoes)
// Fotos: public/images/como-funciona/ (enquanto nao existirem, o card mostra um espaco reservado)

export type StepIcon = 'phone' | 'stethoscope' | 'clipboard' | 'house'

export const howItWorks = {
  eyebrow: 'Como funciona',
  title: 'Da sua ligação ao primeiro turno',
  titleAccent: 'em até 24 horas.',
  intro:
    'Home care de alta complexidade não pode improvisar. Nossa operação foi desenhada para você começar rápido, sem abrir mão de nenhuma etapa clínica.',

  steps: [
    {
      id: 'contato',
      icon: 'phone' as StepIcon,
      title: 'Contato no mesmo dia',
      text: 'Você fala com nossa enfermeira coordenadora, não com um atendente comercial. Ela escuta o quadro, identifica a urgência e agenda a avaliação.',
      image: '/images/como-funciona/01-contato.webp',
      alt: 'Enfermeira coordenadora atendendo uma ligação e fazendo anotações',
    },
    {
      id: 'entrevista',
      icon: 'stethoscope' as StepIcon,
      title: 'Entrevista com a coordenadora clínica',
      text: 'Presencial e gratuita, na sua casa ou no hospital. Ela ouve você, examina o paciente e mapeia o ambiente. É essa conversa que ancora todo o plano.',
      image: '/images/como-funciona/02-entrevista.webp',
      alt: 'Enfermeira coordenadora medindo a pressão de uma senhora na sala de estar, ao lado da filha',
      // abre a resposta do FAQ com as 9 perguntas da entrevista
      link: { label: 'Veja o que avaliamos', faq: 'avaliacao' },
    },
    {
      id: 'plano',
      icon: 'clipboard' as StepIcon,
      title: 'Plano de cuidados por escrito',
      text: 'Você recebe o plano com todos os procedimentos previstos, a escala da equipe, os protocolos por turno e o orçamento personalizado. Sem letra miúda.',
      image: '/images/como-funciona/03-plano.webp',
      alt: 'Enfermeira coordenadora explicando o plano de cuidados impresso para a família',
    },
    {
      id: 'inicio',
      icon: 'house' as StepIcon,
      title: 'Início em até 24 horas',
      text: 'Assinatura do contrato e primeiro turno. A enfermeira coordenadora acompanha pessoalmente os três primeiros dias.',
      image: '/images/como-funciona/04-inicio.webp',
      alt: 'Técnico de enfermagem ajudando uma senhora na cama, com a coordenadora acompanhando',
      highlight: true,
    },
  ],

  closing: {
    title: 'O primeiro passo é uma ligação.',
    text: 'Você fala direto com a enfermeira coordenadora, no mesmo dia.',
    whatsappLabel: 'Chamar no WhatsApp',
  },
}
