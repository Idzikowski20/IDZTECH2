import { Helmet } from 'react-helmet-async';
import { generateMetaTags, generateJsonLd } from '@/utils/seoUtils';
import { BlogPost } from '@/types/blog';

interface SEOProps {
  post?: BlogPost;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ post, title, description, image, url }: SEOProps) {
  // Jeśli mamy post, użyj jego danych
  const metaTags = post ? generateMetaTags(post) : {
    title: title || 'IDZTECH - Tworzymy najlepsze strony internetowe',
    description: description || 'IDZTECH to nowoczesne strony internetowe, aplikacje webowe i sklepy internetowe oraz profesjonalne pozycjonowanie SEO.',
    openGraph: {
      title: title || 'IDZTECH - Tworzymy najlepsze strony internetowe',
      description: description || 'IDZTECH to nowoczesne strony internetowe, aplikacje webowe i sklepy internetowe oraz profesjonalne pozycjonowanie SEO.',
      type: 'website',
      url: url || 'https://idztech.pl',
      image: image || 'https://idztech.pl/public/banner.png',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'IDZTECH - Tworzymy najlepsze strony internetowe',
      description: description || 'IDZTECH to nowoczesne strony internetowe, aplikacje webowe i sklepy internetowe oraz profesjonalne pozycjonowanie SEO.',
      image: image || 'https://idztech.pl/public/banner.png',
    }
  };

  // Generuj JSON-LD tylko dla postów
  const jsonLd = post ? generateJsonLd(post) : null;

  return (
    <Helmet>
      {/* Podstawowe meta tagi */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />

      {/* Open Graph */}
      <meta property="og:title" content={metaTags.openGraph.title} />
      <meta property="og:description" content={metaTags.openGraph.description} />
      <meta property="og:type" content={metaTags.openGraph.type} />
      <meta property="og:url" content={metaTags.openGraph.url} />
      <meta property="og:image" content={metaTags.openGraph.image} />
      {post?.published_at && <meta property="article:published_time" content={post.published_at} />}
      {post?.updated_at && <meta property="article:modified_time" content={post.updated_at} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      <meta name="twitter:image" content={metaTags.twitter.image} />

      {/* Canonical URL */}
      <link rel="canonical" href={metaTags.openGraph.url} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
} 