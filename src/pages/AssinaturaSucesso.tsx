import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Download, FileText, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { criarAssinaturaTrialInicial, getDadosAssinatura } from '@/lib/assinatura-manager'
import { downloadComprovantePDF } from '@/lib/comprovante-pdf'
import { ComprovanteData, NOME_PLANO, VALOR_MENSAL } from '@/types/assinatura'

export default function AssinaturaSucesso() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [comprovante, setComprovante] = useState<ComprovanteData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const nome = searchParams.get('nome') || ''
    const email = searchParams.get('email') || ''
    const modo = searchParams.get('modo') || ''
    const sessionId = searchParams.get('session_id') || searchParams.get('checkout_session_id') || ''

    // Recupera dados pendentes do localStorage (salvos antes do redirect)
    const pendente = localStorage.getItem('msp_checkout_pendente')
    let nomeFinal = nome
    let emailFinal = email

    if (pendente) {
      try {
        const dados = JSON.parse(pendente)
        if (!nomeFinal) nomeFinal = dados.nome || ''
        if (!emailFinal) emailFinal = dados.email || ''
        localStorage.removeItem('msp_checkout_pendente')
      } catch {
        // ignore
      }
    }

    // Se ainda não tem assinatura salva, cria o trial
    const dadosExistentes = getDadosAssinatura()
    if (!dadosExistentes && (nomeFinal || modo === 'trial')) {
      criarAssinaturaTrialInicial({
        nomeUsuario: nomeFinal || 'Usuário',
        emailUsuario: emailFinal || '',
        stripeCustomerId: sessionId ? `cus_${sessionId.slice(-8)}` : 'pending',
        stripeSubscriptionId: sessionId ? `sub_${sessionId.slice(-8)}` : 'pending',
        checkoutSessionId: sessionId || 'direct',
      })
    }

    const dados = getDadosAssinatura()
    if (dados) {
      const novoComprovante: ComprovanteData = {
        nomeUsuario: dados.nomeUsuario || nomeFinal,
        emailUsuario: dados.emailUsuario || emailFinal,
        valor: VALOR_MENSAL,
        plano: NOME_PLANO,
        data: dados.trialInicio || new Date().toISOString(),
        transacaoId: sessionId || dados.checkoutSessionId || 'trial-' + Date.now(),
        stripeCustomerId: dados.stripeCustomerId || 'pending',
      }
      setComprovante(novoComprovante)
    }
  }, [searchParams])

  function handleDownloadComprovante() {
    if (!comprovante) return
    setIsDownloading(true)
    try {
      downloadComprovantePDF(comprovante)
    } finally {
      setTimeout(() => setIsDownloading(false), 1000)
    }
  }

  function formatarData(isoString: string) {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-4">

        {/* Sucesso header */}
        <Card>
          <CardContent className="pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo ao {NOME_PLANO}!
            </h1>
            <p className="text-gray-500 text-sm">
              Seu acesso foi ativado com sucesso. Aproveite todos os recursos!
            </p>
          </CardContent>
        </Card>

        {/* Comprovante */}
        {comprovante && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Comprovante de Cadastro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nome</span>
                  <span className="font-medium text-gray-900">{comprovante.nomeUsuario}</span>
                </div>
                {comprovante.emailUsuario && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">E-mail</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%] break-all">
                      {comprovante.emailUsuario}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500">Plano</span>
                  <span className="font-medium text-gray-900">{comprovante.plano}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor após trial</span>
                  <span className="font-medium text-gray-900">
                    R$ {comprovante.valor.toFixed(2).replace('.', ',')}/mês
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data</span>
                  <span className="font-medium text-gray-900">
                    {formatarData(comprovante.data)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">ID da transação</span>
                  <span className="text-gray-400 font-mono">{comprovante.transacaoId}</span>
                </div>
              </div>

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

        {/* CTA */}
        <Button className="w-full h-12 text-base" onClick={() => navigate('/orcamentos')}>
          Acessar o Sistema
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        <p className="text-center text-xs text-gray-400">
          Você receberá um e-mail de confirmação em breve.
        </p>
      </div>
    </div>
  )
}
