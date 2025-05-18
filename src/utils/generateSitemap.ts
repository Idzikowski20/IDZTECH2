
import { supabase } from '../lib/supabase';

// Define a type for blog posts
interface BlogPost {
  slug: string;
  updated_at: string;
}

export async function generateSitemap(baseUrl: string) {
  // Attempt to fetch all published posts
  try {
    // Get the posts from Supabase
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts for sitemap:', error);
      return generateFallbackSitemap(baseUrl);
    }

    return generateSitemapXml(baseUrl, posts || []);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return generateFallbackSitemap(baseUrl);
  }
}

function generateSitemapXml(baseUrl: string, posts: BlogPost[]) {
  // Generate XML
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
</urlset>`;

  return xml;
}

function generateFallbackSitemap(baseUrl: string) {
  // If we can't get posts, return a simple sitemap with just the main pages
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
}

// Function to save sitemap.xml
export async function saveSitemap(baseUrl: string) {
  try {
    const sitemap = await generateSitemap(baseUrl);
    if (!sitemap) return;

    // In a client-side app, we would typically call an API to save the sitemap
    console.log('Generated sitemap:', sitemap);
    // The actual save to file would happen on the server
  } catch (error) {
    console.error('Error generating sitemap.xml:', error);
  }
}
