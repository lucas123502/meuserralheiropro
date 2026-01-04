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
    subcategorias: []
  },
  {
    id: 'cat-estrutura-metalica',
    nome: 'Estrutura Metálica',
    subcategorias: []
  },
  {
    id: 'cat-toldo',
    nome: 'Toldo',
    subcategorias: []
  },
  {
    id: 'cat-servico-solda',
    nome: 'Serviço com Solda',
    subcategorias: []
  },
  {
    id: 'cat-corrimao',
    nome: 'Corrimão',
    subcategorias: []
  },
  {
    id: 'cat-carretinha',
    nome: 'Carretinha',
    subcategorias: []
  },
  {
    id: 'cat-moveis-industriais',
    nome: 'Móveis Industriais',
    subcategorias: []
  },
  {
    id: 'cat-chales',
    nome: 'Chalés',
    subcategorias: []
  },
  {
    id: 'cat-grade-protecao',
    nome: 'Grade de Proteção',
    subcategorias: []
  },
  {
    id: 'cat-reformas',
    nome: 'Reformas em Geral',
    subcategorias: []
  },
  {
    id: 'cat-calha-rufo',
    nome: 'Calha e Rufo',
    subcategorias: []
  },
  {
    id: 'cat-gaiola-trilha',
    nome: 'Gaiola de Trilha',
    subcategorias: []
  },
  {
    id: 'cat-outros',
    nome: 'Outros',
    subcategorias: []
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
