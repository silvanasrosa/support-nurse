// Secao "Resultados": dado de pesquisa + avaliacoes reais do Google (texto sem travessoes)
// Fotos dos clientes: public/images/clientes (as mesmas da hero)

export const results = {
  eyebrow: 'O que 15 anos deixaram',
  title: 'Não são promessas.',
  titleAccent: 'É o que 15 anos de operação deixaram como resultado.',

  // TODO: confirmar a fonte antes de publicar
  study: {
    value: 40,
    label: 'menos reinternações',
    before: 'Idosos com suporte profissional domiciliar apresentam até',
    highlight: '40% menos reinternações',
    after: 'nos 30 dias seguintes à alta hospitalar.',
    source: 'Journal of the American Geriatrics Society',
  },

  // Perfil no Google (atualizar a nota e o total de vez em quando)
  google: {
    eyebrow: 'Avaliações no Google',
    rating: 4.5,
    count: 43,
    category: 'Agência de enfermagem em São Paulo',
    text: 'Nada mais forte do que família falando por família. Estas são avaliações reais, publicadas por clientes no nosso perfil do Google.',
    cta: 'Ver todas no Google',
    url: 'https://maps.app.goo.gl/ZTNZp4aNoYUADB217',
  },

  // Avaliacoes copiadas do Google como foram escritas
  reviews: [
    {
      name: 'Pérola Setton Sadka',
      photo: '/images/clientes/perola-setton-sadka.webp',
      meta: 'Local Guide · 14 avaliações',
      rating: 5,
      text: 'Sempre tive uma experiência excelente com a empresa. O atendimento é ágil e eficiente, inclusive aos finais de semana, o que faz toda a diferença quando mais precisamos. A equipe de cuidadoras é muito qualificada, atenciosa e transmite muita confiança. Além disso, o custo-benefício é ótimo. Recomendo com total segurança.',
    },
    {
      name: 'Francisco Madia',
      photo: '/images/clientes/francisco-madia.webp',
      meta: '2 avaliações',
      rating: 5,
      text: 'Nossa experiência com a SUPPORT NURSE foi a melhor, mais positiva e cordial possível. Os profissionais da saúde que prestaram serviços além de competentes e educados, revelaram-se seres humanos da melhor qualidade. Assim, e com total justiça e merecimento, concedemos a SUPORT NURSE a melhor avaliação, assim como, registramos nossos melhores agradecimentos. Francisco Madia.',
    },
    {
      name: 'Paula Castro',
      photo: '/images/clientes/paula-castro.webp',
      meta: '3 avaliações',
      rating: 5,
      text: 'Venho agradecer por terem me dado suporte. Uma equipe maravilhosa e a cima de tudo humanos, enfermeira Viviane me atendeu msm fora de hora. Enfermeiro Edir q foi a minha casa um excelente profissional,com muita paciência..... Enfim meu muito obrigada a todos. Que Deus os abençoe sempre.',
    },
    {
      name: 'Sandra Tergolina',
      photo: '/images/clientes/sandra-tergolina.webp',
      meta: '6 avaliações',
      rating: 5,
      text: 'A Support Nurse me atendeu por alguns anos,  com as rotinas de home care com minha mãe, portadora de Alzheimer e foi sempre com rapidez, seriedade e responsabilidade. Profissionais sempre atenciosas e carinhosas com a paciente. Recomendo.',
    },
    {
      name: 'Daniel Pereira',
      photo: '/images/clientes/daniel-pereira.webp',
      meta: 'Local Guide · 168 avaliações',
      rating: 5,
      text: 'Empresa confiável com serviço excelente. O contato com enfermeiras Andréa e Ágata foram sempre muito solícitos e excelentes, sempre atenderam inclusive a pedidos de urgência, o que demonstra muito respeito e atenção ao familiar e à pessoa que receberá o cuidado. Recomendo muito.',
    },
  ] as Review[],
}

export type Review = {
  name: string
  photo: string
  /** linha abaixo do nome, como aparece no Google */
  meta: string
  rating: number
  text: string
}
