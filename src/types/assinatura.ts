export type AssinaturaStatus = 'sem_assinatura' | 'trial' | 'ativa' | 'limitado' | 'cancelada'

export interface DadosAssinatura {
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  assinaturaStatus: AssinaturaStatus
  trialInicio: string | null
  trialFim: string | null
  dataProximaCobranca: string | null
  nomeUsuario: string
  emailUsuario: string
  checkoutSessionId: string | null
  ultimoPagamentoId: string | null
  ultimoPagamentoData: string | null
  ultimoPagamentoValor: number | null
}

export interface ComprovanteData {
  nomeUsuario: string
  emailUsuario: string
  valor: number
  plano: string
  data: string
  transacaoId: string
  stripeCustomerId: string
}

export const ASSINATURA_STORAGE_KEY = 'msp_assinatura'
export const VALOR_MENSAL = 97.0
export const NOME_PLANO = 'Meu Serralheiro Pro'
export const TRIAL_DIAS = 30
