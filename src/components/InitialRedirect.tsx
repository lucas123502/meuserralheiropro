import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function InitialRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se é a primeira visita
    const hasVisited = localStorage.getItem('hasVisited')

    if (!hasVisited) {
      // Primeira visita - ir para onboarding
      localStorage.setItem('hasVisited', 'true')
      navigate('/onboarding')
    } else {
      // Já visitou - ir direto para orçamentos
      navigate('/orcamentos')
    }
  }, [navigate])

  return null
}
