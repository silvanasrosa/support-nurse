// Dados globais do site. Edite aqui, sem mexer nos componentes.
// Links oficiais: .materiais/ficha-cadastral/Midias Support Nurse - Página1.pdf

export const site = {
  name: 'Support Nurse',
  tagline: 'Home Care Premium',
  phone: { label: '(11) 3132-4161', href: 'tel:+551131324161' },
  whatsapp: {
    label: '(11) 97563-8606',
    number: '5511975638606',
    href: 'https://wa.me/5511975638606?text=Ol%C3%A1!%20%0AGostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20SupportNurse!',
  },
  email: 'contato@supportnurse.com.br',
  address: {
    line1: 'R. Augusta, 101, 15º andar',
    line2: 'Consolação, São Paulo',
    // completo (rodape), como no esboco
    full: ["Edifício Ca'd'Oro · R. Augusta, 101 · 15º andar, sala 1507", 'Consolação · São Paulo/SP · 01305-000'],
  },
  cnpj: '15.082.143/0001-67',
  founded: '10/05/2011',
  social: {
    instagram: 'https://www.instagram.com/supportnurse/',
    facebook: 'https://www.facebook.com/supportnursehomecare',
    youtube: 'https://www.youtube.com/@supportnurse_Homecare',
    tiktok: 'https://www.tiktok.com/@supportnurse?lang=pt-BR',
    threads: 'https://www.threads.com/@supportnurse',
    pinterest: 'https://br.pinterest.com/SupportNurse_HomecarePremium/',
    google: 'https://share.google/RUq5WSChiOWMhMHzH',
  },
}

export const nav = [
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Quem somos', href: '/quem-somos/' },
  { label: 'Contato', href: '#contato', highlight: true },
]

/** Link do WhatsApp com uma mensagem pronta. */
export const whatsappWith = (text: string) => `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`

/** Rodape (texto e colunas do esboco). Links "#secao" passam por homeHref. */
export const footer = {
  about: 'Home care premium de alta complexidade em São Paulo e na Grande SP. 15 anos levando o padrão hospitalar pra dentro da casa das famílias que confiam na gente.',
  columns: [
    {
      title: 'Serviços',
      links: [
        { label: 'Pós-cirúrgico', href: '#especialidades' },
        { label: 'Acamados', href: '#especialidades' },
        { label: 'Idosos', href: '#especialidades' },
        { label: 'Todas as especialidades', href: '#catalogo' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Quem somos', href: '/quem-somos/' },
        { label: 'Áreas atendidas', href: '/areas-atendidas/' },
        { label: 'A equipe', href: '#equipe' },
        { label: 'Como funciona', href: '#como-funciona' },
        { label: 'Perguntas frequentes', href: '#faq' },
        { label: 'Contato', href: '#contato' },
      ],
    },
  ],
  credits: {
    label: 'Desenvolvido por:',
    name: 'Prosperar Ideias',
    logo: '/logos/logo-prosperar-ideias.webp',
    href: 'https://api.whatsapp.com/send/?phone=5511985798767&text&type=phone_number&app_absent=0',
  },
}

/** Ancoras que as outras paginas tambem tem (o contato no fim, a equipe na Quem somos): continuam na pagina atual. */
const LOCAL_ANCHORS = ['#contato', '#equipe']

/** Links "#secao" sao da pagina inicial: nas outras paginas (ex.: Quem somos) eles apontam para "/#secao". */
export function homeHref(href: string) {
  const elsewhere = href.startsWith('#') && !LOCAL_ANCHORS.includes(href) && window.location.pathname !== '/'
  return elsewhere ? `/${href}` : href
}
