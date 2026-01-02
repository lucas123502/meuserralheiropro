import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Video,
  HelpCircle,
  MessageSquare,
  XCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  AlertCircle
} from 'lucide-react'

export default function HelpSupport() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState('videos')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [suggestionSent, setSuggestionSent] = useState(false)
  const [cancellationSent, setCancellationSent] = useState(false)
  const [suggestion, setSuggestion] = useState('')

  // Estados do fluxo de cancelamento
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [showRetentionContent, setShowRetentionContent] = useState(false)

  // Dados dos vídeos (placeholder)
  const videos = [
    {
      id: 1,
      title: 'Como criar um orçamento',
      description: 'Aprenda a criar orçamentos profissionais em poucos passos',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop'
    },
    {
      id: 2,
      title: 'Como transformar orçamento em pedido',
      description: 'Veja como converter um orçamento aprovado em pedido',
      duration: '2:30',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop'
    },
    {
      id: 3,
      title: 'Como usar o catálogo',
      description: 'Descubra como organizar e utilizar seu catálogo de produtos',
      duration: '4:15',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=225&fit=crop'
    },
    {
      id: 4,
      title: 'Como acompanhar pedidos',
      description: 'Gerencie e acompanhe todos os seus pedidos facilmente',
      duration: '3:00',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop'
    },
    {
      id: 5,
      title: 'Como ver o faturamento',
      description: 'Entenda seus relatórios financeiros e faturamento',
      duration: '4:30',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=225&fit=crop'
    }
  ]

  // Perguntas frequentes
  const faqs = [
    {
      id: 1,
      question: 'Por que meu faturamento está zerado?',
      answer: 'O faturamento só contabiliza pedidos finalizados com pagamento confirmado. Orçamentos e pedidos em andamento não aparecem no faturamento. Verifique se você marcou os pedidos como "Finalizado" após receber o pagamento.'
    },
    {
      id: 2,
      question: 'Quando um pedido entra no financeiro?',
      answer: 'Um pedido entra no financeiro quando você marca ele como "Finalizado" e confirma o recebimento do pagamento. Pedidos em outras etapas (orçamento, em produção, aguardando pagamento) não são contabilizados.'
    },
    {
      id: 3,
      question: 'Posso editar um orçamento depois de enviado?',
      answer: 'Sim! Você pode editar um orçamento a qualquer momento antes de transformá-lo em pedido. Basta acessar a lista de orçamentos, clicar no orçamento desejado e fazer as alterações necessárias.'
    },
    {
      id: 4,
      question: 'Como transformar orçamento em pedido?',
      answer: 'Abra o orçamento aprovado pelo cliente e clique no botão "Transformar em Pedido". O sistema copiará todas as informações e criará um novo pedido automaticamente. Você pode então acompanhar a produção e entrega.'
    },
    {
      id: 5,
      question: 'O cliente recebe o orçamento em PDF?',
      answer: 'Sim! Ao finalizar um orçamento, você pode gerar e enviar um PDF profissional diretamente para o cliente por WhatsApp ou email. O PDF contém todos os detalhes: itens, valores, condições e forma de pagamento.'
    },
    {
      id: 6,
      question: 'Como faço backup dos meus dados?',
      answer: 'Seus dados estão automaticamente salvos e protegidos na nuvem. Você não precisa fazer backup manual. Todas as informações são sincronizadas em tempo real e podem ser acessadas de qualquer dispositivo.'
    },
    {
      id: 7,
      question: 'Posso usar o app em mais de um dispositivo?',
      answer: 'Sim! Você pode acessar o Meu Serralheiro Pro de qualquer computador, tablet ou celular. Basta fazer login com seu email e senha. Todos os dados serão sincronizados automaticamente.'
    },
    {
      id: 8,
      question: 'Como adiciono produtos no catálogo?',
      answer: 'Acesse o menu Catálogo e clique em "Novo Produto". Preencha as informações (nome, categoria, preço) e salve. Seus produtos ficam organizados por categoria para facilitar o uso nos orçamentos.'
    }
  ]

  // Motivos de cancelamento (sem "Falta de funcionalidades")
  const cancellationOptions = [
    { id: 'price', label: 'Preço / Financeiro' },
    { id: 'difficult', label: 'Achei difícil de usar' },
    { id: 'needs', label: 'Não atendeu minhas necessidades' },
    { id: 'closing', label: 'Estou encerrando minha atividade' },
    { id: 'other', label: 'Outro motivo' }
  ]

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuggestionSent(true)
    setSuggestion('')
    setTimeout(() => setSuggestionSent(false), 5000)
  }

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  // Fluxo de cancelamento - Etapa 1: Selecionar motivo
  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId)
    setShowRetentionContent(true)
    setFeedbackText('')
    setFeedbackSent(false)
  }

  // Fluxo de cancelamento - Etapa 3: Enviar feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackSent(true)
  }

  // Fluxo de cancelamento - Etapa 4: Cancelamento final
  const handleFinalCancellation = () => {
    setCancellationSent(true)
    setSelectedReason(null)
    setFeedbackText('')
    setFeedbackSent(false)
    setShowRetentionContent(false)
  }

  // Validação do campo obrigatório
  const isFeedbackRequired = selectedReason === 'needs' || selectedReason === 'other'
  const canSubmitFeedback = !isFeedbackRequired || (isFeedbackRequired && feedbackText.trim().length > 0)

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ajuda & Suporte</h1>
        <p className="text-muted-foreground">
          Encontre respostas, aprenda a usar o app e envie suas sugestões
        </p>
      </div>

      {/* Tabs de navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="videos" className="flex items-center gap-2 py-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Vídeos</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2 py-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Sugestões</span>
          </TabsTrigger>
          <TabsTrigger value="cancellation" className="flex items-center gap-2 py-2">
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </TabsTrigger>
        </TabsList>

        {/* Seção: Como usar o aplicativo (Vídeos) */}
        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Como usar o aplicativo</CardTitle>
              <CardDescription>
                Vídeos curtos para te ajudar a começar. Conteúdo completo será adicionado em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold mb-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="mt-6">
                <Video className="h-4 w-4" />
                <AlertDescription>
                  Os vídeos tutoriais estarão disponíveis em breve. Enquanto isso, explore o FAQ para encontrar respostas rápidas!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção: Perguntas Frequentes */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-accent transition-colors"
                    >
                      <span className="font-medium pr-4">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-3 pt-1 text-muted-foreground">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção: Sugestões e Feedback */}
        <TabsContent value="suggestions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sugestões e Feedback</CardTitle>
              <CardDescription>
                Sua opinião é muito importante para melhorarmos continuamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestionSent ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Obrigado pela sugestão! Nossa equipe irá analisar com atenção e considerar melhorias sempre que possível.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="suggestion">Sua sugestão ou feedback</Label>
                    <Textarea
                      id="suggestion"
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Conte-nos o que você acha que poderia melhorar no aplicativo, novas funcionalidades que gostaria de ver, ou qualquer outro comentário..."
                      className="min-h-32 mt-2"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar sugestão
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção: Cancelamento com Fluxo de Retenção */}
        <TabsContent value="cancellation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitação de Cancelamento</CardTitle>
              <CardDescription>
                Sentiremos sua falta! Mas antes, queremos entender melhor e talvez possamos ajudar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cancellationSent ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Sua solicitação foi registrada. Agradecemos sua contribuição.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {/* ETAPA 1: Seleção do Motivo */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Por que você está pensando em cancelar?
                    </Label>
                    <div className="space-y-2">
                      {cancellationOptions.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleReasonSelect(option.id)}
                          className={`
                            p-4 border-2 rounded-lg cursor-pointer transition-all
                            ${selectedReason === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center
                              ${selectedReason === option.id
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                              }
                            `}>
                              {selectedReason === option.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ETAPA 2: Conteúdo de Retenção Dinâmico */}
                  {showRetentionContent && selectedReason && !feedbackSent && (
                    <div className="border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          Talvez possamos te ajudar antes de cancelar
                        </h3>

                        {/* Resposta: Preço / Financeiro */}
                        {selectedReason === 'price' && (
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Entendemos a preocupação com o custo. Muitos usuários aumentam suas vendas usando o Meu Serralheiro Pro para criar orçamentos mais rápidos, profissionais e fechar mais pedidos.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setActiveTab('videos')}
                              >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Ver como aumentar vendas
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground italic">
                              Dica: Explore Ideias & Conteúdo, Mensagens WhatsApp e Catálogo de serviços
                            </p>
                          </div>
                        )}

                        {/* Resposta: Difícil de usar */}
                        {selectedReason === 'difficult' && (
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              O aplicativo foi pensado para ser simples, mas sabemos que no início podem surgir dúvidas.
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => setActiveTab('videos')}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Assistir vídeos rápidos de como usar
                            </Button>
                            <p className="text-xs text-muted-foreground italic">
                              A maioria dos usuários aprende o básico em poucos minutos.
                            </p>
                          </div>
                        )}

                        {/* Resposta: Não atendeu necessidades */}
                        {selectedReason === 'needs' && (
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground mb-3">
                              Nossa equipe analisa essas necessidades para melhorar o aplicativo continuamente.
                            </p>
                            <div>
                              <Label htmlFor="needsText" className="text-sm font-semibold">
                                Conte qual necessidade não foi atendida *
                              </Label>
                              <Textarea
                                id="needsText"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Descreva qual necessidade não foi atendida para que possamos avaliar uma solução..."
                                className="min-h-28 mt-2"
                                required
                              />
                            </div>
                            <p className="text-xs text-muted-foreground italic">
                              Se for possível, entraremos em contato para entender melhor e tentar resolver antes do cancelamento.
                            </p>
                          </div>
                        )}

                        {/* Resposta: Encerrando atividade */}
                        {selectedReason === 'closing' && (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              Entendemos sua decisão. Sentimos muito por isso e agradecemos por ter usado o Meu Serralheiro Pro.
                            </p>
                          </div>
                        )}

                        {/* Resposta: Outro motivo */}
                        {selectedReason === 'other' && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="otherText" className="text-sm font-semibold">
                                Explique brevemente o motivo do cancelamento *
                              </Label>
                              <Textarea
                                id="otherText"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Conte-nos o motivo do seu cancelamento..."
                                className="min-h-28 mt-2"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ETAPA 3: Enviar Feedback */}
                      <div className="mt-4">
                        <Button
                          onClick={handleFeedbackSubmit}
                          disabled={!canSubmitFeedback}
                          className="w-full sm:w-auto"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar feedback e continuar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ETAPA 4: Confirmação Final do Cancelamento */}
                  {feedbackSent && (
                    <div className="border-t pt-6 space-y-4">
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Obrigado pelo feedback. Isso nos ajuda a melhorar o Meu Serralheiro Pro.
                        </AlertDescription>
                      </Alert>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <p className="text-sm text-muted-foreground mb-4">
                          Se ainda assim deseja cancelar, clique no botão abaixo. Lamentamos vê-lo partir.
                        </p>
                        <Button
                          onClick={handleFinalCancellation}
                          variant="destructive"
                          className="w-full sm:w-auto"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Confirmar cancelamento
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Onboarding */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bem-vindo ao Meu Serralheiro Pro!</DialogTitle>
            <DialogDescription>
              Quer aprender a usar o app em poucos minutos?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Preparamos vídeos curtos e práticos para você começar rapidamente e aproveitar todas as funcionalidades do aplicativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setShowOnboarding(false)
                  setActiveTab('videos')
                }}
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Assistir vídeos
              </Button>
              <Button
                onClick={() => setShowOnboarding(false)}
                variant="outline"
                className="flex-1"
              >
                Pular por agora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
