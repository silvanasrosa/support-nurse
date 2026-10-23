// Secao "Fundadora" (texto do esboco, sem travessoes)
// Fotos reais da Cassia, recortadas: public/images/fundadora/

export const founder = {
  eyebrow: 'Quem cuida da sua família',
  lead: 'Você não contrata uma empresa. Conhece a fundadora,',
  name: ['Cassia', 'Felix.'],

  // Fotos (para inverter, troque o conteudo de intro e bio). topGap = margem transparente acima da cabeca,
  // usada para a foto final encostar no nome sem cobrir o texto.
  photos: {
    // inicio da animacao (sobre o azul)
    intro: { src: '/images/fundadora/cassia-coordenadora.webp', alt: 'Cassia Felix com estetoscópio, como coordenadora clínica', topGap: 0.045 },
    // fim da animacao (sobre o branco)
    bio: { src: '/images/fundadora/cassia-caramelo.webp', alt: 'Cassia Felix, fundadora da Support Nurse, de terninho caramelo', topGap: 0.028 },
  },

  stats: {
    caption: 'Uma trajetória de cuidado',
    items: [
      { value: 15, suffix: '+', label: 'anos à frente\nda Support Nurse' },
      // TODO: numero PROVISORIO, confirmar com a Support Nurse
      { value: 2000, suffix: '+', label: 'famílias\natendidas' },
      { value: 8, suffix: '+', label: 'especialidades\nna equipe' },
    ],
  },

  // painel da direita no inicio (texto de apoio + cargos em pilulas; sai na rolagem para a biografia entrar)
  side: {
    title: 'Confiança em quem\nentra em casa.',
    text: 'No premium, é isso que a família compra. Por isso mostramos quem somos: quem fundou a operação, quem coordena o cuidado e onde nossa equipe aprendeu.',
    roles: ['Fundadora', 'Coordenadora clínica', 'Responsável técnica'],
    year: '2011',
  },

  bio: {
    eyebrow: 'Biografia',
    title: 'O padrão dos grandes hospitais,',
    titleAccent: 'dentro da sua casa.',
    paragraphs: [
      'CEO e Responsável Técnica da Support Nurse Home Care Premium. De maio de 2008 a novembro de 2018, foi Enfermeira Encarregada da Subcomissão de Controle de Infecção Hospitalar do Instituto de Ortopedia e Traumatologia do Hospital das Clínicas da FMUSP.',
      'Graduada em Enfermagem pela Universidade do Grande ABC (2004), tem ampla experiência em Controle de Infecção, Epidemiologia Hospitalar e Pesquisa Clínica, com trabalhos científicos apresentados em congressos internacionais.',
    ],
    facts: [
      { label: 'Hospital das Clínicas FMUSP', value: '10 anos no Controle de Infecção Hospitalar do Instituto de Ortopedia e Traumatologia (2008 a 2018).' },
      { label: 'Publicação científica', value: 'Estudo sobre prevenção de infecção de corrente sanguínea em UTI cirúrgica: pôster em congresso internacional (2011) e artigo na revista Clinics (2012).' },
    ],
  },
}
