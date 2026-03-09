import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageCircle, Clock, DollarSign, ChevronRight, ChevronLeft, Wrench } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type ColunaCRM = 'enviado' | 'negociando' | 'aprovado' | 'producao' | 'instalado' | 'perdido'

interface CardCRM {
  id: string
  orcamentoId: string
  cliente: string
  telefone: string
  servico: string
  modelo: string
  valor: number
  coluna: ColunaCRM
  dataUltimaInteracao: string
  observacoes?: string
}

const COLUNAS: { id: ColunaCRM; label: string; cor: string; corBg: string }[] = [
  { id: 'enviado', label: 'Enviado', cor: 'text-blue-700', corBg: 'bg-blue-50 border-blue-200' },
  { id: 'negociando', label: 'Negociando', cor: 'text-yellow-700', corBg: 'bg-yellow-50 border-yellow-200' },
  { id: 'aprovado', label: 'Aprovado', cor: 'text-green-700', corBg: 'bg-green-50 border-green-200' },
  { id: 'producao', label: 'Produção', cor: 'text-orange-700', corBg: 'bg-orange-50 border-orange-200' },
  { id: 'instalado', label: 'Instalado', cor: 'text-purple-700', corBg: 'bg-purple-50 border-purple-200' },
  { id: 'perdido', label: 'Perdido', cor: 'text-red-700', corBg: 'bg-red-50 border-red-200' },
]

const STORAGE_KEY = 'crm_cards'

function calcularDiasSemResposta(dataUltimaInteracao: string): number {
  const ultima = new Date(dataUltimaInteracao)
  const agora = new Date()
  const diff = agora.getTime() - ultima.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function gerarMensagemFollowUp(card: CardCRM): string {
  const nomeCliente = card.cliente || 'Cliente'
  const dias = calcularDiasSemResposta(card.dataUltimaInteracao)

  let mensagem = `Olá ${nomeCliente}! 👋\n\n`

  if (dias > 0) {
    mensagem += `Passando para saber se você já teve a oportunidade de analisar o orçamento que enviei há ${dias} dia${dias > 1 ? 's' : ''}.\n\n`
  } else {
    mensagem += `Passando para saber se você tem alguma dúvida sobre o orçamento que enviei.\n\n`
  }

  mensagem += `🔧 *Serviço:* ${card.servico}\n`
  mensagem += `💰 *Valor:* R$ ${card.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`
  mensagem += `Estou à disposição para esclarecer qualquer dúvida ou ajustar o orçamento conforme sua necessidade. 😊`

  return mensagem
}

function sincronizarComOrcamentos(cardsAtuais: CardCRM[]): CardCRM[] {
  const orcamentosRaw = localStorage.getItem('orcamentos')
  if (!orcamentosRaw) return cardsAtuais

  const orcamentos = JSON.parse(orcamentosRaw)
  const idsExistentes = new Set(cardsAtuais.map(c => c.orcamentoId))
  const novosCards: CardCRM[] = []

  for (const orc of orcamentos) {
    if (!idsExistentes.has(orc.id) && orc.status === 'enviado') {
      novosCards.push({
        id: `crm-${orc.id}`,
        orcamentoId: orc.id,
        cliente: orc.cliente || 'Cliente sem nome',
        telefone: orc.clienteCompleto?.telefone || '',
        servico: orc.tipoServico || '',
        modelo: orc.modelo || '',
        valor: orc.valor || 0,
        coluna: 'enviado',
        dataUltimaInteracao: orc.dataEnvioWhatsApp || orc.data || new Date().toISOString(),
        observacoes: orc.observacoes
      })
    }
  }

  return [...cardsAtuais, ...novosCards]
}

export default function CRM() {
  const { toast } = useToast()
  const [cards, setCards] = useState<CardCRM[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const cardsAtuais: CardCRM[] = saved ? JSON.parse(saved) : []
    const cardsSincronizados = sincronizarComOrcamentos(cardsAtuais)
    setCards(cardsSincronizados)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsSincronizados))
  }, [])

  const salvarCards = useCallback((novosCards: CardCRM[]) => {
    setCards(novosCards)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosCards))
  }, [])

  const moverCard = (cardId: string, direcao: 'anterior' | 'proxima') => {
    const card = cards.find(c => c.id === cardId)
    if (!card) return

    const indexAtual = COLUNAS.findIndex(c => c.id === card.coluna)
    let novoIndex = direcao === 'proxima' ? indexAtual + 1 : indexAtual - 1

    if (novoIndex < 0 || novoIndex >= COLUNAS.length) return

    const novaColuna = COLUNAS[novoIndex].id

    const novosCards = cards.map(c =>
      c.id === cardId
        ? { ...c, coluna: novaColuna, dataUltimaInteracao: new Date().toISOString() }
        : c
    )
    salvarCards(novosCards)

    toast({
      title: 'Card movido!',
      description: `${card.cliente} → ${COLUNAS[novoIndex].label}`
    })
  }

  const enviarFollowUp = (card: CardCRM) => {
    const telefoneLimpo = card.telefone.replace(/\D/g, '')

    if (!telefoneLimpo) {
      toast({
        title: 'Telefone não encontrado',
        description: 'Este cliente não possui telefone cadastrado',
        variant: 'destructive'
      })
      return
    }

    const telefoneFormatado = telefoneLimpo.startsWith('55')
      ? telefoneLimpo
      : `55${telefoneLimpo}`

    const mensagem = gerarMensagemFollowUp(card)
    const url = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`

    // Atualizar data da última interação
    const novosCards = cards.map(c =>
      c.id === card.id
        ? { ...c, dataUltimaInteracao: new Date().toISOString() }
        : c
    )
    salvarCards(novosCards)

    window.open(url, '_blank')

    toast({
      title: 'Follow-up enviado!',
      description: `Mensagem de acompanhamento para ${card.cliente}`
    })
  }

  const cardsPorColuna = (coluna: ColunaCRM) =>
    cards.filter(c => c.coluna === coluna)

  const totalValor = cards
    .filter(c => c.coluna !== 'perdido')
    .reduce((acc, c) => acc + c.valor, 0)

  const totalInstalado = cards
    .filter(c => c.coluna === 'instalado')
    .reduce((acc, c) => acc + c.valor, 0)

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline CRM</h1>
          <p className="text-gray-500 mt-1">Acompanhe o andamento dos seus orçamentos</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-gray-500">Pipeline ativo</p>
            <p className="text-lg font-bold text-gray-900">
              R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Instalados</p>
            <p className="text-lg font-bold text-green-600">
              R$ {totalInstalado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {cards.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-3">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Wrench className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhum orçamento no pipeline</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Os orçamentos com status "Enviado" aparecem aqui automaticamente para você acompanhar a negociação.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Board Kanban */}
      {cards.length > 0 && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {COLUNAS.map((coluna) => {
              const cardsColuna = cardsPorColuna(coluna.id)
              return (
                <div key={coluna.id} className="w-72 flex-shrink-0">
                  {/* Cabeçalho da coluna */}
                  <div className={`rounded-t-lg px-3 py-2 border ${coluna.corBg} flex items-center justify-between`}>
                    <span className={`font-semibold text-sm ${coluna.cor}`}>{coluna.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {cardsColuna.length}
                    </Badge>
                  </div>

                  {/* Cards da coluna */}
                  <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg min-h-32 p-2 space-y-2">
                    {cardsColuna.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-xs">
                        Sem negociações
                      </div>
                    )}
                    {cardsColuna.map((card) => {
                      const dias = calcularDiasSemResposta(card.dataUltimaInteracao)
                      const indexColuna = COLUNAS.findIndex(c => c.id === card.coluna)
                      const temAnterior = indexColuna > 0
                      const temProxima = indexColuna < COLUNAS.length - 1

                      return (
                        <Card key={card.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-3 space-y-2">
                            {/* Nome do cliente */}
                            <div>
                              <p className="font-semibold text-sm text-gray-900 truncate">{card.cliente}</p>
                              <p className="text-xs text-gray-500 truncate">{card.servico}</p>
                              {card.modelo && (
                                <p className="text-xs text-gray-400 truncate">{card.modelo}</p>
                              )}
                            </div>

                            {/* Valor */}
                            <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                              <DollarSign className="h-3 w-3 text-gray-500" />
                              R$ {card.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>

                            {/* Dias sem resposta */}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className={`text-xs ${dias >= 7 ? 'text-red-600 font-semibold' : dias >= 3 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                {dias === 0 ? 'Hoje' : `${dias} dia${dias > 1 ? 's' : ''} sem resposta`}
                              </span>
                            </div>

                            {/* Ações */}
                            <div className="flex gap-1 pt-1 border-t border-gray-100">
                              {/* Mover para coluna anterior */}
                              {temAnterior && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                                  onClick={() => moverCard(card.id, 'anterior')}
                                  title={`Mover para ${COLUNAS[indexColuna - 1].label}`}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                              )}

                              {/* Botão WhatsApp follow-up */}
                              {card.telefone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 text-xs px-2"
                                  onClick={() => enviarFollowUp(card)}
                                >
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Follow-up
                                </Button>
                              )}

                              {/* Mover para próxima coluna */}
                              {temProxima && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                                  onClick={() => moverCard(card.id, 'proxima')}
                                  title={`Mover para ${COLUNAS[indexColuna + 1].label}`}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
