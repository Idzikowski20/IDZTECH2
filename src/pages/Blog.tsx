
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getAllPosts, BlogPost } from '@/services/blogService';
import { Sparkles } from '@/components/ui/sparkles';
import { useTheme } from '@/utils/themeContext';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // Pobierz posty przy pierwszym ładowaniu
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Zapewnij scroll do góry przy ładowaniu strony
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen bg-premium-dark">
      <Helmet>
        <title>Blog SEO i tworzenia stron internetowych | IDZ.TECH</title>
        <meta name="description" content="Najnowsze informacje, porady i trendy z świata SEO i tworzenia stron internetowych." />
        <meta name="keywords" content="seo, blog seo, pozycjonowanie, strony internetowe" />
        <link rel="canonical" href="https://idz.tech/blog" />
      </Helmet>

      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 relative">
        {/* Light effects */}
        <div className="absolute top-40 left-20 w-24 h-24 bg-premium-purple/60 rounded-full blur-[50px] animate-pulse-slow"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-premium-blue/60 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog SEO</h1>
            <p className="text-xl text-premium-light/70 mb-8">
              Najnowsze informacje, porady i trendy z świata SEO i tworzenia stron internetowych
            </p>
          </div>
        </div>

        <div className="relative -mt-20 h-40 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
          <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40" />
          <Sparkles
            density={800}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            color={theme === "dark" ? "#ffffff" : "#000000"}
          />
        </div>
      </section>
      
      {/* Blog posts grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-premium-light/70 text-lg">Brak postów do wyświetlenia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden hover:border-premium-light/30 transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
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
                      <h3 className="text-xl font-bold mb-3 hover:text-premium-purple transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-premium-light/70 mb-4 line-clamp-3">
                      {post.summary}
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
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
