
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/utils/themeContext';
import { AuthProvider } from '@/utils/AuthProvider';

const root = createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
