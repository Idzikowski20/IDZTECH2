
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the notification store
import { useNotifications } from '@/utils/notifications';

// Trigger initial load of notifications
useNotifications.getState().fetchNotifications();

createRoot(document.getElementById("root")!).render(<App />);
