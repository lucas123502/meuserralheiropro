import { DadosAssinatura, AssinaturaStatus, ASSINATURA_STORAGE_KEY, TRIAL_DIAS } from '@/types/assinatura'

export function getDadosAssinatura(): DadosAssinatura | null {
  try {
    const raw = localStorage.getItem(ASSINATURA_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DadosAssinatura
  } catch {
    return null
  }
}

export function salvarDadosAssinatura(dados: DadosAssinatura): void {
  localStorage.setItem(ASSINATURA_STORAGE_KEY, JSON.stringify(dados))
}

export function criarAssinaturaTrialInicial(params: {
  nomeUsuario: string
  emailUsuario: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  checkoutSessionId: string
}): DadosAssinatura {
  const agora = new Date()
  const trialFim = new Date(agora)
  trialFim.setDate(trialFim.getDate() + TRIAL_DIAS)

  const dados: DadosAssinatura = {
    stripeCustomerId: params.stripeCustomerId,
    stripeSubscriptionId: params.stripeSubscriptionId,
    assinaturaStatus: 'trial',
    trialInicio: agora.toISOString(),
    trialFim: trialFim.toISOString(),
    dataProximaCobranca: trialFim.toISOString(),
    nomeUsuario: params.nomeUsuario,
    emailUsuario: params.emailUsuario,
    checkoutSessionId: params.checkoutSessionId,
    ultimoPagamentoId: null,
    ultimoPagamentoData: null,
    ultimoPagamentoValor: null,
  }

  salvarDadosAssinatura(dados)
  return dados
}

export function atualizarStatusPagamentoAprovado(params: {
  pagamentoId: string
  valor: number
}): void {
  const dados = getDadosAssinatura()
  if (!dados) return

  const proximaCobranca = new Date()
  proximaCobranca.setDate(proximaCobranca.getDate() + 30)

  const atualizados: DadosAssinatura = {
    ...dados,
    assinaturaStatus: 'ativa',
    dataProximaCobranca: proximaCobranca.toISOString(),
    ultimoPagamentoId: params.pagamentoId,
    ultimoPagamentoData: new Date().toISOString(),
    ultimoPagamentoValor: params.valor,
  }

  salvarDadosAssinatura(atualizados)
}

export function atualizarStatusPagamentoFalhou(): void {
  const dados = getDadosAssinatura()
  if (!dados) return

  salvarDadosAssinatura({
    ...dados,
    assinaturaStatus: 'limitado',
  })
}

export function getStatusAssinatura(): AssinaturaStatus {
  const dados = getDadosAssinatura()
  if (!dados) return 'sem_assinatura'
  return dados.assinaturaStatus
}

export function temAcessoTotal(): boolean {
  const status = getStatusAssinatura()
  return status === 'trial' || status === 'ativa'
}

export function isTrialAtivo(): boolean {
  const dados = getDadosAssinatura()
  if (!dados || dados.assinaturaStatus !== 'trial') return false
  if (!dados.trialFim) return false
  return new Date() < new Date(dados.trialFim)
}
