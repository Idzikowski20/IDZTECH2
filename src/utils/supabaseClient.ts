
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apeestymqcpmpdnmccmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZWVzdHltcWNwbXBkbm1jY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTQxMzYsImV4cCI6MjA2MjQ5MDEzNn0.JP4TXteB44O23CDlqf7J0wIawGFsxK0Z_W5_hnIXC0k';

// Create Supabase client with retry options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'web-app',
    },
  },
  // Add in error handling and retries for network issues
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Add global error handler for Supabase connection issues
window.addEventListener('online', () => {
  console.log('Network connection restored, reconnecting to Supabase');
  // Force refresh auth session when connection is restored
  supabase.auth.refreshSession();
});
