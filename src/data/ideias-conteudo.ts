import type { IdeiaConteudo, LinkUtil, MensagemWhatsApp } from '@/types/ideias'

// Ideias de conteúdo organizadas por categoria
export const ideiasConteudo: IdeiaConteudo[] = [
  // PORTÕES
  {
    id: '1',
    categoria: 'Portões',
    titulo: 'Antes e Depois de Portão Residencial',
    descricao: 'Mostre a transformação de um portão antigo para um novo. Cliente adora ver o resultado!',
    formato: 'Antes/Depois',
    texto: '🔥 TRANSFORMAÇÃO COMPLETA!\n\nDe portão antigo e enferrujado para um portão moderno e seguro.\n\n✅ Mais segurança\n✅ Visual renovado\n✅ Valoriza seu imóvel\n\n📱 Chama no WhatsApp para um orçamento!'
  },
  {
    id: '2',
    categoria: 'Portões',
    titulo: 'Processo de Instalação (Time-lapse)',
    descricao: 'Filme a instalação do começo ao fim e acelere o vídeo. Mostra profissionalismo!',
    formato: 'Vídeo'
  },
  {
    id: '3',
    categoria: 'Portões',
    titulo: 'Detalhes de Acabamento',
    descricao: 'Foto close dos detalhes: solda perfeita, pintura impecável, ferragens de qualidade.',
    formato: 'Foto',
    texto: '👌 Qualidade nos detalhes!\n\nNosso trabalho é feito com:\n✅ Solda profissional\n✅ Acabamento perfeito\n✅ Materiais de primeira\n\nSeu portão merece o melhor! 💪'
  },
  {
    id: '4',
    categoria: 'Portões',
    titulo: 'Dica de Manutenção',
    descricao: 'Ensine como cuidar do portão para durar mais. Gera autoridade e confiança.',
    formato: 'Reels',
    texto: '🔧 DICA DE OURO para seu portão durar anos!\n\n1. Lubrifique as dobradiças a cada 6 meses\n2. Lave com sabão neutro\n3. Evite bater ou forçar\n\nCuide bem e ele vai te proteger por muito tempo! 🏡'
  },
  {
    id: '5',
    categoria: 'Portões',
    titulo: 'Modelos Disponíveis',
    descricao: 'Carrossel mostrando diferentes modelos que você faz. Cliente escolhe o favorito.',
    formato: 'Carrossel',
    texto: '🚪 Qual modelo você prefere?\n\nDeslize e veja nossas opções:\n▶️ Portão de correr\n▶️ Portão basculante\n▶️ Portão social\n\nTodos feitos sob medida para sua casa!'
  },

  // ESTRUTURAS METÁLICAS
  {
    id: '6',
    categoria: 'Estruturas Metálicas',
    titulo: 'Obra em Andamento',
    descricao: 'Mostre a estrutura sendo montada. Cliente vê que você trabalha sério.',
    formato: 'Vídeo'
  },
  {
    id: '7',
    categoria: 'Estruturas Metálicas',
    titulo: 'Projeto vs. Realidade',
    descricao: 'Mostre o desenho/projeto ao lado da obra pronta. Impressiona muito!',
    formato: 'Antes/Depois',
    texto: '📐 DO PAPEL PARA A REALIDADE!\n\nVeja como transformamos o projeto em uma estrutura sólida e segura.\n\n✅ Planejamento detalhado\n✅ Execução perfeita\n✅ Resultado garantido\n\nSeu projeto em boas mãos! 💪'
  },
  {
    id: '8',
    categoria: 'Estruturas Metálicas',
    titulo: 'Estrutura Concluída',
    descricao: 'Foto da estrutura finalizada com boa iluminação. Destaque a qualidade.',
    formato: 'Foto',
    texto: '🏗️ Mais uma estrutura entregue!\n\nAço de alta resistência + Engenharia precisa = Obra segura e durável.\n\nFaça seu orçamento sem compromisso! 📲'
  },
  {
    id: '9',
    categoria: 'Estruturas Metálicas',
    titulo: 'Vantagens do Aço',
    descricao: 'Explique porque estruturas metálicas são uma boa escolha. Educa o cliente.',
    formato: 'Reels',
    texto: '💡 Por que escolher estruturas metálicas?\n\n✅ Resistência superior\n✅ Durabilidade de décadas\n✅ Sustentável (100% reciclável)\n✅ Obra mais rápida\n\nQualidade que sustenta seus projetos! 🏗️'
  },

  // TOLDOS
  {
    id: '10',
    categoria: 'Toldos',
    titulo: 'Toldo Instalado (Antes/Depois)',
    descricao: 'Compare o ambiente sem toldo e com toldo. Mostra o valor agregado.',
    formato: 'Antes/Depois',
    texto: '☀️ Seu espaço mais confortável!\n\nAntes: Sol direto, calor insuportável\nDepois: Sombra fresquinha, área aproveitada\n\n✅ Protege do sol e da chuva\n✅ Aumenta o espaço útil\n✅ Valoriza o imóvel\n\nChama no WhatsApp! 📱'
  },
  {
    id: '11',
    categoria: 'Toldos',
    titulo: 'Tipos de Lona e Cores',
    descricao: 'Carrossel mostrando opções de tecidos e cores. Cliente participa da escolha.',
    formato: 'Carrossel',
    texto: '🎨 Escolha a cor perfeita para seu toldo!\n\nTemos várias opções de lonas:\n▶️ Resistentes ao sol\n▶️ Impermeáveis\n▶️ Cores modernas\n\nPersonalize do seu jeito! 😊'
  },
  {
    id: '12',
    categoria: 'Toldos',
    titulo: 'Cliente Aproveitando o Toldo',
    descricao: 'Se possível, mostre a família/cliente usando a área. Cria conexão emocional.',
    formato: 'Foto'
  },
  {
    id: '13',
    categoria: 'Toldos',
    titulo: 'Instalação Rápida',
    descricao: 'Time-lapse da instalação. Mostra que é prático e não causa transtorno.',
    formato: 'Vídeo',
    texto: '⚡ Instalação rápida e sem bagunça!\n\nVeja como seu toldo fica pronto em poucas horas.\n\nAgendamos no melhor dia para você! 📅'
  },

  // OUTROS SERVIÇOS
  {
    id: '14',
    categoria: 'Outros Serviços',
    titulo: 'Serviços que Você Oferece',
    descricao: 'Liste todos os serviços: grades, guarda-corpos, escadas, etc.',
    formato: 'Carrossel',
    texto: '🔧 O QUE A GENTE FAZ?\n\n✅ Portões e grades\n✅ Estruturas metálicas\n✅ Toldos e coberturas\n✅ Guarda-corpos\n✅ Escadas\n✅ Corrimãos\n\nQualquer serviço em ferro e aço! 💪'
  },
  {
    id: '15',
    categoria: 'Outros Serviços',
    titulo: 'Depoimento de Cliente',
    descricao: 'Peça feedback de um cliente satisfeito. Prova social é ouro!',
    formato: 'Foto',
    texto: '⭐⭐⭐⭐⭐\n\n"Trabalho impecável! Super indico!"\n- Cliente satisfeito\n\nSeu projeto também merece esse cuidado! 📱'
  },
  {
    id: '16',
    categoria: 'Outros Serviços',
    titulo: 'Bastidores do Trabalho',
    descricao: 'Mostre você e sua equipe trabalhando. Humaniza e gera identificação.',
    formato: 'Reels'
  },
  {
    id: '17',
    categoria: 'Outros Serviços',
    titulo: 'Dica Rápida de Segurança',
    descricao: 'Compartilhe conhecimento sobre segurança em estruturas metálicas.',
    formato: 'Reels',
    texto: '⚠️ SEGURANÇA EM PRIMEIRO LUGAR!\n\nAo contratar um serralheiro, verifique:\n✅ Experiência comprovada\n✅ Uso de equipamentos de proteção\n✅ Materiais certificados\n\nNão economize na segurança da sua família! 🏡'
  },
  {
    id: '18',
    categoria: 'Outros Serviços',
    titulo: 'Promoção ou Condição Especial',
    descricao: 'Crie posts de ofertas especiais em épocas estratégicas.',
    formato: 'Foto',
    texto: '🎉 PROMOÇÃO DE [MÊS]!\n\nCondições especiais para:\n▶️ Portões residenciais\n▶️ Toldos\n▶️ Grades de proteção\n\n📱 Chama no WhatsApp e garanta sua vaga!\n\n⏰ Vagas limitadas!'
  }
]

// Links úteis curados
export const linksUteis: LinkUtil[] = [
  {
    id: '1',
    titulo: 'Como Filmar Seu Trabalho para Redes Sociais',
    descricao: 'Dicas práticas de como gravar vídeos do seu serviço com celular',
    url: 'https://www.youtube.com/results?search_query=como+filmar+trabalho+serralheiro',
    plataforma: 'YouTube'
  },
  {
    id: '2',
    titulo: 'Ideias de Reels para Profissionais',
    descricao: 'Exemplos de reels que funcionam para divulgar serviços',
    url: 'https://www.instagram.com/explore/tags/serralheria/',
    plataforma: 'Instagram'
  },
  {
    id: '3',
    titulo: 'Antes e Depois que Vendem',
    descricao: 'Como fazer fotos de antes e depois que impressionam',
    url: 'https://www.youtube.com/results?search_query=antes+e+depois+transforma%C3%A7%C3%A3o',
    plataforma: 'YouTube'
  },
  {
    id: '4',
    titulo: 'Serralheiros de Sucesso nas Redes',
    descricao: 'Perfis de serralheiros que vendem muito pelo Instagram',
    url: 'https://www.instagram.com/explore/tags/serralheriaartistica/',
    plataforma: 'Instagram'
  },
  {
    id: '5',
    titulo: 'Edição Simples de Vídeos pelo Celular',
    descricao: 'Tutorial de apps gratuitos para editar vídeos profissionais',
    url: 'https://www.youtube.com/results?search_query=editar+video+celular+gratis',
    plataforma: 'YouTube'
  },
  {
    id: '6',
    titulo: 'Legendas que Chamam Atenção',
    descricao: 'Como escrever textos que fazem o cliente parar e ler',
    url: 'https://www.youtube.com/results?search_query=como+escrever+legendas+instagram',
    plataforma: 'YouTube'
  },
  {
    id: '7',
    titulo: 'Marketing para Prestadores de Serviço',
    descricao: 'Estratégias de marketing digital para quem trabalha com serviços',
    url: 'https://www.youtube.com/results?search_query=marketing+prestador+de+servi%C3%A7o',
    plataforma: 'YouTube'
  },
  {
    id: '8',
    titulo: 'Portfólio de Trabalhos em Ferro e Aço',
    descricao: 'Inspiração de trabalhos lindos para mostrar aos clientes',
    url: 'https://www.instagram.com/explore/tags/trabalhosemferro/',
    plataforma: 'Instagram'
  }
]

// Mensagens prontas para WhatsApp
export const mensagensWhatsApp: MensagemWhatsApp[] = [
  // PROSPECÇÃO INICIAL
  {
    id: '1',
    tipo: 'Prospecção inicial',
    titulo: 'Primeiro contato - Apresentação',
    texto: 'Oi! Tudo bem? 😊\n\nSou [SEU NOME], serralheiro profissional.\n\nVi que você pode estar precisando de serviços em estruturas metálicas. Trabalho com portões, grades, toldos e muito mais!\n\nPosso te ajudar com algum projeto?'
  },
  {
    id: '2',
    tipo: 'Prospecção inicial',
    titulo: 'Prospecção para vizinhança',
    texto: 'Olá! 👋\n\nEstou fazendo um trabalho aqui no seu bairro e gostaria de oferecer meus serviços.\n\nSou especialista em:\n✅ Portões\n✅ Grades de proteção\n✅ Estruturas metálicas\n✅ Toldos\n\nTem interesse em receber um orçamento sem compromisso?'
  },

  // APRESENTAÇÃO DA EMPRESA
  {
    id: '3',
    tipo: 'Apresentação da empresa',
    titulo: 'Apresentação completa',
    texto: 'Prazer! Sou [SEU NOME] 👷‍♂️\n\n📍 Atuo em [SUA CIDADE] e região\n⏱️ [X] anos de experiência\n\n🔧 Serviços que ofereço:\n▶️ Portões residenciais e comerciais\n▶️ Estruturas metálicas\n▶️ Toldos e coberturas\n▶️ Grades e guarda-corpos\n▶️ Manutenção e reparos\n\n✅ Material de qualidade\n✅ Garantia do serviço\n✅ Orçamento transparente\n\nComo posso te ajudar? 😊'
  },
  {
    id: '4',
    tipo: 'Apresentação da empresa',
    titulo: 'Apresentação breve',
    texto: 'Oi! Sou [SEU NOME], serralheiro profissional! 🔧\n\nFaço portões, grades, estruturas metálicas e toldos com qualidade e garantia.\n\n[X] anos de experiência e vários clientes satisfeitos na região!\n\nQuer ver alguns trabalhos que já fiz?'
  },

  // ENVIO DE ORÇAMENTO
  {
    id: '5',
    tipo: 'Envio de orçamento',
    titulo: 'Envio formal de orçamento',
    texto: 'Olá! Segue o orçamento que você solicitou 📋\n\n[ANEXAR PDF DO ORÇAMENTO]\n\n💰 Valor: R$ [VALOR]\n📅 Prazo: [X] dias úteis\n✅ Inclui: material + mão de obra + garantia\n\nO orçamento é válido por 15 dias.\n\nFicou alguma dúvida? Estou à disposição! 😊'
  },
  {
    id: '6',
    tipo: 'Envio de orçamento',
    titulo: 'Orçamento com destaque de benefícios',
    texto: 'Seu orçamento está pronto! 🎉\n\n[ANEXAR PDF]\n\nPor que escolher nosso serviço?\n✅ Material de primeira qualidade\n✅ Acabamento impecável\n✅ Garantia de [X] meses\n✅ Experiência comprovada\n✅ Prazo cumprido\n\n💰 Valor: R$ [VALOR]\n\nVamos agendar? 📅'
  },

  // FOLLOW-UP
  {
    id: '7',
    tipo: 'Follow-up',
    titulo: 'Follow-up após 2-3 dias',
    texto: 'Oi! Tudo bem? 😊\n\nTe enviei um orçamento há alguns dias. Conseguiu dar uma olhada?\n\nFicou alguma dúvida ou quer ajustar alguma coisa no projeto?\n\nEstou por aqui para te ajudar!'
  },
  {
    id: '8',
    tipo: 'Follow-up',
    titulo: 'Follow-up com incentivo',
    texto: 'Olá! 👋\n\nVi que você ainda não respondeu sobre o orçamento.\n\nSe tiver alguma dúvida ou quiser negociar, podemos conversar!\n\nTambém posso apresentar outras opções que caibam melhor no seu orçamento. O que acha? 😊'
  },
  {
    id: '9',
    tipo: 'Follow-up',
    titulo: 'Último follow-up (educado)',
    texto: 'Oi! Como vai? 😊\n\nEntendo que as vezes o timing não é o ideal para fazer o serviço.\n\nSe quiser retomar a conversa no futuro, pode me chamar a qualquer momento!\n\nGuardo seu orçamento aqui. Boa sorte com seu projeto! 🙏'
  },

  // FECHAMENTO
  {
    id: '10',
    tipo: 'Fechamento',
    titulo: 'Confirmação do fechamento',
    texto: 'Ótimo! Fechado então! 🎉\n\nVou confirmar alguns detalhes:\n\n📋 Serviço: [DESCRIÇÃO]\n💰 Valor: R$ [VALOR]\n📅 Data de início: [DATA]\n⏱️ Prazo: [X] dias\n\nForma de pagamento:\n[DESCREVER CONDIÇÕES]\n\nTudo certo para você? Confirma?'
  },
  {
    id: '11',
    tipo: 'Fechamento',
    titulo: 'Preparação para início do trabalho',
    texto: 'Perfeito! Tudo confirmado! ✅\n\nVou começar o trabalho no dia [DATA] às [HORÁRIO].\n\nPreciso que você:\n✅ Libere o acesso ao local\n✅ Tenha ponto de energia disponível\n✅ [OUTRAS NECESSIDADES]\n\nQualquer imprevisto, me avisa com antecedência!\n\nNos vemos em breve! 😊'
  },

  // PÓS-VENDA
  {
    id: '12',
    tipo: 'Pós-venda',
    titulo: 'Agradecimento após conclusão',
    texto: 'Oi [NOME]! 😊\n\nSó passando para agradecer pela confiança no meu trabalho!\n\nFoi um prazer fazer seu projeto. Espero que você e sua família aproveitem bastante! 🏡\n\nQualquer coisa, estou à disposição!\n\nAbraço! 🙏'
  },
  {
    id: '13',
    tipo: 'Pós-venda',
    titulo: 'Pedido de avaliação',
    texto: 'Olá [NOME]! Tudo bem? 😊\n\nJá faz uns dias que finalizamos seu projeto. Está tudo certo?\n\nSe puder, deixa uma avaliação para mim! Isso ajuda muito outros clientes a me conhecerem.\n\n⭐⭐⭐⭐⭐\n\nObrigado! 🙏'
  },
  {
    id: '14',
    tipo: 'Pós-venda',
    titulo: 'Lembrete de manutenção',
    texto: 'Oi [NOME]! Como vai? 😊\n\nLembrete amigo: Já faz [X] meses que instalei seu [PORTÃO/TOLDO/ETC].\n\nÉ um bom momento para fazer uma revisão preventiva e garantir que tudo continue perfeito!\n\nQuer agendar uma visita técnica? (Sem custo!)\n\nEstou à disposição! 🔧'
  },
  {
    id: '15',
    tipo: 'Pós-venda',
    titulo: 'Pedido de indicação',
    texto: 'Oi [NOME]! Tudo bem? 😊\n\nConhece alguém que está precisando de serviços de serralheria?\n\nSe puder me indicar, ficarei muito grato! E você ainda ajuda alguém a ter o mesmo trabalho de qualidade que teve.\n\n🤝 Indique e ganhe [BENEFÍCIO, se houver]\n\nObrigado pelo apoio! 🙏'
  }
]
