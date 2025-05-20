import { db } from '@/integrations/firebase/client';
import { collection, getDocs } from 'firebase/firestore';

export async function generateSitemap() {
  const posts = await getDocs(collection(db, 'blog_posts'));
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://premiumdigitalharvest.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${posts.docs.map(post => `
        <url>
          <loc>https://premiumdigitalharvest.com/blog/${post.id}</loc>
          <lastmod>${post.data().updated_at || post.data().created_at}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;

  return sitemap;
}

// Funkcja do zapisywania sitemap.xml
export async function saveSitemap(baseUrl: string) {
  try {
    const sitemap = await generateSitemap()
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
