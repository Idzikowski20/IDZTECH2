
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './utils/themeContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UIToaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { initGA } from './utils/analytics'
import ScrollToTop from '@/components/ScrollToTop'
import { AuthProvider } from './utils/firebaseAuth.tsx' // Use the Firebase AuthProvider

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
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ScrollToTop />
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
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
