import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AboutPage from './AboutPage'
import '../styles/globals.css'

// Entrada da pagina "Quem somos" (quem-somos/index.html)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AboutPage />
  </StrictMode>,
)
