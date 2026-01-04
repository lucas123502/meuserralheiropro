// ============================================
// TIPOS E INTERFACES DO MÓDULO ORÇAMENTO
// ============================================

/**
 * Serviço personalizado criado pelo usuário na categoria "Outros"
 */
export interface ServicoPersonalizado {
  id: string
  nomeServico: string
  nomeSubcategoria?: string
  tipoCobranca: 'fixo' | 'por_m2'
  valorBase: number
  observacoes?: string
  criadoEm: string
}

/**
 * Categoria principal de serviços/produtos
 */
export interface CategoriaOrcamento {
  id: string
  nome: string
  subcategorias: SubcategoriaOrcamento[]
}

/**
 * Subcategoria dentro de uma categoria
 */
export interface SubcategoriaOrcamento {
  id: string
  nome: string
  modelos: ModeloOrcamento[]
}

/**
 * Modelo específico de produto/serviço com precificação
 */
export interface ModeloOrcamento {
  id: string
  nome: string
  descricao?: string
  precoPorMetroQuadrado: number
  imagemUrl?: string
  ativo: boolean
}

/**
 * Medidas para cálculo de área
 */
export interface MedidasOrcamento {
  largura: number
  altura: number
  areaCalculada: number
}

/**
 * Detalhamento de custos de um item
 */
export interface CustosDetalhados {
  material: number
  kitPadrao: number
  maoDeObra: number
  deslocamento: number
  depreciacao: number
  margemLucro: number
}

/**
 * Item individual do orçamento
 */
export interface ItemOrcamento {
  id: string
  categoriaId: string
  subcategoriaId: string
  modeloId: string
  medidas: MedidasOrcamento
  custos: CustosDetalhados
  valorTotal: number
}

/**
 * Orçamento completo
 */
export interface Orcamento {
  id: string
  clienteId: string
  itens: ItemOrcamento[]
  valorTotal: number
  criadoEm: Date
}

// ============================================
// FUNÇÕES DE CÁLCULO
// ============================================

/**
 * Calcula a área com base em largura e altura
 * PRESERVA O VALOR EXATO sem arredondamentos
 */
export function calcularArea(largura: number, altura: number): number {
  // Multiplicação direta sem arredondamento
  const area = largura * altura

  // Retorna com precisão de duas casas decimais (para exibição monetária)
  return Number(area.toFixed(2))
}

/**
 * Calcula o valor do modelo baseado na área e preço por m²
 */
export function calcularValorModelo(
  area: number,
  precoPorMetroQuadrado: number
): number {
  const valor = area * precoPorMetroQuadrado
  return Number(valor.toFixed(2))
}

/**
 * Calcula o valor total de um item somando todos os custos
 * NÃO aplica descontos automáticos
 * NÃO aplica taxas de cartão
 */
export function calcularValorTotalItem(custos: CustosDetalhados): number {
  const total =
    custos.material +
    custos.kitPadrao +
    custos.maoDeObra +
    custos.deslocamento +
    custos.depreciacao +
    custos.margemLucro

  return Number(total.toFixed(2))
}

/**
 * Calcula o valor total de um orçamento somando todos os itens
 */
export function calcularValorTotalOrcamento(itens: ItemOrcamento[]): number {
  const total = itens.reduce((acc, item) => acc + item.valorTotal, 0)
  return Number(total.toFixed(2))
}

/**
 * Cria as medidas de um item calculando automaticamente a área
 */
export function criarMedidas(largura: number, altura: number): MedidasOrcamento {
  return {
    largura,
    altura,
    areaCalculada: calcularArea(largura, altura)
  }
}

/**
 * Valida se um valor numérico é positivo
 */
export function validarValorPositivo(valor: number, nomeCampo: string): boolean {
  if (valor < 0) {
    throw new Error(`${nomeCampo} não pode ser negativo`)
  }
  if (isNaN(valor)) {
    throw new Error(`${nomeCampo} deve ser um número válido`)
  }
  return true
}

// ============================================
// CATEGORIAS PADRÃO (DADOS INICIAIS)
// ============================================

export const CATEGORIAS_PADRAO: CategoriaOrcamento[] = [
  {
    id: 'cat-portao',
    nome: 'Portão',
    subcategorias: [
      {
        id: 'sub-portao-correr',
        nome: 'Portão de correr',
        modelos: [
          {
            id: 'mod-portao-correr-padrao',
            nome: 'Portão de Correr Padrão',
            descricao: 'Portão deslizante lateral',
            precoPorMetroQuadrado: 250.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-correr-social-dentro',
        nome: 'Portão de correr com portão social dentro',
        modelos: [
          {
            id: 'mod-portao-correr-social-dentro',
            nome: 'Portão de Correr com Social Interno',
            descricao: 'Portão deslizante com porta social integrada',
            precoPorMetroQuadrado: 280.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-correr-social-fora',
        nome: 'Portão de correr com portão social fora',
        modelos: [
          {
            id: 'mod-portao-correr-social-fora',
            nome: 'Portão de Correr com Social Externo',
            descricao: 'Portão deslizante com porta social ao lado',
            precoPorMetroQuadrado: 270.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-correr-grades',
        nome: 'Portão de correr com grades',
        modelos: [
          {
            id: 'mod-portao-correr-grades',
            nome: 'Portão de Correr com Grades',
            descricao: 'Portão deslizante com detalhes em grades',
            precoPorMetroQuadrado: 260.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-basculante',
        nome: 'Portão basculante / elevação',
        modelos: [
          {
            id: 'mod-portao-basculante-padrao',
            nome: 'Portão Basculante',
            descricao: 'Portão com abertura vertical',
            precoPorMetroQuadrado: 300.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-abrir-1folha',
        nome: 'Portão de abrir (1 folha)',
        modelos: [
          {
            id: 'mod-portao-1folha-padrao',
            nome: 'Portão 1 Folha',
            descricao: 'Portão com abertura em 1 folha',
            precoPorMetroQuadrado: 280.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-abrir-2folhas',
        nome: 'Portão de abrir (2 folhas)',
        modelos: [
          {
            id: 'mod-portao-2folhas-padrao',
            nome: 'Portão 2 Folhas',
            descricao: 'Portão com abertura em 2 folhas',
            precoPorMetroQuadrado: 290.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-simples',
        nome: 'Portão simples',
        modelos: [
          {
            id: 'mod-portao-simples',
            nome: 'Portão Simples',
            descricao: 'Portão modelo básico',
            precoPorMetroQuadrado: 220.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-chapa',
        nome: 'Portão de chapa',
        modelos: [
          {
            id: 'mod-portao-chapa',
            nome: 'Portão de Chapa',
            descricao: 'Portão em chapa de aço',
            precoPorMetroQuadrado: 270.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-metalon',
        nome: 'Portão de metalon',
        modelos: [
          {
            id: 'mod-portao-metalon',
            nome: 'Portão de Metalon',
            descricao: 'Portão em estrutura metalon',
            precoPorMetroQuadrado: 240.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-social',
        nome: 'Portão social',
        modelos: [
          {
            id: 'mod-portao-social-padrao',
            nome: 'Portão Social',
            descricao: 'Portão para entrada de pedestres',
            precoPorMetroQuadrado: 220.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-portao-abrir-l',
        nome: 'Portão de abrir em L',
        modelos: [
          {
            id: 'mod-portao-abrir-l',
            nome: 'Portão de Abrir em L',
            descricao: 'Portão com abertura em formato L',
            precoPorMetroQuadrado: 310.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-porta-ferro',
        nome: 'Porta de ferro',
        modelos: [
          {
            id: 'mod-porta-ferro-padrao',
            nome: 'Porta de Ferro',
            descricao: 'Porta completa em ferro',
            precoPorMetroQuadrado: 200.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-porta-ferro-madeira',
        nome: 'Porta de ferro e madeira',
        modelos: [
          {
            id: 'mod-porta-ferro-madeira-padrao',
            nome: 'Porta Ferro e Madeira',
            descricao: 'Porta combinada ferro com madeira',
            precoPorMetroQuadrado: 240.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-estrutura-metalica',
    nome: 'Estrutura Metálica',
    subcategorias: [
      {
        id: 'sub-estrutura-telha-zinco',
        nome: 'Estrutura metálica com telha de zinco',
        modelos: [
          {
            id: 'mod-estrutura-zinco',
            nome: 'Estrutura com Telha de Zinco',
            descricao: 'Estrutura metálica coberta com telha de zinco',
            precoPorMetroQuadrado: 180.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-estrutura-telha-sanduiche',
        nome: 'Estrutura metálica com telha sanduíche',
        modelos: [
          {
            id: 'mod-estrutura-sanduiche',
            nome: 'Estrutura com Telha Sanduíche',
            descricao: 'Estrutura metálica coberta com telha sanduíche',
            precoPorMetroQuadrado: 220.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-estrutura-telha-eternit',
        nome: 'Estrutura metálica com telha Eternit',
        modelos: [
          {
            id: 'mod-estrutura-eternit',
            nome: 'Estrutura com Telha Eternit',
            descricao: 'Estrutura metálica coberta com telha Eternit',
            precoPorMetroQuadrado: 190.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-pe-direito-metalico',
        nome: 'Pé-direito metálico',
        modelos: [
          {
            id: 'mod-pe-direito',
            nome: 'Pé-direito Metálico',
            descricao: 'Coluna metálica de sustentação',
            precoPorMetroQuadrado: 150.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-toldo',
    nome: 'Toldo',
    subcategorias: [
      {
        id: 'sub-toldo-lona',
        nome: 'Toldo em lona',
        modelos: [
          {
            id: 'mod-toldo-lona',
            nome: 'Toldo em Lona',
            descricao: 'Estrutura metálica com cobertura em lona',
            precoPorMetroQuadrado: 120.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-toldo-policarbonato',
        nome: 'Toldo em policarbonato',
        modelos: [
          {
            id: 'mod-toldo-policarbonato',
            nome: 'Toldo em Policarbonato',
            descricao: 'Estrutura metálica com cobertura em policarbonato',
            precoPorMetroQuadrado: 150.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-toldo-retratil',
        nome: 'Toldo retrátil',
        modelos: [
          {
            id: 'mod-toldo-retratil-manual',
            nome: 'Toldo Retrátil Manual',
            descricao: 'Sistema retrátil com acionamento manual',
            precoPorMetroQuadrado: 200.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-pergolado',
        nome: 'Pergolado',
        modelos: [
          {
            id: 'mod-pergolado',
            nome: 'Pergolado',
            descricao: 'Estrutura tipo pergolado',
            precoPorMetroQuadrado: 180.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-servico-solda',
    nome: 'Serviço com Solda',
    subcategorias: [
      {
        id: 'sub-solda-geral',
        nome: 'Solda em geral',
        modelos: [
          {
            id: 'mod-solda-geral',
            nome: 'Serviço de Solda',
            descricao: 'Serviço de solda em geral',
            precoPorMetroQuadrado: 100.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-corrimao',
    nome: 'Corrimão',
    subcategorias: [
      {
        id: 'sub-corrimao-ferro',
        nome: 'Corrimão de ferro',
        modelos: [
          {
            id: 'mod-corrimao-ferro',
            nome: 'Corrimão de Ferro',
            descricao: 'Corrimão em ferro com pintura',
            precoPorMetroQuadrado: 180.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-carretinha',
    nome: 'Carretinha',
    subcategorias: [
      {
        id: 'sub-carretinha-barco',
        nome: 'Carretinha de barco',
        modelos: [
          {
            id: 'mod-carretinha-barco',
            nome: 'Carretinha de Barco',
            descricao: 'Carretinha para transporte de barco',
            precoPorMetroQuadrado: 600.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-carretinha-carga',
        nome: 'Carretinha de carga',
        modelos: [
          {
            id: 'mod-carretinha-carga',
            nome: 'Carretinha de Carga',
            descricao: 'Carretinha para transporte de carga',
            precoPorMetroQuadrado: 500.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-moveis-industriais',
    nome: 'Móveis Industriais',
    subcategorias: [
      {
        id: 'sub-artigos-decoracao',
        nome: 'Artigos de decoração em geral',
        modelos: [
          {
            id: 'mod-artigos-decoracao',
            nome: 'Artigos de Decoração',
            descricao: 'Peças decorativas em metal',
            precoPorMetroQuadrado: 350.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-mesas',
        nome: 'Mesas',
        modelos: [
          {
            id: 'mod-mesa-industrial',
            nome: 'Mesa Industrial',
            descricao: 'Mesa em estrutura metálica',
            precoPorMetroQuadrado: 400.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-prateleiras',
        nome: 'Prateleiras',
        modelos: [
          {
            id: 'mod-prateleira',
            nome: 'Prateleira Metálica',
            descricao: 'Prateleira em estrutura metálica',
            precoPorMetroQuadrado: 300.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-chales',
    nome: 'Chalés',
    subcategorias: [
      {
        id: 'sub-chale-estrutura-sanduiche',
        nome: 'Chalé em estrutura metálica com telha sanduíche',
        modelos: [
          {
            id: 'mod-chale-sanduiche',
            nome: 'Chalé com Telha Sanduíche',
            descricao: 'Chalé em estrutura metálica com telha sanduíche',
            precoPorMetroQuadrado: 600.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-grade-protecao',
    nome: 'Grade de Proteção',
    subcategorias: [
      {
        id: 'sub-grade-tela',
        nome: 'Grade de proteção com tela',
        modelos: [
          {
            id: 'mod-grade-tela',
            nome: 'Grade com Tela',
            descricao: 'Grade de proteção com tela',
            precoPorMetroQuadrado: 110.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-grade-ferro-macico',
        nome: 'Grade de proteção com ferro maciço',
        modelos: [
          {
            id: 'mod-grade-ferro-macico',
            nome: 'Grade com Ferro Maciço',
            descricao: 'Grade de proteção com ferro maciço',
            precoPorMetroQuadrado: 180.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-grade-metalon',
        nome: 'Grade de proteção com metalon',
        modelos: [
          {
            id: 'mod-grade-metalon',
            nome: 'Grade com Metalon',
            descricao: 'Grade de proteção com metalon',
            precoPorMetroQuadrado: 140.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-reformas',
    nome: 'Reformas em Geral',
    subcategorias: [
      {
        id: 'sub-reforma-solda',
        nome: 'Reforma com solda',
        modelos: [
          {
            id: 'mod-reforma-solda',
            nome: 'Reforma com Solda',
            descricao: 'Serviço de reforma com solda',
            precoPorMetroQuadrado: 150.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-calha-rufo',
    nome: 'Calha e Rufo',
    subcategorias: [
      {
        id: 'sub-calha',
        nome: 'Calha',
        modelos: [
          {
            id: 'mod-calha-aluminio',
            nome: 'Calha',
            descricao: 'Calha para escoamento',
            precoPorMetroQuadrado: 80.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-rufo',
        nome: 'Rufo',
        modelos: [
          {
            id: 'mod-rufo',
            nome: 'Rufo',
            descricao: 'Rufo para acabamento',
            precoPorMetroQuadrado: 70.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-gaiola-trilha',
    nome: 'Gaiola de Trilha',
    subcategorias: [
      {
        id: 'sub-gaiola-estrutura-metalica',
        nome: 'Gaiola de estrutura metálica',
        modelos: [
          {
            id: 'mod-gaiola-padrao',
            nome: 'Gaiola de Estrutura Metálica',
            descricao: 'Gaiola de proteção em estrutura metálica',
            precoPorMetroQuadrado: 700.00,
            ativo: true
          }
        ]
      }
    ]
  },
  {
    id: 'cat-outros',
    nome: 'Outros',
    subcategorias: [
      {
        id: 'sub-outros',
        nome: 'Outros (campo livre para o usuário cadastrar manualmente)',
        modelos: [
          {
            id: 'mod-servico-personalizado',
            nome: 'Serviço Personalizado',
            descricao: 'Serviço sob medida',
            precoPorMetroQuadrado: 200.00,
            ativo: true
          }
        ]
      }
    ]
  }
]

// ============================================
// UTILITÁRIOS PARA CRIAÇÃO DE OBJETOS
// ============================================

/**
 * Gera um ID único simples (timestamp + random)
 */
export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Cria um novo item de orçamento com valores padrão
 */
export function criarItemOrcamento(
  categoriaId: string,
  subcategoriaId: string,
  modeloId: string,
  largura: number,
  altura: number
): Omit<ItemOrcamento, 'custos' | 'valorTotal'> {
  validarValorPositivo(largura, 'Largura')
  validarValorPositivo(altura, 'Altura')

  return {
    id: gerarId(),
    categoriaId,
    subcategoriaId,
    modeloId,
    medidas: criarMedidas(largura, altura)
  }
}

/**
 * Cria custos zerados (para inicialização)
 */
export function criarCustosZerados(): CustosDetalhados {
  return {
    material: 0,
    kitPadrao: 0,
    maoDeObra: 0,
    deslocamento: 0,
    depreciacao: 0,
    margemLucro: 0
  }
}

/**
 * Cria um novo orçamento vazio
 */
export function criarOrcamentoVazio(clienteId: string): Orcamento {
  return {
    id: gerarId(),
    clienteId,
    itens: [],
    valorTotal: 0,
    criadoEm: new Date()
  }
}

// ============================================
// FUNÇÕES PARA SERVIÇOS PERSONALIZADOS
// ============================================

/**
 * Obtém serviços personalizados salvos pelo usuário
 */
export function obterServicosPersonalizados(): ServicoPersonalizado[] {
  const servicosStr = localStorage.getItem('servicosPersonalizados')
  return servicosStr ? JSON.parse(servicosStr) : []
}

/**
 * Salva um novo serviço personalizado
 */
export function salvarServicoPersonalizado(servico: Omit<ServicoPersonalizado, 'id' | 'criadoEm'>): ServicoPersonalizado {
  const servicoCompleto: ServicoPersonalizado = {
    ...servico,
    id: gerarId(),
    criadoEm: new Date().toISOString()
  }

  const servicos = obterServicosPersonalizados()
  servicos.push(servicoCompleto)
  localStorage.setItem('servicosPersonalizados', JSON.stringify(servicos))

  return servicoCompleto
}

/**
 * Remove um serviço personalizado
 */
export function removerServicoPersonalizado(id: string): void {
  const servicos = obterServicosPersonalizados()
  const servicosFiltrados = servicos.filter(s => s.id !== id)
  localStorage.setItem('servicosPersonalizados', JSON.stringify(servicosFiltrados))
}
