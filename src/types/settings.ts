export interface CompanySettings {
  // Dados da empresa
  companyName: string
  responsibleName: string
  phone: string
  city: string
  state: string
  email?: string

  // Logo
  logo?: string // base64 ou URL

  // Parâmetros de orçamento
  pricePerSquareMeter: number
  defaultObservation?: string

  // Informações para PDF
  pdfFooter?: string
  defaultExecutionTime?: string
}

export const defaultSettings: CompanySettings = {
  companyName: '',
  responsibleName: '',
  phone: '',
  city: '',
  state: '',
  email: '',
  logo: undefined,
  pricePerSquareMeter: 150.0,
  defaultObservation: '',
  pdfFooter: '',
  defaultExecutionTime: '',
}
