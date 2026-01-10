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
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = 20

  // ============================================
  // CABEÇALHO - Empresa
  // ============================================

  // Fundo do cabeçalho
  doc.setFillColor(41, 41, 41) // Cinza escuro
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Nome da Empresa
  doc.setTextColor(255, 255, 255) // Branco
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('MEU SERRALHEIRO PRO', pageWidth / 2, 18, { align: 'center' })

  // Subtítulo
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Serralheria e Estruturas Metálicas', pageWidth / 2, 26, { align: 'center' })

  // Informações de contato (opcional - pode descomentar se tiver)
  doc.setFontSize(8)
  doc.text('Tel: (00) 0000-0000 | serralheiro@email.com', pageWidth / 2, 33, { align: 'center' })

  // Linha separadora dourada
  doc.setDrawColor(218, 165, 32) // Dourado
  doc.setLineWidth(1.5)
  doc.line(15, 42, pageWidth - 15, 42)

  doc.setTextColor(0, 0, 0) // Volta para preto
  y = 55

  // ============================================
  // TÍTULO DO DOCUMENTO
  // ============================================

  doc.setFillColor(245, 245, 245) // Cinza claro
  doc.rect(15, y - 3, pageWidth - 30, 15, 'F')

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(41, 41, 41)
  doc.text('ORÇAMENTO PERSONALIZADO', pageWidth / 2, y + 6, { align: 'center' })

  doc.setTextColor(0, 0, 0)
  y += 22

  // Data e Número do Orçamento
  const dataFormatada = format(
    typeof orcamento.data === 'string' ? new Date(orcamento.data) : orcamento.data,
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  )

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Data de emissão: ${dataFormatada}`, 15, y)
  doc.text(`Nº ${orcamento.id}`, pageWidth - 15, y, { align: 'right' })
  doc.setTextColor(0, 0, 0)
  y += 12

  // ============================================
  // SEÇÃO: DADOS DO CLIENTE
  // ============================================

  // Linha decorativa antes da seção
  doc.setDrawColor(218, 165, 32)
  doc.setLineWidth(0.8)
  doc.line(15, y, 50, y)
  y += 6

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DADOS DO CLIENTE', 15, y)
  y += 8

  // Box com informações do cliente
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  const clienteBoxHeight = orcamento.clienteCompleto?.endereco ? 22 : (orcamento.clienteCompleto?.telefone ? 16 : 10)
  doc.rect(15, y - 2, pageWidth - 30, clienteBoxHeight)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Nome:', 18, y + 3)
  doc.setFont('helvetica', 'normal')
  doc.text(orcamento.clienteCompleto?.nome || orcamento.cliente, 35, y + 3)
  y += 6

  if (orcamento.clienteCompleto?.telefone) {
    doc.setFont('helvetica', 'bold')
    doc.text('Telefone:', 18, y + 3)
    doc.setFont('helvetica', 'normal')
    doc.text(orcamento.clienteCompleto.telefone, 40, y + 3)
    y += 6
  }

  if (orcamento.clienteCompleto?.endereco) {
    doc.setFont('helvetica', 'bold')
    doc.text('Endereço:', 18, y + 3)
    doc.setFont('helvetica', 'normal')
    const enderecoLines = doc.splitTextToSize(orcamento.clienteCompleto.endereco, pageWidth - 55)
    doc.text(enderecoLines, 42, y + 3)
    y += 6
  }

  y += 12

  // ============================================
  // SEÇÃO: DESCRIÇÃO DO SERVIÇO
  // ============================================

  // Linha decorativa antes da seção
  doc.setDrawColor(218, 165, 32)
  doc.setLineWidth(0.8)
  doc.line(15, y, 50, y)
  y += 6

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIÇÃO DO SERVIÇO', 15, y)
  y += 8

  // Box com detalhes do serviço
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.rect(15, y - 2, pageWidth - 30, 30)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Tipo de Serviço:', 18, y + 3)
  doc.setFont('helvetica', 'normal')
  doc.text(orcamento.tipoServico, 50, y + 3)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Modelo:', 18, y + 3)
  doc.setFont('helvetica', 'normal')
  const modeloLines = doc.splitTextToSize(orcamento.modelo, pageWidth - 50)
  doc.text(modeloLines, 38, y + 3)
  y += 6

  const largura = parseFloat(orcamento.medidas.largura)
  const altura = parseFloat(orcamento.medidas.altura)
  const quantidade = parseInt(orcamento.medidas.quantidade)

  const larguraValida = Number.isFinite(largura) ? largura : 0
  const alturaValida = Number.isFinite(altura) ? altura : 0
  const quantidadeValida = Number.isFinite(quantidade) ? quantidade : 0
  const area = larguraValida * alturaValida * quantidadeValida

  doc.setFont('helvetica', 'bold')
  doc.text('Medidas:', 18, y + 3)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${larguraValida.toFixed(2)}m (L) × ${alturaValida.toFixed(2)}m (A) × ${quantidadeValida} und`,
    38,
    y + 3
  )
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Área Total:', 18, y + 3)
  doc.setFont('helvetica', 'normal')
  doc.text(`${Number.isFinite(area) ? area.toFixed(2) : '0.00'} m²`, 42, y + 3)
  y += 12

  // ============================================
  // SEÇÃO: OBSERVAÇÕES (se houver)
  // ============================================

  if (orcamento.observacoes) {
    // Linha decorativa antes da seção
    doc.setDrawColor(218, 165, 32)
    doc.setLineWidth(0.8)
    doc.line(15, y, 50, y)
    y += 6

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('OBSERVAÇÕES', 15, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    const observacoesLines = doc.splitTextToSize(orcamento.observacoes, pageWidth - 35)
    doc.text(observacoesLines, 18, y)
    doc.setTextColor(0, 0, 0)
    y += (observacoesLines.length * 5) + 10
  }

  // ============================================
  // SEÇÃO: VALOR TOTAL - DESTAQUE
  // ============================================

  y += 8

  // Box destacado para valor
  doc.setFillColor(41, 41, 41) // Cinza escuro
  doc.rect(15, y - 3, pageWidth - 30, 22, 'F')

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255) // Branco
  doc.text('VALOR TOTAL DO ORÇAMENTO:', 20, y + 8)

  doc.setFontSize(20)
  doc.setTextColor(218, 165, 32) // Dourado
  const valorSeguro = Number.isFinite(orcamento.valor) ? orcamento.valor : 0
  const valorFormatado = `R$ ${valorSeguro.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
  doc.text(valorFormatado, pageWidth - 20, y + 8, { align: 'right' })

  doc.setTextColor(0, 0, 0) // Volta para preto
  y += 30

  // ============================================
  // AVISO IMPORTANTE
  // ============================================

  doc.setFillColor(255, 248, 220) // Amarelo claro
  doc.setDrawColor(218, 165, 32) // Borda dourada
  doc.setLineWidth(0.5)
  doc.rect(15, y - 2, pageWidth - 30, 16, 'FD')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(80, 80, 80)
  const avisoText = 'Este valor é uma estimativa inicial e pode sofrer alterações após avaliação detalhada no local.'
  const avisoLines = doc.splitTextToSize(avisoText, pageWidth - 40)
  doc.text(avisoLines, pageWidth / 2, y + 5, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  // ============================================
  // RODAPÉ
  // ============================================

  const footerY = pageHeight - 25

  // Linha superior do rodapé
  doc.setDrawColor(218, 165, 32)
  doc.setLineWidth(1)
  doc.line(15, footerY - 3, pageWidth - 15, footerY - 3)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(41, 41, 41)
  doc.text('Meu Serralheiro Pro', pageWidth / 2, footerY + 4, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Obrigado pela preferência!', pageWidth / 2, footerY + 10, { align: 'center' })

  doc.setTextColor(0, 0, 0)

  return doc
}

export function baixarPDF(orcamento: OrcamentoPDF) {
  const doc = gerarPDFOrcamento(orcamento)
  const nomeArquivo = `orcamento-${orcamento.id}-${orcamento.cliente.replace(/\s/g, '-')}.pdf`
  doc.save(nomeArquivo)
}

export function visualizarPDF(orcamento: OrcamentoPDF): string {
  const doc = gerarPDFOrcamento(orcamento)
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  return pdfUrl
}
