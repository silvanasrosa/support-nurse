// Pagina "Areas atendidas" (/areas-atendidas/): capital e os 39 municipios da Regiao Metropolitana de Sao Paulo.
// Este arquivo tambem gera o HTML pre-pronto da pagina (vite.config.ts), lido pelo Google e pelas IAs.
// Sem caminhos com "@/": o vite.config importa este arquivo direto.

export type Region = { id: string; name: string; note?: string; cities: string[] }

export const regions: Region[] = [
  { id: 'capital', name: 'Capital', note: 'Todas as zonas: Centro, Norte, Sul, Leste e Oeste', cities: ['São Paulo'] },
  { id: 'abc', name: 'Sudeste · ABC', cities: ['Santo André', 'São Bernardo do Campo', 'São Caetano do Sul', 'Diadema', 'Mauá', 'Ribeirão Pires', 'Rio Grande da Serra'] },
  { id: 'oeste', name: 'Oeste', note: 'Inclui Alphaville', cities: ['Barueri', 'Santana de Parnaíba', 'Osasco', 'Carapicuíba', 'Itapevi', 'Jandira', 'Pirapora do Bom Jesus'] },
  { id: 'sudoeste', name: 'Sudoeste', cities: ['Cotia', 'Taboão da Serra', 'Embu das Artes', 'Itapecerica da Serra', 'Embu-Guaçu', 'Vargem Grande Paulista', 'São Lourenço da Serra', 'Juquitiba'] },
  { id: 'leste', name: 'Leste · Alto Tietê', cities: ['Guarulhos', 'Mogi das Cruzes', 'Suzano', 'Itaquaquecetuba', 'Arujá', 'Poá', 'Ferraz de Vasconcelos', 'Santa Isabel', 'Guararema', 'Biritiba Mirim', 'Salesópolis'] },
  { id: 'norte', name: 'Norte', cities: ['Caieiras', 'Mairiporã', 'Franco da Rocha', 'Francisco Morato', 'Cajamar'] },
]

export const allCities = regions.flatMap((r) => r.cities)

export const areas = {
  eyebrow: 'Áreas atendidas',
  title: 'Home care em São Paulo',
  titleAccent: 'e em toda a Grande SP.',
  text: 'Atendimento domiciliar de enfermagem e equipe multidisciplinar na capital e nos 39 municípios da Região Metropolitana de São Paulo, com o mesmo padrão hospitalar, a mesma coordenação clínica e a mesma central de urgência 24 horas.',
  cta: { label: 'Conte-nos o que precisa', href: '#contato' },

  stats: [
    { value: '39', label: 'municípios da Grande SP' },
    { value: '24h', label: 'central de urgência com enfermeira' },
    { value: '15', label: 'anos de home care em São Paulo' },
  ],

  list: {
    eyebrow: 'Onde atendemos',
    title: 'A capital e as cidades',
    titleAccent: 'da região metropolitana.',
    intro:
      'Atendemos pacientes em casa em todas as sub-regiões da Grande São Paulo. Se a sua cidade está na lista, o cuidado começa pelo mesmo caminho: uma ligação com a enfermeira coordenadora.',
  },

  same: {
    eyebrow: 'Fora da capital',
    title: 'O mesmo padrão,',
    titleAccent: 'em qualquer cidade da região.',
    items: [
      {
        title: 'Entrevista presencial e gratuita',
        text: 'A coordenadora clínica vai até o hospital ou até a casa do paciente para a avaliação inicial, também nas cidades da Grande SP.',
      },
      {
        title: 'Plano de cuidados por escrito',
        text: 'Procedimentos, escala da equipe e protocolos por turno documentados. O prazo de início é confirmado no primeiro contato, conforme a cidade e o quadro clínico.',
      },
      {
        title: 'Central 24h e relatório diário',
        text: 'Enfermeira de plantão a qualquer hora e relatório no WhatsApp todos os dias, com sinais vitais, medicação e intercorrências.',
      },
    ],
  },

  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Atendimento na',
    titleAccent: 'Grande São Paulo.',
    items: [
      {
        q: 'A Support Nurse atende fora da cidade de São Paulo?',
        a: 'Sim. Além da capital, a Support Nurse faz home care nos 39 municípios da Região Metropolitana de São Paulo, como Santo André, São Bernardo do Campo, São Caetano do Sul, Osasco, Barueri, Guarulhos, Cotia e Mogi das Cruzes.',
      },
      {
        q: 'Quais cidades do ABC paulista recebem atendimento domiciliar?',
        a: 'Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires e Rio Grande da Serra, com enfermagem domiciliar, cuidado a pacientes acamados, idosos e recuperação pós-cirúrgica.',
      },
      {
        q: 'Vocês fazem home care em Alphaville, Barueri e Santana de Parnaíba?',
        a: 'Sim. A região oeste da Grande SP, incluindo Alphaville, Barueri, Santana de Parnaíba e Osasco, é atendida com a mesma equipe multidisciplinar e a mesma coordenação clínica da capital.',
      },
      {
        q: 'O home care na Grande SP tem o mesmo padrão da capital?',
        a: 'Sim. Entrevista presencial gratuita com a coordenadora clínica, plano de cuidados por escrito, profissionais supervisionados, relatório diário no WhatsApp e central de urgência 24 horas com enfermeira de plantão.',
      },
      {
        q: 'Como contratar home care na Grande São Paulo?',
        a: 'Ligue para a central (11) 3132-4161 ou chame no WhatsApp (11) 97563-8606. A enfermeira coordenadora entende o caso no mesmo dia, agenda a entrevista e, depois do plano assinado, a equipe começa o atendimento na sua casa.',
      },
    ],
  },
}
