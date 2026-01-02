export type CategoriaIdeia = 'Portões' | 'Estruturas Metálicas' | 'Toldos' | 'Outros Serviços'
export type FormatoConteudo = 'Foto' | 'Vídeo' | 'Antes/Depois' | 'Reels' | 'Carrossel'

export interface IdeiaConteudo {
  id: string
  categoria: CategoriaIdeia
  titulo: string
  descricao: string
  formato: FormatoConteudo
  texto?: string // Texto pronto para copiar (opcional)
}

export interface LinkUtil {
  id: string
  titulo: string
  descricao: string
  url: string
  plataforma: 'YouTube' | 'Instagram' | 'TikTok' | 'Outro'
}

export type TipoMensagemWhatsApp =
  | 'Prospecção inicial'
  | 'Apresentação da empresa'
  | 'Envio de orçamento'
  | 'Follow-up'
  | 'Fechamento'
  | 'Pós-venda'

export interface MensagemWhatsApp {
  id: string
  tipo: TipoMensagemWhatsApp
  titulo: string
  texto: string
}
