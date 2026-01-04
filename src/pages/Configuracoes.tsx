import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, User, Phone, MapPin, Mail, Image, DollarSign, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { getSettings, saveSettings } from '@/lib/settings'
import { CompanySettings } from '@/types/settings'

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  responsibleName: z.string().min(1, 'Nome do responsável é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  pricePerSquareMeter: z.number().min(0, 'Valor deve ser positivo'),
  defaultObservation: z.string().optional(),
  pdfFooter: z.string().optional(),
  defaultExecutionTime: z.string().optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function Configuracoes() {
  const { toast } = useToast()
  const [logo, setLogo] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  })

  // Carregar configurações ao montar
  useEffect(() => {
    const settings = getSettings()
    reset({
      companyName: settings.companyName,
      responsibleName: settings.responsibleName,
      phone: settings.phone,
      city: settings.city,
      state: settings.state,
      email: settings.email,
      pricePerSquareMeter: settings.pricePerSquareMeter,
      defaultObservation: settings.defaultObservation,
      pdfFooter: settings.pdfFooter,
      defaultExecutionTime: settings.defaultExecutionTime,
    })
    setLogo(settings.logo)
  }, [reset])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, selecione uma imagem PNG ou JPG',
        variant: 'destructive',
      })
      return
    }

    // Converter para base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogo(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogo(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = (data: SettingsFormData) => {
    const settings: CompanySettings = {
      ...data,
      logo,
      email: data.email || undefined,
      defaultObservation: data.defaultObservation || undefined,
      pdfFooter: data.pdfFooter || undefined,
      defaultExecutionTime: data.defaultExecutionTime || undefined,
    }

    saveSettings(settings)

    toast({
      title: 'Configurações salvas',
      description: 'Suas informações foram atualizadas com sucesso',
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Personalize as informações da sua empresa e parâmetros do sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Essas informações aparecerão nos orçamentos e documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Nome da Empresa <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="Ex: Serralheria Silva"
                    className="pl-9"
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleName">
                  Nome do Responsável <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="responsibleName"
                    {...register('responsibleName')}
                    placeholder="Ex: João Silva"
                    className="pl-9"
                  />
                </div>
                {errors.responsibleName && (
                  <p className="text-sm text-destructive">{errors.responsibleName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefone (WhatsApp) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="(00) 00000-0000"
                    className="pl-9"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="contato@exemplo.com"
                    className="pl-9"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Cidade <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Ex: São Paulo"
                    className="pl-9"
                  />
                </div>
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Ex: SP"
                  maxLength={2}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo da Empresa
            </CardTitle>
            <CardDescription>
              Adicione o logo que aparecerá nos orçamentos em PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1 space-y-2">
                <Label htmlFor="logo">Selecionar Logo</Label>
                <Input
                  id="logo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PNG, JPG (máx. 5MB)
                </p>
              </div>

              {logo && (
                <div className="flex flex-col items-center gap-2">
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <img
                      src={logo}
                      alt="Logo da empresa"
                      className="max-h-24 max-w-[200px] object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    Remover
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parâmetros de Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Parâmetros de Orçamento
            </CardTitle>
            <CardDescription>
              Configure valores padrão para novos orçamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerSquareMeter">
                Valor Base por m² <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pricePerSquareMeter"
                  type="number"
                  step="0.01"
                  {...register('pricePerSquareMeter', { valueAsNumber: true })}
                  placeholder="150.00"
                  className="pl-9"
                />
              </div>
              {errors.pricePerSquareMeter && (
                <p className="text-sm text-destructive">{errors.pricePerSquareMeter.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Esse valor será usado como base nos novos orçamentos
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultObservation">Observação Padrão do Orçamento</Label>
              <Textarea
                id="defaultObservation"
                {...register('defaultObservation')}
                placeholder="Ex: Materiais inclusos, mão de obra especializada..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Texto que aparecerá automaticamente em novos orçamentos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações para PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações para PDF
            </CardTitle>
            <CardDescription>
              Personalize o rodapé e informações dos orçamentos em PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdfFooter">Texto do Rodapé</Label>
              <Textarea
                id="pdfFooter"
                {...register('pdfFooter')}
                placeholder="Ex: Garantia de 12 meses. Pagamento: 50% entrada + 50% na entrega."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Informações sobre garantia, pagamento, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultExecutionTime">
                <Clock className="inline h-4 w-4 mr-1" />
                Prazo Padrão de Execução
              </Label>
              <Input
                id="defaultExecutionTime"
                {...register('defaultExecutionTime')}
                placeholder="Ex: 15 dias úteis"
              />
              <p className="text-xs text-muted-foreground">
                Prazo estimado que aparecerá nos orçamentos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg">
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  )
}
