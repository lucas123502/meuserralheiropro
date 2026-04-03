import { Navigate } from 'react-router-dom'
import { useAssinatura } from '@/hooks/use-assinatura'

interface AssinaturaGuardProps {
  children: React.ReactNode
}

/**
 * Guard que protege as rotas principais.
 * - sem_assinatura → redireciona para /checkout
 * - limitado → redireciona para /assinatura/limitada
 * - trial/ativa → acesso liberado
 */
export default function AssinaturaGuard({ children }: AssinaturaGuardProps) {
  const { status, isLoading } = useAssinatura()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (status === 'sem_assinatura') {
    return <Navigate to="/checkout" replace />
  }

  if (status === 'limitado') {
    return <Navigate to="/assinatura/limitada" replace />
  }

  return <>{children}</>
}
