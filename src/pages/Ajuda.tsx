import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Ajuda() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ajuda & Suporte</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Como podemos ajudar?</CardTitle>
            <CardDescription>
              Estamos aqui para tirar suas dúvidas e ajudar no que precisar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-6 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                <Mail className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-1">E-mail</h3>
                <p className="text-sm text-gray-600">suporte@meuserralheiro.com</p>
              </button>

              <button className="p-6 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                <Phone className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-1">Telefone</h3>
                <p className="text-sm text-gray-600">(11) 9999-9999</p>
              </button>

              <button className="p-6 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                <MessageCircle className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-1">WhatsApp</h3>
                <p className="text-sm text-gray-600">Chat direto</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Como criar um orçamento?</h3>
              <p className="text-sm text-gray-600">
                Acesse a aba "Orçamentos" e clique em "Novo Orçamento". Siga as etapas
                para selecionar o tipo de serviço, modelo e medidas. No final, você pode
                revisar e ajustar o valor antes de enviar ao cliente.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Como editar um orçamento?</h3>
              <p className="text-sm text-gray-600">
                Na lista de orçamentos, clique no orçamento que deseja editar. Você pode
                alterar as informações e salvar novamente.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Como gerar o PDF do orçamento?</h3>
              <p className="text-sm text-gray-600">
                Após finalizar o orçamento, você terá a opção de visualizar e baixar
                o PDF. O documento será gerado automaticamente com todas as informações.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Posso alterar o valor calculado?</h3>
              <p className="text-sm text-gray-600">
                Sim! Na etapa de revisão, você pode editar o valor final manualmente.
                O sistema calcula uma estimativa inicial, mas você tem total controle
                para ajustar conforme necessário.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
