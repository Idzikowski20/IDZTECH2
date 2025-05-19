
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';

const Blog = () => {
  const { posts, isLoadingPosts, error } = useBlogPosts();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("Blog component mounted");
  }, []);

  useEffect(() => {
    if (posts) {
      console.log("Posts in component:", posts);
    }
  }, [posts]);

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 relative">
        {/* Light effects */}
        <div className="absolute top-40 left-20 w-24 h-24 bg-premium-purple/60 rounded-full blur-[50px] animate-pulse-slow"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-premium-blue/60 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
        <div className="absolute bottom-40 left-1/2 w-28 h-28 bg-premium-pink/60 rounded-full blur-[55px] animate-pulse-slow delay-300"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog SEO</h1>
            <p className="text-xl text-gray-300 mb-8">
              Najnowsze informacje, porady i trendy z świata SEO i tworzenia stron internetowych
            </p>
          </div>
        </div>
      </section>
      
      {/* Blog posts grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {isLoadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <Skeleton className="h-52 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl mb-4">Wystąpił błąd podczas ładowania postów.</p>
              <p className="mb-4">Spróbuj odświeżyć stronę lub sprawdź połączenie internetowe.</p>
              <Button onClick={() => window.location.reload()} variant="outline">Odśwież stronę</Button>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden hover:border-premium-light/30 transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={post.featured_image || '/placeholder.svg'} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <span>{new Date(post.created_at).toLocaleDateString('pl-PL')}</span>
                      <span className="mx-2">•</span>
                      <span>{post.categories && post.categories[0] || 'SEO'}</span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-3 hover:text-premium-purple transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.summary || post.excerpt || 'Brak opisu'}
                    </p>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent text-premium-purple hover:text-premium-purple/80"
                      >
                        Czytaj więcej <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl mb-4">Brak postów do wyświetlenia.</p>
              <p>Wróć później, gdy pojawią się nowe artykuły.</p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
