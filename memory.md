# Memória do Projeto - Meu Serralheiro Pro

## Stack
React 18 + TypeScript + Vite + Tailwind + shadcn/ui + jsPDF + React Router v7

## Funcionalidades implementadas

### Orçamentos (Orcamentos.tsx)
- Listagem com PDF download direto (baixarPDF)
- Botão "Enviar no WhatsApp": abre wa.me com texto do orçamento, salva dataEnvioWhatsApp, marca status=enviado
- Converter em Pedido
- Badge visual "WhatsApp enviado" quando dataEnvioWhatsApp preenchido

### Fluxo de Orçamento (NovoOrcamento.tsx)
- Após calcular área e valor na etapa de medidas, exibe DOIS botões:
  - "Gerar orçamento rápido" → usa valor por m², salva modoOrcamento='rapido', pula estrutura de custo
  - "Detalhar custos" → segue fluxo normal com estrutura de custos
- O modoRapido anterior (via botão no card de modelo) também continua funcionando
- Serviços personalizados (cat-outros) também têm os dois botões

### Pipeline CRM (src/pages/CRM.tsx)
- Rota: /crm
- Colunas: Enviado → Negociando → Aprovado → Produção → Instalado → Perdido
- Cards sincronizados automaticamente com orçamentos de status='enviado'
- Mostra: cliente, serviço, valor, dias sem resposta (vermelho se ≥7 dias)
- Botão WhatsApp follow-up com mensagem automática
- Setas para mover card entre colunas
- Persistência em localStorage (crm_cards)
- Totais de pipeline ativo e instalados no header

### Navegação (MainLayout.tsx)
- Adicionado "Pipeline CRM" com ícone KanbanSquare após Orçamentos

## PDF
- Gerado por jsPDF, download direto via baixarPDF()
- Cabeçalho escuro com nome da empresa e linha dourada
- Layout moderno com seções: cliente, serviço, observações, valor total, aviso
