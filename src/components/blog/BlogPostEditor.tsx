import { SEO } from '@/components/SEO';

export function BlogPostEditor({ post }) {
  return (
    <>
      <SEO 
        title={`Edycja: ${post?.title || 'Nowy post'} | IDZTECH`}
        description="Edytor postów blogowych IDZTECH"
      />
      {/* reszta komponentu */}
    </>
  );
} 