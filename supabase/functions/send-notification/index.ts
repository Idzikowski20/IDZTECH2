
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Nagłówki CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Obsługa zapytań CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://apeestymqcpmpdnmccmd.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Używamy klucza service role, aby móc pomijać polityki RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { userId, title, message, type } = await req.json();
    
    // Sprawdzamy, czy użytkownik istnieje
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Błąd podczas pobierania danych użytkownika:', userError);
      throw new Error('Nie znaleziono użytkownika');
    }
    
    // Dodajemy powiadomienie do bazy danych
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type: type || 'info',
        is_read: false,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Błąd podczas tworzenia powiadomienia:', error);
      throw new Error('Błąd podczas tworzenia powiadomienia');
    }

    // W przyszłości możemy tu dodać wysyłkę e-maili poprzez Resend lub inny serwis
    console.log('Powiadomienie utworzono dla użytkownika:', userId);
    console.log('E-mail do wysyłki:', userProfile.email);
    
    return new Response(
      JSON.stringify({ success: true, notification }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Błąd funkcji send-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
