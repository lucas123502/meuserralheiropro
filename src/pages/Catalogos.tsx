import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { BookOpen, Plus, Pencil, Trash2, FileText, AlertCircle } from 'lucide-react'
import type { ItemCatalogo, CategoriaCatalogo, TipoServicoCatalogo, ModeloCatalogo } from '@/types/catalogo'
import { categoriasParaTipoServico } from '@/types/catalogo'

// Modelos disponíveis por tipo de serviço (sincronizado com NovoOrcamento)
const modelosPorTipo: Record<TipoServicoCatalogo, ModeloCatalogo[]> = {
  'Portão': ['Portão de correr', 'Portão basculante', 'Outro'],
  'Estrutura metálica': ['Estrutura simples', 'Outro'],
  'Toldo': ['Toldo fixo', 'Toldo retrátil', 'Outro'],
  'Outro': ['Outro']
}

export default function Catalogos() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [itens, setItens] = useState<ItemCatalogo[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [itemEditando, setItemEditando] = useState<ItemCatalogo | null>(null)
  const [itemExcluindo, setItemExcluindo] = useState<ItemCatalogo | null>(null)
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaCatalogo>('Portões')

  const categorias: CategoriaCatalogo[] = ['Portões', 'Estruturas Metálicas', 'Toldos', 'Outros Serviços']

  // Estado do formulário
  const [formulario, setFormulario] = useState<Omit<ItemCatalogo, 'id' | 'dataCriacao' | 'dataAtualizacao'>>({
    nome: '',
    categoria: 'Portões',
    descricao: '',
    observacaoInterna: '',
    tipoServico: 'Portão',
    modelo: 'Portão de correr'
  })

  // Carregar itens do localStorage
  useEffect(() => {
    const salvos = localStorage.getItem('catalogo')
    if (salvos) {
      setItens(JSON.parse(salvos))
    }
  }, [])

  // Salvar itens no localStorage
  const salvarItens = (novosItens: ItemCatalogo[]) => {
    localStorage.setItem('catalogo', JSON.stringify(novosItens))
    setItens(novosItens)
  }

  // Abrir dialog para novo item
  const abrirNovoItem = () => {
    setItemEditando(null)
    setFormulario({
      nome: '',
      categoria: categoriaAtiva,
      descricao: '',
      observacaoInterna: '',
      tipoServico: categoriasParaTipoServico[categoriaAtiva],
      modelo: modelosPorTipo[categoriasParaTipoServico[categoriaAtiva]][0]
    })
    setDialogAberto(true)
  }

  // Abrir dialog para editar item
  const abrirEditarItem = (item: ItemCatalogo) => {
    setItemEditando(item)
    setFormulario({
      nome: item.nome,
      categoria: item.categoria,
      descricao: item.descricao,
      observacaoInterna: item.observacaoInterna || '',
      tipoServico: item.tipoServico,
      modelo: item.modelo
    })
    setDialogAberto(true)
  }

  // Atualizar categoria no formulário
  const atualizarCategoria = (categoria: CategoriaCatalogo) => {
    const tipoServico = categoriasParaTipoServico[categoria]
    const modelo = modelosPorTipo[tipoServico][0]
    setFormulario({
      ...formulario,
      categoria,
      tipoServico,
      modelo
    })
  }

  // Atualizar tipo de serviço no formulário
  const atualizarTipoServico = (tipoServico: TipoServicoCatalogo) => {
    const modelo = modelosPorTipo[tipoServico][0]
    setFormulario({
      ...formulario,
      tipoServico,
      modelo
    })
  }

  // Salvar item (criar ou editar)
  const salvarItem = () => {
    if (!formulario.nome.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Preencha o nome do serviço',
        variant: 'destructive'
      })
      return
    }

    if (!formulario.descricao.trim()) {
      toast({
        title: 'Descrição obrigatória',
        description: 'Preencha a descrição do serviço',
        variant: 'destructive'
      })
      return
    }

    const agora = new Date().toISOString()

    if (itemEditando) {
      // Editar item existente
      const novosItens = itens.map(item =>
        item.id === itemEditando.id
          ? {
              ...formulario,
              id: item.id,
              dataCriacao: item.dataCriacao,
              dataAtualizacao: agora
            }
          : item
      )
      salvarItens(novosItens)
      toast({
        title: 'Item atualizado!',
        description: 'O item do catálogo foi atualizado com sucesso'
      })
    } else {
      // Criar novo item
      const novoItem: ItemCatalogo = {
        ...formulario,
        id: Date.now().toString(),
        dataCriacao: agora,
        dataAtualizacao: agora
      }
      salvarItens([...itens, novoItem])
      toast({
        title: 'Item criado!',
        description: 'O item foi adicionado ao catálogo'
      })
    }

    setDialogAberto(false)
  }

  // Excluir item
  const confirmarExclusao = () => {
    if (!itemExcluindo) return

    const novosItens = itens.filter(item => item.id !== itemExcluindo.id)
    salvarItens(novosItens)
    toast({
      title: 'Item excluído',
      description: 'O item foi removido do catálogo'
    })
    setItemExcluindo(null)
  }

  // Usar item no orçamento
  const usarNoOrcamento = (item: ItemCatalogo) => {
    // Salvar dados do item selecionado para usar no NovoOrcamento
    const dadosParaOrcamento = {
      tipoServico: item.tipoServico,
      modelo: item.modelo,
      origemCatalogo: true,
      catalogoId: item.id
    }
    localStorage.setItem('orcamentoCatalogo', JSON.stringify(dadosParaOrcamento))

    toast({
      title: 'Iniciando orçamento',
      description: `Usando "${item.nome}" como base`
    })

    navigate('/orcamentos/novo')
  }

  // Filtrar itens por categoria
  const itensPorCategoria = itens.filter(item => item.categoria === categoriaAtiva)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogos</h1>
        <p className="text-gray-600">
          Gerencie seus serviços padronizados para agilizar a criação de orçamentos
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Serviços do Catálogo</CardTitle>
              <CardDescription>
                Organize seus serviços por categoria e use-os rapidamente em orçamentos
              </CardDescription>
            </div>
            <Button onClick={abrirNovoItem}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={categoriaAtiva} onValueChange={(val) => setCategoriaAtiva(val as CategoriaCatalogo)}>
            <TabsList className="grid w-full grid-cols-4">
              {categorias.map(categoria => (
                <TabsTrigger key={categoria} value={categoria}>
                  {categoria}
                </TabsTrigger>
              ))}
            </TabsList>

            {categorias.map(categoria => (
              <TabsContent key={categoria} value={categoria} className="mt-6">
                {itensPorCategoria.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum item nesta categoria
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Adicione serviços para começar a usar o catálogo
                    </p>
                    <Button onClick={abrirNovoItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Item
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itensPorCategoria.map(item => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{item.nome}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {item.tipoServico}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.modelo}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirEditarItem(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setItemExcluindo(item)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">{item.descricao}</p>
                          </div>
                          {item.observacaoInterna && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-yellow-800 mb-1">
                                    Observação interna
                                  </p>
                                  <p className="text-xs text-yellow-700">
                                    {item.observacaoInterna}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          <Button
                            className="w-full"
                            onClick={() => usarNoOrcamento(item)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Usar no Orçamento
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de Criação/Edição */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {itemEditando ? 'Editar Item do Catálogo' : 'Novo Item do Catálogo'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do serviço que deseja adicionar ao catálogo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Serviço *</Label>
              <Input
                id="nome"
                placeholder="Ex: Portão de correr residencial padrão"
                value={formulario.nome}
                onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={formulario.categoria}
                  onValueChange={(val) => atualizarCategoria(val as CategoriaCatalogo)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoServico">Tipo de Serviço *</Label>
                <Select
                  value={formulario.tipoServico}
                  onValueChange={(val) => atualizarTipoServico(val as TipoServicoCatalogo)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Portão">Portão</SelectItem>
                    <SelectItem value="Estrutura metálica">Estrutura metálica</SelectItem>
                    <SelectItem value="Toldo">Toldo</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Select
                value={formulario.modelo}
                onValueChange={(val) => setFormulario({ ...formulario, modelo: val as ModeloCatalogo })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelosPorTipo[formulario.tipoServico].map(modelo => (
                    <SelectItem key={modelo} value={modelo}>
                      {modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição que aparecerá no catálogo e no orçamento"
                rows={3}
                value={formulario.descricao}
                onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Esta descrição será visível para o cliente no PDF do orçamento
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacaoInterna">Observação Interna (opcional)</Label>
              <Textarea
                id="observacaoInterna"
                placeholder="Notas internas que não aparecerão no PDF do orçamento"
                rows={2}
                value={formulario.observacaoInterna}
                onChange={(e) => setFormulario({ ...formulario, observacaoInterna: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Use este campo para lembretes pessoais ou informações internas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarItem}>
              {itemEditando ? 'Atualizar' : 'Criar'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!itemExcluindo} onOpenChange={() => setItemExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{itemExcluindo?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
