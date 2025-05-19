
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useFirebaseBlogPosts } from '@/hooks/useFirebaseBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatReadingTime } from '@/utils/dateUtils';
import { Helmet } from 'react-helmet-async';

const BlogCategories = () => {
  const categories = ["Wszystkie", "SEO", "Web Development", "Marketing", "E-commerce", "Hosting"];
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  
  return (
    <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
      {categories.map(category => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(category)}
          className={activeCategory === category 
            ? "bg-premium-purple hover:bg-purple-700 hover:text-white" 
            : "hover:bg-premium-light/10 hover:text-white"}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

const Blog = () => {
  const { posts, isLoadingPosts, error } = useFirebaseBlogPosts();

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
      <Helmet>
        <title>Blog o SEO i tworzeniu stron | IDZ.TECH</title>
        <meta name="description" content="Blog o SEO, pozycjonowaniu stron internetowych i tworzeniu stron www. Porady, artykuły i case study." />
      </Helmet>
      
      <Navbar />
      
      {/* Hero section - simplified with CyberFolks style */}
      <section className="pt-32 pb-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Najnowsze informacje, porady i trendy z świata SEO i tworzenia stron internetowych
            </p>
            
            <BlogCategories />
          </div>
        </div>
      </section>
      
      {/* Blog posts grid - CyberFolks style */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {isLoadingPosts ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="group flex flex-col bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden hover:border-premium-light/30 transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="overflow-hidden relative block aspect-[16/9]">
                    <img 
                      src={post.featured_image || '/placeholder.svg'} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {post.categories && post.categories[0] && (
                      <span className="absolute top-4 left-4 bg-premium-purple text-white text-xs px-3 py-1 rounded-full">
                        {post.categories[0]}
                      </span>
                    )}
                  </Link>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatReadingTime(post.content)}
                      </span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-premium-purple transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-400 mb-4 line-clamp-3 flex-grow">
                      {post.summary || post.excerpt || 'Brak opisu'}
                    </p>
                    
                    <Link to={`/blog/${post.slug}`} className="group/link inline-flex items-center text-premium-purple font-medium">
                      <span className="group-hover/link:underline">Czytaj więcej</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover/link:translate-x-1" />
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
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-t border-b border-premium-light/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Potrzebujesz profesjonalnych usług SEO?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Skontaktuj się z nami, aby omówić jak możemy pomóc Twojej stronie osiągnąć lepsze wyniki w wyszukiwarkach.
          </p>
          <Button className="bg-premium-gradient hover:bg-premium-purple hover:text-white">
            Skontaktuj się z nami
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
