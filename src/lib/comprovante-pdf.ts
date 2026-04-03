import jsPDF from 'jspdf'
import { ComprovanteData, NOME_PLANO } from '@/types/assinatura'

export function gerarComprovantePDF(dados: ComprovanteData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Cabeçalho com fundo azul
  doc.setFillColor(0, 100, 220)
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Meu Serralheiro Pro', pageWidth / 2, 18, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Comprovante de Pagamento', pageWidth / 2, 30, { align: 'center' })

  // Status aprovado
  doc.setFillColor(34, 197, 94)
  doc.roundedRect(margin, 50, pageWidth - margin * 2, 18, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Pagamento Aprovado', pageWidth / 2, 62, { align: 'center' })

  // Linha divisória
  doc.setDrawColor(229, 229, 234)
  doc.setLineWidth(0.5)
  doc.line(margin, 78, pageWidth - margin, 78)

  // Dados do pagamento
  doc.setTextColor(50, 50, 60)
  const labelX = margin
  const valueX = pageWidth / 2

  const linhas: Array<{ label: string; value: string }> = [
    { label: 'Nome:', value: dados.nomeUsuario },
    { label: 'E-mail:', value: dados.emailUsuario },
    { label: 'Plano:', value: dados.plano },
    {
      label: 'Valor:',
      value: `R$ ${dados.valor.toFixed(2).replace('.', ',')} / mês`,
    },
    { label: 'Data do pagamento:', value: formatarData(dados.data) },
    { label: 'ID da transação:', value: dados.transacaoId },
    { label: 'ID do cliente:', value: dados.stripeCustomerId },
  ]

  let y = 92
  linhas.forEach((linha) => {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 110)
    doc.text(linha.label, labelX, y)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(20, 20, 30)
    doc.text(linha.value, valueX, y)

    y += 12
  })

  // Linha divisória
  doc.setDrawColor(229, 229, 234)
  doc.line(margin, y + 4, pageWidth - margin, y + 4)

  // Informações do plano
  y += 16
  doc.setFillColor(240, 247, 255)
  doc.roundedRect(margin, y, pageWidth - margin * 2, 46, 3, 3, 'F')

  doc.setTextColor(0, 80, 200)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Detalhes da Assinatura', margin + 6, y + 12)

  doc.setTextColor(50, 50, 80)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const detalheLinhas = [
    `Plano: ${NOME_PLANO}`,
    'Período: Mensal (renovação automática)',
    'Acesso: Completo a todos os recursos',
    'Cobrança: Automática todo mês',
  ]
  detalheLinhas.forEach((linha, i) => {
    doc.text(linha, margin + 6, y + 22 + i * 7)
  })

  // Rodapé
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setDrawColor(200, 200, 210)
  doc.line(margin, footerY - 6, pageWidth - margin, footerY - 6)

  doc.setFontSize(9)
  doc.setTextColor(150, 150, 160)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Este comprovante foi gerado automaticamente. Para dúvidas, acesse o suporte.',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )

  return doc
}

export function downloadComprovantePDF(dados: ComprovanteData): void {
  const doc = gerarComprovantePDF(dados)
  const dataFormatada = new Date(dados.data).toLocaleDateString('pt-BR').replace(/\//g, '-')
  doc.save(`comprovante-msp-${dataFormatada}.pdf`)
}

export function getComprovantePDFBase64(dados: ComprovanteData): string {
  const doc = gerarComprovantePDF(dados)
  return doc.output('datauristring')
}

function formatarData(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}
