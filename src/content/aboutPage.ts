// Pagina "Quem somos" (/quem-somos/): abertura. Os dados de transparencia ficam em about.ts.
// Textos do esboco novo (sem travessoes).

export const aboutPage = {
  eyebrow: 'Quem somos',
  title: 'Conheça a',
  titleAccent: 'Support Nurse.',
  text: 'Empresa de home care premium de alta complexidade em São Paulo. 15 anos levando o padrão hospitalar pra dentro da casa das famílias que confiam na gente.',
  founded: 'Fundada em 10/05/2011 por Cassia Felix.',
  cta: { label: 'Conte-nos o que precisa', href: '#contato' },

  // foto real da recepcao (a mesma da central 24h)
  photo: {
    src: '/images/beneficios/central-24h.webp',
    alt: 'Recepção da Support Nurse: atendente da central ao telefone, com a logo da empresa ao fundo',
  },

  // numeros da faixa do esboco
  stats: [
    { value: '15', label: 'Anos cuidando de famílias em São Paulo' },
    { value: '24h', label: 'Ativação para alta hospitalar urgente' },
    { value: '100%', label: 'Equipe certificada e supervisionada' },
    { value: '8+', label: 'Especialidades multidisciplinares' },
    { value: '3 a 24h', label: 'Períodos flexíveis de atendimento' },
    { value: 'SP', label: 'Cobertura em toda a capital' },
  ],
}
