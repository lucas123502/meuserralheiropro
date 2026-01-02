import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, Calendar, DollarSign, User, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import { Pedido, StatusPedido, STATUS_LABELS, STATUS_COLORS } from '@/types/pedido'

export default function Pedidos() {
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = () => {
    const saved = localStorage.getItem('pedidos')
    if (saved) {
      setPedidos(JSON.parse(saved))
    }
  }

  const alterarStatus = (novoStatus: StatusPedido) => {
    if (!pedidoSelecionado) return

    const pedidosAtualizados = pedidos.map(p =>
      p.id === pedidoSelecionado.id
        ? { ...p, status: novoStatus, atualizadoEm: new Date().toISOString() }
        : p
    )

    localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados))
    setPedidos(pedidosAtualizados)

    toast({
      title: 'Status atualizado!',
      description: `Pedido alterado para ${STATUS_LABELS[novoStatus]}`
    })

    setDialogAberto(false)
    setPedidoSelecionado(null)
  }

  const abrirDialogStatus = (pedido: Pedido) => {
    setPedidoSelecionado(pedido)
    setDialogAberto(true)
  }

  if (pedidos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pedidos</h1>

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Você ainda não tem pedidos
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Quando um orçamento for aprovado, você poderá convertê-lo em pedido e acompanhar o status
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pedidos</h1>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pedido.clienteNome}
                      </h3>
                      <Badge className={STATUS_COLORS[pedido.status]}>
                        {STATUS_LABELS[pedido.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {pedido.tipoServico} - {pedido.modelo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(pedido.criadoEm), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                      <DollarSign className="h-6 w-6" />
                      {pedido.valor.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => abrirDialogStatus(pedido)}
                  >
                    Alterar Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status do Pedido</DialogTitle>
            <DialogDescription>
              Selecione o novo status para este pedido
            </DialogDescription>
          </DialogHeader>

          {pedidoSelecionado && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  Cliente
                </div>
                <div className="font-semibold">{pedidoSelecionado.clienteNome}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Status Atual: <span className="font-bold">{STATUS_LABELS[pedidoSelecionado.status]}</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {(['aprovado', 'em_producao', 'instalado', 'finalizado'] as StatusPedido[]).map((status) => (
                    <Button
                      key={status}
                      variant={pedidoSelecionado.status === status ? 'default' : 'outline'}
                      onClick={() => alterarStatus(status)}
                      disabled={pedidoSelecionado.status === status}
                      className="justify-start"
                    >
                      {STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
