import { ComprovanteData, NOME_PLANO, VALOR_MENSAL } from '@/types/assinatura'

export interface EmailConfirmacaoParams {
  nomeUsuario: string
  emailUsuario: string
  comprovante: ComprovanteData
}

/**
 * Prepara os dados para o e-mail de confirmação de pagamento.
 * Pronto para integração com qualquer provedor de e-mail (Resend, SendGrid, etc).
 */
export function prepareEmailConfirmacao(params: EmailConfirmacaoParams): {
  to: string
  subject: string
  html: string
  text: string
} {
  const { nomeUsuario, emailUsuario, comprovante } = params
  const dataFormatada = new Date(comprovante.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const valorFormatado = `R$ ${VALOR_MENSAL.toFixed(2).replace('.', ',')}`

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao ${NOME_PLANO}</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: #0064DC; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Meu Serralheiro Pro</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Sua assinatura está ativa!</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <h2 style="color: #1a1a2e; font-size: 20px; margin: 0 0 16px;">
        Olá, ${nomeUsuario}!
      </h2>

      <p style="color: #444; line-height: 1.6; margin: 0 0 24px;">
        Seu pagamento foi confirmado e sua assinatura do <strong>${NOME_PLANO}</strong> está ativa.
        Você agora tem acesso completo a todas as funcionalidades do sistema.
      </p>

      <!-- Status Badge -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 24px; text-align: center;">
        <span style="color: #15803d; font-weight: bold; font-size: 16px;">
          ✓ Assinatura Ativa
        </span>
      </div>

      <!-- Detalhes do Plano -->
      <div style="background: #f8faff; border: 1px solid #dce8ff; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
        <h3 style="color: #1a1a2e; margin: 0 0 12px; font-size: 16px;">Detalhes da Assinatura</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #666;">Plano:</td>
            <td style="padding: 6px 0; color: #1a1a2e; font-weight: 600; text-align: right;">${NOME_PLANO}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Valor:</td>
            <td style="padding: 6px 0; color: #1a1a2e; font-weight: 600; text-align: right;">${valorFormatado}/mês</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Data de pagamento:</td>
            <td style="padding: 6px 0; color: #1a1a2e; font-weight: 600; text-align: right;">${dataFormatada}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">ID da transação:</td>
            <td style="padding: 6px 0; color: #666; font-size: 12px; text-align: right;">${comprovante.transacaoId}</td>
          </tr>
        </table>
      </div>

      <p style="color: #555; line-height: 1.6; margin: 0 0 24px;">
        O comprovante de pagamento está anexado neste e-mail em PDF.
        Você também pode acessá-lo a qualquer momento no sistema.
      </p>

      <p style="color: #777; font-size: 13px; line-height: 1.6; margin: 0;">
        A cobrança será renovada automaticamente todo mês.
        Para cancelar ou alterar sua assinatura, entre em contato com nosso suporte.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e5e5;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Meu Serralheiro Pro · Todos os direitos reservados
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Olá, ${nomeUsuario}!

Seu pagamento foi confirmado e sua assinatura do ${NOME_PLANO} está ativa.

DETALHES DA ASSINATURA:
- Plano: ${NOME_PLANO}
- Valor: ${valorFormatado}/mês
- Data: ${dataFormatada}
- Transação: ${comprovante.transacaoId}

O comprovante está disponível no sistema.

Meu Serralheiro Pro
  `.trim()

  return {
    to: emailUsuario,
    subject: `Assinatura ativa - ${NOME_PLANO}`,
    html,
    text,
  }
}

/**
 * Envia o e-mail de confirmação.
 * Substitua o corpo desta função pela integração com seu provedor de e-mail.
 * Provedores suportados: Resend, SendGrid, Mailgun, AWS SES, etc.
 */
export async function enviarEmailConfirmacao(
  params: EmailConfirmacaoParams
): Promise<{ sucesso: boolean; erro?: string }> {
  const emailData = prepareEmailConfirmacao(params)

  // TODO: Integrar com provedor de e-mail
  // Exemplo com Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@seudominio.com.br',
  //   to: emailData.to,
  //   subject: emailData.subject,
  //   html: emailData.html,
  // })

  console.log('[Email] Preparado para envio:', {
    to: emailData.to,
    subject: emailData.subject,
  })

  // Por ora, retorna sucesso simulado (sem envio real)
  return { sucesso: true }
}
