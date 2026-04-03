import { useState } from 'react'
import { CreditCard, CheckCircle, Clock, AlertTriangle, Download, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAssinatura } from '@/hooks/use-assinatura'
import { downloadComprovantePDF } from '@/lib/comprovante-pdf'
import { getDadosAssinatura } from '@/lib/assinatura-manager'
import { ComprovanteData, NOME_PLANO, VALOR_MENSAL } from '@/types/assinatura'

const STATUS_CONFIG = {
  trial: {
    label: 'Trial Ativo',
    color: 'bg-blue-100 text-blue-700',
    icon: Clock,
    descricao: 'Você está no período gratuito de experimentação.',
  },
  ativa: {
    label: 'Assinatura Ativa',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    descricao: 'Sua assinatura está ativa e em dia.',
  },
  limitado: {
    label: 'Pagamento Pendente',
    color: 'bg-amber-100 text-amber-700',
    icon: AlertTriangle,
    descricao: 'Houve um problema com o pagamento. Atualize sua forma de pagamento.',
  },
  cancelada: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-700',
    icon: AlertTriangle,
    descricao: 'Sua assinatura foi cancelada.',
  },
  sem_assinatura: {
    label: 'Sem Assinatura',
    color: 'bg-gray-100 text-gray-700',
    icon: CreditCard,
    descricao: 'Você não possui uma assinatura ativa.',
  },
}

function formatarData(isoString: string | null): string {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function GerenciarAssinatura() {
  const { dados, status } = useAssinatura()
  const [isDownloading, setIsDownloading] = useState(false)

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.sem_assinatura
  const Icon = config.icon

  function handleDownloadComprovante() {
    if (!dados?.ultimoPagamentoId && status !== 'trial') return

    const comprovante: ComprovanteData = {
      nomeUsuario: dados?.nomeUsuario || 'Usuário',
      emailUsuario: dados?.emailUsuario || '',
      valor: dados?.ultimoPagamentoValor || VALOR_MENSAL,
      plano: NOME_PLANO,
      data: dados?.ultimoPagamentoData || dados?.trialInicio || new Date().toISOString(),
      transacaoId:
        dados?.ultimoPagamentoId ||
        dados?.checkoutSessionId ||
        'trial-' + Date.now(),
      stripeCustomerId: dados?.stripeCustomerId || '',
    }

    setIsDownloading(true)
    try {
      downloadComprovantePDF(comprovante)
    } finally {
      setTimeout(() => setIsDownloading(false), 1000)
    }
  }

  function handlePortalCliente() {
    const dadosAss = getDadosAssinatura()
    if (!dadosAss?.stripeCustomerId || dadosAss.stripeCustomerId === 'demo_customer') {
      alert('Configure o Stripe para acessar o portal de gerenciamento.')
      return
    }
    // Em produção, chamar endpoint para gerar URL do portal do cliente Stripe
    window.open('https://billing.stripe.com/p/login/', '_blank')
  }

  const temComprovante =
    !!dados?.ultimoPagamentoId || (status === 'trial' && !!dados?.checkoutSessionId)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minha Assinatura</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie seu plano e pagamentos</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Status da Assinatura</CardTitle>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </span>
          </div>
          <CardDescription>{config.descricao}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Plano</span>
              <span className="font-medium text-gray-900">{NOME_PLANO}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Valor mensal</span>
              <span className="font-medium text-gray-900">
                R$ {VALOR_MENSAL.toFixed(2).replace('.', ',')}
              </span>
            </div>
            {dados?.nomeUsuario && (
              <div className="flex justify-between">
                <span className="text-gray-500">Titular</span>
                <span className="font-medium text-gray-900">{dados.nomeUsuario}</span>
              </div>
            )}
            {dados?.emailUsuario && (
              <div className="flex justify-between">
                <span className="text-gray-500">E-mail</span>
                <span className="font-medium text-gray-900">{dados.emailUsuario}</span>
              </div>
            )}
            <Separator />
            {dados?.dataProximaCobranca && (
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {status === 'trial' ? 'Fim do trial' : 'Próxima cobrança'}
                </span>
                <span className="font-medium text-gray-900">
                  {formatarData(dados.dataProximaCobranca)}
                </span>
              </div>
            )}
            {dados?.ultimoPagamentoData && (
              <div className="flex justify-between">
                <span className="text-gray-500">Último pagamento</span>
                <span className="font-medium text-gray-900">
                  {formatarData(dados.ultimoPagamentoData)}
                </span>
              </div>
            )}
            {dados?.stripeCustomerId && dados.stripeCustomerId !== 'demo_customer' && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">ID do cliente</span>
                <span className="text-gray-400 font-mono">{dados.stripeCustomerId}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comprovante */}
      {temComprovante && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Comprovante de Pagamento
            </CardTitle>
            <CardDescription>
              Baixe o comprovante do seu pagamento em PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadComprovante}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Comprovante PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      {status === 'limitado' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-700">Ação necessária</CardTitle>
            <CardDescription>
              Atualize sua forma de pagamento para reativar o acesso completo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handlePortalCliente}>
              <CreditCard className="h-4 w-4 mr-2" />
              Atualizar Pagamento
            </Button>
          </CardContent>
        </Card>
      )}

      {(status === 'trial' || status === 'ativa') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gerenciar Assinatura</CardTitle>
            <CardDescription>
              Acesse o portal para cancelar ou alterar seu plano.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handlePortalCliente}>
              <CreditCard className="h-4 w-4 mr-2" />
              Portal de Gerenciamento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Aviso modo demo */}
      {dados?.stripeCustomerId === 'demo_customer' && (
        <div className="text-xs text-gray-400 text-center border border-dashed border-gray-200 rounded-lg p-3">
          Modo demonstração ativo. Configure as variáveis de ambiente do Stripe para habilitar
          pagamentos reais.
        </div>
      )}
    </div>
  )
}
