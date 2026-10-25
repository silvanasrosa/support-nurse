export const hero = {
  title: 'Home Care',
  titleAccent: 'Multidisciplinar',
  tagline: 'O padrão dos grandes hospitais dentro da sua casa.',
  cta: { label: 'Conte-nos o que precisa', href: '#contato' },

  stats: {
    caption: 'Resultados de que nos orgulhamos',
    items: [
      { value: 15, suffix: '+', label: 'anos de\nexperiência' },
      { value: 24, suffix: 'h', label: 'ativação após\nalta hospitalar' },
      { value: 100, suffix: '%', label: 'equipe\nsupervisionada' },
    ],
    // Quando houver vídeo da recepção, informe o caminho aqui (ex.: '/media/recepcao.mp4')
    video: undefined as string | undefined,
  },

  side: {
    title: 'Cuidado de hospital,\nno conforto de casa',
    text: 'Atendimento domiciliar de enfermagem em São Paulo: pós-cirúrgico, acamados, idosos e terapia medicamentosa com equipe multidisciplinar, plano de cuidados por escrito e central de urgência 24 horas.',
  },

  // Rótulos flutuantes de vidro. x e y em % do palco central (tablet e desktop); mobile = posição no smartphone.
  pills: [
    // className opcional: esta pilula some no tablet (md ate lg), onde cairia sobre o botao
    { label: 'Confiança', x: -26, y: 60, mobile: { x: 4, y: 60 }, dot: 'right' as const, className: 'md:max-lg:hidden' },
    { label: 'Experiência', x: 64, y: 44, mobile: { x: 56, y: 36 }, dot: 'left' as const },
    { label: 'Excelência', x: 72, y: 78, mobile: { x: 54, y: 74 }, dot: 'left' as const },
  ],

  feedback: {
    text: 'Famílias que confiam',
    strong: 'desde 2011',
    // Fotos de clientes (avaliacoes reais). Arquivos em public/images/clientes
    clients: [
      { name: 'Francisco Madia', photo: '/images/clientes/francisco-madia.webp' },
      { name: 'Paula Castro', photo: '/images/clientes/paula-castro.webp' },
      { name: 'Pérola Setton Sadka', photo: '/images/clientes/perola-setton-sadka.webp' },
    ],
  },

  // Caminho de um PNG recortado (sem fundo). Sem foto, o palco exibe o símbolo 3D.
  portrait: '/images/enfermeira-hero.webp' as string | undefined,
  // versoes menores da mesma foto (o navegador escolhe pelo tamanho da tela)
  // mesmo valor do preload em index.html (se mudar aqui, mude la)
  portraitSizes: '(min-width: 768px) 46vw, 62vw',
  portraitSrcSet: '/images/enfermeira-hero-480.webp 480w, /images/enfermeira-hero-640.webp 640w, /images/enfermeira-hero-860.webp 860w, /images/enfermeira-hero.webp 1086w',
}
