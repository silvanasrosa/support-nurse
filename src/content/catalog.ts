// Secao "Catalogo de especialidades" (texto do esboco, sem travessoes)

export type CatalogIcon = 'firstAid' | 'brain' | 'wind' | 'nutrition' | 'syringe' | 'bandaids' | 'walk' | 'handHeart' | 'armchair'

export const catalog = {
  eyebrow: 'Nossas especialidades',
  title: 'Surpreenda-se com o que',
  titleAccent: 'temos para oferecer.',
  intro:
    'Uma amostra do que nossa equipe multiprofissional atende. Se a condição do seu familiar não estiver aqui, provavelmente já cuidamos de um caso parecido: pergunte na entrevista com a enfermeira chefe.',

  areas: [
    {
      id: 'pos-cirurgico',
      icon: 'firstAid' as CatalogIcon,
      name: 'Pós-cirúrgico',
      headline: 'Recuperação com padrão clínico hospitalar',
      items: [
        'Pós-plástica de grande porte (lipo HD, abdominoplastia)',
        'Ortopédica: quadril, coluna, joelho e ombro',
        'Cardíaca: revascularização, válvula e marcapasso',
        'Abdominal: colecistectomia, colostomia e ressecções',
        'Trauma e pós-UTI',
      ],
    },
    {
      id: 'neurologico',
      icon: 'brain' as CatalogIcon,
      name: 'Neurológico',
      headline: 'Suporte contínuo para quadros degenerativos e agudos',
      items: ['Alzheimer e outras demências', 'Doença de Parkinson', 'Sequelas de AVC', 'Esclerose múltipla', 'Traumatismo craniano'],
    },
    {
      id: 'respiratorio',
      icon: 'wind' as CatalogIcon,
      name: 'Respiratório',
      headline: 'Cuidado especializado com via aérea e ventilação',
      items: [
        'Reabilitação pós-COVID',
        'DPOC e insuficiência respiratória crônica',
        'Traqueostomia: cuidado e aspiração',
        'Oxigenoterapia domiciliar',
      ],
    },
    {
      id: 'nutricional',
      icon: 'nutrition' as CatalogIcon,
      name: 'Nutricional e digestivo',
      headline: 'Suporte nutricional enteral e parenteral',
      items: ['Gastrostomia (GTT): cuidado e administração', 'Sonda nasoenteral', 'Colostomia e ileostomia', 'Nutrição parenteral'],
    },
    {
      id: 'medicamentosa',
      icon: 'syringe' as CatalogIcon,
      name: 'Terapia medicamentosa',
      headline: 'Administração de medicamentos de alta complexidade',
      items: [
        'Antibioticoterapia endovenosa',
        'Terapia subcutânea contínua',
        'Imunização e vacinas domiciliares',
        'Medicamentos controlados',
        'Terapia oncológica de suporte',
      ],
    },
    {
      id: 'curativos',
      icon: 'bandaids' as CatalogIcon,
      name: 'Curativos e feridas',
      headline: 'Do curativo simples ao complexo',
      items: [
        'Feridas cirúrgicas',
        'Úlceras por pressão: prevenção e tratamento',
        'Feridas crônicas: venosas, arteriais e diabéticas',
        'Ostomias em geral',
      ],
    },
    {
      id: 'reabilitacao',
      icon: 'walk' as CatalogIcon,
      name: 'Reabilitação',
      headline: 'Recuperação funcional em casa',
      items: ['Reabilitação motora pós-cirúrgica', 'Reabilitação cardíaca e pulmonar', 'Reeducação da marcha', 'Fisioterapia respiratória'],
    },
    {
      id: 'paliativos',
      icon: 'handHeart' as CatalogIcon,
      name: 'Cuidados paliativos',
      headline: 'Conforto, dignidade e presença',
      items: ['Controle da dor', 'Manejo de sintomas em quadros avançados', 'Suporte à família', 'Cuidado espiritual e psicológico'],
    },
    {
      id: 'idosos',
      icon: 'armchair' as CatalogIcon,
      name: 'Idosos e cuidado prolongado',
      headline: 'Autonomia preservada, dignidade sustentada',
      items: ['Acamados e semi-dependentes', 'Estímulo cognitivo', 'Prevenção de quedas', 'Acompanhamento em consultas e exames'],
    },
  ],

  /** botao no rodape do bloco preso: pula direto para a proxima secao */
  skipLabel: 'Próxima seção',

  cta: {
    quote:
      'A condição do seu familiar não apareceu aqui? Provavelmente já cuidamos de um caso parecido. Conte-nos o que precisa e a coordenadora clínica avalia.',
    label: 'Estamos prontos, conte-nos o que precisa',
    shortLabel: 'Fale com a coordenadora',
    href: '#contato',
  },
}
