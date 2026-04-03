import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Check, CreditCard, Shield, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { isStripeConfigurado } from '@/lib/stripe-checkout'
import { criarAssinaturaTrialInicial } from '@/lib/assinatura-manager'
import { NOME_PLANO, VALOR_MENSAL, TRIAL_DIAS } from '@/types/assinatura'

const BENEFICIOS = [
  'Orçamentos profissionais ilimitados',
  'Pipeline de CRM completo',
  'Gestão de pedidos e produção',
  'Controle financeiro integrado',
  'Geração de PDF automática',
  'Envio por WhatsApp em 1 clique',
  'Catálogos de produtos',
  'Relatórios e métricas',
]

export default function Checkout() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState('')

  const stripeConfigurado = isStripeConfigurado()
  const priceId = import.meta.env.VITE_STRIPE_PRICE_ID as string

  async function handleIniciarTrial() {
    if (!nome.trim()) {
      setErro('Por favor, informe seu nome.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErro('Por favor, informe um e-mail válido.')
      return
    }
    setErro('')
    setIsLoading(true)

    try {
      if (!stripeConfigurado || !priceId) {
        // Modo demo: simula trial sem Stripe configurado
        criarAssinaturaTrialInicial({
          nomeUsuario: nome.trim(),
          emailUsuario: email.trim(),
          stripeCustomerId: 'demo_customer',
          stripeSubscriptionId: 'demo_sub',
          checkoutSessionId: 'demo_session',
        })
        toast({ title: 'Bem-vindo ao trial!', description: 'Seu período gratuito foi ativado.' })
        navigate('/assinatura/sucesso?modo=trial&nome=' + encodeURIComponent(nome.trim()))
        return
      }

      // Stripe configurado: redireciona para Payment Link
      const origem = window.location.origin
      const successUrl = `${origem}/assinatura/sucesso?nome=${encodeURIComponent(nome.trim())}&email=${encodeURIComponent(email.trim())}`
      const cancelUrl = `${origem}/checkout`

      // Abre Stripe Checkout via Payment Link com trial
      const stripeUrl = `https://buy.stripe.com/${priceId}?prefilled_email=${encodeURIComponent(email.trim())}&client_reference_id=${encodeURIComponent(nome.trim())}`

      // Salva dados localmente antes de redirecionar
      localStorage.setItem(
        'msp_checkout_pendente',
        JSON.stringify({ nome: nome.trim(), email: email.trim() })
      )

      window.location.href = stripeUrl
      void successUrl
      void cancelUrl
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar pagamento.'
      setErro(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Serralheiro Pro</h1>
          <p className="text-gray-500 mt-2">Comece seu período gratuito de {TRIAL_DIAS} dias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Formulário */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Criar sua conta
              </CardTitle>
              <CardDescription>
                Preencha seus dados para começar. Nenhuma cobrança nos primeiros{' '}
                <strong>{TRIAL_DIAS} dias</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input
                  id="nome"
                  placeholder="João Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {erro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}

              {!stripeConfigurado && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Stripe ainda não configurado. Configure a chave{' '}
                    <code>VITE_STRIPE_PUBLISHABLE_KEY</code> e{' '}
                    <code>VITE_STRIPE_PRICE_ID</code> para habilitar pagamentos reais.
                    No momento, o trial será ativado em modo demonstração.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full h-12 text-base"
                onClick={handleIniciarTrial}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Aguarde...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Iniciar {TRIAL_DIAS} dias grátis
                  </>
                )}
              </Button>

              <div className="flex items-start gap-2 text-xs text-gray-500">
                <Shield className="h-3.5 w-3.5 mt-0.5 text-green-600 shrink-0" />
                <span>
                  Após o período gratuito, será cobrado{' '}
                  <strong>R$ {VALOR_MENSAL.toFixed(2).replace('.', ',')}/mês</strong>.
                  Cancele quando quiser.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios */}
          <div className="order-1 lg:order-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que está incluído</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {BENEFICIOS.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    R$ {VALOR_MENSAL.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">por mês, após o trial</div>
                  <div className="mt-3 inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    <Check className="h-3 w-3" />
                    {TRIAL_DIAS} dias gratuitos inclusos
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-gray-400 text-center">
              Pagamento processado com segurança pelo Stripe.
              Cancele a qualquer momento pelo suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
