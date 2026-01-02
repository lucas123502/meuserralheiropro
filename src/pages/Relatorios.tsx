import { BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Relatorios() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Relatórios</h1>

      <Card className="text-center py-12">
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Relatórios e Análises
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Em breve você terá acesso a relatórios detalhados do seu negócio.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
