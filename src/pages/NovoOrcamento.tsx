import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type TipoServico = 'Portão' | 'Estrutura metálica' | 'Toldo' | 'Outro'
type Modelo = 'Portão de correr' | 'Portão basculante' | 'Estrutura simples' | 'Toldo fixo' | 'Toldo retrátil' | 'Outro'

interface Medidas {
  largura: string
  altura: string
  quantidade: string
}

interface DadosCliente {
  nome: string
  telefone: string
  endereco: string
}

interface OrcamentoData {
  tipoServico: TipoServico | ''
  modelo: Modelo | ''
  medidas: Medidas
  valorFinal: number
  cliente: DadosCliente
  observacoes: string
}

export default function NovoOrcamento() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [etapa, setEtapa] = useState(1)
  const [dados, setDados] = useState<OrcamentoData>({
    tipoServico: '',
    modelo: '',
    medidas: { largura: '', altura: '', quantidade: '1' },
    valorFinal: 0,
    cliente: { nome: '', telefone: '', endereco: '' },
    observacoes: ''
  })

  // Helper function para garantir string segura para inputs
  const toSafeInputValue = (value: string | number): string => {
    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value.toString()
    }
    return ''
  }

  const VALOR_POR_M2 = 150

  const tiposServico: TipoServico[] = ['Portão', 'Estrutura metálica', 'Toldo', 'Outro']

  const modelosPorTipo: Record<TipoServico, Modelo[]> = {
    'Portão': ['Portão de correr', 'Portão basculante', 'Outro'],
    'Estrutura metálica': ['Estrutura simples', 'Outro'],
    'Toldo': ['Toldo fixo', 'Toldo retrátil', 'Outro'],
    'Outro': ['Outro']
  }

  const validarMedidas = () => {
    const largura = parseFloat(dados.medidas.largura)
    const altura = parseFloat(dados.medidas.altura)
    const quantidade = parseInt(dados.medidas.quantidade)

    return !isNaN(largura) && largura > 0 &&
           !isNaN(altura) && altura > 0 &&
           !isNaN(quantidade) && quantidade > 0
  }

  const calcularValor = () => {
    const largura = parseFloat(dados.medidas.largura) || 0
    const altura = parseFloat(dados.medidas.altura) || 0
    const quantidade = parseInt(dados.medidas.quantidade) || 1
    const area = largura * altura * quantidade
    return area * VALOR_POR_M2
  }

  const proximaEtapa = () => {
    if (etapa === 1 && !dados.tipoServico) {
      toast({
        title: 'Selecione um tipo de serviço',
        variant: 'destructive'
      })
      return
    }
    if (etapa === 2 && !dados.modelo) {
      toast({
        title: 'Selecione um modelo',
        variant: 'destructive'
      })
      return
    }
    if (etapa === 3) {
      if (!dados.medidas.largura || !dados.medidas.altura || !dados.medidas.quantidade) {
        toast({
          title: 'Preencha todos os campos numéricos antes de avançar',
          variant: 'destructive'
        })
        return
      }
      if (!validarMedidas()) {
        toast({
          title: 'Preencha todos os campos numéricos antes de avançar',
          variant: 'destructive'
        })
        return
      }
      const valor = calcularValor()
      setDados({ ...dados, valorFinal: valor })
    }
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const salvarOrcamento = (status: 'rascunho' | 'enviado') => {
    if (!dados.cliente.nome) {
      toast({
        title: 'Preencha o nome do cliente',
        variant: 'destructive'
      })
      return
    }

    const novoOrcamento = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      cliente: dados.cliente.nome,
      valor: dados.valorFinal,
      status,
      tipoServico: dados.tipoServico,
      modelo: dados.modelo,
      medidas: dados.medidas,
      clienteCompleto: dados.cliente,
      observacoes: dados.observacoes
    }

    const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]')
    orcamentos.push(novoOrcamento)
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos))

    toast({
      title: status === 'enviado' ? 'Orçamento enviado!' : 'Orçamento salvo!',
      description: 'Você pode visualizá-lo na lista de orçamentos'
    })

    navigate('/orcamentos')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/orcamentos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Orçamentos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Orçamento</CardTitle>
          <CardDescription>
            Etapa {etapa} de 4
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Indicador de progresso */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`h-2 flex-1 rounded-full ${
                  num <= etapa ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Etapa 1: Tipo de Serviço */}
          {etapa === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Selecione o tipo de serviço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiposServico.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setDados({ ...dados, tipoServico: tipo, modelo: '' })}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      dados.tipoServico === tipo
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg">{tipo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 2: Modelo */}
          {etapa === 2 && dados.tipoServico && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Selecione o modelo</h2>
              <div className="grid grid-cols-1 gap-4">
                {modelosPorTipo[dados.tipoServico].map((modelo) => (
                  <button
                    key={modelo}
                    onClick={() => setDados({ ...dados, modelo })}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      dados.modelo === modelo
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg">{modelo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 3: Medidas */}
          {etapa === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informe as medidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="largura">Largura (metros)</Label>
                  <Input
                    id="largura"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 3.5"
                    value={toSafeInputValue(dados.medidas.largura)}
                    onChange={(e) => {
                      const valor = e.target.value
                      setDados({
                        ...dados,
                        medidas: { ...dados.medidas, largura: valor }
                      })
                    }}
                    onBlur={(e) => {
                      // Ao sair do campo, limpar se inválido
                      const valor = e.target.value
                      const numero = parseFloat(valor)
                      if (valor === '' || !Number.isFinite(numero) || numero < 0) {
                        setDados({
                          ...dados,
                          medidas: { ...dados.medidas, largura: '' }
                        })
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (metros)</Label>
                  <Input
                    id="altura"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 2.0"
                    value={toSafeInputValue(dados.medidas.altura)}
                    onChange={(e) => {
                      const valor = e.target.value
                      setDados({
                        ...dados,
                        medidas: { ...dados.medidas, altura: valor }
                      })
                    }}
                    onBlur={(e) => {
                      // Ao sair do campo, limpar se inválido
                      const valor = e.target.value
                      const numero = parseFloat(valor)
                      if (valor === '' || !Number.isFinite(numero) || numero < 0) {
                        setDados({
                          ...dados,
                          medidas: { ...dados.medidas, altura: '' }
                        })
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    placeholder="Ex: 1"
                    value={toSafeInputValue(dados.medidas.quantidade)}
                    onChange={(e) => {
                      const valor = e.target.value
                      setDados({
                        ...dados,
                        medidas: { ...dados.medidas, quantidade: valor }
                      })
                    }}
                    onBlur={(e) => {
                      // Ao sair do campo, definir 1 se inválido
                      const valor = e.target.value
                      const numero = parseInt(valor)
                      if (valor === '' || !Number.isFinite(numero) || numero < 1) {
                        setDados({
                          ...dados,
                          medidas: { ...dados.medidas, quantidade: '1' }
                        })
                      }
                    }}
                  />
                </div>
              </div>
              {validarMedidas() && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Área total: {(() => {
                      const largura = parseFloat(dados.medidas.largura)
                      const altura = parseFloat(dados.medidas.altura)
                      const quantidade = parseInt(dados.medidas.quantidade)
                      const area = largura * altura * quantidade

                      if (Number.isFinite(area)) {
                        return area.toFixed(2)
                      }
                      return '0.00'
                    })()} m²
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Etapa 4: Revisão e Cliente */}
          {etapa === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Revisão do Orçamento</h2>

                <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Este valor é uma estimativa inicial. Revise antes de enviar ao cliente.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Tipo de Serviço</div>
                      <div className="font-semibold">{dados.tipoServico}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Modelo</div>
                      <div className="font-semibold">{dados.modelo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Medidas</div>
                      <div className="font-semibold">
                        {(() => {
                          const largura = parseFloat(dados.medidas.largura)
                          const altura = parseFloat(dados.medidas.altura)
                          const quantidade = dados.medidas.quantidade

                          if (Number.isFinite(largura) && Number.isFinite(altura)) {
                            return `${largura.toFixed(2)}m × ${altura.toFixed(2)}m × ${quantidade}`
                          }
                          return 'Não informado'
                        })()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Área Total</div>
                      <div className="font-semibold">
                        {(() => {
                          if (validarMedidas()) {
                            const largura = parseFloat(dados.medidas.largura)
                            const altura = parseFloat(dados.medidas.altura)
                            const quantidade = parseInt(dados.medidas.quantidade)
                            const area = largura * altura * quantidade

                            if (Number.isFinite(area)) {
                              return `${area.toFixed(2)} m²`
                            }
                          }
                          return '0.00 m²'
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="valorFinal">Valor Final (R$)</Label>
                  <Input
                    id="valorFinal"
                    type="number"
                    step="0.01"
                    min="0"
                    value={(() => {
                      // SEMPRE retornar string para o input
                      if (Number.isFinite(dados.valorFinal)) {
                        return dados.valorFinal.toString()
                      }
                      return ''
                    })()}
                    onChange={(e) => {
                      const valor = e.target.value
                      const numero = parseFloat(valor)

                      // Se campo vazio, deixar como string vazia temporariamente
                      if (valor === '') {
                        setDados({ ...dados, valorFinal: 0 })
                        return
                      }

                      // Só atualizar se for número válido
                      if (Number.isFinite(numero) && numero >= 0) {
                        setDados({ ...dados, valorFinal: numero })
                      }
                    }}
                    onBlur={(e) => {
                      // Ao sair do campo, garantir valor válido
                      const valor = e.target.value
                      const numero = parseFloat(valor)

                      if (valor === '' || !Number.isFinite(numero) || numero < 0) {
                        // Se inválido, usar valor calculado automaticamente
                        const valorCalculado = calcularValor()
                        setDados({ ...dados, valorFinal: valorCalculado })
                      }
                    }}
                    className="text-2xl font-bold"
                  />
                  <p className="text-sm text-gray-600">
                    Valor calculado automaticamente: R$ {(() => {
                      const valorCalc = calcularValor()
                      return Number.isFinite(valorCalc) ? valorCalc.toFixed(2) : '0.00'
                    })()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Dados do Cliente</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
                    <Input
                      id="nomeCliente"
                      placeholder="Nome completo"
                      value={dados.cliente.nome}
                      onChange={(e) => setDados({
                        ...dados,
                        cliente: { ...dados.cliente, nome: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={dados.cliente.telefone}
                      onChange={(e) => setDados({
                        ...dados,
                        cliente: { ...dados.cliente, telefone: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      placeholder="Rua, número, bairro"
                      value={dados.cliente.endereco}
                      onChange={(e) => setDados({
                        ...dados,
                        cliente: { ...dados.cliente, endereco: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Detalhes adicionais, informações importantes..."
                      rows={3}
                      value={dados.observacoes}
                      onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="flex items-center justify-between pt-6 border-t">
            {etapa > 1 && (
              <Button variant="outline" onClick={voltarEtapa}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            {etapa < 4 ? (
              <Button onClick={proximaEtapa} className="ml-auto">
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => salvarOrcamento('rascunho')}>
                  Salvar Rascunho
                </Button>
                <Button onClick={() => salvarOrcamento('enviado')}>
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Orçamento
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
