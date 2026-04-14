# VERSÃO ESTÁVEL ATUAL — 2026-04-14

> ⚠️ Este documento registra o estado funcional confirmado do sistema.
> Toda alteração futura deve ser **incremental** — nenhuma funcionalidade listada aqui pode ser removida ou sobrescrita.

---

## Módulos e Funcionalidades Confirmadas

### 1. Orçamentos (`/orcamentos`)
- Listagem de orçamentos com status (Rascunho / Enviado)
- Badge e indicador visual "Fazer contato" (laranja pulsante) para orçamentos enviados há >2 dias
- Seção "Orçamentos para acompanhar" no topo da lista
- Botão "Baixar PDF" — geração de PDF com dados da empresa + cliente
- Botão "Enviar no WhatsApp" — abre `wa.me` com mensagem pré-definida + marca `dataEnvioWhatsApp`
- Botão "Converter em Pedido" — converte orçamento aprovado em pedido
- Badge "Convertido em Pedido" após conversão
- Salvo em: `localStorage['orcamentos']`

### 2. Novo Orçamento (`/orcamentos/novo`)
- Wizard multi-etapa: categoria → subcategoria → modelo → medidas → custo → cliente → finalizar
- Dois modos de precificação: rápido (m²) e detalhado (custo por componente)
- Suporte a serviços personalizados ("Outros")
- Cálculo automático de área e valor
- Preço personalizado por modelo salvo localmente

### 3. Gerenciar Modelos (`/orcamentos/modelos`)
- Criação/edição/exclusão de modelos personalizados
- Upload de imagem (Base64, max 2MB)
- Preço por m² customizável por modelo
- Organização por categoria e subcategoria

### 4. Pedidos (`/pedidos`)
- Listagem de pedidos com status coloridos
- Fluxo de status: `aprovado → em_producao → instalado → finalizado`
- Troca de status via modal
- Salvo em: `localStorage['pedidos']`

### 5. Financeiro (`/financeiro`)
- **Filtro de período** (dropdown único no topo):
  - Mês atual / Últimos 30 dias / Últimos 3 meses / Últimos 6 meses / Este ano / Período personalizado
- **Cards principais**: Faturamento (pedidos finalizados) + Pedidos Finalizados + Lucro Líquido
- **Lucro Líquido** = Total Recebido − Total Pago (visual verde/vermelho/neutro)
- **Contas a Receber**:
  - Botão "+ Nova Conta"
  - Campos: Nome, Valor, Vencimento, Categoria (Serviço / Produto / Outros)
  - Status: Pendente / Recebido | Botão "Marcar como recebido"
  - Filtro por categoria com badge colorido por tipo
  - Cards resumo: Total a Receber (amarelo) + Total Recebido (verde)
  - Salvo em: `localStorage['contasReceber']`
- **Contas a Pagar**:
  - Botão "+ Nova Despesa"
  - Campos: Descrição, Valor, Vencimento, Categoria (Material / Funcionário / Aluguel / Outros)
  - Status: Pendente / Pago | Botão "Marcar como pago"
  - Filtro por categoria com badge colorido por tipo
  - Destaque visual: vermelho = pendente, verde = pago
  - Cards resumo: Total a Pagar (vermelho) + Total Pago (verde)
  - Salvo em: `localStorage['contasPagar']`

### 6. Relatórios (`/relatorios`)
- **Filtro de período** (mesmo padrão do Financeiro — dropdown único no topo)
- **Cards de Resumo de Orçamentos/Pedidos** (filtrados por período):
  - Total de Orçamentos
  - Orçamentos Aprovados / Não Aprovados
  - Total de Pedidos / Pedidos Finalizados
  - Faturamento Total (pedidos finalizados)
- **Visão Financeira Real** (dados das Contas a Receber/Pagar):
  - Receita Real (verde) — contas marcadas como recebido
  - Despesa Total (vermelho) — contas marcadas como pago
  - Lucro Líquido (azul/laranja)
  - Margem de Lucro % (roxo)
- **Pedidos por Status** — tabela com contagem por cada status
- **Conversão de Orçamentos** — total criados, aprovados, taxa de conversão %

### 7. Clientes (`/clientes`)
- Listagem de clientes com telefone, endereço e contagem de orçamentos
- Botão "+ Novo Cliente" com formulário (nome, telefone, endereço)
- **Botão "Chamar no WhatsApp"** em cada card — abre `wa.me` com mensagem padrão
- Aviso "Telefone não cadastrado" quando telefone ausente
- Migração automática de clientes de orçamentos antigos
- Salvo em: `localStorage['clientes']`

### 8. CRM (`/crm`)
- Kanban com 6 colunas: Enviado / Negociando / Aprovado / Produção / Instalado / Perdido
- Cards sincronizados automaticamente com orçamentos enviados
- Cálculo de dias sem resposta por card
- Botão "Follow-up" abre WhatsApp com mensagem contextual
- Drag-and-drop entre colunas
- Salvo em: `localStorage['crm_cards']`

### 9. Ideias (`/ideias`)
- Templates de mensagens WhatsApp por fase da venda
- Ideias de conteúdo por categoria (Portões, Estruturas, Toldos, etc.)
- Copiar texto com feedback visual

### 10. Catálogos (`/catalogos`)
- CRUD de itens do catálogo por categoria
- Campos: nome, categoria, descrição pública, observação interna, tipo de serviço, modelo
- Salvo em: `localStorage['catalogo']`

### 11. Configurações (`/configuracoes`)
- Dados da empresa: nome, responsável, CNPJ, telefone, email, cidade, estado
- Upload de logotipo (Base64)
- Textos para PDF: brinde, garantia, prazo de entrega, parcelamento, frase final
- Salvo via `settings.ts` helpers

### 12. Geração de PDF (`/src/lib/pdf-generator.ts`)
- PDF profissional com logo da empresa, dados do cliente, dimensões, valores
- Parcelamento automático (valor × 1.16 / 12x)
- Seções condicionais: brinde, garantia, prazo, frase final
- Funções: `baixarPDF()`, `visualizarPDF()`, `gerarPDFOrcamento()`

---

## Estrutura de Dados (localStorage)

| Chave              | Conteúdo                          |
|--------------------|-----------------------------------|
| `orcamentos`       | Array de orçamentos               |
| `pedidos`          | Array de pedidos                  |
| `clientes`         | Array de clientes                 |
| `contasReceber`    | Array de contas a receber         |
| `contasPagar`      | Array de contas a pagar           |
| `catalogo`         | Array de itens do catálogo        |
| `crm_cards`        | Array de cards do CRM             |
| `settings`         | Configurações da empresa          |
| `assinatura`       | Dados da assinatura               |

---

## Regras para Alterações Futuras

1. **Nunca remover** funcionalidades listadas acima
2. **Nunca sobrescrever** arquivos existentes sem ler o estado atual primeiro
3. **Sempre adicionar** de forma incremental
4. **Verificar TypeScript** com `npx tsc --noEmit` após cada alteração
5. **Preservar** todas as chaves do localStorage existentes
