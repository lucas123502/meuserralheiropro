import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import MainLayout from '@/components/layout/MainLayout'
import InitialRedirect from '@/components/InitialRedirect'
import Orcamentos from '@/pages/Orcamentos'
import NovoOrcamento from '@/pages/NovoOrcamento'
import Pedidos from '@/pages/Pedidos'
import Financeiro from '@/pages/Financeiro'
import Clientes from '@/pages/Clientes'
import Ideias from '@/pages/Ideias'
import Catalogos from '@/pages/Catalogos'
import Relatorios from '@/pages/Relatorios'
import HelpSupport from '@/pages/HelpSupport'
import Onboarding from '@/pages/Onboarding'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<InitialRedirect />} />
            <Route path="orcamentos" element={<Orcamentos />} />
            <Route path="orcamentos/novo" element={<NovoOrcamento />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="ideias" element={<Ideias />} />
            <Route path="catalogos" element={<Catalogos />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="ajuda" element={<HelpSupport />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
