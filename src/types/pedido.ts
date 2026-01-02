export type StatusPedido = 'aprovado' | 'em_producao' | 'instalado' | 'finalizado'

export interface Pedido {
  id: string
  orcamentoId: string
  clienteId: string
  clienteNome: string
  tipoServico: string
  modelo: string
  valor: number
  status: StatusPedido
  criadoEm: string
  atualizadoEm: string
  observacoes?: string
}

export const STATUS_LABELS: Record<StatusPedido, string> = {
  aprovado: 'Aprovado',
  em_producao: 'Em Produção',
  instalado: 'Instalado',
  finalizado: 'Finalizado'
}

export const STATUS_COLORS: Record<StatusPedido, string> = {
  aprovado: 'bg-blue-100 text-blue-800',
  em_producao: 'bg-yellow-100 text-yellow-800',
  instalado: 'bg-purple-100 text-purple-800',
  finalizado: 'bg-green-100 text-green-800'
}
