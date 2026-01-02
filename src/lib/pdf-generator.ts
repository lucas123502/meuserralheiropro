import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface OrcamentoPDF {
  id: string
  data: Date | string
  cliente: string
  clienteCompleto?: {
    nome: string
    telefone: string
    endereco: string
  }
  tipoServico: string
  modelo: string
  medidas: {
    largura: string
    altura: string
    quantidade: string
  }
  valor: number
  observacoes?: string
}

export function gerarPDFOrcamento(orcamento: OrcamentoPDF) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header - Nome da Empresa
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Meu Serralheiro Pro', pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Orçamento', pageWidth / 2, y, { align: 'center' })
  y += 15

  // Linha separadora
  doc.setLineWidth(0.5)
  doc.line(15, y, pageWidth - 15, y)
  y += 10

  // Data do orçamento
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const dataFormatada = format(
    typeof orcamento.data === 'string' ? new Date(orcamento.data) : orcamento.data,
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  )
  doc.text(`Data: ${dataFormatada}`, 15, y)
  y += 7
  doc.text(`Orçamento Nº: ${orcamento.id}`, 15, y)
  y += 15

  // Dados do Cliente
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DADOS DO CLIENTE', 15, y)
  y += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nome: ${orcamento.clienteCompleto?.nome || orcamento.cliente}`, 15, y)
  y += 6

  if (orcamento.clienteCompleto?.telefone) {
    doc.text(`Telefone: ${orcamento.clienteCompleto.telefone}`, 15, y)
    y += 6
  }

  if (orcamento.clienteCompleto?.endereco) {
    doc.text(`Endereço: ${orcamento.clienteCompleto.endereco}`, 15, y)
    y += 6
  }
  y += 10

  // Detalhes do Serviço
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DETALHES DO SERVIÇO', 15, y)
  y += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Tipo de Serviço: ${orcamento.tipoServico}`, 15, y)
  y += 6
  doc.text(`Modelo: ${orcamento.modelo}`, 15, y)
  y += 6

  const largura = parseFloat(orcamento.medidas.largura)
  const altura = parseFloat(orcamento.medidas.altura)
  const quantidade = parseInt(orcamento.medidas.quantidade)

  // Validar valores antes de usar
  const larguraValida = Number.isFinite(largura) ? largura : 0
  const alturaValida = Number.isFinite(altura) ? altura : 0
  const quantidadeValida = Number.isFinite(quantidade) ? quantidade : 0
  const area = larguraValida * alturaValida * quantidadeValida

  doc.text(
    `Medidas: ${larguraValida.toFixed(2)}m (largura) × ${alturaValida.toFixed(2)}m (altura) × ${quantidadeValida} unidade(s)`,
    15,
    y
  )
  y += 6
  doc.text(`Área Total: ${Number.isFinite(area) ? area.toFixed(2) : '0.00'} m²`, 15, y)
  y += 15

  // Observações (se houver)
  if (orcamento.observacoes) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('OBSERVAÇÕES', 15, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const observacoesLines = doc.splitTextToSize(orcamento.observacoes, pageWidth - 30)
    doc.text(observacoesLines, 15, y)
    y += (observacoesLines.length * 6) + 10
  }

  // Valor Final - Destaque
  y += 10
  doc.setFillColor(240, 240, 240)
  doc.rect(15, y - 5, pageWidth - 30, 20, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('VALOR TOTAL:', 20, y + 5)

  doc.setFontSize(18)
  doc.setTextColor(0, 100, 0)
  const valorSeguro = Number.isFinite(orcamento.valor) ? orcamento.valor : 0
  const valorFormatado = `R$ ${valorSeguro.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
  doc.text(valorFormatado, pageWidth - 20, y + 5, { align: 'right' })
  doc.setTextColor(0, 0, 0)
  y += 30

  // Aviso
  doc.setFillColor(255, 250, 220)
  doc.rect(15, y - 5, pageWidth - 30, 18, 'F')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  const avisoText = 'Este valor é uma estimativa inicial e pode sofrer alterações após avaliação detalhada no local.'
  const avisoLines = doc.splitTextToSize(avisoText, pageWidth - 40)
  doc.text(avisoLines, pageWidth / 2, y + 2, { align: 'center' })
  y += 25

  // Rodapé
  const footerY = doc.internal.pageSize.getHeight() - 30
  doc.setLineWidth(0.5)
  doc.line(15, footerY, pageWidth - 15, footerY)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Meu Serralheiro Pro', pageWidth / 2, footerY + 7, { align: 'center' })
  doc.text('Obrigado pela preferência!', pageWidth / 2, footerY + 12, { align: 'center' })

  return doc
}

export function baixarPDF(orcamento: OrcamentoPDF) {
  const doc = gerarPDFOrcamento(orcamento)
  const nomeArquivo = `orcamento-${orcamento.id}-${orcamento.cliente.replace(/\s/g, '-')}.pdf`
  doc.save(nomeArquivo)
}

export function visualizarPDF(orcamento: OrcamentoPDF) {
  const doc = gerarPDFOrcamento(orcamento)
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}
