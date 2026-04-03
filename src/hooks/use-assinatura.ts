import { useState, useEffect, useCallback } from 'react'
import {
  getDadosAssinatura,
  getStatusAssinatura,
  temAcessoTotal,
} from '@/lib/assinatura-manager'
import { DadosAssinatura, AssinaturaStatus } from '@/types/assinatura'

export interface UseAssinaturaReturn {
  dados: DadosAssinatura | null
  status: AssinaturaStatus
  temAcesso: boolean
  isLoading: boolean
  recarregar: () => void
}

export function useAssinatura(): UseAssinaturaReturn {
  const [dados, setDados] = useState<DadosAssinatura | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const recarregar = useCallback(() => {
    setIsLoading(true)
    const d = getDadosAssinatura()
    setDados(d)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  const status = dados?.assinaturaStatus ?? 'sem_assinatura'
  const temAcesso = temAcessoTotal()

  return { dados, status, temAcesso, isLoading, recarregar }
}
