import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DollarSign, TrendingUp, Package, Calendar, User, FileText, Info, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subDays, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pedido } from '@/types/pedido'

type FiltroPeriodo = 'mes_atual' | 'ultimos_30' | 'total'

interface ContaReceber {
  id: string
  nome: string
  valor: number
  vencimento: string
  categoria: string
  status: 'pendente' | 'recebido'
  criadoEm: string
}

const CATEGORIAS = ['Venda', 'Serviço', 'Aluguel', 'Comissão', 'Outro']

const CONTA_RECEBER_VAZIA: Omit<ContaReceber, 'id' | 'criadoEm' | 'status'> = {
  nome: '',
  valor: 0,
  vencimento: '',
  categoria: '',
}

interface ContaPagar {
  id: string
  descricao: string
  valor: number
  vencimento: string
  categoria: string
  status: 'pendente' | 'pago'
  criadoEm: string
}

const CATEGORIAS_PAGAR = ['Material', 'Funcionário', 'Aluguel', 'Outros']

const CONTA_PAGAR_VAZIA: Omit<ContaPagar, 'id' | 'criadoEm' | 'status'> = {
  descricao: '',
  valor: 0,
  vencimento: '',
  categoria: '',
}

export default function Financeiro() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroSelecionado, setFiltroSelecionado] = useState<FiltroPeriodo>('mes_atual')

  // Contas a Receber
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [novaConta, setNovaConta] = useState(CONTA_RECEBER_VAZIA)

  // Contas a Pagar
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([])
  const [modalPagarAberto, setModalPagarAberto] = useState(false)
  const [novaDespesa, setNovaDespesa] = useState(CONTA_PAGAR_VAZIA)

  useEffect(() => {
    carregarPedidos()
    carregarContasReceber()
    carregarContasPagar()
  }, [])

  const carregarPedidos = () => {
    const saved = localStorage.getItem('pedidos')
    if (saved) {
      setPedidos(JSON.parse(saved))
    }
  }

  const carregarContasReceber = () => {
    const saved = localStorage.getItem('contasReceber')
    if (saved) {
      setContasReceber(JSON.parse(saved))
    }
  }

  const salvarContasReceber = (contas: ContaReceber[]) => {
    localStorage.setItem('contasReceber', JSON.stringify(contas))
    setContasReceber(contas)
  }

  const adicionarConta = () => {
    if (!novaConta.nome || !novaConta.valor || !novaConta.vencimento || !novaConta.categoria) return
    const conta: ContaReceber = {
      ...novaConta,
      id: Date.now().toString(),
      status: 'pendente',
      criadoEm: new Date().toISOString(),
    }
    salvarContasReceber([...contasReceber, conta])
    setNovaConta(CONTA_RECEBER_VAZIA)
    setModalAberto(false)
  }

  const marcarComoRecebido = (id: string) => {
    const atualizadas = contasReceber.map(c =>
      c.id === id ? { ...c, status: 'recebido' as const } : c
    )
    salvarContasReceber(atualizadas)
  }

  const totalAReceber = contasReceber
    .filter(c => c.status === 'pendente')
    .reduce((acc, c) => acc + c.valor, 0)

  const totalRecebido = contasReceber
    .filter(c => c.status === 'recebido')
    .reduce((acc, c) => acc + c.valor, 0)

  const carregarContasPagar = () => {
    const saved = localStorage.getItem('contasPagar')
    if (saved) {
      setContasPagar(JSON.parse(saved))
    }
  }

  const salvarContasPagar = (contas: ContaPagar[]) => {
    localStorage.setItem('contasPagar', JSON.stringify(contas))
    setContasPagar(contas)
  }

  const adicionarDespesa = () => {
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.vencimento || !novaDespesa.categoria) return
    const conta: ContaPagar = {
      ...novaDespesa,
      id: Date.now().toString(),
      status: 'pendente',
      criadoEm: new Date().toISOString(),
    }
    salvarContasPagar([...contasPagar, conta])
    setNovaDespesa(CONTA_PAGAR_VAZIA)
    setModalPagarAberto(false)
  }

  const marcarComoPago = (id: string) => {
    const atualizadas = contasPagar.map(c =>
      c.id === id ? { ...c, status: 'pago' as const } : c
    )
    salvarContasPagar(atualizadas)
  }

  const totalAPagar = contasPagar
    .filter(c => c.status === 'pendente')
    .reduce((acc, c) => acc + c.valor, 0)

  const totalPago = contasPagar
    .filter(c => c.status === 'pago')
    .reduce((acc, c) => acc + c.valor, 0)

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

      {/* ─────────────── CONTAS A RECEBER ─────────────── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contas a Receber</h2>
            <p className="text-gray-600 text-sm mt-1">Gerencie os valores que você tem a receber</p>
          </div>
          <Button onClick={() => setModalAberto(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        {/* Resumo Contas a Receber */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total a Receber</CardTitle>
              <div className="h-9 w-9 bg-yellow-200 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                R$ {totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {contasReceber.filter(c => c.status === 'pendente').length} conta(s) pendente(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Recebido</CardTitle>
              <div className="h-9 w-9 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {contasReceber.filter(c => c.status === 'recebido').length} conta(s) recebida(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Lista de Contas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contasReceber.length === 0 ? (
              <div className="text-center py-10">
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-7 w-7 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Nenhuma conta cadastrada</h3>
                <p className="text-gray-500 text-sm">Clique em "+ Nova Conta" para adicionar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contasReceber.map((conta) => (
                  <div
                    key={conta.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{conta.nome}</span>
                        <Badge
                          className={
                            conta.status === 'recebido'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {conta.status === 'recebido' ? 'Recebido' : 'Pendente'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{conta.categoria}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Vence em {format(new Date(conta.vencimento + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      {conta.status === 'pendente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => marcarComoRecebido(conta.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como recebido
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Nova Conta */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Conta a Receber</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="cr-nome">Nome</Label>
              <Input
                id="cr-nome"
                placeholder="Ex: Pagamento cliente João"
                value={novaConta.nome}
                onChange={e => setNovaConta(p => ({ ...p, nome: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cr-valor">Valor (R$)</Label>
              <Input
                id="cr-valor"
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={novaConta.valor || ''}
                onChange={e => setNovaConta(p => ({ ...p, valor: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cr-vencimento">Data de Vencimento</Label>
              <Input
                id="cr-vencimento"
                type="date"
                value={novaConta.vencimento}
                onChange={e => setNovaConta(p => ({ ...p, vencimento: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select
                value={novaConta.categoria}
                onValueChange={v => setNovaConta(p => ({ ...p, categoria: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button
              onClick={adicionarConta}
              disabled={!novaConta.nome || !novaConta.valor || !novaConta.vencimento || !novaConta.categoria}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────── CONTAS A PAGAR ─────────────── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contas a Pagar</h2>
            <p className="text-gray-600 text-sm mt-1">Controle suas despesas e obrigações financeiras</p>
          </div>
          <Button
            onClick={() => setModalPagarAberto(true)}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Despesa
          </Button>
        </div>

        {/* Resumo Contas a Pagar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total a Pagar</CardTitle>
              <div className="h-9 w-9 bg-red-200 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                R$ {totalAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {contasPagar.filter(c => c.status === 'pendente').length} despesa(s) pendente(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Pago</CardTitle>
              <div className="h-9 w-9 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {contasPagar.filter(c => c.status === 'pago').length} despesa(s) quitada(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Despesas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Lista de Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contasPagar.length === 0 ? (
              <div className="text-center py-10">
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-7 w-7 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Nenhuma despesa cadastrada</h3>
                <p className="text-gray-500 text-sm">Clique em "+ Nova Despesa" para adicionar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contasPagar.map((conta) => (
                  <div
                    key={conta.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      conta.status === 'pendente'
                        ? 'border-red-200 bg-red-50 hover:bg-red-100'
                        : 'border-green-200 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{conta.descricao}</span>
                        <Badge
                          className={
                            conta.status === 'pago'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {conta.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{conta.categoria}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Vence em {format(new Date(conta.vencimento + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${conta.status === 'pendente' ? 'text-red-700' : 'text-green-700'}`}>
                          R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      {conta.status === 'pendente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => marcarComoPago(conta.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como pago
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Nova Despesa */}
      <Dialog open={modalPagarAberto} onOpenChange={setModalPagarAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Despesa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="cp-descricao">Descrição</Label>
              <Input
                id="cp-descricao"
                placeholder="Ex: Compra de materiais"
                value={novaDespesa.descricao}
                onChange={e => setNovaDespesa(p => ({ ...p, descricao: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cp-valor">Valor (R$)</Label>
              <Input
                id="cp-valor"
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={novaDespesa.valor || ''}
                onChange={e => setNovaDespesa(p => ({ ...p, valor: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cp-vencimento">Data de Vencimento</Label>
              <Input
                id="cp-vencimento"
                type="date"
                value={novaDespesa.vencimento}
                onChange={e => setNovaDespesa(p => ({ ...p, vencimento: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select
                value={novaDespesa.categoria}
                onValueChange={v => setNovaDespesa(p => ({ ...p, categoria: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_PAGAR.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalPagarAberto(false)}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={adicionarDespesa}
              disabled={!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.vencimento || !novaDespesa.categoria}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
