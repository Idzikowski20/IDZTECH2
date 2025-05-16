import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://apeestymqcpmpdnmccmd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZWVzdHltcWNwbXBkbm1jY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTQxMzYsImV4cCI6MjA2MjQ5MDEzNn0.JP4TXteB44O23CDlqf7J0wIawGFsxK0Z_W5_hnIXC0k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);