export const API_URL = import.meta.env.PROD 
  ? 'https://idztech.onrender.com' 
  : (import.meta.env.VITE_API_URL || 'https://idztech.onrender.com'); 