import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, XCircle, Package, CircleCheck, DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react'
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

  // Dados financeiros (contas a receber / a pagar)
  const [receitaReal, setReceitaReal] = useState(0)
  const [despesaTotal, setDespesaTotal] = useState(0)

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

    // Carregar dados financeiros do módulo Financeiro
    const savedContasReceber = localStorage.getItem('contasReceber')
    if (savedContasReceber) {
      const contas = JSON.parse(savedContasReceber)
      const total = contas
        .filter((c: { status: string }) => c.status === 'recebido')
        .reduce((acc: number, c: { valor: number }) => acc + c.valor, 0)
      setReceitaReal(total)
    }

    const savedContasPagar = localStorage.getItem('contasPagar')
    if (savedContasPagar) {
      const contas = JSON.parse(savedContasPagar)
      const total = contas
        .filter((c: { status: string }) => c.status === 'pago')
        .reduce((acc: number, c: { valor: number }) => acc + c.valor, 0)
      setDespesaTotal(total)
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

  // Métricas financeiras reais
  const lucroLiquidoReal = receitaReal - despesaTotal
  const margemLucro = receitaReal > 0 ? (lucroLiquidoReal / receitaReal) * 100 : 0

  const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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

      {/* ── Visão Financeira Real ── */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Visão Financeira Real</h2>
        <p className="text-gray-500 text-sm mb-4">Baseado nas Contas a Receber e Contas a Pagar do módulo Financeiro</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Receita Real */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Real</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">R$ {formatBRL(receitaReal)}</div>
              <p className="text-xs text-gray-500 mt-1">Contas marcadas como recebido</p>
            </CardContent>
          </Card>

          {/* Despesa Total */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Despesa Total</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">R$ {formatBRL(despesaTotal)}</div>
              <p className="text-xs text-gray-500 mt-1">Contas marcadas como pago</p>
            </CardContent>
          </Card>

          {/* Lucro Líquido */}
          <Card className={`border-2 ${lucroLiquidoReal >= 0 ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
              <TrendingUp className={`h-5 w-5 ${lucroLiquidoReal >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${lucroLiquidoReal >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {lucroLiquidoReal < 0 ? '-' : ''}R$ {formatBRL(Math.abs(lucroLiquidoReal))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Receita Real − Despesa Total</p>
            </CardContent>
          </Card>

          {/* Margem de Lucro */}
          <Card className={`border-2 ${margemLucro >= 0 ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Margem de Lucro</CardTitle>
              <Percent className={`h-5 w-5 ${margemLucro >= 0 ? 'text-purple-600' : 'text-gray-400'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${margemLucro > 0 ? 'text-purple-700' : margemLucro < 0 ? 'text-red-700' : 'text-gray-500'}`}>
                {margemLucro.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {receitaReal === 0 ? 'Sem receita registrada' : '(Lucro ÷ Receita) × 100'}
              </p>
            </CardContent>
          </Card>
        </div>
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
