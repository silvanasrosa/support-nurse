// Secao "Alta complexidade" (texto do esboco, sem travessoes)

export const specialties = {
  eyebrow: 'Especialidades clínicas',
  title: 'Alta complexidade é o nosso',
  titleAccent: 'território há 15 anos.',
  intro:
    'Cada tipo de cuidado exige um protocolo diferente. Escolha o seu: nossa equipe já cuidou de centenas de casos como o do seu familiar.',

  seals: [
    { icon: 'stethoscope', value: '8+', label: 'especialidades na equipe' },
    { icon: 'clock', value: '3 a 24h', label: 'períodos flexíveis' },
    { icon: 'map', value: 'SP', label: 'toda a capital' },
  ],

  items: [
    {
      id: 'pos-cirurgico',
      icon: 'firstAid',
      title: 'Pós-cirúrgico premium',
      text: 'Pós-plástica, ortopédica, cardíaca e trauma. Monitoramento de sinais vitais, curativos complexos, controle da dor e mobilização segura. Ativação em 24 horas para alta programada ou urgente.',
      protocol: {
        lead: 'Recuperação com padrão clínico hospitalar, do primeiro dia em casa até a alta.',
        list: [
          'Pós-plástica de grande porte (lipo HD, abdominoplastia)',
          'Ortopédica: quadril, coluna, joelho e ombro',
          'Cardíaca: revascularização, válvula e marcapasso',
          'Abdominal: colecistectomia, colostomia e ressecções',
          'Trauma e pós-UTI',
        ],
      },
    },
    {
      id: 'acamados',
      icon: 'bed',
      title: 'Acamados e cuidado prolongado',
      text: 'Prevenção de escaras, higiene digna, mobilização, gastrostomia, traqueostomia, sonda vesical e aspiração. Enfermagem com experiência em UTI. Períodos de 6, 8, 12 ou 24 horas.',
      protocol: {
        lead: 'Cuidado contínuo, com técnica de UTI e respeito à rotina da família.',
        list: [
          'Prevenção e tratamento de úlceras por pressão',
          'Gastrostomia (GTT) e sonda nasoenteral',
          'Traqueostomia: cuidado e aspiração',
          'Sonda vesical, colostomia e ileostomia',
          'Mobilização, higiene e conforto no leito',
        ],
      },
    },
    {
      id: 'idosos',
      icon: 'heart',
      title: 'Idosos com dependência',
      text: 'Parkinson, Alzheimer, sequelas de AVC e quadros crônicos. Cuidado que preserva a autonomia sempre que possível e sustenta a dignidade quando ela precisa ser sustentada.',
      protocol: {
        lead: 'Autonomia preservada, dignidade sustentada.',
        list: [
          'Alzheimer e outras demências',
          'Doença de Parkinson',
          'Sequelas de AVC',
          'Estímulo cognitivo e prevenção de quedas',
          'Acompanhamento em consultas e exames',
        ],
      },
    },
    {
      id: 'medicamentosa',
      icon: 'syringe',
      title: 'Terapia medicamentosa',
      text: 'Antibioticoterapia endovenosa, terapia subcutânea, imunização e aplicação de medicamentos controlados. Sob prescrição médica, com protocolo hospitalar e registro em prontuário.',
      protocol: {
        lead: 'Administração de medicamentos de alta complexidade, com segurança e rastreabilidade.',
        list: [
          'Antibioticoterapia endovenosa',
          'Terapia subcutânea contínua',
          'Imunização e vacinas domiciliares',
          'Medicamentos controlados',
          'Terapia oncológica de suporte',
        ],
      },
    },
  ],

  protocolCta: { label: 'Conte-nos o que precisa', href: '#contato' },
}

export type SpecialtyIcon = 'firstAid' | 'bed' | 'heart' | 'syringe'
