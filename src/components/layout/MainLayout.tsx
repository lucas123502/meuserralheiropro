import { Outlet, Link, useLocation } from 'react-router-dom'
import { FileText, Package, DollarSign, Users, Lightbulb, BookOpen, BarChart3, Settings, HelpCircle, KanbanSquare, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAssinatura } from '@/hooks/use-assinatura'

const navigation = [
  { name: 'Orçamentos', href: '/orcamentos', icon: FileText },
  { name: 'Pipeline CRM', href: '/crm', icon: KanbanSquare },
  { name: 'Pedidos', href: '/pedidos', icon: Package },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Ideias & Conteúdo', href: '/ideias', icon: Lightbulb },
  { name: 'Catálogos', href: '/catalogos', icon: BookOpen },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
  { name: 'Ajuda / Suporte', href: '/ajuda', icon: HelpCircle },
]

export default function MainLayout() {
  const location = useLocation()
  const { status } = useAssinatura()

  const statusBadge =
    status === 'trial'
      ? { label: 'Trial', color: 'bg-blue-100 text-blue-700' }
      : status === 'ativa'
        ? { label: 'Ativo', color: 'bg-green-100 text-green-700' }
        : status === 'limitado'
          ? { label: 'Limitado', color: 'bg-amber-100 text-amber-700' }
          : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">Meu Serralheiro Pro</h1>
              {statusBadge && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>
            <Link
              to="/assinatura"
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                location.pathname === '/assinatura'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <CreditCard className="h-3.5 w-3.5" />
              Assinatura
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
