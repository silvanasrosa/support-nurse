// Secao "Perguntas frequentes" (perguntas do esboco + "Por que nao tem preco no site?"), sem travessoes.
// As respostas usam o que o site ja afirma (como funciona, contrato, equipe). id = ancora (ex.: #avaliacao).

export const faq = {
  eyebrow: 'Perguntas que vale fazer',
  title: 'As perguntas que qualquer família responsável faz antes de contratar,',
  titleAccent: 'respondidas em minutos.',
  more: {
    title: 'Ficou alguma dúvida?',
    text: 'Pergunte direto para a enfermeira coordenadora. Ela responde no mesmo dia.',
    cta: 'Perguntar no WhatsApp',
  },

  items: [
    {
      id: 'coordenacao',
      q: 'Quem coordena o cuidado do meu familiar?',
      a: [
        'A coordenação clínica da Support Nurse, sob a responsabilidade técnica da fundadora, Cassia Felix. É a coordenadora quem faz a entrevista, monta o plano de cuidados e supervisiona cada profissional que entra na sua casa.',
        'Você fala com ela desde o primeiro contato, e não com um atendente comercial.',
      ],
    },
    {
      id: 'avaliacao',
      q: 'Como funciona a avaliação inicial?',
      a: [
        'Todo cuidado começa por uma entrevista da coordenadora clínica com quem contrata: uma anamnese cuidadosa, presencial e gratuita, no hospital ou na sua casa, no mesmo dia. É ela que mede o que planilha nenhuma antecipa:',
      ],
      checklist: [
        'O paciente está no hospital, em UTI ou já em casa?',
        'Anda sozinho, precisa de apoio parcial ou depende de ajuda para tudo?',
        'Está consciente e orientado, ou precisa de estímulo cognitivo?',
        'Existe ferida operatória, sonda, cateter, gastrostomia ou traqueostomia?',
        'A terapia medicamentosa exige monitoramento contínuo?',
        'Qual a rotina de sono e o quadro atual de dor?',
        'Quantas horas por dia: 6, 8, 12 ou 24?',
        'A família mora junto ou o cuidado precisa suprir a ausência?',
        'Qual o nível de complexidade clínica esperado nos próximos 30 dias?',
      ],
      after: 'Com essas respostas, você recebe o plano de cuidados por escrito e a Support Nurse envia o time exato que aquele plano exige.',
    },
    {
      id: 'preco',
      q: 'Por que não tem preço no site?',
      a: [
        'Porque um preço tabelado seria irreal e não faria justiça ao seu familiar. O valor depende do que a entrevista mostra: o quadro clínico, os profissionais necessários e quantas horas por dia de cuidado.',
        'O orçamento personalizado vem junto com o plano de cuidados por escrito, com tudo o que está previsto. Sem letra miúda.',
      ],
    },
    {
      id: 'ajustes',
      q: 'E se o quadro mudar depois que o cuidado começar? O plano é ajustado?',
      a: [
        'Sim. O plano acompanha o paciente: a coordenação reavalia sempre que o quadro muda e ajusta a equipe, os horários e os protocolos. Nos três primeiros dias, a coordenadora acompanha pessoalmente.',
      ],
    },
    {
      id: 'supervisao',
      q: 'Como funciona a supervisão da equipe no dia a dia?',
      a: [
        'Nossa equipe é formada por profissionais fixos e colaboradores especializados, todos certificados, treinados no nosso protocolo interno e supervisionados pela coordenação clínica. Nenhum profissional atua sem supervisão.',
      ],
    },
    {
      id: 'faltas',
      q: 'Se o profissional escalado faltar, o que acontece?',
      a: ['Substituição em até 4 horas, com outro profissional do nosso banco ativo. Sem cobrança extra e sem improviso.'],
    },
    {
      id: 'contrato',
      q: 'Existe contrato escrito e plano de cuidados formal?',
      a: [
        'Sim. O contrato é transparente e o plano de cuidados é entregue por escrito no dia da avaliação: os procedimentos previstos, a escala da equipe e os protocolos por turno. Você sabe exatamente o que vai ser feito, quando e por quem.',
      ],
    },
    {
      id: 'noticias',
      q: 'Como recebo notícias do paciente?',
      a: [
        'Todo dia, pelo WhatsApp: sinais vitais, medicação administrada, intercorrências, alimentação e humor. E, a qualquer hora, a central de urgência 24h atende com enfermeira de plantão.',
      ],
    },
    {
      id: 'plano-de-saude',
      q: 'Vocês atendem plano de saúde ou é particular?',
      // TODO: resposta PROVISORIA, confirmar com a Support Nurse
      a: ['[Texto provisório] Resposta a confirmar com a Support Nurse.'],
    },
  ] as FaqItem[],
}

export type FaqItem = {
  id: string
  q: string
  a: string[]
  /** lista com marcas de check (ex.: o que a entrevista avalia) */
  checklist?: string[]
  /** paragrafo depois da lista */
  after?: string
}
