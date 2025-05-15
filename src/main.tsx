
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the initialization function
import { initializeNotifications } from '@/utils/notifications';

// Initialize notifications
initializeNotifications();

createRoot(document.getElementById("root")!).render(<App />);
