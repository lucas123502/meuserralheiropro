import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, Grid3x3, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  CategoriaOrcamento,
  SubcategoriaOrcamento,
  ModeloOrcamento,
  CATEGORIAS_PADRAO,
  calcularArea,
  calcularValorModelo
} from '@/types/orcamento'

export default function NovoOrcamento() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Estados de navegação
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaOrcamento | null>(null)
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<SubcategoriaOrcamento | null>(null)
  const [modeloSelecionado, setModeloSelecionado] = useState<ModeloOrcamento | null>(null)

  // Estados de medidas
  const [largura, setLargura] = useState<string>('')
  const [altura, setAltura] = useState<string>('')
  const [area, setArea] = useState<number>(0)
  const [valorTotal, setValorTotal] = useState<number>(0)

  // Carregar dados mockados para demonstração
  useEffect(() => {
    // TODO: Aqui no futuro virá do banco de dados/API
    // Por enquanto, usar as categorias padrão
  }, [])

  // Recalcular área e valor quando medidas mudarem
  useEffect(() => {
    const larguraNum = parseFloat(largura)
    const alturaNum = parseFloat(altura)

    if (!isNaN(larguraNum) && larguraNum > 0 && !isNaN(alturaNum) && alturaNum > 0) {
      const areaCalculada = calcularArea(larguraNum, alturaNum)
      setArea(areaCalculada)

      if (modeloSelecionado) {
        const valor = calcularValorModelo(areaCalculada, modeloSelecionado.precoPorMetroQuadrado)
        setValorTotal(valor)
      }
    } else {
      setArea(0)
      setValorTotal(0)
    }
  }, [largura, altura, modeloSelecionado])

  const voltarParaCategorias = () => {
    setCategoriaSelecionada(null)
    setSubcategoriaSelecionada(null)
    setModeloSelecionado(null)
    setLargura('')
    setAltura('')
  }

  const voltarParaSubcategorias = () => {
    setSubcategoriaSelecionada(null)
    setModeloSelecionado(null)
    setLargura('')
    setAltura('')
  }

  const voltarParaModelos = () => {
    setModeloSelecionado(null)
    setLargura('')
    setAltura('')
  }

  const adicionarAoOrcamento = () => {
    if (!categoriaSelecionada || !subcategoriaSelecionada || !modeloSelecionado) {
      toast({
        title: 'Erro',
        description: 'Selecione categoria, subcategoria e modelo',
        variant: 'destructive'
      })
      return
    }

    if (!largura || !altura) {
      toast({
        title: 'Erro',
        description: 'Preencha largura e altura',
        variant: 'destructive'
      })
      return
    }

    toast({
      title: 'Item adicionado!',
      description: `${modeloSelecionado.nome} - R$ ${valorTotal.toFixed(2)}`
    })

    // TODO: Implementar lógica para salvar item no orçamento
    // Por enquanto, apenas resetar seleção
    voltarParaCategorias()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/orcamentos')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Orçamentos
          </Button>
          <h1 className="text-3xl font-bold">Novo Orçamento</h1>
          <p className="text-gray-600 mt-1">Selecione os produtos e serviços para criar seu orçamento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área principal - Seleção */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {!categoriaSelecionada && 'Selecione uma Categoria'}
                  {categoriaSelecionada && !subcategoriaSelecionada && 'Selecione uma Subcategoria'}
                  {subcategoriaSelecionada && !modeloSelecionado && 'Selecione um Modelo'}
                  {modeloSelecionado && 'Informe as Medidas'}
                </CardTitle>
                <CardDescription>
                  {categoriaSelecionada && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={voltarParaCategorias}
                        className="text-sm hover:underline"
                      >
                        {categoriaSelecionada.nome}
                      </button>
                      {subcategoriaSelecionada && (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          <button
                            onClick={voltarParaSubcategorias}
                            className="text-sm hover:underline"
                          >
                            {subcategoriaSelecionada.nome}
                          </button>
                        </>
                      )}
                      {modeloSelecionado && (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          <button
                            onClick={voltarParaModelos}
                            className="text-sm hover:underline"
                          >
                            {modeloSelecionado.nome}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* ETAPA 1: Categorias */}
                {!categoriaSelecionada && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CATEGORIAS_PADRAO.map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => setCategoriaSelecionada(categoria)}
                        className="group p-6 border-2 border-gray-200 rounded-lg hover:border-black transition-all text-left bg-white hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-black">
                              {categoria.nome}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {categoria.subcategorias.length} subcategorias
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ETAPA 2: Subcategorias */}
                {categoriaSelecionada && !subcategoriaSelecionada && (
                  <div>
                    {categoriaSelecionada.subcategorias.length === 0 ? (
                      <div className="text-center py-12">
                        <Grid3x3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          Nenhuma subcategoria cadastrada em <strong>{categoriaSelecionada.nome}</strong>
                        </p>
                        <Button
                          variant="outline"
                          onClick={voltarParaCategorias}
                          className="mt-4"
                        >
                          Voltar para Categorias
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {categoriaSelecionada.subcategorias.map((subcategoria) => (
                          <button
                            key={subcategoria.id}
                            onClick={() => setSubcategoriaSelecionada(subcategoria)}
                            className="group p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-all text-left bg-white hover:shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium group-hover:text-black">
                                  {subcategoria.nome}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {subcategoria.modelos.length} modelos disponíveis
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ETAPA 3: Modelos */}
                {subcategoriaSelecionada && !modeloSelecionado && (
                  <div>
                    {subcategoriaSelecionada.modelos.length === 0 ? (
                      <div className="text-center py-12">
                        <Grid3x3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          Nenhum modelo cadastrado em <strong>{subcategoriaSelecionada.nome}</strong>
                        </p>
                        <Button
                          variant="outline"
                          onClick={voltarParaSubcategorias}
                          className="mt-4"
                        >
                          Voltar para Subcategorias
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subcategoriaSelecionada.modelos
                          .filter(modelo => modelo.ativo)
                          .map((modelo) => (
                            <button
                              key={modelo.id}
                              onClick={() => setModeloSelecionado(modelo)}
                              className="group border-2 border-gray-200 rounded-lg hover:border-black transition-all text-left bg-white hover:shadow-md overflow-hidden"
                            >
                              {/* Imagem do modelo */}
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

                              {/* Info do modelo */}
                              <div className="p-4">
                                <h4 className="font-semibold text-lg group-hover:text-black mb-1">
                                  {modelo.nome}
                                </h4>
                                {modelo.descricao && (
                                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                    {modelo.descricao}
                                  </p>
                                )}
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="font-mono">
                                    R$ {modelo.precoPorMetroQuadrado.toFixed(2)}/m²
                                  </Badge>
                                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ETAPA 4: Medidas */}
                {modeloSelecionado && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{modeloSelecionado.nome}</h4>
                          {modeloSelecionado.descricao && (
                            <p className="text-sm text-gray-600 mt-1">{modeloSelecionado.descricao}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          R$ {modeloSelecionado.precoPorMetroQuadrado.toFixed(2)}/m²
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="largura">Largura (metros)</Label>
                        <Input
                          id="largura"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Ex: 3.50"
                          value={largura}
                          onChange={(e) => setLargura(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="altura">Altura (metros)</Label>
                        <Input
                          id="altura"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Ex: 2.00"
                          value={altura}
                          onChange={(e) => setAltura(e.target.value)}
                        />
                      </div>
                    </div>

                    {area > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Área Calculada</p>
                            <p className="text-2xl font-bold text-black">
                              {area.toFixed(2)} m²
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valor Total</p>
                            <p className="text-2xl font-bold text-black">
                              R$ {valorTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={adicionarAoOrcamento}
                      className="w-full"
                      disabled={!largura || !altura || area === 0}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Adicionar ao Orçamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Resumo */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
                <CardDescription>Itens selecionados</CardDescription>
              </CardHeader>
              <CardContent>
                {!categoriaSelecionada ? (
                  <div className="text-center py-8">
                    <Grid3x3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">
                      Nenhum item selecionado ainda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Categoria</Label>
                      <p className="font-medium">{categoriaSelecionada.nome}</p>
                    </div>

                    {subcategoriaSelecionada && (
                      <div>
                        <Label className="text-xs text-gray-500">Subcategoria</Label>
                        <p className="font-medium">{subcategoriaSelecionada.nome}</p>
                      </div>
                    )}

                    {modeloSelecionado && (
                      <>
                        <div>
                          <Label className="text-xs text-gray-500">Modelo</Label>
                          <p className="font-medium">{modeloSelecionado.nome}</p>
                        </div>

                        <div className="border-t pt-4">
                          <Label className="text-xs text-gray-500">Preço por m²</Label>
                          <p className="font-mono font-semibold">
                            R$ {modeloSelecionado.precoPorMetroQuadrado.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}

                    {area > 0 && (
                      <>
                        <div className="border-t pt-4">
                          <Label className="text-xs text-gray-500">Medidas</Label>
                          <p className="font-medium">
                            {largura}m × {altura}m
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Área Total</Label>
                          <p className="font-semibold text-lg">
                            {area.toFixed(2)} m²
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <Label className="text-xs text-gray-500">Valor Calculado</Label>
                          <p className="font-bold text-2xl text-black">
                            R$ {valorTotal.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
