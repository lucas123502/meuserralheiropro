import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Lightbulb, Copy, ExternalLink, MessageSquare, CheckCircle2 } from 'lucide-react'
import { ideiasConteudo, linksUteis, mensagensWhatsApp } from '@/data/ideias-conteudo'
import type { CategoriaIdeia, TipoMensagemWhatsApp } from '@/types/ideias'

export default function Ideias() {
  const { toast } = useToast()
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaIdeia>('Portões')
  const [tipoMensagemAtiva, setTipoMensagemAtiva] = useState<TipoMensagemWhatsApp>('Prospecção inicial')
  const [copiadoIds, setCopiadoIds] = useState<Set<string>>(new Set())

  const categorias: CategoriaIdeia[] = ['Portões', 'Estruturas Metálicas', 'Toldos', 'Outros Serviços']
  const tiposMensagem: TipoMensagemWhatsApp[] = [
    'Prospecção inicial',
    'Apresentação da empresa',
    'Envio de orçamento',
    'Follow-up',
    'Fechamento',
    'Pós-venda'
  ]

  // Copiar texto para clipboard
  const copiarTexto = async (texto: string, id: string) => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiadoIds(prev => new Set(prev).add(id))
      setTimeout(() => {
        setCopiadoIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 2000)
      toast({
        title: 'Texto copiado!',
        description: 'Cole onde quiser usar'
      })
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Tente novamente',
        variant: 'destructive'
      })
    }
  }

  // Filtrar ideias por categoria
  const ideiasCategoria = ideiasConteudo.filter(ideia => ideia.categoria === categoriaAtiva)

  // Filtrar mensagens por tipo
  const mensagensTipo = mensagensWhatsApp.filter(msg => msg.tipo === tipoMensagemAtiva)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ideias & Conteúdo</h1>
        <p className="text-gray-600">
          Ideias prontas para você postar e vender mais
        </p>
      </div>

      <Tabs defaultValue="ideias" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ideias">
            <Lightbulb className="h-4 w-4 mr-2" />
            Ideias de Conteúdo
          </TabsTrigger>
          <TabsTrigger value="links">
            <ExternalLink className="h-4 w-4 mr-2" />
            Links Úteis
          </TabsTrigger>
          <TabsTrigger value="mensagens">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensagens WhatsApp
          </TabsTrigger>
        </TabsList>

        {/* SEÇÃO 1: IDEIAS DE CONTEÚDO */}
        <TabsContent value="ideias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ideias de Conteúdo por Categoria</CardTitle>
              <CardDescription>
                Escolha uma categoria e veja ideias prontas para suas redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={categoriaAtiva} onValueChange={(val) => setCategoriaAtiva(val as CategoriaIdeia)}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  {categorias.map(cat => (
                    <TabsTrigger key={cat} value={cat}>
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categorias.map(categoria => (
                  <TabsContent key={categoria} value={categoria}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ideiasCategoria.map(ideia => (
                        <Card key={ideia.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <CardTitle className="text-base">{ideia.titulo}</CardTitle>
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {ideia.formato}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600">{ideia.descricao}</p>
                            {ideia.texto && (
                              <div className="bg-gray-50 rounded-lg p-3 border">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                  💬 Texto sugerido:
                                </p>
                                <p className="text-sm text-gray-800 whitespace-pre-line">
                                  {ideia.texto}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-3"
                                  onClick={() => copiarTexto(ideia.texto!, `ideia-${ideia.id}`)}
                                >
                                  {copiadoIds.has(`ideia-${ideia.id}`) ? (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                      Copiado!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copiar Texto
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEÇÃO 2: LINKS ÚTEIS */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Links Úteis</CardTitle>
              <CardDescription>
                Vídeos e conteúdos selecionados para te inspirar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Estes links abrem em uma nova aba. São conteúdos externos para você se inspirar!
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linksUteis.map(link => (
                  <Card key={link.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-base">{link.titulo}</CardTitle>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {link.plataforma}
                          </Badge>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{link.descricao}</p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Link
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEÇÃO 3: MENSAGENS WHATSAPP */}
        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens Prontas para WhatsApp</CardTitle>
              <CardDescription>
                Textos profissionais para cada etapa da venda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={tipoMensagemAtiva}
                onValueChange={(val) => setTipoMensagemAtiva(val as TipoMensagemWhatsApp)}
              >
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tiposMensagem.map(tipo => (
                      <Button
                        key={tipo}
                        variant={tipoMensagemAtiva === tipo ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTipoMensagemAtiva(tipo)}
                        className="justify-start"
                      >
                        {tipo}
                      </Button>
                    ))}
                  </div>
                </div>

                {tiposMensagem.map(tipo => (
                  <TabsContent key={tipo} value={tipo}>
                    <div className="space-y-4">
                      {mensagensTipo.map(mensagem => (
                        <Card key={mensagem.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-green-600" />
                              {mensagem.titulo}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <p className="text-sm text-gray-800 whitespace-pre-line">
                                {mensagem.texto}
                              </p>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => copiarTexto(mensagem.texto, `msg-${mensagem.id}`)}
                            >
                              {copiadoIds.has(`msg-${mensagem.id}`) ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar Mensagem
                                </>
                              )}
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                              💡 Personalize com seus dados antes de enviar
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
