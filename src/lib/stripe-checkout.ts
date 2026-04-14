import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string

let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe() {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export function isStripeConfigurado(): boolean {
  return !!STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.startsWith('pk_')
}

/**
 * Redireciona para o Stripe Checkout (hosted).
 * Requer um endpoint de backend para criar a sessão.
 * Em produção, substituir pela chamada real à API.
 */
export async function redirecionarParaCheckout(params: {
  nomeUsuario: string
  emailUsuario: string
  successUrl: string
  cancelUrl: string
}): Promise<{ error?: string }> {
  try {
    const stripe = await getStripe()
    if (!stripe) {
      return { error: 'Stripe não configurado. Configure a chave VITE_STRIPE_PUBLISHABLE_KEY.' }
    }

    // Chama o endpoint de criação de sessão
    const response = await fetch('/api/stripe/criar-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: params.nomeUsuario,
        email: params.emailUsuario,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return { error: data.message || 'Erro ao criar sessão de pagamento.' }
    }

    const data = await response.json()
    const sessionUrl: string | undefined = data.url || data.sessionUrl

    if (sessionUrl) {
      window.location.href = sessionUrl
      return {}
    }

    // Fallback: redireciona via sessionId usando stripe.js
    const sessionId: string = data.sessionId
    if (!sessionId) {
      return { error: 'Sessão de pagamento inválida.' }
    }

    const result = await (stripe as any).redirectToCheckout({ sessionId })
    if (result?.error) {
      return { error: result.error.message || 'Erro ao redirecionar para pagamento.' }
    }

    return {}
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao conectar com o Stripe.'
    return { error: message }
  }
}

/**
 * Gera URL de Stripe Checkout diretamente usando Payment Link.
 * Alternativa sem backend - usa Stripe Payment Links configurados no dashboard.
 */
export function gerarUrlPaymentLink(params: {
  email: string
  nome: string
  priceId: string
}): string {
  const baseUrl = `https://checkout.stripe.com/pay/${params.priceId}`
  const queryParams = new URLSearchParams({
    prefilled_email: params.email,
  })
  return `${baseUrl}?${queryParams.toString()}`
}
