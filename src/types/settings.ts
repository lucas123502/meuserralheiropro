export interface CompanySettings {
  // Dados da empresa
  companyName: string
  responsibleName: string
  cnpj: string
  phone: string
  email?: string
  city: string
  state: string

  // Logo
  logo?: string // base64 ou URL

  // Campos do PDF
  brinde?: string
  garantia?: string
  tempoEntrega?: string
  parcelamento?: string
  fraseFinal?: string
}

export const defaultSettings: CompanySettings = {
  companyName: '',
  responsibleName: '',
  cnpj: '',
  phone: '',
  email: '',
  city: '',
  state: '',
  logo: undefined,
  brinde: '',
  garantia: '1 ano contra defeitos de fabricação',
  tempoEntrega: '15 a 30 dias úteis após aprovação',
  parcelamento: 'até 12x no cartão',
  fraseFinal: 'Obrigado pela preferência! Estamos à disposição para qualquer dúvida.',
}
