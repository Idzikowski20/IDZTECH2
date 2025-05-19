import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";
import { integrateAuth, registerUser, loginUser, updateUserProfile } from "./authIntegration";

// Re-export the auth hook and provider from firebaseAuth
export { useAuth, AuthProvider } from './firebaseAuth';
