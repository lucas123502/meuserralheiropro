import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Calendar, DollarSign, Download, CheckCircle, Settings, MessageCircle, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { baixarPDF } from '@/lib/pdf-generator'

import { useToast } from '@/hooks/use-toast'
import { Pedido } from '@/types/pedido'
import { salvarClienteAutomatico } from '@/lib/cliente-manager'

interface Orcamento {
  id: string
  data: Date | string
  cliente: string
  clienteId?: string
  valor: number
  status: 'rascunho' | 'enviado'
  tipoServico: string
  modelo: string
  medidas: {
    largura: string
    altura: string
    quantidade: string
  }
  clienteCompleto?: {
    nome: string
    telefone: string
    endereco: string
  }
  observacoes?: string
  convertidoEmPedido?: boolean
  dataEnvioWhatsApp?: string
}

function gerarMensagemWhatsApp(_orcamento: Orcamento): string {
  return `Olá, tudo bem?\n\nSegue o orçamento que preparei para você.\n\nSe tiver qualquer dúvida ou quiser ajustar algo é só me avisar.`
}

export default function Orcamentos() {
  const { toast } = useToast()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('orcamentos')
    if (saved) {
      const parsed = JSON.parse(saved)
      setOrcamentos(parsed.map((o: any) => ({ ...o, data: new Date(o.data) })))
    }
  }, [])

  const converterEmPedido = (orcamento: Orcamento) => {
    if (orcamento.convertidoEmPedido) {
      toast({
        title: 'Pedido já criado',
        description: 'Este orçamento já foi convertido em pedido',
        variant: 'destructive'
      })
      return
    }

    let clienteId = orcamento.clienteId || ''

    if (orcamento.clienteCompleto && orcamento.clienteCompleto.nome) {
      clienteId = salvarClienteAutomatico(
        orcamento.clienteCompleto,
        orcamento.clienteId
      )
    }

    const novoPedido: Pedido = {
      id: Date.now().toString(),
      orcamentoId: orcamento.id,
      clienteId: clienteId,
      clienteNome: orcamento.cliente,
      tipoServico: orcamento.tipoServico,
      modelo: orcamento.modelo,
      valor: orcamento.valor,
      status: 'aprovado',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      observacoes: orcamento.observacoes
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]')
    pedidos.push(novoPedido)
    localStorage.setItem('pedidos', JSON.stringify(pedidos))

    const orcamentosAtualizados = orcamentos.map(o =>
      o.id === orcamento.id ? { ...o, convertidoEmPedido: true, clienteId } : o
    )
    setOrcamentos(orcamentosAtualizados)
    localStorage.setItem('orcamentos', JSON.stringify(orcamentosAtualizados))

    toast({
      title: 'Pedido criado com sucesso!',
      description: 'O orçamento foi convertido em pedido'
    })
  }

  const enviarWhatsApp = (orcamento: Orcamento) => {
    const telefone = orcamento.clienteCompleto?.telefone || ''
    const telefoneLimpo = telefone.replace(/\D/g, '')

    if (!telefoneLimpo) {
      toast({
        title: 'Telefone não encontrado',
        description: 'Este orçamento não possui telefone do cliente cadastrado',
        variant: 'destructive'
      })
      return
    }

    // Adicionar código do Brasil se não tiver
    const telefoneFormatado = telefoneLimpo.startsWith('55')
      ? telefoneLimpo
      : `55${telefoneLimpo}`

    const mensagem = gerarMensagemWhatsApp(orcamento)
    const url = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`

    // Marcar dataEnvio no orçamento
    const agora = new Date().toISOString()
    const orcamentosAtualizados = orcamentos.map(o =>
      o.id === orcamento.id
        ? { ...o, status: 'enviado' as const, dataEnvioWhatsApp: agora }
        : o
    )
    setOrcamentos(orcamentosAtualizados)
    localStorage.setItem('orcamentos', JSON.stringify(orcamentosAtualizados))

    window.open(url, '_blank')

    toast({
      title: 'WhatsApp aberto!',
      description: 'Orçamento marcado como enviado'
    })
  }

  // Verifica se o orçamento precisa de follow-up:
  // enviado há mais de 2 dias, não convertido em pedido
  const precisaFollowUp = (orcamento: Orcamento): boolean => {
    if (orcamento.convertidoEmPedido) return false
    if (orcamento.status !== 'enviado') return false

    const dataRef = orcamento.dataEnvioWhatsApp
      ? new Date(orcamento.dataEnvioWhatsApp)
      : typeof orcamento.data === 'string'
        ? new Date(orcamento.data)
        : orcamento.data

    const diasPassados = (Date.now() - dataRef.getTime()) / (1000 * 60 * 60 * 24)
    return diasPassados >= 2
  }

  const paraAcompanhar = orcamentos.filter(precisaFollowUp)

  if (orcamentos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <div className="flex gap-3">
            <Link to="/orcamentos/modelos">
              <Button variant="outline" size="lg">
                <Settings className="h-5 w-5 mr-2" />
                Gerenciar Modelos
              </Button>
            </Link>
            <Link to="/orcamentos/novo">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Orçamento
              </Button>
            </Link>
          </div>
        </div>

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Você ainda não tem orçamentos
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Comece criando seu primeiro orçamento. É rápido e simples!
            </p>
            <Link to="/orcamentos/novo">
              <Button size="lg" className="mt-4">
                <Plus className="h-5 w-5 mr-2" />
                Criar Primeiro Orçamento
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
        <div className="flex gap-3">
          <Link to="/orcamentos/modelos">
            <Button variant="outline" size="lg">
              <Settings className="h-5 w-5 mr-2" />
              Gerenciar Modelos
            </Button>
          </Link>
          <Link to="/orcamentos/novo">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Orçamentos para acompanhar ── */}
      {paraAcompanhar.length > 0 && (
        <div className="mb-8 p-4 border-2 border-orange-200 bg-orange-50 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-orange-800">
              Orçamentos para acompanhar ({paraAcompanhar.length})
            </h2>
          </div>
          <p className="text-sm text-orange-700 mb-4">
            Estes orçamentos foram enviados há mais de 2 dias e ainda não viraram pedido. Hora de entrar em contato!
          </p>
          <div className="space-y-2">
            {paraAcompanhar.map((orcamento) => {
              const dataRef = orcamento.dataEnvioWhatsApp
                ? new Date(orcamento.dataEnvioWhatsApp)
                : typeof orcamento.data === 'string' ? new Date(orcamento.data) : orcamento.data
              const dias = Math.floor((Date.now() - dataRef.getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div
                  key={orcamento.id}
                  className="flex items-center justify-between bg-white border border-orange-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">{orcamento.cliente || 'Cliente sem nome'}</span>
                      <span className="text-sm text-gray-500 ml-2">{orcamento.tipoServico} - {orcamento.modelo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-orange-700 font-medium">
                      {dias === 1 ? '1 dia' : `${dias} dias`} sem resposta
                    </span>
                    {orcamento.clienteCompleto?.telefone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-700 border-green-300 hover:bg-green-50"
                        onClick={() => enviarWhatsApp(orcamento)}
                      >
                        <MessageCircle className="h-3.5 w-3.5 mr-1" />
                        Contatar
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {orcamentos.map((orcamento) => (
          <Card key={orcamento.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {orcamento.cliente || 'Cliente sem nome'}
                      </h3>
                      <Badge variant={orcamento.status === 'enviado' ? 'default' : 'secondary'}>
                        {orcamento.status === 'enviado' ? 'Enviado' : 'Rascunho'}
                      </Badge>
                      {orcamento.dataEnvioWhatsApp && (
                        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          WhatsApp enviado
                        </Badge>
                      )}
                      {precisaFollowUp(orcamento) && (
                        <Badge className="bg-orange-100 text-orange-800 border border-orange-300 animate-pulse">
                          <Bell className="h-3 w-3 mr-1" />
                          Fazer contato
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {orcamento.tipoServico} - {orcamento.modelo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(
                          typeof orcamento.data === 'string' ? new Date(orcamento.data) : orcamento.data,
                          "dd 'de' MMMM 'de' yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                    </div>

                    {orcamento.clienteCompleto?.telefone && (
                      <div className="text-sm text-gray-500">
                        Telefone: {orcamento.clienteCompleto.telefone}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                      <DollarSign className="h-6 w-6" />
                      {(() => {
                        const valorSeguro = Number.isFinite(orcamento.valor) ? orcamento.valor : 0
                        return valorSeguro.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => baixarPDF(orcamento)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-300 hover:bg-green-50"
                    onClick={() => enviarWhatsApp(orcamento)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar no WhatsApp
                  </Button>

                  {!orcamento.convertidoEmPedido && orcamento.status === 'enviado' && (
                    <Button
                      size="sm"
                      onClick={() => converterEmPedido(orcamento)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Converter em Pedido
                    </Button>
                  )}
                  {orcamento.convertidoEmPedido && (
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      Convertido em Pedido
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
