import { Cliente } from '@/types/cliente'

interface DadosCliente {
  nome: string
  telefone: string
  endereco: string
}

/**
 * Salva ou atualiza um cliente automaticamente
 * Se já existir um cliente com mesmo nome+telefone, retorna o ID existente
 * Caso contrário, cria um novo cliente
 */
export function salvarClienteAutomatico(
  dados: DadosCliente,
  clienteIdExistente?: string
): string {
  // Se não tem nome, não salva
  if (!dados.nome.trim()) {
    return ''
  }

  // Carregar clientes existentes
  const clientes: Cliente[] = JSON.parse(localStorage.getItem('clientes') || '[]')

  // Se já tem um clienteId válido, verificar se ele ainda existe
  if (clienteIdExistente) {
    const clienteExiste = clientes.find(c => c.id === clienteIdExistente)
    if (clienteExiste) {
      return clienteIdExistente
    }
  }

  // Normalizar dados para comparação
  const nomeNormalizado = dados.nome.trim().toLowerCase()
  const telefoneNormalizado = dados.telefone.trim().replace(/\D/g, '')

  // Buscar cliente duplicado (mesmo nome + telefone)
  const clienteExistente = clientes.find(c => {
    const nomeExistenteNorm = c.nome.trim().toLowerCase()
    const telefoneExistenteNorm = c.telefone.trim().replace(/\D/g, '')

    // Se tiver telefone, comparar nome + telefone
    if (telefoneNormalizado && telefoneExistenteNorm) {
      return nomeExistenteNorm === nomeNormalizado &&
             telefoneExistenteNorm === telefoneNormalizado
    }

    // Se não tiver telefone, comparar apenas nome
    return nomeExistenteNorm === nomeNormalizado
  })

  // Se encontrou cliente existente, retornar o ID dele
  if (clienteExistente) {
    return clienteExistente.id
  }

  // Criar novo cliente
  const novoCliente: Cliente = {
    id: Date.now().toString(),
    nome: dados.nome.trim(),
    telefone: dados.telefone.trim(),
    endereco: dados.endereco.trim(),
    criadoEm: new Date().toISOString()
  }

  // Salvar no localStorage
  clientes.push(novoCliente)
  localStorage.setItem('clientes', JSON.stringify(clientes))

  return novoCliente.id
}

/**
 * Atualiza a contagem de orçamentos para um cliente
 * (usado para manter a UI sincronizada)
 */
export function atualizarContagemOrcamentos(clienteId: string): number {
  if (!clienteId) return 0

  const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]')
  return orcamentos.filter((orc: any) => orc.clienteId === clienteId).length
}

/**
 * Garante que todos os orçamentos/pedidos existentes têm seus clientes salvos
 * Útil para migração de dados antigos
 */
export function migrarClientesDeOrcamentos(): void {
  const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]')

  orcamentos.forEach((orc: any) => {
    if (orc.clienteCompleto && orc.clienteCompleto.nome) {
      const clienteId = salvarClienteAutomatico(
        orc.clienteCompleto,
        orc.clienteId
      )

      // Atualizar o orçamento com o clienteId correto
      if (clienteId && orc.clienteId !== clienteId) {
        orc.clienteId = clienteId
      }
    }
  })

  localStorage.setItem('orcamentos', JSON.stringify(orcamentos))
}
