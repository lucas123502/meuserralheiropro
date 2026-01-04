import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, Edit2, Grid3x3, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  CATEGORIAS_PADRAO,
  CategoriaOrcamento,
  SubcategoriaOrcamento,
  ModeloOrcamento,
  obterModelosPersonalizados,
  salvarModeloPersonalizado,
  removerModeloPersonalizado,
  atualizarModeloPersonalizado,
  converterImagemParaBase64
} from '@/types/orcamento'

export default function GerenciarModelos() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Estados
  const [categorias] = useState<CategoriaOrcamento[]>(CATEGORIAS_PADRAO)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('')
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string>('')
  const [modelosPersonalizados, setModelosPersonalizados] = useState<ModeloOrcamento[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [modeloEditando, setModeloEditando] = useState<ModeloOrcamento | null>(null)

  // Formulário de novo modelo
  const [novoModelo, setNovoModelo] = useState({
    nome: '',
    descricao: '',
    precoPorMetroQuadrado: '',
    imagemUrl: ''
  })
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null)
  const [previewImagem, setPreviewImagem] = useState<string>('')

  // Carregar subcategorias da categoria selecionada
  const subcategorias: SubcategoriaOrcamento[] =
    categorias.find(c => c.id === categoriaSelecionada)?.subcategorias || []

  // Carregar modelos quando subcategoria mudar
  useEffect(() => {
    if (subcategoriaSelecionada) {
      const modelos = obterModelosPersonalizados(subcategoriaSelecionada)
      setModelosPersonalizados(modelos)
    } else {
      setModelosPersonalizados([])
    }
  }, [subcategoriaSelecionada])

  // Processar upload de imagem
  const handleImagemUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 2MB',
        variant: 'destructive'
      })
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'O arquivo deve ser uma imagem',
        variant: 'destructive'
      })
      return
    }

    setArquivoImagem(file)

    // Gerar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImagem(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removerImagem = () => {
    setArquivoImagem(null)
    setPreviewImagem('')
    setNovoModelo({ ...novoModelo, imagemUrl: '' })
  }

  const abrirDialogNovo = () => {
    setModoEdicao(false)
    setModeloEditando(null)
    setNovoModelo({
      nome: '',
      descricao: '',
      precoPorMetroQuadrado: '',
      imagemUrl: ''
    })
    setPreviewImagem('')
    setArquivoImagem(null)
    setDialogAberto(true)
  }

  const abrirDialogEdicao = (modelo: ModeloOrcamento) => {
    setModoEdicao(true)
    setModeloEditando(modelo)
    setNovoModelo({
      nome: modelo.nome,
      descricao: modelo.descricao || '',
      precoPorMetroQuadrado: modelo.precoPorMetroQuadrado.toString(),
      imagemUrl: modelo.imagemUrl || ''
    })
    setPreviewImagem(modelo.imagemUrl || '')
    setArquivoImagem(null)
    setDialogAberto(true)
  }

  const salvarModelo = async () => {
    // Validações
    if (!novoModelo.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Preencha o nome do modelo',
        variant: 'destructive'
      })
      return
    }

    const preco = parseFloat(novoModelo.precoPorMetroQuadrado)
    if (isNaN(preco) || preco <= 0) {
      toast({
        title: 'Erro',
        description: 'Preencha um valor por m² válido',
        variant: 'destructive'
      })
      return
    }

    if (!subcategoriaSelecionada) {
      toast({
        title: 'Erro',
        description: 'Selecione uma subcategoria',
        variant: 'destructive'
      })
      return
    }

    try {
      // Converter imagem para base64 se houver
      let imagemUrl = novoModelo.imagemUrl
      if (arquivoImagem) {
        imagemUrl = await converterImagemParaBase64(arquivoImagem)
      }

      if (modoEdicao && modeloEditando) {
        // Atualizar modelo existente
        atualizarModeloPersonalizado(subcategoriaSelecionada, modeloEditando.id, {
          nome: novoModelo.nome,
          descricao: novoModelo.descricao || undefined,
          precoPorMetroQuadrado: preco,
          imagemUrl: imagemUrl || undefined
        })

        toast({
          title: 'Modelo atualizado!',
          description: `${novoModelo.nome} foi atualizado com sucesso`
        })
      } else {
        // Salvar novo modelo
        salvarModeloPersonalizado(subcategoriaSelecionada, {
          nome: novoModelo.nome,
          descricao: novoModelo.descricao || undefined,
          precoPorMetroQuadrado: preco,
          imagemUrl: imagemUrl || undefined,
          ativo: true
        })

        toast({
          title: 'Modelo criado!',
          description: `${novoModelo.nome} foi adicionado à subcategoria`
        })
      }

      // Recarregar modelos
      setModelosPersonalizados(obterModelosPersonalizados(subcategoriaSelecionada))

      // Fechar dialog
      setDialogAberto(false)
      setNovoModelo({
        nome: '',
        descricao: '',
        precoPorMetroQuadrado: '',
        imagemUrl: ''
      })
      setPreviewImagem('')
      setArquivoImagem(null)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o modelo',
        variant: 'destructive'
      })
    }
  }

  const excluirModelo = (modeloId: string) => {
    if (!subcategoriaSelecionada) return

    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      removerModeloPersonalizado(subcategoriaSelecionada, modeloId)
      setModelosPersonalizados(obterModelosPersonalizados(subcategoriaSelecionada))

      toast({
        title: 'Modelo excluído',
        description: 'O modelo foi removido da subcategoria'
      })
    }
  }

  // Obter todos os modelos (padrão + personalizados)
  const todosModelos = subcategoriaSelecionada
    ? [
        ...(subcategorias.find(s => s.id === subcategoriaSelecionada)?.modelos || []),
        ...modelosPersonalizados
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/orcamentos')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Gerenciar Modelos</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie seus próprios modelos com fotos e valores personalizados
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecione a Categoria e Subcategoria</CardTitle>
            <CardDescription>
              Escolha onde você quer adicionar ou editar modelos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={categoriaSelecionada} onValueChange={(value) => {
                  setCategoriaSelecionada(value)
                  setSubcategoriaSelecionada('')
                }}>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategoria">Subcategoria</Label>
                <Select
                  value={subcategoriaSelecionada}
                  onValueChange={setSubcategoriaSelecionada}
                  disabled={!categoriaSelecionada}
                >
                  <SelectTrigger id="subcategoria">
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategorias.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Modelos */}
        {subcategoriaSelecionada && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Modelos Disponíveis</CardTitle>
                  <CardDescription>
                    {todosModelos.length} modelo(s) nesta subcategoria
                  </CardDescription>
                </div>
                <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                  <DialogTrigger asChild>
                    <Button onClick={abrirDialogNovo}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Modelo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {modoEdicao ? 'Editar Modelo' : 'Novo Modelo Personalizado'}
                      </DialogTitle>
                      <DialogDescription>
                        {modoEdicao
                          ? 'Atualize as informações do modelo'
                          : 'Crie um modelo com foto e valor personalizado para acelerar seus orçamentos'
                        }
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Upload de Imagem */}
                      <div className="space-y-2">
                        <Label>Foto do Modelo</Label>
                        {previewImagem ? (
                          <div className="relative">
                            <img
                              src={previewImagem}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removerImagem}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImagemUpload}
                              className="hidden"
                              id="upload-imagem"
                            />
                            <label htmlFor="upload-imagem" className="cursor-pointer">
                              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600">
                                Clique para enviar uma foto
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG até 2MB
                              </p>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Nome */}
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome do Modelo *</Label>
                        <Input
                          id="nome"
                          placeholder="Ex: Portão Premium com Detalhes"
                          value={novoModelo.nome}
                          onChange={(e) => setNovoModelo({ ...novoModelo, nome: e.target.value })}
                        />
                      </div>

                      {/* Descrição */}
                      <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição (opcional)</Label>
                        <Textarea
                          id="descricao"
                          placeholder="Detalhes sobre o modelo"
                          value={novoModelo.descricao}
                          onChange={(e) => setNovoModelo({ ...novoModelo, descricao: e.target.value })}
                          rows={3}
                        />
                      </div>

                      {/* Valor por m² */}
                      <div className="space-y-2">
                        <Label htmlFor="preco">Valor Base por m² *</Label>
                        <Input
                          id="preco"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Ex: 350.00"
                          value={novoModelo.precoPorMetroQuadrado}
                          onChange={(e) => setNovoModelo({ ...novoModelo, precoPorMetroQuadrado: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">
                          Este valor será multiplicado pela área em m² no orçamento
                        </p>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setDialogAberto(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={salvarModelo}>
                          {modoEdicao ? 'Atualizar' : 'Criar'} Modelo
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {todosModelos.length === 0 ? (
                <div className="text-center py-12">
                  <Grid3x3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">
                    Nenhum modelo disponível nesta subcategoria
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Clique em "Novo Modelo" para criar o primeiro
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todosModelos.map(modelo => (
                    <Card key={modelo.id} className="overflow-hidden">
                      {/* Imagem */}
                      {modelo.imagemUrl ? (
                        <div className="aspect-video bg-gray-100 relative">
                          <img
                            src={modelo.imagemUrl}
                            alt={modelo.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <Grid3x3 className="h-12 w-12 text-gray-300" />
                        </div>
                      )}

                      {/* Conteúdo */}
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-base line-clamp-1">
                                {modelo.nome}
                              </h4>
                              {modelo.personalizado && (
                                <Badge variant="secondary" className="text-xs">
                                  Seu
                                </Badge>
                              )}
                            </div>
                            {modelo.descricao && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {modelo.descricao}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge className="font-mono">
                              R$ {modelo.precoPorMetroQuadrado.toFixed(2)}/m²
                            </Badge>

                            {modelo.personalizado && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => abrirDialogEdicao(modelo)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => excluirModelo(modelo.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mensagem quando nenhuma subcategoria selecionada */}
        {!subcategoriaSelecionada && (
          <Card className="text-center py-12">
            <CardContent>
              <Grid3x3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Selecione uma Categoria e Subcategoria
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Escolha nos filtros acima onde você quer adicionar seus modelos personalizados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
