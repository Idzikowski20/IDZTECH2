import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Updated BlogPost interface to remove updated_at and author_id
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string | null;
  categories: string[] | null;
  tags: string[] | null;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, content, featured_image, excerpt, categories, tags, created_at')
      .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPosts(data);
      } else {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
          </div>
        </div>
      </section>
      
      {/* Blog posts grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center text-premium-light/70 py-12">Ładowanie postów...</div>
            ) : posts.length === 0 ? (
              <div className="col-span-3 text-center text-premium-light/70 py-12">Brak postów do wyświetlenia.</div>
            ) : posts.map((post) => (
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
                    <span>{new Date(post.created_at).toLocaleDateString('pl-PL')}</span>
                    <span className="mx-2">•</span>
                    <span>{post.categories && post.categories[0] || 'SEO'}</span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-3 hover:text-premium-purple transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-premium-light/70 mb-4 line-clamp-3">
                    {post.excerpt}
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
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
