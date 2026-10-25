import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AreasPage from './AreasPage'
import '../styles/globals.css'

// Entrada da pagina "Areas atendidas" (areas-atendidas/index.html)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AreasPage />
  </StrictMode>,
)
