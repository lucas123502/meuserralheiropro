export type CategoriaCatalogo = 'Portões' | 'Estruturas Metálicas' | 'Toldos' | 'Outros Serviços'

export type TipoServicoCatalogo = 'Portão' | 'Estrutura metálica' | 'Toldo' | 'Outro'
export type ModeloCatalogo = 'Portão de correr' | 'Portão basculante' | 'Estrutura simples' | 'Toldo fixo' | 'Toldo retrátil' | 'Outro'

export interface ItemCatalogo {
  id: string
  nome: string
  categoria: CategoriaCatalogo
  descricao: string
  observacaoInterna?: string
  tipoServico: TipoServicoCatalogo
  modelo: ModeloCatalogo
  dataCriacao: string
  dataAtualizacao: string
}

// Mapeamento de categoria para tipo de serviço
export const categoriasParaTipoServico: Record<CategoriaCatalogo, TipoServicoCatalogo> = {
  'Portões': 'Portão',
  'Estruturas Metálicas': 'Estrutura metálica',
  'Toldos': 'Toldo',
  'Outros Serviços': 'Outro'
}
