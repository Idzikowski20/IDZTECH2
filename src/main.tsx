
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './utils/themeContext.tsx'
import { AuthProvider } from './utils/AuthProvider.tsx'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UIToaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import LanguageController from '@/components/LanguageController'
import './utils/i18n'
import { initGA } from './utils/analytics'

// Initialize Google Analytics
initGA();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageController />
            <App />
            <UIToaster />
            <SonnerToaster 
              position="top-right"
              richColors
              closeButton
              theme="dark"
            />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
