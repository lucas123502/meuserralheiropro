/**
 * Handler de Webhooks do Stripe
 *
 * Este arquivo contém a lógica de processamento dos eventos do Stripe.
 * Em produção, este handler deve ser executado em um servidor/edge function.
 *
 * Eventos suportados:
 * - checkout.session.completed
 * - invoice.paid
 * - invoice.payment_failed
 * - customer.subscription.updated
 */

import {
  criarAssinaturaTrialInicial,
  atualizarStatusPagamentoAprovado,
  atualizarStatusPagamentoFalhou,
  getDadosAssinatura,
  salvarDadosAssinatura,
} from '@/lib/assinatura-manager'
import { enviarEmailConfirmacao } from '@/lib/email-confirmacao'
import { ComprovanteData, VALOR_MENSAL, NOME_PLANO } from '@/types/assinatura'

// Tipos simplificados dos eventos Stripe
interface StripeCheckoutSession {
  id: string
  customer: string
  subscription: string
  customer_email: string
  customer_details?: { name?: string; email?: string }
  metadata?: { nome?: string; email?: string }
}

interface StripeInvoice {
  id: string
  customer: string
  subscription: string
  amount_paid: number
  currency: string
  customer_email: string
  customer_name?: string
}

interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_end: number
}

export interface StripeWebhookEvent {
  type: string
  data: {
    object: StripeCheckoutSession | StripeInvoice | StripeSubscription
  }
}

/**
 * Processa um evento de webhook do Stripe.
 * Em produção, verificar a assinatura do webhook antes de processar.
 */
export async function processarWebhookStripe(
  event: StripeWebhookEvent
): Promise<{ sucesso: boolean; mensagem: string }> {
  console.log('[Stripe Webhook] Evento recebido:', event.type)

  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutCompleto(event.data.object as StripeCheckoutSession)

    case 'invoice.paid':
      return handleInvoicePago(event.data.object as StripeInvoice)

    case 'invoice.payment_failed':
      return handleInvoiceFalhou(event.data.object as StripeInvoice)

    case 'customer.subscription.updated':
      return handleSubscriptionAtualizada(event.data.object as StripeSubscription)

    default:
      return { sucesso: true, mensagem: `Evento ${event.type} não tratado.` }
  }
}

async function handleCheckoutCompleto(
  session: StripeCheckoutSession
): Promise<{ sucesso: boolean; mensagem: string }> {
  const nome =
    session.customer_details?.name || session.metadata?.nome || 'Usuário'
  const email =
    session.customer_details?.email || session.customer_email || ''

  criarAssinaturaTrialInicial({
    nomeUsuario: nome,
    emailUsuario: email,
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription,
    checkoutSessionId: session.id,
  })

  console.log('[Stripe] Assinatura trial criada para:', email)
  return { sucesso: true, mensagem: 'Assinatura trial criada com sucesso.' }
}

async function handleInvoicePago(
  invoice: StripeInvoice
): Promise<{ sucesso: boolean; mensagem: string }> {
  const valorEmReais = invoice.amount_paid / 100
  const nomeUsuario = invoice.customer_name || 'Usuário'
  const emailUsuario = invoice.customer_email || ''

  atualizarStatusPagamentoAprovado({
    pagamentoId: invoice.id,
    valor: valorEmReais,
  })

  const comprovante: ComprovanteData = {
    nomeUsuario,
    emailUsuario,
    valor: valorEmReais || VALOR_MENSAL,
    plano: NOME_PLANO,
    data: new Date().toISOString(),
    transacaoId: invoice.id,
    stripeCustomerId: invoice.customer,
  }

  // Salvar comprovante no localStorage para acesso posterior
  const dadosAtuais = getDadosAssinatura()
  if (dadosAtuais) {
    salvarDadosAssinatura({
      ...dadosAtuais,
      ultimoPagamentoId: invoice.id,
      ultimoPagamentoData: new Date().toISOString(),
      ultimoPagamentoValor: valorEmReais,
    })
  }

  // Enviar e-mail de confirmação
  await enviarEmailConfirmacao({
    nomeUsuario,
    emailUsuario,
    comprovante,
  })

  console.log('[Stripe] Pagamento aprovado:', invoice.id)
  return { sucesso: true, mensagem: 'Pagamento aprovado e e-mail enviado.' }
}

async function handleInvoiceFalhou(
  invoice: StripeInvoice
): Promise<{ sucesso: boolean; mensagem: string }> {
  atualizarStatusPagamentoFalhou()
  console.log('[Stripe] Pagamento falhou para customer:', invoice.customer)
  return { sucesso: true, mensagem: 'Status atualizado para limitado.' }
}

async function handleSubscriptionAtualizada(
  subscription: StripeSubscription
): Promise<{ sucesso: boolean; mensagem: string }> {
  const dados = getDadosAssinatura()
  if (!dados) {
    return { sucesso: false, mensagem: 'Assinatura não encontrada.' }
  }

  const proximaCobranca = new Date(subscription.current_period_end * 1000)

  salvarDadosAssinatura({
    ...dados,
    dataProximaCobranca: proximaCobranca.toISOString(),
  })

  console.log('[Stripe] Assinatura atualizada:', subscription.id)
  return { sucesso: true, mensagem: 'Assinatura atualizada.' }
}
