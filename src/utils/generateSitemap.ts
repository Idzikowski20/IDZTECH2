import { db } from '@/integrations/firebase/client';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getCachedSitemap, clearSitemapCache } from './seoUtils';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://idztech.pl';

// Statyczne strony
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/tworzenie-stron-www', priority: 0.9, changefreq: 'monthly' },
  { path: '/tworzenie-sklepow-internetowych', priority: 0.9, changefreq: 'monthly' },
  { path: '/pozycjonowanie-stron-internetowych', priority: 0.9, changefreq: 'monthly' },
  { path: '/pozycjonowanie-lokalne', priority: 0.8, changefreq: 'monthly' },
  { path: '/audyt-seo', priority: 0.8, changefreq: 'monthly' },
  { path: '/optymalizacja-seo', priority: 0.8, changefreq: 'monthly' },
  { path: '/copywriting-seo', priority: 0.8, changefreq: 'monthly' },
  { path: '/content-plan', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/about-us', priority: 0.6, changefreq: 'monthly' },
  { path: '/projects', priority: 0.8, changefreq: 'monthly' }
];

export async function generateSitemap() {
  // Pobierz tylko opublikowane posty
  const postsRef = collection(db, 'blog_posts');
  const q = query(postsRef, where('published', '==', true));
  const posts = await getDocs(q);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
${posts.docs.map(post => {
  const data = post.data();
  const lastmod = data.updated_at || data.created_at || new Date().toISOString();
  return `
  <url>
    <loc>${SITE_URL}/blog/${data.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('')}
</urlset>`;

  return sitemap;
}

// Funkcja do zapisywania sitemap.xml
export async function saveSitemap() {
  try {
    // Użyj cache'owanej wersji sitemap
    const sitemap = await getCachedSitemap(generateSitemap);
    if (!sitemap) return;

    // Zapisz sitemap.xml w katalogu public
    const response = await fetch('/api/save-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sitemap })
    });

    if (!response.ok) {
      throw new Error('Błąd podczas zapisywania sitemap.xml');
    }
  } catch (error) {
    console.error('Błąd podczas generowania sitemap.xml:', error);
  }
}

// Funkcja do generowania sitemap podczas builda
export async function generateSitemapDuringBuild() {
  try {
    const sitemap = await generateSitemap();
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Upewnij się, że katalog public istnieje
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Zapisz sitemap.xml
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Sitemap.xml wygenerowany podczas builda');

    // Wyczyść cache po wygenerowaniu
    clearSitemapCache();
  } catch (error) {
    console.error('Błąd podczas generowania sitemap.xml podczas builda:', error);
  }
}
