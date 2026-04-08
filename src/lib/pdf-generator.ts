import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getSettings } from '@/lib/settings'

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

// Cores padrão
const COR_ESCURA = [30, 30, 30] as const       // Quase preto
const COR_DOURADA = [218, 165, 32] as const    // Dourado
const COR_BRANCA = [255, 255, 255] as const
const COR_CINZA_CLARO = [245, 245, 245] as const
const COR_CINZA_TEXTO = [90, 90, 90] as const
const COR_VERDE_CLARO = [240, 255, 245] as const
const COR_VERDE_BORDA = [34, 139, 34] as const

// Helpers
function setFill(doc: jsPDF, cor: readonly [number, number, number]) {
  doc.setFillColor(cor[0], cor[1], cor[2])
}
function setDraw(doc: jsPDF, cor: readonly [number, number, number]) {
  doc.setDrawColor(cor[0], cor[1], cor[2])
}
function setTextColor(doc: jsPDF, cor: readonly [number, number, number]) {
  doc.setTextColor(cor[0], cor[1], cor[2])
}

function drawSectionTitle(doc: jsPDF, label: string, y: number, pageWidth: number) {
  setFill(doc, COR_ESCURA)
  doc.rect(15, y, pageWidth - 30, 8, 'F')
  setTextColor(doc, COR_DOURADA)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(label.toUpperCase(), 20, y + 5.5)
  setTextColor(doc, [0, 0, 0])
  return y + 12
}

function drawInfoRow(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  pageWidth: number,
  labelWidth = 40
) {
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setTextColor(doc, COR_CINZA_TEXTO)
  doc.text(label, 18, y)
  doc.setFont('helvetica', 'normal')
  setTextColor(doc, [0, 0, 0])
  const valueLines = doc.splitTextToSize(value, pageWidth - 30 - labelWidth)
  doc.text(valueLines, 18 + labelWidth, y)
  return y + (valueLines.length * 5) + 1
}

export function gerarPDFOrcamento(orcamento: OrcamentoPDF) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Carregar configurações da empresa
  const settings = getSettings()
  const nomeEmpresa = settings.companyName || 'MINHA EMPRESA'
  const cnpj = settings.cnpj || ''
  const cidade = settings.city || ''
  const estado = settings.state || ''
  const whatsapp = settings.phone || ''
  const brinde = settings.brinde || ''
  const garantia = settings.garantia || ''
  const tempoEntrega = settings.tempoEntrega || ''
  const parcelamento = settings.parcelamento || ''
  const fraseFinal = settings.fraseFinal || ''

  let y = 0

  // ============================================================
  // CABEÇALHO DA EMPRESA
  // ============================================================

  const cabecalhoAltura = 52
  setFill(doc, COR_ESCURA)
  doc.rect(0, 0, pageWidth, cabecalhoAltura, 'F')

  // Logo (se existir)
  let logoWidth = 0
  if (settings.logo) {
    try {
      const imgProps = doc.getImageProperties(settings.logo)
      const maxLogoH = 30
      const maxLogoW = 40
      const ratio = Math.min(maxLogoW / imgProps.width, maxLogoH / imgProps.height)
      logoWidth = imgProps.width * ratio
      const logoH = imgProps.height * ratio
      doc.addImage(settings.logo, 'PNG', 15, (cabecalhoAltura - logoH) / 2, logoWidth, logoH)
      logoWidth += 5
    } catch {
      logoWidth = 0
    }
  }

  // Nome da empresa
  setTextColor(doc, COR_BRANCA)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const textoX = 15 + logoWidth
  doc.text(nomeEmpresa.toUpperCase(), textoX, 18)

  // Linha de informações abaixo do nome
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setTextColor(doc, [200, 200, 200])

  const infoParts: string[] = []
  if (cnpj) infoParts.push(`CNPJ: ${cnpj}`)
  if (cidade) infoParts.push(estado ? `${cidade} - ${estado}` : cidade)
  if (whatsapp) infoParts.push(`WhatsApp: ${whatsapp}`)

  if (infoParts.length > 0) {
    doc.text(infoParts.join('   |   '), textoX, 27)
  }

  // Linha dourada separadora
  setDraw(doc, COR_DOURADA)
  doc.setLineWidth(1.5)
  doc.line(0, cabecalhoAltura - 3, pageWidth, cabecalhoAltura - 3)

  y = cabecalhoAltura + 8

  // ============================================================
  // TÍTULO DO DOCUMENTO
  // ============================================================

  setFill(doc, COR_CINZA_CLARO)
  doc.rect(15, y - 2, pageWidth - 30, 14, 'F')
  setDraw(doc, COR_DOURADA)
  doc.setLineWidth(0.5)
  doc.rect(15, y - 2, pageWidth - 30, 14)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  setTextColor(doc, COR_ESCURA)
  doc.text('ORÇAMENTO PERSONALIZADO', pageWidth / 2, y + 7.5, { align: 'center' })
  setTextColor(doc, [0, 0, 0])

  y += 20

  // Data e número
  const dataFormatada = format(
    typeof orcamento.data === 'string' ? new Date(orcamento.data) : orcamento.data,
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  )

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setTextColor(doc, COR_CINZA_TEXTO)
  doc.text(`Emitido em: ${dataFormatada}`, 15, y)
  doc.text(`Nº ${orcamento.id}`, pageWidth - 15, y, { align: 'right' })
  setTextColor(doc, [0, 0, 0])

  y += 10

  // ============================================================
  // SEÇÃO: DADOS DO CLIENTE
  // ============================================================

  y = drawSectionTitle(doc, 'Dados do Cliente', y, pageWidth)

  const clienteNome = orcamento.clienteCompleto?.nome || orcamento.cliente
  const clienteTel = orcamento.clienteCompleto?.telefone || ''
  const clienteEnd = orcamento.clienteCompleto?.endereco || ''

  // Box do cliente
  setFill(doc, COR_BRANCA)
  setDraw(doc, [220, 220, 220])
  doc.setLineWidth(0.3)

  const clienteLinhas = [
    clienteNome,
    clienteTel ? `Tel: ${clienteTel}` : '',
    clienteEnd ? `End: ${clienteEnd}` : ''
  ].filter(Boolean)

  const clienteBoxH = clienteLinhas.length * 6 + 6
  doc.rect(15, y - 2, pageWidth - 30, clienteBoxH, 'FD')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(clienteNome, 18, y + 4)

  let yCliente = y + 4
  if (clienteTel) {
    yCliente += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setTextColor(doc, COR_CINZA_TEXTO)
    doc.text(`Tel: ${clienteTel}`, 18, yCliente)
  }
  if (clienteEnd) {
    yCliente += 6
    doc.setFontSize(9)
    const endLines = doc.splitTextToSize(`End: ${clienteEnd}`, pageWidth - 40)
    doc.text(endLines, 18, yCliente)
    yCliente += (endLines.length - 1) * 5
  }

  setTextColor(doc, [0, 0, 0])
  y += clienteBoxH + 8

  // ============================================================
  // SEÇÃO: DESCRIÇÃO DO SERVIÇO / DIMENSÕES
  // ============================================================

  y = drawSectionTitle(doc, 'Tipo de Serviço e Dimensões', y, pageWidth)

  const largura = parseFloat(orcamento.medidas.largura)
  const altura = parseFloat(orcamento.medidas.altura)
  const quantidade = parseInt(orcamento.medidas.quantidade)
  const larguraValida = Number.isFinite(largura) ? largura : 0
  const alturaValida = Number.isFinite(altura) ? altura : 0
  const quantidadeValida = Number.isFinite(quantidade) ? quantidade : 0
  const area = larguraValida * alturaValida * quantidadeValida

  setFill(doc, COR_BRANCA)
  setDraw(doc, [220, 220, 220])
  doc.setLineWidth(0.3)
  doc.rect(15, y - 2, pageWidth - 30, 28, 'FD')

  y = drawInfoRow(doc, 'Tipo de Serviço:', orcamento.tipoServico, y + 4, pageWidth, 40)
  y = drawInfoRow(doc, 'Modelo:', orcamento.modelo, y + 2, pageWidth, 40)
  y = drawInfoRow(
    doc,
    'Dimensões:',
    `${larguraValida.toFixed(2)}m (L) × ${alturaValida.toFixed(2)}m (A) × ${quantidadeValida} und — Área Total: ${Number.isFinite(area) ? area.toFixed(2) : '0.00'} m²`,
    y + 2,
    pageWidth,
    40
  )

  y += 8

  // ============================================================
  // SEÇÃO: QUALIDADE DO PRODUTO (campo "observacoes" do orçamento)
  // ============================================================

  if (orcamento.observacoes) {
    y = drawSectionTitle(doc, 'Qualidade do seu produto feito conosco', y, pageWidth)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    setTextColor(doc, [40, 40, 40])
    const obsLines = doc.splitTextToSize(orcamento.observacoes, pageWidth - 35)

    setFill(doc, COR_BRANCA)
    setDraw(doc, [220, 220, 220])
    doc.setLineWidth(0.3)
    doc.rect(15, y - 2, pageWidth - 30, obsLines.length * 5.5 + 8, 'FD')

    doc.text(obsLines, 18, y + 4)
    setTextColor(doc, [0, 0, 0])
    y += obsLines.length * 5.5 + 14
  }

  // ============================================================
  // BRINDE (se configurado)
  // ============================================================

  if (brinde) {
    y = drawSectionTitle(doc, 'Brinde', y, pageWidth)

    setFill(doc, COR_VERDE_CLARO)
    setDraw(doc, COR_VERDE_BORDA)
    doc.setLineWidth(0.3)

    const brindeLines = doc.splitTextToSize(brinde, pageWidth - 35)
    doc.rect(15, y - 2, pageWidth - 30, brindeLines.length * 5.5 + 8, 'FD')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    setTextColor(doc, [0, 100, 0])
    doc.text(brindeLines, 18, y + 4)
    setTextColor(doc, [0, 0, 0])
    y += brindeLines.length * 5.5 + 14
  }

  // ============================================================
  // GARANTIA
  // ============================================================

  if (garantia) {
    y = drawSectionTitle(doc, 'Garantia', y, pageWidth)

    setFill(doc, COR_BRANCA)
    setDraw(doc, [220, 220, 220])
    doc.setLineWidth(0.3)

    const garLines = doc.splitTextToSize(garantia, pageWidth - 35)
    doc.rect(15, y - 2, pageWidth - 30, garLines.length * 5.5 + 8, 'FD')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(garLines, 18, y + 4)
    y += garLines.length * 5.5 + 14
  }

  // ============================================================
  // TEMPO ESTIMADO PARA ENTREGA
  // ============================================================

  if (tempoEntrega) {
    y = drawSectionTitle(doc, 'Tempo Estimado para Entrega', y, pageWidth)

    setFill(doc, COR_BRANCA)
    setDraw(doc, [220, 220, 220])
    doc.setLineWidth(0.3)

    const entregaLines = doc.splitTextToSize(tempoEntrega, pageWidth - 35)
    doc.rect(15, y - 2, pageWidth - 30, entregaLines.length * 5.5 + 8, 'FD')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(entregaLines, 18, y + 4)
    y += entregaLines.length * 5.5 + 14
  }

  // ============================================================
  // FORMAS DE PAGAMENTO
  // ============================================================

  const valorSeguro = Number.isFinite(orcamento.valor) ? orcamento.valor : 0
  const valorFormatado = valorSeguro.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  // Calcular valor parcelado (valor base + 16%)
  const valorParcelado = valorSeguro * 1.16
  const valorParceladoFormatado = valorParcelado.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  y = drawSectionTitle(doc, 'Formas de Pagamento', y, pageWidth)

  setFill(doc, COR_BRANCA)
  setDraw(doc, [220, 220, 220])
  doc.setLineWidth(0.3)

  const pagBoxH = parcelamento ? 18 : 0
  if (pagBoxH > 0) {
    doc.rect(15, y - 2, pageWidth - 30, pagBoxH, 'FD')
  }

  // Parcelado
  if (parcelamento) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setTextColor(doc, COR_CINZA_TEXTO)
    doc.text('Parcelado:', 18, y + 4)
    const parcLines = doc.splitTextToSize(`${parcelamento} (total R$ ${valorParceladoFormatado})`, pageWidth - 70)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    setTextColor(doc, COR_CINZA_TEXTO)
    doc.text(parcLines, 50, y + 4)
    y += pagBoxH + 8
  }

  setTextColor(doc, [0, 0, 0])
  y += 4

  // ============================================================
  // VALOR TOTAL — DESTAQUE PRINCIPAL
  // ============================================================

  setFill(doc, COR_ESCURA)
  doc.rect(15, y, pageWidth - 30, 22, 'F')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  setTextColor(doc, COR_BRANCA)
  doc.text('VALOR TOTAL DO ORÇAMENTO:', 20, y + 9)

  doc.setFontSize(18)
  setTextColor(doc, COR_DOURADA)
  doc.text(`R$ ${valorFormatado}`, pageWidth - 20, y + 10, { align: 'right' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setTextColor(doc, [180, 180, 180])
  doc.text('* Valor sujeito a confirmação após visita técnica', pageWidth / 2, y + 18, { align: 'center' })

  setTextColor(doc, [0, 0, 0])
  y += 30

  // ============================================================
  // FRASE FINAL DA EMPRESA
  // ============================================================

  if (fraseFinal) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    setTextColor(doc, COR_CINZA_TEXTO)
    const fraseLines = doc.splitTextToSize(fraseFinal, pageWidth - 35)
    doc.text(fraseLines, pageWidth / 2, y + 6, { align: 'center' })
    setTextColor(doc, [0, 0, 0])
    y += fraseLines.length * 6 + 10
  }

  // ============================================================
  // RODAPÉ
  // ============================================================

  const footerY = pageHeight - 18

  setDraw(doc, COR_DOURADA)
  doc.setLineWidth(0.8)
  doc.line(15, footerY - 4, pageWidth - 15, footerY - 4)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  setTextColor(doc, COR_ESCURA)
  doc.text(nomeEmpresa, pageWidth / 2, footerY + 2, { align: 'center' })

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  setTextColor(doc, COR_CINZA_TEXTO)

  const rodapeInfos: string[] = []
  if (cnpj) rodapeInfos.push(`CNPJ: ${cnpj}`)
  if (cidade) rodapeInfos.push(estado ? `${cidade}/${estado}` : cidade)
  if (whatsapp) rodapeInfos.push(whatsapp)
  if (rodapeInfos.length > 0) {
    doc.text(rodapeInfos.join('  |  '), pageWidth / 2, footerY + 8, { align: 'center' })
  }

  setTextColor(doc, [0, 0, 0])

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
