import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CreditCard, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAssinatura } from '@/hooks/use-assinatura'
import { getDadosAssinatura } from '@/lib/assinatura-manager'
import { NOME_PLANO, VALOR_MENSAL } from '@/types/assinatura'
import { isStripeConfigurado } from '@/lib/stripe-checkout'

export default function AssinaturaLimitada() {
  const navigate = useNavigate()
  const { recarregar } = useAssinatura()

  function handleAtualizarPagamento() {
    const dados = getDadosAssinatura()
    const stripeConfigurado = isStripeConfigurado()

    if (!stripeConfigurado || !dados?.stripeCustomerId || dados.stripeCustomerId === 'demo_customer') {
      // Modo demo: volta para checkout
      navigate('/checkout')
      return
    }

    // Redireciona para o portal do cliente Stripe
    // Em produção, chamar endpoint para gerar URL do portal
    window.open(
      `https://billing.stripe.com/p/login/test_xxx?prefilled_email=${encodeURIComponent(dados?.emailUsuario || '')}`,
      '_blank'
    )
  }

  function handleRecarregar() {
    recarregar()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Acesso Limitado</CardTitle>
          <CardDescription>
            Houve um problema com o pagamento da sua assinatura do{' '}
            <strong>{NOME_PLANO}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            Seu acesso está temporariamente limitado. Para reativar todos os recursos,
            atualize seu método de pagamento.
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Plano</span>
              <span className="font-medium">{NOME_PLANO}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Valor</span>
              <span className="font-medium">
                R$ {VALOR_MENSAL.toFixed(2).replace('.', ',')}/mês
              </span>
            </div>
          </div>

          <Button className="w-full h-11" onClick={handleAtualizarPagamento}>
            <CreditCard className="h-4 w-4 mr-2" />
            Atualizar Forma de Pagamento
          </Button>

          <Button variant="outline" className="w-full" onClick={handleRecarregar}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Já atualizei, verificar status
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
