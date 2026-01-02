import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Bem-vindo ao Meu Serralheiro Pro</CardTitle>
          <CardDescription className="text-base mt-2">
            Vamos criar seu primeiro orçamento em poucos minutos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">O que você pode fazer:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Criar orçamentos profissionais em menos de 2 minutos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Gerar PDFs prontos para enviar aos seus clientes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Acompanhar todo o histórico dos seus orçamentos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Editar valores e detalhes antes de enviar</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => navigate('/orcamentos/novo')}
            className="w-full h-12 text-base"
            size="lg"
          >
            Criar Meu Primeiro Orçamento
          </Button>

          <button
            onClick={() => navigate('/orcamentos')}
            className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Pular e ir para a página inicial
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
