import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, User, Phone, MapPin, Mail, Image, FileDigit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { getSettings, saveSettings } from '@/lib/settings'
import { CompanySettings } from '@/types/settings'

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  responsibleName: z.string().min(1, 'Nome do responsável é obrigatório'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
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
      cnpj: settings.cnpj,
      phone: settings.phone,
      email: settings.email,
      city: settings.city,
      state: settings.state,
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
          Configure as informações da sua empresa
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
              Essas informações aparecerão automaticamente nos orçamentos, catálogos e documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="cnpj">
                CNPJ <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <FileDigit className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cnpj"
                  {...register('cnpj')}
                  placeholder="00.000.000/0000-00"
                  className="pl-9"
                />
              </div>
              {errors.cnpj && (
                <p className="text-sm text-destructive">{errors.cnpj.message}</p>
              )}
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
              Aparecerá automaticamente em orçamentos em PDF e catálogos
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
