
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './utils/themeContext.tsx'
import { AuthProvider } from './utils/AuthProvider.tsx'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import LanguageController from '@/components/LanguageController'
import './utils/i18n'

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
      <ThemeProvider defaultTheme="dark" storageKey="idztech-ui-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageController />
            <App />
            <Toaster />
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
