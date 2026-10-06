// Secao "Equipe" (texto do esboco, sem travessoes). A fundadora fica em content/founder.ts
// Fotos: public/images/equipe/ (enquanto nao existirem, aparece um espaco reservado)

export type RoleIcon = 'stethoscope' | 'physio' | 'nutrition' | 'speech' | 'psychology' | 'occupational' | 'technician' | 'dental'
export type SealIcon = 'clock' | 'shield' | 'certificate'

export const team = {
  staff: {
    eyebrow: 'Equipe multiprofissional',
    title: 'A expertise dos grandes hospitais,',
    titleAccent: 'na sua casa.',
    intro:
      'Com uma equipe multidisciplinar altamente qualificada, a Support Nurse leva à residência de seus clientes a qualidade e a expertise dos grandes hospitais: assistência domiciliar de baixa, média e alta complexidade, em períodos de 3, 6, 8, 12 ou 24 horas, com atendimento customizado e precisão clínica.',
    roles: [
      {
        id: 'enfermeiro',
        icon: 'stethoscope' as RoleIcon,
        title: 'Enfermeiro',
        text: 'Profissional responsável por cuidados e assistência aos pacientes com padrão de hospitais e clínicas de alta complexidade.',
        photo: '/images/equipe/01-enfermeiro.webp',
        alt: 'Mãos de enfermeiro ajustando o soro ao lado da cama do paciente',
      },
      {
        id: 'fisioterapeuta',
        icon: 'physio' as RoleIcon,
        title: 'Fisioterapeuta',
        text: 'Prevenção e tratamento de disfunções físicas, com exercícios e técnicas específicas para reabilitação motora, cardíaca e respiratória.',
        photo: '/images/equipe/02-fisioterapeuta.webp',
        alt: 'Fisioterapeuta apoiando um senhor que caminha com andador',
      },
      {
        id: 'nutricionista',
        icon: 'nutrition' as RoleIcon,
        title: 'Nutricionista',
        text: 'Planeja e orienta dietas adequadas às condições clínicas do paciente, incluindo terapia nutricional enteral e parenteral.',
        photo: '/images/equipe/03-nutricionista.webp',
        alt: 'Nutricionista montando uma refeição saudável em uma bandeja',
      },
      {
        id: 'fonoaudiologo',
        icon: 'speech' as RoleIcon,
        title: 'Fonoaudiólogo',
        text: 'Avalia e trata distúrbios de comunicação, voz, linguagem e deglutição, essencial em quadros pós-AVC, neurológicos e pós-intubação.',
        photo: '/images/equipe/04-fonoaudiologo.webp',
        alt: 'Fonoaudióloga orientando uma senhora em um exercício de deglutição',
      },
      {
        id: 'psicologo',
        icon: 'psychology' as RoleIcon,
        title: 'Psicólogo',
        text: 'Diagnostica, trata e previne distúrbios mentais e emocionais por meio de psicoterapia, incluindo suporte à família e ao cuidador.',
        photo: '/images/equipe/05-psicologo.webp',
        alt: 'Psicóloga conversando com um senhor e sua filha na sala de estar',
      },
      {
        id: 'terapeuta-ocupacional',
        icon: 'occupational' as RoleIcon,
        title: 'Terapeuta ocupacional',
        text: 'Ajuda o paciente a recuperar habilidades físicas e mentais para as atividades do dia a dia, do banho ao retorno da autonomia.',
        photo: '/images/equipe/06-terapeuta-ocupacional.webp',
        alt: 'Terapeuta ocupacional ajudando uma senhora a abotoar o casaco',
      },
      {
        id: 'tecnicos',
        icon: 'technician' as RoleIcon,
        title: 'Auxiliares e técnicos de enfermagem',
        text: 'Prestam cuidados básicos e assistência direta ao paciente, sob supervisão contínua da enfermagem. Nenhum turno sem coordenação.',
        photo: '/images/equipe/07-tecnicos.webp',
        alt: 'Técnico de enfermagem entregando um copo de água ao lado do porta-comprimidos',
      },
      {
        id: 'odontologia',
        icon: 'dental' as RoleIcon,
        title: 'Odontologia domiciliar',
        text: 'Cuidados odontológicos no domicílio: diagnóstico, tratamento e prevenção de problemas bucais, com conforto e qualidade.',
        photo: '/images/equipe/08-odontologia.webp',
        alt: 'Dentista examinando uma senhora sentada em uma poltrona, em casa',
      },
    ],
  },

  training: {
    eyebrow: 'Nossa maior expertise',
    title: 'Onde nossa equipe se formou.',
    text: 'Nossos profissionais têm experiência clínica em hospitais de referência de São Paulo, instituições reconhecidas pelo padrão de alta complexidade. É essa bagagem, absorvida em UTI e centro cirúrgico, que sustenta o padrão técnico que entregamos dentro da sua casa.',
    /**
     * VALIDAR COM O JURIDICO antes de publicar a citacao nominal dos hospitais.
     * Se algum profissional tiver clausula de confidencialidade, mude para false: a faixa mostra o texto generico.
     */
    showNames: true,
    hospitals: ['Albert Einstein', 'HCor', 'Sírio-Libanês', 'Oswaldo Cruz', 'Beneficência Portuguesa', 'Samaritano'],
    genericLabel: 'Hospitais de referência da capital paulista',
    disclaimerStrong: 'Não somos parceiros comerciais desses hospitais.',
    disclaimer: 'Nossos profissionais foram formados por dentro deles.',
  },

  guarantees: {
    seals: [
      { icon: 'clock' as SealIcon, title: 'Substituição em até 4 horas', text: 'em caso de imprevisto' },
      { icon: 'shield' as SealIcon, title: 'Supervisão clínica', text: 'em todos os turnos' },
      { icon: 'certificate' as SealIcon, title: 'Profissionais certificados', text: 'e treinados no nosso protocolo' },
    ],
    note: 'Nossa equipe é composta por profissionais fixos e colaboradores especializados, todos certificados em suas categorias, treinados no nosso protocolo interno e supervisionados pela coordenação clínica. Substituição garantida em até 4 horas em caso de imprevisto. Nenhum profissional atua sem supervisão clínica.',
  },
}
