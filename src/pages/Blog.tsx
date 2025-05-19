
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
      
      {/* Blog posts grid - Updated design matching reference image */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {isLoadingPosts ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="h-52 w-full rounded-xl mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
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
                <article key={post.id} className="group flex flex-col">
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-xl mb-4">
                    <img 
                      src={post.featured_image || '/placeholder.svg'} 
                      alt={post.title} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </Link>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-premium-purple group-hover:underline transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-400 mb-3 line-clamp-2">
                    {post.excerpt || post.summary || 'Brak opisu'}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="mt-auto inline-flex items-center text-premium-purple font-medium group/link"
                  >
                    <span className="group-hover/link:underline">Czytaj więcej</span>
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </article>
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
