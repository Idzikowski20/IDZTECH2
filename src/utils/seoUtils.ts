import { BlogPost } from '@/types/blog';

// Cache dla sitemap.xml
let sitemapCache: string | null = null;
let lastCacheUpdate: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 godzina

// Generowanie meta tagów dla posta
export function generateMetaTags(post: BlogPost) {
  return {
    title: `${post.title} | IDZTECH`,
    description: post.excerpt || post.summary || 'Artykuł na blogu IDZTECH',
    openGraph: {
      title: post.title,
      description: post.excerpt || post.summary,
      type: 'article',
      url: `https://idztech.pl/blog/${post.slug}`,
      image: post.featured_image,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: ['IDZTECH'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.summary,
      image: post.featured_image,
    }
  };
}

// Generowanie JSON-LD dla posta
export function generateJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.summary,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'IDZTECH',
      url: 'https://idztech.pl'
    },
    publisher: {
      '@type': 'Organization',
      name: 'IDZTECH',
      logo: {
        '@type': 'ImageObject',
        url: 'https://idztech.pl/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://idztech.pl/blog/${post.slug}`
    }
  };
}

// Funkcja do cache'owania sitemap
export async function getCachedSitemap(generateSitemap: () => Promise<string>): Promise<string> {
  const now = Date.now();
  
  // Jeśli cache jest ważny, zwróć go
  if (sitemapCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return sitemapCache;
  }
  
  // Generuj nowy sitemap
  try {
    sitemapCache = await generateSitemap();
    lastCacheUpdate = now;
    return sitemapCache;
  } catch (error) {
    console.error('Błąd podczas generowania sitemap:', error);
    // Jeśli generowanie się nie powiedzie, a mamy stary cache, użyj go
    if (sitemapCache) {
      return sitemapCache;
    }
    throw error;
  }
}

// Funkcja do czyszczenia cache
export function clearSitemapCache() {
  sitemapCache = null;
  lastCacheUpdate = 0;
} 