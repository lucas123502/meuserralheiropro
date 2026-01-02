import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DollarSign, TrendingUp, Package, Calendar, User, FileText, Info } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subDays, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pedido } from '@/types/pedido'

type FiltroPeriodo = 'mes_atual' | 'ultimos_30' | 'total'

export default function Financeiro() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroSelecionado, setFiltroSelecionado] = useState<FiltroPeriodo>('mes_atual')

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = () => {
    const saved = localStorage.getItem('pedidos')
    if (saved) {
      setPedidos(JSON.parse(saved))
    }
  }

  // Filtrar apenas pedidos finalizados
  const pedidosFinalizados = useMemo(() => {
    return pedidos.filter(p => p.status === 'finalizado')
  }, [pedidos])

  // Aplicar filtro de período
  const pedidosFiltrados = useMemo(() => {
    const hoje = new Date()

    switch (filtroSelecionado) {
      case 'mes_atual': {
        const inicio = startOfMonth(hoje)
        const fim = endOfMonth(hoje)
        return pedidosFinalizados.filter(p =>
          isWithinInterval(new Date(p.atualizadoEm), { start: inicio, end: fim })
        )
      }
      case 'ultimos_30': {
        const inicio = subDays(hoje, 30)
        return pedidosFinalizados.filter(p =>
          isWithinInterval(new Date(p.atualizadoEm), { start: inicio, end: hoje })
        )
      }
      case 'total':
      default:
        return pedidosFinalizados
    }
  }, [pedidosFinalizados, filtroSelecionado])

  // Calcular métricas
  const faturamentoTotal = useMemo(() => {
    return pedidosFiltrados.reduce((total, pedido) => total + pedido.valor, 0)
  }, [pedidosFiltrados])

  const quantidadePedidos = pedidosFiltrados.length

  const getLabelPeriodo = () => {
    switch (filtroSelecionado) {
      case 'mes_atual':
        return 'Este Mês'
      case 'ultimos_30':
        return 'Últimos 30 Dias'
      case 'total':
        return 'Total Geral'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financeiro</h1>
        <p className="text-gray-600">Visão simples do seu faturamento</p>
      </div>

      {/* Alerta informativo */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Somente pedidos com status <strong>FINALIZADO</strong> são contabilizados no faturamento.
        </AlertDescription>
      </Alert>

      {/* Filtros de período */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filtroSelecionado === 'mes_atual' ? 'default' : 'outline'}
          onClick={() => setFiltroSelecionado('mes_atual')}
          size="sm"
        >
          Mês Atual
        </Button>
        <Button
          variant={filtroSelecionado === 'ultimos_30' ? 'default' : 'outline'}
          onClick={() => setFiltroSelecionado('ultimos_30')}
          size="sm"
        >
          Últimos 30 Dias
        </Button>
        <Button
          variant={filtroSelecionado === 'total' ? 'default' : 'outline'}
          onClick={() => setFiltroSelecionado('total')}
          size="sm"
        >
          Total Geral
        </Button>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Faturamento Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento {getLabelPeriodo()}
            </CardTitle>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              R$ {faturamentoTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {quantidadePedidos} {quantidadePedidos === 1 ? 'pedido finalizado' : 'pedidos finalizados'}
            </p>
          </CardContent>
        </Card>

        {/* Quantidade de Pedidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Finalizados
            </CardTitle>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {quantidadePedidos}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {filtroSelecionado === 'mes_atual' && 'neste mês'}
              {filtroSelecionado === 'ultimos_30' && 'nos últimos 30 dias'}
              {filtroSelecionado === 'total' && 'no total'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos finalizados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pedidos Finalizados - {getLabelPeriodo()}
          </CardTitle>
          <CardDescription>
            Lista de todos os pedidos que já foram concluídos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pedidosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum pedido finalizado
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {filtroSelecionado === 'total'
                  ? 'Quando você finalizar um pedido, ele aparecerá aqui no seu faturamento.'
                  : 'Nenhum pedido foi finalizado neste período. Tente mudar o filtro para ver seus resultados.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosFiltrados.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {pedido.clienteNome}
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Finalizado
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-7">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {pedido.tipoServico} - {pedido.modelo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Finalizado em {format(new Date(pedido.atualizadoEm), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xl font-bold text-green-600">
                      <DollarSign className="h-5 w-5" />
                      {pedido.valor.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
