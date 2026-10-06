// Secao "O que a familia recebe" (texto do esboco, sem travessoes)
// Foto: public/images/beneficios/ (enquanto nao existir, aparece um espaco reservado)

export type BenefitIcon = 'clipboard' | 'swap' | 'heartbeat' | 'pill'

export const benefits = {
  eyebrow: 'O que está no seu contrato',
  title: 'O que a família recebe',
  titleAccent: 'e o que a maioria das empresas não conta.',
  intro:
    'No home care premium, o cuidado com o paciente é só metade do serviço. A outra metade é o cuidado com você, que precisa dormir tranquilo, receber informação e ter alguém para chamar.',

  // card grande: celular com a conversa chegando (ilustrativa, nomes ficticios)
  report: {
    title: 'Relatório diário no WhatsApp',
    text: 'Sinais vitais, medicação administrada, intercorrências, alimentação, humor. Tudo registrado, tudo transparente.',
    chat: {
      name: 'Support Nurse',
      status: 'enfermeira de plantão',
      messages: [
        { from: 'team', time: '08:12', text: 'Bom dia! Segue o relatório da manhã da Dona Helena.' },
        {
          from: 'team',
          time: '08:12',
          vitals: [
            ['Pressão', '12x8'],
            ['Saturação', '97%'],
            ['Temperatura', '36,5 °C'],
            ['Frequência', '72 bpm'],
          ],
        },
        { from: 'team', time: '08:14', text: 'Medicação das 8h administrada.', check: true },
        { from: 'team', time: '12:40', text: 'Almoço: comeu bem. Humor: tranquila, conversou bastante.' },
        { from: 'family', time: '12:42', text: 'Obrigada! Que alívio acompanhar daqui.' },
      ] as ChatMessage[],
    },
  },

  // card com foto: central de urgencia
  urgency: {
    title: 'Central de urgência 24h',
    text: 'Não é chatbot. Não é atendente comercial. É enfermeira de plantão. Ligou, atendeu.',
    image: '/images/beneficios/central-24h.webp',
    alt: 'Recepção da Support Nurse: atendente da central ao telefone, com a logo da empresa ao fundo',
    live: 'enfermeira de plantão disponível',
  },

  items: [
    {
      icon: 'clipboard' as BenefitIcon,
      title: 'Plano de cuidados por escrito',
      text: 'Você recebe o documento no dia da avaliação. Sabe exatamente o que vai ser feito, quando e por quem.',
    },
    {
      icon: 'swap' as BenefitIcon,
      title: 'Substituição em até 4 horas',
      text: 'Profissional faltou ou passou mal? Já saiu outro do banco ativo. Sem cobrança extra, sem improviso.',
    },
    {
      icon: 'heartbeat' as BenefitIcon,
      title: 'Monitoramento de sinais vitais',
      text: 'Pressão, saturação, temperatura, frequência cardíaca. Protocolado e disponível para o médico assistente.',
    },
    {
      icon: 'pill' as BenefitIcon,
      title: 'Gestão completa de medicamentos',
      text: 'Controle de estoque, horários, interações, comunicação com farmácia e médico assistente.',
    },
  ],
}

export type ChatMessage = {
  from: 'team' | 'family'
  time: string
  text?: string
  /** pares [rotulo, valor] mostrados como uma ficha de sinais vitais */
  vitals?: [string, string][]
  /** marca de concluido ao lado do texto */
  check?: boolean
}
