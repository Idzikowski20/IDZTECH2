
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBlogStore } from '@/utils/blog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Helper function to strip HTML tags for excerpts
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const Blog = () => {
  const { posts, loading, fetchPosts } = useBlogStore();
  const [visiblePosts, setVisiblePosts] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts based on search query
  useEffect(() => {
    if (!posts) return;
    
    let results = [...posts];
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(query) || 
        stripHtml(post.excerpt).toLowerCase().includes(query) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPosts(results);
  }, [posts, searchQuery]);

  // Handle showing more posts
  const handleShowMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  // Ensure scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const visiblePostsList = filteredPosts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < filteredPosts.length;

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
            <p className="text-xl text-premium-light/70 mb-8">
              Najnowsze informacje, porady i trendy z świata SEO i tworzenia stron internetowych
            </p>
            
            {/* Search */}
            <div className="mt-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-light/50" size={18} />
                <Input 
                  type="search"
                  placeholder="Szukaj artykułów..."
                  className="pl-10 bg-premium-dark/50 border-premium-light/20 w-full focus:border-premium-purple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Szukaj artykułów"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog posts grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item} 
                  className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden"
                >
                  <div className="relative h-52">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-6">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium">Nie znaleziono artykułów spełniających podane kryteria</h2>
              <p className="text-premium-light/70 mt-2">Spróbuj zmienić kryteria wyszukiwania</p>
              <Button 
                onClick={() => { setSearchQuery(''); }}
                className="mt-4"
                variant="outline"
              >
                Resetuj filtry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visiblePostsList.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden hover:border-premium-light/30 transition-all duration-300"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-premium-light/60 mb-3">
                        <span>{new Date(post.date).toLocaleDateString('pl-PL')}</span>
                        {post.categories && post.categories.length > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.categories[0]}</span>
                          </>
                        )}
                      </div>
                      
                      <Link to={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-bold mb-3 hover:text-premium-purple transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-premium-light/70 mb-4 line-clamp-3">
                        {stripHtml(post.excerpt)}
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
              
              {/* Show More Button */}
              {hasMorePosts && (
                <div className="flex justify-center mt-12">
                  <Button 
                    onClick={handleShowMore} 
                    variant="outline"
                    size="lg"
                    className={cn(
                      "border-premium-light/30 hover:bg-premium-light hover:text-premium-dark",
                      "transition-all duration-300 focus:ring-2 focus:ring-premium-purple/50"
                    )}
                  >
                    Pokaż więcej artykułów
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
