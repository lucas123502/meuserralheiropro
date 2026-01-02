import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Users, Phone, MapPin } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Cliente, ClienteFormData } from '@/types/cliente'

export default function Clientes() {
  const { toast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [formData, setFormData] = useState<ClienteFormData>({
    nome: '',
    telefone: '',
    endereco: ''
  })

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = () => {
    const saved = localStorage.getItem('clientes')
    if (saved) {
      setClientes(JSON.parse(saved))
    }
  }

  const contarOrcamentos = (clienteId: string): number => {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]')
    return orcamentos.filter((orc: any) => orc.clienteId === clienteId).length
  }

  const salvarCliente = () => {
    if (!formData.nome.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Preencha o nome do cliente',
        variant: 'destructive'
      })
      return
    }

    const novoCliente: Cliente = {
      id: Date.now().toString(),
      nome: formData.nome.trim(),
      telefone: formData.telefone.trim(),
      endereco: formData.endereco.trim(),
      criadoEm: new Date().toISOString()
    }

    const clientesAtualizados = [...clientes, novoCliente]
    localStorage.setItem('clientes', JSON.stringify(clientesAtualizados))
    setClientes(clientesAtualizados)

    toast({
      title: 'Cliente cadastrado!',
      description: `${novoCliente.nome} foi adicionado com sucesso`
    })

    setFormData({ nome: '', telefone: '', endereco: '' })
    setDialogAberto(false)
  }

  if (clientes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo cliente à sua base
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    placeholder="Rua, número, bairro"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>
                <Button onClick={salvarCliente} className="w-full">
                  Salvar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Você ainda não tem clientes cadastrados
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Cadastre clientes para reutilizar suas informações em orçamentos e pedidos
            </p>
            <Button size="lg" onClick={() => setDialogAberto(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Cliente</DialogTitle>
              <DialogDescription>
                Adicione um novo cliente à sua base
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, bairro"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>
              <Button onClick={salvarCliente} className="w-full">
                Salvar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {clientes.map((cliente) => {
          const qtdOrcamentos = contarOrcamentos(cliente.id)

          return (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cliente.nome}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      {cliente.telefone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {cliente.telefone}
                        </div>
                      )}
                      {cliente.endereco && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {cliente.endereco}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {qtdOrcamentos}
                    </div>
                    <div className="text-sm text-gray-600">
                      {qtdOrcamentos === 1 ? 'orçamento' : 'orçamentos'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
