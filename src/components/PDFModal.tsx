import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface PDFModalProps {
  open: boolean
  onClose: () => void
  pdfUrl: string
  titulo: string
}

export default function PDFModal({ open, onClose, pdfUrl, titulo }: PDFModalProps) {
  // Limpar URL ao fechar para evitar memory leak
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle>Visualizar PDF - {titulo}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Visualização do PDF"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allow="fullscreen"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
