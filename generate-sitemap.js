const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Ustaw swoje dane Supabase
const SUPABASE_URL = 'https://TWOJ-URL.supabase.co';
const SUPABASE_KEY = 'TWOJ_PUBLICZNY_KLUCZ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://twojadomena.pl'; // <- zmień na swój adres

async function generateSitemap() {
  // Pobierz wszystkie posty
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at');

  if (error) {
    console.error('Błąd pobierania postów:', error);
    process.exit(1);
  }

  // Generuj wpisy do sitemap
  const urls = posts.map(post => `
    <url>
      <loc>${BASE_URL}/blog/${post.slug}</loc>
      <lastmod>${(post.updated_at || new Date()).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  // Szablon sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

  // Zapisz do pliku
  fs.writeFileSync('public/sitemap.xml', sitemap.trim());
  console.log('Sitemap wygenerowana!');
}

generateSitemap();
