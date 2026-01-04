// ============================================
// TIPOS E INTERFACES DO MÓDULO ORÇAMENTO
// ============================================

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
        nome: 'Portão abrir 1 folha',
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
        nome: 'Portão abrir 2 folhas',
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
        id: 'sub-cobertura',
        nome: 'Cobertura Metálica',
        modelos: [
          {
            id: 'mod-cobertura-simples',
            nome: 'Cobertura Simples',
            descricao: 'Estrutura básica para cobertura',
            precoPorMetroQuadrado: 180.00,
            ativo: true
          },
          {
            id: 'mod-cobertura-duas-aguas',
            nome: 'Cobertura Duas Águas',
            descricao: 'Estrutura com caimento bilateral',
            precoPorMetroQuadrado: 220.00,
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
        id: 'sub-toldo-fixo',
        nome: 'Toldo Fixo',
        modelos: [
          {
            id: 'mod-toldo-policarbonato',
            nome: 'Toldo Policarbonato',
            descricao: 'Estrutura metálica com cobertura em policarbonato',
            precoPorMetroQuadrado: 150.00,
            ativo: true
          },
          {
            id: 'mod-toldo-lona',
            nome: 'Toldo com Lona',
            descricao: 'Estrutura metálica com cobertura em lona',
            precoPorMetroQuadrado: 120.00,
            ativo: true
          }
        ]
      },
      {
        id: 'sub-toldo-retratil',
        nome: 'Toldo Retrátil',
        modelos: [
          {
            id: 'mod-toldo-retratil-manual',
            nome: 'Toldo Retrátil Manual',
            descricao: 'Sistema retrátil com acionamento manual',
            precoPorMetroQuadrado: 200.00,
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
        id: 'sub-servico-solda-geral',
        nome: 'Serviço de Solda',
        modelos: [
          {
            id: 'mod-solda-hora',
            nome: 'Serviço de Solda',
            descricao: 'Serviço de solda por hora',
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
        id: 'sub-corrimao-escada',
        nome: 'Corrimão de Escada',
        modelos: [
          {
            id: 'mod-corrimao-inox',
            nome: 'Corrimão Inox',
            descricao: 'Corrimão em aço inoxidável',
            precoPorMetroQuadrado: 280.00,
            ativo: true
          },
          {
            id: 'mod-corrimao-ferro',
            nome: 'Corrimão Ferro',
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
        id: 'sub-carretinha-pequena',
        nome: 'Carretinha Pequena',
        modelos: [
          {
            id: 'mod-carretinha-padrao',
            nome: 'Carretinha Padrão',
            descricao: 'Carretinha para transporte pequeno',
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
        id: 'sub-moveis-escritorio',
        nome: 'Móveis para Escritório',
        modelos: [
          {
            id: 'mod-mesa-industrial',
            nome: 'Mesa Industrial',
            descricao: 'Mesa em estrutura metálica',
            precoPorMetroQuadrado: 400.00,
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
        id: 'sub-chale-madeira',
        nome: 'Chalé de Madeira',
        modelos: [
          {
            id: 'mod-chale-pequeno',
            nome: 'Chalé Pequeno',
            descricao: 'Chalé estrutura metálica e madeira',
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
        id: 'sub-grade-janela',
        nome: 'Grade para Janela',
        modelos: [
          {
            id: 'mod-grade-simples',
            nome: 'Grade Simples',
            descricao: 'Grade de proteção padrão para janelas',
            precoPorMetroQuadrado: 120.00,
            ativo: true
          },
          {
            id: 'mod-grade-ornamentada',
            nome: 'Grade Ornamentada',
            descricao: 'Grade com detalhes decorativos',
            precoPorMetroQuadrado: 180.00,
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
        id: 'sub-reforma-residencial',
        nome: 'Reforma Residencial',
        modelos: [
          {
            id: 'mod-reforma-geral',
            nome: 'Reforma Geral',
            descricao: 'Serviço de reforma residencial',
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
            nome: 'Calha Alumínio',
            descricao: 'Calha em alumínio',
            precoPorMetroQuadrado: 80.00,
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
        id: 'sub-gaiola',
        nome: 'Gaiola Completa',
        modelos: [
          {
            id: 'mod-gaiola-padrao',
            nome: 'Gaiola Padrão',
            descricao: 'Gaiola de proteção para veículo',
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
        nome: 'Serviços Diversos',
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
