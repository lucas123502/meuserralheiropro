import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Check, Grid3x3, ChevronRight, User, FileCheck, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  CategoriaOrcamento,
  SubcategoriaOrcamento,
  ModeloOrcamento,
  ServicoPersonalizado,
  CATEGORIAS_PADRAO,
  calcularArea,
  calcularValorModelo,
  obterServicosPersonalizados,
  salvarServicoPersonalizado,
  removerServicoPersonalizado
} from '@/types/orcamento'

// Interface para dados do cliente
interface DadosCliente {
  nome: string
  telefone: string
  endereco: string
}

// Interface para item do orçamento
interface ItemOrcamento {
  categoria: string
  subcategoria: string
  modelo: string
  largura: number
  altura: number
  area: number
  valorUnitario: number
  valorTotal: number
}

type Etapa = 'categoria' | 'subcategoria' | 'modelo' | 'medidas' | 'cliente' | 'finalizar' | 'servico-personalizado'

export default function NovoOrcamento() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Estados de navegação
  const [etapaAtual, setEtapaAtual] = useState<Etapa>('categoria')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaOrcamento | null>(null)
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<SubcategoriaOrcamento | null>(null)
  const [modeloSelecionado, setModeloSelecionado] = useState<ModeloOrcamento | null>(null)

  // Estados para serviço personalizado (categoria "Outros")
  const [servicoPersonalizado, setServicoPersonalizado] = useState({
    nomeServico: '',
    nomeSubcategoria: '',
    tipoCobranca: 'por_m2' as 'fixo' | 'por_m2',
    valorBase: '',
    observacoes: '',
    salvarParaFuturo: false
  })
  const [servicosSalvos, setServicosSalvos] = useState<ServicoPersonalizado[]>([])
  const [modoSelecaoServico, setModoSelecaoServico] = useState<'novo' | 'existente'>('novo')

  // Estados de medidas - PRESERVAR VALORES EXATOS
  const [largura, setLargura] = useState<string>('')
  const [altura, setAltura] = useState<string>('')
  const [area, setArea] = useState<number>(0)
  const [valorTotal, setValorTotal] = useState<number>(0)

  // Estados do cliente
  const [dadosCliente, setDadosCliente] = useState<DadosCliente>({
    nome: '',
    telefone: '',
    endereco: ''
  })

  // Estados de finalização
  const [itens, setItens] = useState<ItemOrcamento[]>([])
  const [observacoes, setObservacoes] = useState('')

  // Carregar serviços salvos ao montar o componente
  useEffect(() => {
    setServicosSalvos(obterServicosPersonalizados())
  }, [])

  // Recalcular área e valor quando medidas mudarem
  // CORREÇÃO CRÍTICA: Não alterar valores digitados pelo usuário
  useEffect(() => {
    const larguraNum = parseFloat(largura)
    const alturaNum = parseFloat(altura)

    if (!isNaN(larguraNum) && larguraNum > 0 && !isNaN(alturaNum) && alturaNum > 0) {
      const areaCalculada = calcularArea(larguraNum, alturaNum)
      setArea(areaCalculada)

      if (modeloSelecionado) {
        const valor = calcularValorModelo(areaCalculada, modeloSelecionado.precoPorMetroQuadrado)
        setValorTotal(valor)
      } else if (etapaAtual === 'medidas' && servicoPersonalizado.tipoCobranca === 'por_m2' && servicoPersonalizado.valorBase) {
        // Cálculo para serviço personalizado cobrado por m²
        const valorBaseNum = parseFloat(servicoPersonalizado.valorBase)
        if (!isNaN(valorBaseNum)) {
          const valor = calcularValorModelo(areaCalculada, valorBaseNum)
          setValorTotal(valor)
        }
      }
    } else {
      setArea(0)
      // Para serviço com cobrança fixa, manter o valor
      if (servicoPersonalizado.tipoCobranca === 'fixo' && servicoPersonalizado.valorBase) {
        const valorFixo = parseFloat(servicoPersonalizado.valorBase)
        if (!isNaN(valorFixo)) {
          setValorTotal(valorFixo)
        } else {
          setValorTotal(0)
        }
      } else {
        setValorTotal(0)
      }
    }
  }, [largura, altura, modeloSelecionado, servicoPersonalizado.tipoCobranca, servicoPersonalizado.valorBase, etapaAtual])

  const selecionarCategoria = (categoria: CategoriaOrcamento) => {
    setCategoriaSelecionada(categoria)

    // Se for "Outros", ir direto para serviço personalizado
    if (categoria.id === 'cat-outros') {
      setEtapaAtual('servico-personalizado')
    } else {
      setEtapaAtual('subcategoria')
    }
  }

  const selecionarSubcategoria = (subcategoria: SubcategoriaOrcamento) => {
    setSubcategoriaSelecionada(subcategoria)
    setEtapaAtual('modelo')
  }

  const selecionarModelo = (modelo: ModeloOrcamento) => {
    setModeloSelecionado(modelo)
    setEtapaAtual('medidas')
  }

  const confirmarServicoPersonalizado = () => {
    // Validações
    if (!servicoPersonalizado.nomeServico.trim()) {
      toast({
        title: 'Erro',
        description: 'Preencha o nome do serviço',
        variant: 'destructive'
      })
      return
    }

    if (!servicoPersonalizado.valorBase || parseFloat(servicoPersonalizado.valorBase) <= 0) {
      toast({
        title: 'Erro',
        description: 'Preencha um valor válido',
        variant: 'destructive'
      })
      return
    }

    // Salvar para uso futuro se marcado
    if (servicoPersonalizado.salvarParaFuturo) {
      salvarServicoPersonalizado({
        nomeServico: servicoPersonalizado.nomeServico,
        nomeSubcategoria: servicoPersonalizado.nomeSubcategoria || undefined,
        tipoCobranca: servicoPersonalizado.tipoCobranca,
        valorBase: parseFloat(servicoPersonalizado.valorBase),
        observacoes: servicoPersonalizado.observacoes || undefined
      })

      toast({
        title: 'Serviço salvo!',
        description: 'O serviço foi salvo para uso futuro'
      })

      // Atualizar lista de serviços salvos
      setServicosSalvos(obterServicosPersonalizados())
    }

    // Se for valor fixo, não precisa de medidas
    if (servicoPersonalizado.tipoCobranca === 'fixo') {
      setValorTotal(parseFloat(servicoPersonalizado.valorBase))
      setArea(0) // Área não aplicável para valor fixo
      setLargura('0')
      setAltura('0')

      // Adicionar item ao orçamento
      const novoItem: ItemOrcamento = {
        categoria: 'Outros',
        subcategoria: servicoPersonalizado.nomeSubcategoria || 'Serviço Personalizado',
        modelo: servicoPersonalizado.nomeServico,
        largura: 0,
        altura: 0,
        area: 0,
        valorUnitario: parseFloat(servicoPersonalizado.valorBase),
        valorTotal: parseFloat(servicoPersonalizado.valorBase)
      }

      setItens([...itens, novoItem])

      toast({
        title: 'Item adicionado!',
        description: `${novoItem.modelo} - R$ ${novoItem.valorTotal.toFixed(2)}`
      })

      // Ir para dados do cliente
      setEtapaAtual('cliente')
    } else {
      // Se for por m², ir para medidas
      setEtapaAtual('medidas')
    }
  }

  const confirmarMedidas = () => {
    // Para serviço personalizado por m²
    if (categoriaSelecionada?.id === 'cat-outros' && servicoPersonalizado.tipoCobranca === 'por_m2') {
      if (!largura || !altura || area === 0) {
        toast({
          title: 'Erro',
          description: 'Preencha largura e altura válidas',
          variant: 'destructive'
        })
        return
      }

      const novoItem: ItemOrcamento = {
        categoria: 'Outros',
        subcategoria: servicoPersonalizado.nomeSubcategoria || 'Serviço Personalizado',
        modelo: servicoPersonalizado.nomeServico,
        largura: parseFloat(largura),
        altura: parseFloat(altura),
        area: area,
        valorUnitario: parseFloat(servicoPersonalizado.valorBase),
        valorTotal: valorTotal
      }

      setItens([...itens, novoItem])

      toast({
        title: 'Item adicionado!',
        description: `${novoItem.modelo} - R$ ${valorTotal.toFixed(2)}`
      })

      setEtapaAtual('cliente')
      return
    }

    // Fluxo padrão para outros serviços
    if (!largura || !altura || area === 0) {
      toast({
        title: 'Erro',
        description: 'Preencha largura e altura válidas',
        variant: 'destructive'
      })
      return
    }

    // Adicionar item ao orçamento
    const novoItem: ItemOrcamento = {
      categoria: categoriaSelecionada!.nome,
      subcategoria: subcategoriaSelecionada!.nome,
      modelo: modeloSelecionado!.nome,
      largura: parseFloat(largura),
      altura: parseFloat(altura),
      area: area,
      valorUnitario: modeloSelecionado!.precoPorMetroQuadrado,
      valorTotal: valorTotal
    }

    setItens([...itens, novoItem])

    toast({
      title: 'Item adicionado!',
      description: `${novoItem.modelo} - R$ ${valorTotal.toFixed(2)}`
    })

    // Ir para dados do cliente
    setEtapaAtual('cliente')
  }

  const confirmarCliente = () => {
    if (!dadosCliente.nome || !dadosCliente.telefone) {
      toast({
        title: 'Erro',
        description: 'Preencha nome e telefone do cliente',
        variant: 'destructive'
      })
      return
    }

    setEtapaAtual('finalizar')
  }

  const voltarEtapa = () => {
    if (etapaAtual === 'subcategoria') {
      setCategoriaSelecionada(null)
      setEtapaAtual('categoria')
    } else if (etapaAtual === 'servico-personalizado') {
      setCategoriaSelecionada(null)
      setServicoPersonalizado({
        nomeServico: '',
        nomeSubcategoria: '',
        tipoCobranca: 'por_m2',
        valorBase: '',
        observacoes: '',
        salvarParaFuturo: false
      })
      setEtapaAtual('categoria')
    } else if (etapaAtual === 'modelo') {
      setSubcategoriaSelecionada(null)
      setEtapaAtual('subcategoria')
    } else if (etapaAtual === 'medidas') {
      if (categoriaSelecionada?.id === 'cat-outros') {
        setLargura('')
        setAltura('')
        setEtapaAtual('servico-personalizado')
      } else {
        setModeloSelecionado(null)
        setLargura('')
        setAltura('')
        setEtapaAtual('modelo')
      }
    } else if (etapaAtual === 'cliente') {
      if (itens.length > 0) {
        // Se já tem itens, voltar para finalizar
        setEtapaAtual('finalizar')
      } else {
        setEtapaAtual('medidas')
      }
    } else if (etapaAtual === 'finalizar') {
      setEtapaAtual('cliente')
    }
  }

  const carregarServicoSalvo = (servico: ServicoPersonalizado) => {
    setServicoPersonalizado({
      nomeServico: servico.nomeServico,
      nomeSubcategoria: servico.nomeSubcategoria || '',
      tipoCobranca: servico.tipoCobranca,
      valorBase: servico.valorBase.toString(),
      observacoes: servico.observacoes || '',
      salvarParaFuturo: false
    })
    setModoSelecaoServico('novo')
  }

  const excluirServicoSalvo = (id: string) => {
    removerServicoPersonalizado(id)
    setServicosSalvos(obterServicosPersonalizados())
    toast({
      title: 'Serviço removido',
      description: 'O serviço foi removido da lista'
    })
  }

  const finalizarOrcamento = () => {
    if (itens.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos um item ao orçamento',
        variant: 'destructive'
      })
      return
    }

    const valorTotalOrcamento = itens.reduce((acc, item) => acc + item.valorTotal, 0)

    const novoOrcamento = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      cliente: dadosCliente.nome,
      clienteCompleto: dadosCliente,
      valor: valorTotalOrcamento,
      status: 'enviado',
      tipoServico: itens[0].categoria,
      modelo: itens[0].modelo,
      medidas: {
        largura: itens[0].largura.toString(),
        altura: itens[0].altura.toString(),
        quantidade: itens.length.toString()
      },
      itens: itens,
      observacoes: observacoes,
      convertidoEmPedido: false
    }

    // Salvar no localStorage
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]')
    orcamentos.push(novoOrcamento)
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos))

    toast({
      title: 'Orçamento criado!',
      description: 'Orçamento salvo com sucesso'
    })

    navigate('/orcamentos')
  }

  const adicionarMaisItens = () => {
    setCategoriaSelecionada(null)
    setSubcategoriaSelecionada(null)
    setModeloSelecionado(null)
    setLargura('')
    setAltura('')
    setEtapaAtual('categoria')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/orcamentos')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Orçamentos
          </Button>
          <h1 className="text-3xl font-bold">Novo Orçamento</h1>
          <p className="text-gray-600 mt-1">
            {etapaAtual === 'categoria' && 'Selecione a categoria do serviço'}
            {etapaAtual === 'subcategoria' && 'Selecione a subcategoria'}
            {etapaAtual === 'modelo' && 'Selecione o modelo'}
            {etapaAtual === 'servico-personalizado' && 'Configure seu serviço personalizado'}
            {etapaAtual === 'medidas' && 'Informe as medidas'}
            {etapaAtual === 'cliente' && 'Dados do cliente'}
            {etapaAtual === 'finalizar' && 'Revisar e finalizar orçamento'}
          </p>
        </div>

        {/* Navegação por Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {etapaAtual === 'categoria' && '1. Categoria'}
                {etapaAtual === 'subcategoria' && '2. Subcategoria'}
                {etapaAtual === 'modelo' && '3. Modelo'}
                {etapaAtual === 'servico-personalizado' && '2. Serviço Personalizado'}
                {etapaAtual === 'medidas' && '4. Medidas'}
                {etapaAtual === 'cliente' && '5. Cliente'}
                {etapaAtual === 'finalizar' && '6. Finalizar'}
              </CardTitle>
              {etapaAtual !== 'categoria' && (
                <Button variant="outline" size="sm" onClick={voltarEtapa}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              )}
            </div>
            {categoriaSelecionada && etapaAtual !== 'categoria' && (
              <CardDescription>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary">{categoriaSelecionada.nome}</Badge>
                  {subcategoriaSelecionada && (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      <Badge variant="secondary">{subcategoriaSelecionada.nome}</Badge>
                    </>
                  )}
                  {modeloSelecionado && (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      <Badge variant="secondary">{modeloSelecionado.nome}</Badge>
                    </>
                  )}
                </div>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {/* ETAPA 1: Categorias */}
            {etapaAtual === 'categoria' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIAS_PADRAO.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => selecionarCategoria(categoria)}
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
            {etapaAtual === 'subcategoria' && categoriaSelecionada && (
              <div className="grid grid-cols-1 gap-3">
                {categoriaSelecionada.subcategorias.map((subcategoria) => (
                  <button
                    key={subcategoria.id}
                    onClick={() => selecionarSubcategoria(subcategoria)}
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

            {/* ETAPA 2B: Serviço Personalizado (Categoria Outros) */}
            {etapaAtual === 'servico-personalizado' && (
              <div className="space-y-6">
                {/* Opção: Novo serviço ou serviço salvo */}
                {servicosSalvos.length > 0 && (
                  <div className="space-y-3">
                    <Label>Deseja usar um serviço já cadastrado?</Label>
                    <RadioGroup
                      value={modoSelecaoServico}
                      onValueChange={(value) => setModoSelecaoServico(value as 'novo' | 'existente')}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="novo" id="novo" />
                        <Label htmlFor="novo" className="cursor-pointer font-normal">
                          Criar novo serviço
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existente" id="existente" />
                        <Label htmlFor="existente" className="cursor-pointer font-normal">
                          Usar serviço salvo
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Lista de serviços salvos */}
                {modoSelecaoServico === 'existente' && servicosSalvos.length > 0 && (
                  <div className="space-y-3">
                    <Label>Selecione um serviço salvo:</Label>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                      {servicosSalvos.map((servico) => (
                        <div
                          key={servico.id}
                          className="group border-2 border-gray-200 rounded-lg p-4 hover:border-black transition-all bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{servico.nomeServico}</h4>
                              {servico.nomeSubcategoria && (
                                <p className="text-sm text-gray-500">{servico.nomeSubcategoria}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                <Badge variant="secondary">
                                  {servico.tipoCobranca === 'fixo' ? 'Valor Fixo' : 'Por m²'}
                                </Badge>
                                <span className="text-sm font-mono font-semibold">
                                  R$ {servico.valorBase.toFixed(2)}
                                  {servico.tipoCobranca === 'por_m2' && '/m²'}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => carregarServicoSalvo(servico)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => excluirServicoSalvo(servico.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulário de novo serviço */}
                {modoSelecaoServico === 'novo' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Categoria "Outros":</strong> Configure manualmente os detalhes do seu serviço.
                        Você pode escolher cobrar um valor fixo ou por metro quadrado.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomeServico">Nome do Serviço *</Label>
                      <Input
                        id="nomeServico"
                        placeholder="Ex: Instalação de Alarme"
                        value={servicoPersonalizado.nomeServico}
                        onChange={(e) =>
                          setServicoPersonalizado({ ...servicoPersonalizado, nomeServico: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomeSubcategoria">Subcategoria (opcional)</Label>
                      <Input
                        id="nomeSubcategoria"
                        placeholder="Ex: Segurança Eletrônica"
                        value={servicoPersonalizado.nomeSubcategoria}
                        onChange={(e) =>
                          setServicoPersonalizado({ ...servicoPersonalizado, nomeSubcategoria: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Tipo de Cobrança *</Label>
                      <RadioGroup
                        value={servicoPersonalizado.tipoCobranca}
                        onValueChange={(value) =>
                          setServicoPersonalizado({ ...servicoPersonalizado, tipoCobranca: value as 'fixo' | 'por_m2' })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixo" id="fixo" />
                          <Label htmlFor="fixo" className="cursor-pointer font-normal">
                            Valor Fixo (valor único para o serviço completo)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="por_m2" id="por_m2" />
                          <Label htmlFor="por_m2" className="cursor-pointer font-normal">
                            Valor por m² (será multiplicado pela área informada)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorBase">
                        {servicoPersonalizado.tipoCobranca === 'fixo' ? 'Valor Total *' : 'Valor por m² *'}
                      </Label>
                      <Input
                        id="valorBase"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 500.00"
                        value={servicoPersonalizado.valorBase}
                        onChange={(e) =>
                          setServicoPersonalizado({ ...servicoPersonalizado, valorBase: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoesServico">Observações (opcional)</Label>
                      <Textarea
                        id="observacoesServico"
                        placeholder="Detalhes adicionais sobre o serviço"
                        value={servicoPersonalizado.observacoes}
                        onChange={(e) =>
                          setServicoPersonalizado({ ...servicoPersonalizado, observacoes: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="salvarParaFuturo"
                        checked={servicoPersonalizado.salvarParaFuturo}
                        onCheckedChange={(checked) =>
                          setServicoPersonalizado({ ...servicoPersonalizado, salvarParaFuturo: checked as boolean })
                        }
                      />
                      <Label htmlFor="salvarParaFuturo" className="cursor-pointer font-normal">
                        Salvar este serviço para uso futuro (somente para você)
                      </Label>
                    </div>

                    <Button onClick={confirmarServicoPersonalizado} className="w-full">
                      <Check className="h-4 w-4 mr-2" />
                      {servicoPersonalizado.tipoCobranca === 'fixo' ? 'Confirmar Serviço' : 'Continuar para Medidas'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 3: Modelos */}
            {etapaAtual === 'modelo' && subcategoriaSelecionada && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subcategoriaSelecionada.modelos
                  .filter((modelo) => modelo.ativo)
                  .map((modelo) => (
                    <button
                      key={modelo.id}
                      onClick={() => selecionarModelo(modelo)}
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

            {/* ETAPA 4: Medidas */}
            {etapaAtual === 'medidas' && modeloSelecionado && (
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
                      type="text"
                      placeholder="Ex: 3.50 ou 2.00"
                      value={largura}
                      onChange={(e) => setLargura(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (metros)</Label>
                    <Input
                      id="altura"
                      type="text"
                      placeholder="Ex: 2.00 ou 2400"
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
                        <p className="text-2xl font-bold text-black">{area.toFixed(2)} m²</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor Total</p>
                        <p className="text-2xl font-bold text-black">R$ {valorTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={confirmarMedidas} className="w-full" disabled={!largura || !altura || area === 0}>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar Medidas
                </Button>
              </div>
            )}

            {/* ETAPA 5: Cliente */}
            {etapaAtual === 'cliente' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <p className="font-semibold">Item adicionado ao orçamento</p>
                  </div>
                  <p className="text-sm text-gray-600">{itens.length} item(ns) no orçamento</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Cliente *</Label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Nome completo"
                      value={dadosCliente.nome}
                      onChange={(e) =>
                        setDadosCliente({ ...dadosCliente, nome: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={dadosCliente.telefone}
                      onChange={(e) =>
                        setDadosCliente({ ...dadosCliente, telefone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      type="text"
                      placeholder="Endereço completo"
                      value={dadosCliente.endereco}
                      onChange={(e) =>
                        setDadosCliente({ ...dadosCliente, endereco: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button onClick={confirmarCliente} className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Continuar para Finalização
                </Button>
              </div>
            )}

            {/* ETAPA 6: Finalizar */}
            {etapaAtual === 'finalizar' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold mb-2">Cliente</h4>
                  <p className="text-sm">
                    <strong>{dadosCliente.nome}</strong>
                  </p>
                  <p className="text-sm text-gray-600">{dadosCliente.telefone}</p>
                  {dadosCliente.endereco && (
                    <p className="text-sm text-gray-600">{dadosCliente.endereco}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Itens do Orçamento</h4>
                  {itens.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{item.modelo}</p>
                          <p className="text-sm text-gray-600">
                            {item.categoria} → {item.subcategoria}
                          </p>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          R$ {item.valorTotal.toFixed(2)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.largura}m × {item.altura}m = {item.area.toFixed(2)}m²
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg">Valor Total</p>
                    <p className="font-bold text-2xl text-black">
                      R$ {itens.reduce((acc, item) => acc + item.valorTotal, 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Informações adicionais sobre o orçamento"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={adicionarMaisItens} className="flex-1">
                    Adicionar Mais Itens
                  </Button>
                  <Button onClick={finalizarOrcamento} className="flex-1">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Finalizar Orçamento
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
