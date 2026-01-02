import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Calendar, DollarSign, Eye, Download } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { visualizarPDF, baixarPDF } from '@/lib/pdf-generator'
import PDFModal from '@/components/PDFModal'

interface Orcamento {
  id: string
  data: Date | string
  cliente: string
  valor: number
  status: 'rascunho' | 'enviado'
  tipoServico: string
  modelo: string
  medidas: {
    largura: string
    altura: string
    quantidade: string
  }
  clienteCompleto?: {
    nome: string
    telefone: string
    endereco: string
  }
  observacoes?: string
}

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [tituloModal, setTituloModal] = useState('')

  useEffect(() => {
    // Carregar orçamentos do localStorage
    const saved = localStorage.getItem('orcamentos')
    if (saved) {
      const parsed = JSON.parse(saved)
      setOrcamentos(parsed.map((o: any) => ({ ...o, data: new Date(o.data) })))
    }
  }, [])

  const handleVisualizarPDF = (orcamento: Orcamento) => {
    const url = visualizarPDF(orcamento)
    setPdfUrl(url)
    setTituloModal(orcamento.cliente || 'Cliente sem nome')
    setModalAberto(true)
  }

  const handleFecharModal = () => {
    setModalAberto(false)
    // Limpar URL após um pequeno delay para dar tempo da animação de fechamento
    setTimeout(() => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
        setPdfUrl('')
      }
    }, 300)
  }

  if (orcamentos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <Link to="/orcamentos/novo">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
        </div>

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Você ainda não tem orçamentos
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Comece criando seu primeiro orçamento. É rápido e simples!
            </p>
            <Link to="/orcamentos/novo">
              <Button size="lg" className="mt-4">
                <Plus className="h-5 w-5 mr-2" />
                Criar Primeiro Orçamento
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
        <Link to="/orcamentos/novo">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {orcamentos.map((orcamento) => (
          <Card key={orcamento.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {orcamento.cliente || 'Cliente sem nome'}
                      </h3>
                      <Badge variant={orcamento.status === 'enviado' ? 'default' : 'secondary'}>
                        {orcamento.status === 'enviado' ? 'Enviado' : 'Rascunho'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {orcamento.tipoServico} - {orcamento.modelo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(
                          typeof orcamento.data === 'string' ? new Date(orcamento.data) : orcamento.data,
                          "dd 'de' MMMM 'de' yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                      <DollarSign className="h-6 w-6" />
                      {(() => {
                        const valorSeguro = Number.isFinite(orcamento.valor) ? orcamento.valor : 0
                        return valorSeguro.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisualizarPDF(orcamento)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => baixarPDF(orcamento)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PDFModal
        open={modalAberto}
        onClose={handleFecharModal}
        pdfUrl={pdfUrl}
        titulo={tituloModal}
      />
    </div>
  )
}
