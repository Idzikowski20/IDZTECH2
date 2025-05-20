
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBSITE_URL = 'https://idz.tech'
const SITEMAP_PATH = '/sitemap.xml'

serve(async (req) => {
  // Konfiguracja CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  
  // Obsługa CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Utwórz klienta Supabase z zmiennych środowiskowych
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Pobierz dane z żądania
    const { slug } = await req.json()
    
    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Slug is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }
    
    // Pobierz wszystkie posty blogowe, aby zaktualizować sitemap
    const { data: posts, error } = await supabaseClient
      .from('blog_posts')
      .select('slug')
    
    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
    
    // Pobierz aktualną zawartość sitemap.xml z pliku publicznego
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${WEBSITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${WEBSITE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    
    // Dodaj stałe strony
    const staticPages = [
      'tworzenie-stron-www',
      'tworzenie-sklepow-internetowych',
      'pozycjonowanie-stron-internetowych',
      'pozycjonowanie-lokalne',
      'audyt-seo',
      'optymalizacja-seo',
      'copywriting-seo',
      'content-plan',
      'contact',
      'about-us',
      'projects'
    ]
    
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${WEBSITE_URL}/${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === 'contact' ? '0.7' : '0.8'}</priority>
  </url>`
    })
    
    // Dodaj wszystkie posty blogowe
    posts?.forEach(post => {
      sitemap += `
  <url>
    <loc>${WEBSITE_URL}/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })
    
    // Zakończ sitemap
    sitemap += `
</urlset>
`
    
    // Zapisz zaktualizowany sitemap.xml do storage
    const { error: storageError } = await supabaseClient
      .storage
      .from('public')
      .upload('sitemap.xml', sitemap, {
        contentType: 'application/xml',
        cacheControl: '3600',
        upsert: true
      })
    
    if (storageError) {
      console.error('Error saving sitemap to storage:', storageError)
      throw storageError
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Sitemap updated successfully' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
})
