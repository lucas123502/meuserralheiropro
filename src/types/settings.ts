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
}
