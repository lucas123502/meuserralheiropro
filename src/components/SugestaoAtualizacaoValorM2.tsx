import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SugestaoAtualizacaoValorM2Props {
  modeloNome: string
  valorAtualPorM2: number
  valorCalculadoPorM2: number
  onAtualizar: () => void
  onManter: () => void
}

export default function SugestaoAtualizacaoValorM2({
  modeloNome,
  valorAtualPorM2,
  valorCalculadoPorM2,
  onAtualizar,
  onManter
}: SugestaoAtualizacaoValorM2Props) {
  const diferenca = valorCalculadoPorM2 - valorAtualPorM2
  const percentualDiferenca = valorAtualPorM2 > 0
    ? ((diferenca / valorAtualPorM2) * 100).toFixed(1)
    : '0'
  const aumentou = diferenca > 0

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Sugestão de atualização do valor por m²</CardTitle>
            <CardDescription className="mt-1">
              Com base neste orçamento, você pode atualizar o valor de referência deste modelo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Modelo:</span>
            <Badge variant="secondary">{modeloNome}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Valor atual por m²:</span>
            <span className="font-mono font-semibold">
              R$ {valorAtualPorM2.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Valor calculado neste orçamento:</span>
            <span className="font-mono font-bold text-blue-600">
              R$ {valorCalculadoPorM2.toFixed(2)}
            </span>
          </div>

          {Math.abs(diferenca) > 0.01 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Diferença:</span>
              <Badge
                variant={aumentou ? "default" : "secondary"}
                className={aumentou ? "bg-green-500" : "bg-orange-500"}
              >
                {aumentou ? '+' : ''}{diferenca.toFixed(2)} ({aumentou ? '+' : ''}{percentualDiferenca}%)
              </Badge>
            </div>
          )}
        </div>

        <div className="bg-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <strong>💡 Dica:</strong> Atualizar o valor por m² ajuda o sistema a sugerir preços mais próximos
            da sua realidade em futuros orçamentos. Este valor sempre será editável.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onManter}
            className="flex-1"
          >
            Manter valor atual
          </Button>
          <Button
            onClick={onAtualizar}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Atualizar valor por m²
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
