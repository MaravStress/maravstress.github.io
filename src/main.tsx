import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/Frontend/ThemeProvider.tsx'
import { DataProvider } from './context/DataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="saas-theme">
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </StrictMode>,
)
