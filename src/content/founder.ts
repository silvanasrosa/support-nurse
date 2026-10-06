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

  // TODO: biografia PROVISORIA, trocar pelo texto real da Cassia
  bio: {
    eyebrow: 'Biografia',
    title: 'O padrão dos grandes hospitais,',
    titleAccent: 'dentro da sua casa.',
    paragraphs: [
      '[Texto provisório] Aqui entra a história da Cassia: a formação em enfermagem, os anos de prática em hospitais de referência e a especialização que a levou à coordenação clínica.',
      '[Texto provisório] E o momento em que decidiu fundar a Support Nurse, em 2011, para levar o mesmo rigor técnico e o mesmo cuidado humano para dentro da casa das famílias.',
    ],
    facts: [
      { label: 'Trajetória', value: '[Formação principal e tempo de atuação em home care]' },
      { label: 'Experiência clínica', value: '[Hospitais onde atuou antes de fundar a Support Nurse]' },
    ],
  },
}
