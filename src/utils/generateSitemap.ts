
import { supabase } from '@/integrations/supabase/client'

export async function generateSitemap(baseUrl: string) {
  // Pobierz wszystkie opublikowane posty
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Błąd podczas pobierania postów do sitemap:', error)
    return null
  }

  // Generuj XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return xml
}

// Funkcja do zapisywania sitemap.xml
export async function saveSitemap(baseUrl: string) {
  try {
    const sitemap = await generateSitemap(baseUrl)
    if (!sitemap) return

    // Zapisz sitemap.xml w katalogu public
    const response = await fetch('/api/save-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sitemap })
    })

    if (!response.ok) {
      throw new Error('Błąd podczas zapisywania sitemap.xml')
    }
  } catch (error) {
    console.error('Błąd podczas generowania sitemap.xml:', error)
  }
} 
