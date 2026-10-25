// Chamada final (id "contato"): texto do esboco + pre-avaliacao que monta a mensagem do WhatsApp.
// O site nao guarda nada: as respostas so viram o texto da mensagem.

export const finalCta = {
  eyebrow: 'Alta hospitalar prevista?',
  title: 'Estamos prontos.',
  titleAccent: 'Conte-nos o que precisa.',
  text: 'Atendimento domiciliar para paciente de alta hospitalar em São Paulo. A entrevista com a coordenadora clínica é gratuita e pode ser feita no hospital ou na sua casa, no mesmo dia. Em 15 minutos ao telefone entendemos o caso e agendamos a visita. A operação começa em até 24 horas depois do plano assinado.',
  quote: 'Você não contrata uma diária de home care. Você contrata um plano de cuidados sob medida.',
  phoneLabel: 'Central 24h',

  form: {
    eyebrow: 'Pré-avaliação',
    title: 'Adiante o caso para a coordenadora',
    text: 'Toque nas respostas. Elas viram a sua mensagem no WhatsApp.',
    intro: 'Olá! Gostaria de agendar a entrevista com a coordenadora clínica.',
    cta: 'Enviar para a coordenadora',
    preview: 'Sua mensagem',
  },

  // cada pergunta: rotulo, opcoes (o que aparece no botao) e como entra na mensagem
  questions: [
    {
      id: 'local',
      label: 'Onde está o paciente?',
      prefix: 'Paciente',
      options: [
        { label: 'No hospital', text: 'internado no hospital' },
        { label: 'Na UTI', text: 'na UTI' },
        { label: 'Já em casa', text: 'já em casa' },
      ],
    },
    {
      id: 'mobilidade',
      label: 'Mobilidade',
      prefix: 'Mobilidade',
      options: [
        { label: 'Anda sozinho', text: 'anda sozinho' },
        { label: 'Apoio parcial', text: 'precisa de apoio parcial' },
        { label: 'Depende de ajuda', text: 'depende de ajuda para tudo' },
      ],
    },
    {
      id: 'horas',
      label: 'Horas por dia',
      prefix: 'Cuidado',
      options: [
        { label: '6h', text: '6 horas por dia' },
        { label: '8h', text: '8 horas por dia' },
        { label: '12h', text: '12 horas por dia' },
        { label: '24h', text: '24 horas por dia' },
        { label: 'Não sei', text: 'horas por dia ainda a definir' },
      ],
    },
    {
      id: 'dispositivos',
      label: 'Sonda, curativo, cateter ou traqueostomia?',
      prefix: 'Dispositivos',
      options: [
        { label: 'Sim', text: 'tem sonda, curativo, cateter ou traqueostomia' },
        { label: 'Não', text: 'sem sonda, curativo, cateter ou traqueostomia' },
        { label: 'Não sei', text: 'não sei informar' },
      ],
    },
  ] as CtaQuestion[],
}

export type CtaQuestion = {
  id: string
  label: string
  /** inicio da linha na mensagem (ex.: "Paciente: ja em casa") */
  prefix: string
  options: { label: string; text: string }[]
}
