export interface Cliente {
  id: string
  nome: string
  telefone: string
  endereco: string
  criadoEm: string
}

export interface ClienteFormData {
  nome: string
  telefone: string
  endereco: string
}
