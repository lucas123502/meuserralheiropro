import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, XCircle, Package, CircleCheck, DollarSign } from 'lucide-react'
import { Pedido, StatusPedido, STATUS_LABELS } from '@/types/pedido'

interface Orcamento {
  id: string
  data: Date | string
  cliente: string
  valor: number
  status: 'rascunho' | 'enviado'
  convertidoEmPedido?: boolean
}

type PeriodoFiltro = 'mes_atual' | 'ultimos_30' | 'todos'

export default function Relatorios() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [periodoSelecionado, setPeriodoSelecionado] = useState<PeriodoFiltro>('mes_atual')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = () => {
    // Carregar orçamentos
    const savedOrcamentos = localStorage.getItem('orcamentos')
    if (savedOrcamentos) {
      const parsed = JSON.parse(savedOrcamentos)
      setOrcamentos(parsed.map((o: any) => ({ ...o, data: new Date(o.data) })))
    }

    // Carregar pedidos
    const savedPedidos = localStorage.getItem('pedidos')
    if (savedPedidos) {
      setPedidos(JSON.parse(savedPedidos))
    }
  }

  const filtrarPorPeriodo = <T extends { data?: Date | string; criadoEm?: string }>(
    items: T[]
  ): T[] => {
    if (periodoSelecionado === 'todos') {
      return items
    }

    const hoje = new Date()
    let dataInicio: Date

    if (periodoSelecionado === 'mes_atual') {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    } else {
      // ultimos_30
      dataInicio = new Date(hoje)
      dataInicio.setDate(dataInicio.getDate() - 30)
    }

    return items.filter((item) => {
      let dataItem: Date

      if ('data' in item && item.data) {
        dataItem = typeof item.data === 'string' ? new Date(item.data) : item.data
      } else if ('criadoEm' in item && item.criadoEm) {
        dataItem = new Date(item.criadoEm)
      } else {
        return false
      }

      return dataItem >= dataInicio
    })
  }

  const orcamentosFiltrados = filtrarPorPeriodo(orcamentos)
  const pedidosFiltrados = filtrarPorPeriodo(pedidos)

  // Cálculos para os cards
  const totalOrcamentos = orcamentosFiltrados.length
  const orcamentosAprovados = orcamentosFiltrados.filter((o) => o.convertidoEmPedido).length
  const orcamentosNaoAprovados = totalOrcamentos - orcamentosAprovados
  const totalPedidos = pedidosFiltrados.length
  const pedidosFinalizados = pedidosFiltrados.filter((p) => p.status === 'finalizado').length

  // Faturamento: somente pedidos finalizados
  const faturamentoTotal = pedidosFiltrados
    .filter((p) => p.status === 'finalizado')
    .reduce((acc, p) => acc + p.valor, 0)

  // Conversão de orçamentos
  const taxaConversao = totalOrcamentos > 0 ? (orcamentosAprovados / totalOrcamentos) * 100 : 0

  // Pedidos por status
  const pedidosPorStatus: Record<StatusPedido, number> = {
    aprovado: 0,
    em_producao: 0,
    instalado: 0,
    finalizado: 0,
  }

  pedidosFiltrados.forEach((pedido) => {
    pedidosPorStatus[pedido.status]++
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatórios</h1>
        <p className="text-gray-600">Visão geral do desempenho do seu negócio</p>
      </div>

      {/* Filtro de Período */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={periodoSelecionado === 'mes_atual' ? 'default' : 'outline'}
          onClick={() => setPeriodoSelecionado('mes_atual')}
        >
          Mês Atual
        </Button>
        <Button
          variant={periodoSelecionado === 'ultimos_30' ? 'default' : 'outline'}
          onClick={() => setPeriodoSelecionado('ultimos_30')}
        >
          Últimos 30 Dias
        </Button>
        <Button
          variant={periodoSelecionado === 'todos' ? 'default' : 'outline'}
          onClick={() => setPeriodoSelecionado('todos')}
        >
          Todos os Períodos
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Orçamentos
            </CardTitle>
            <FileText className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalOrcamentos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Orçamentos Aprovados
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{orcamentosAprovados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Orçamentos Não Aprovados
            </CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{orcamentosNaoAprovados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Pedidos
            </CardTitle>
            <Package className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalPedidos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pedidos Finalizados
            </CardTitle>
            <CircleCheck className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{pedidosFinalizados}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Faturamento Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {faturamentoTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Somente pedidos finalizados entram no faturamento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Pedidos por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(pedidosPorStatus).map(([status, quantidade]) => (
                <div
                  key={status}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-700 font-medium">
                    {STATUS_LABELS[status as StatusPedido]}
                  </span>
                  <span className="text-gray-900 font-bold text-lg">{quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversão de Orçamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Conversão de Orçamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Total Criados</span>
                <span className="text-gray-900 font-bold text-lg">{totalOrcamentos}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Aprovados</span>
                <span className="text-green-600 font-bold text-lg">{orcamentosAprovados}</span>
              </div>
              <div className="flex items-center justify-between py-3 bg-blue-50 px-4 rounded-lg">
                <span className="text-gray-700 font-semibold">Taxa de Conversão</span>
                <span className="text-blue-600 font-bold text-2xl">
                  {taxaConversao.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
