import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, Tag, Share2, MessageSquare, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatReadingTime } from '@/utils/dateUtils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/AuthProvider';
import CommentSection from '@/components/blog/CommentSection';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { useFirebaseBlogPosts } from '@/hooks/useFirebaseBlogPosts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get blog data
  const { getPost, posts } = useFirebaseBlogPosts();
  const { post, isLoading, error } = getPost(slug || '');
  
  // States
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Extract headings for table of contents
  useEffect(() => {
    if (post?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;
      
      const headings = Array.from(tempDiv.querySelectorAll('h2, h3'));
      const toc = headings.map(heading => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        // If no ID, add one to the actual content
        if (!heading.id && heading.textContent) {
          heading.id = id;
        }
        return {
          id,
          text: heading.textContent || '',
          level: heading.tagName === 'H2' ? 2 : 3
        };
      });
      
      setTableOfContents(toc);
    }
  }, [post?.content]);
  
  // Setup intersection observer for headings
  useEffect(() => {
    if (tableOfContents.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: '-100px 0px -80% 0px' }
      );
      
      tableOfContents.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) observer.observe(element);
      });
      
      return () => {
        tableOfContents.forEach(heading => {
          const element = document.getElementById(heading.id);
          if (element) observer.unobserve(element);
        });
      };
    }
  }, [tableOfContents]);
  
  // Redirect if post not found
  useEffect(() => {
    if (!isLoading && !post && posts?.length > 0) {
      navigate('/blog');
      toast({
        title: "Post nie istnieje",
        description: "Nie znaleziono posta o podanym adresie URL",
        variant: "destructive"
      });
    }
  }, [post, posts, isLoading, navigate, toast]);
  
  // Pobierz wszystkie posty z Firestore
  const relatedPosts = post && posts ? posts.filter(p => p.id !== post.id).slice(0, 3) : [];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-32">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-premium-dark">
      <Helmet>
        <title>{post.title} | IDZ.TECH Blog</title>
        <meta name="description" content={post.excerpt || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>
      
      <Navbar />
      
      <div className="pt-32 pb-20">
        {/* Main content */}
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-10">
          {/* Article content */}
          <div className="lg:w-2/3">
            {/* Back button */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/blog')}
                className="text-premium-light/70 hover:text-white hover:bg-premium-light/10"
                size="sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Wróć do bloga
              </Button>
            </div>
            
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-3 space-x-2">
                {post.categories.map(category => (
                  <Badge key={category} className="bg-premium-purple hover:bg-premium-purple/80">{category}</Badge>
                ))}
              </div>
            )}
            
            {/* Post header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-premium-light/70 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{formatReadingTime(post.content)}</span>
                </div>
                
                <div className="flex items-center">
                  <Eye size={16} className="mr-2" />
                  <span>0 wyświetleń</span>
                </div>
              </div>
            </header>
            
            {/* Featured image */}
            {post.featured_image && (
              <div className="mb-8">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-auto rounded-lg object-cover max-h-[500px]" 
                />
              </div>
            )}
            
            {/* Mobile table of contents */}
            {tableOfContents.length > 0 && (
              <div className="mb-8 lg:hidden bg-premium-dark/50 border border-premium-light/10 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Spis treści</h3>
                <ul className="space-y-2">
                  {tableOfContents.map(heading => (
                    <li 
                      key={heading.id}
                      className={cn(
                        "transition-colors",
                        heading.level === 3 ? "ml-4" : "",
                        activeSection === heading.id ? "text-premium-purple font-medium" : "text-gray-400"
                      )}
                    >
                      <a 
                        href={`#${heading.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Post content */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-2">Z tego artykułu dowiesz się, że:</h2>
              <ul className="list-disc pl-6">
                {tableOfContents.map(heading => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`} className="text-premium-purple hover:underline">{heading.text}</a>
                  </li>
                ))}
              </ul>
            </section>
            
            <article className="prose prose-invert prose-premium max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} />
                  <span className="font-medium">Tagi:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-premium-light/5 hover:bg-premium-light/10 hover:text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Share section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={16} />
                <span className="font-medium">Udostępnij:</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-blue-600 hover:text-white">
                  <Facebook size={18} />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-sky-500 hover:text-white">
                  <Twitter size={18} />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-blue-700 hover:text-white">
                  <Linkedin size={18} />
                </Button>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* Comments section */}
              {/* Author info */}
              <div className="bg-premium-dark/50 border border-premium-light/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-premium-gradient">
                      A
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">Autor</div>
                    <div className="text-sm text-premium-light/70">
                      {post['author_id'] ? post['author_id'] : "Brak autora"}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Agencja SEO i tworzenia stron internetowych z wieloletnim doświadczeniem w branży.
                </p>
                <Button variant="outline" size="sm" className="w-full hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black">
                  Zobacz wszystkie posty
                </Button>
              </div>
          </div>
          
          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">

              
              {/* Table of contents - Desktop */}
              {tableOfContents.length > 0 && (
                <div className="hidden lg:block bg-premium-dark/50 border border-premium-light/10 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Spis treści</h3>
                  <ul className="space-y-3">
                    {tableOfContents.map(heading => (
                      <li 
                        key={heading.id}
                        className={cn(
                          "transition-colors",
                          heading.level === 3 ? "ml-3 text-sm" : "font-medium",
                          activeSection === heading.id ? "text-premium-purple" : "text-gray-400"
                        )}
                      >
                        <a 
                          href={`#${heading.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Related posts */}
              <section>
                <h2>Powiązane artykuły</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedPosts?.map(rp => (
                    <Link to={`/blog/${rp.slug}`} key={rp.id} className="block">
                      <img src={rp.featured_image} alt={rp.title} className="rounded-lg w-full h-32 object-cover mb-2" />
                      <div className="font-semibold">{rp.title}</div>
                      <div className="text-sm text-gray-400">{rp.excerpt}</div>
                    </Link>
                  ))}
                </div>
              </section>
              
              {/* CTA Box */}
              <div className="bg-gradient-to-br from-premium-purple/20 to-indigo-900/20 border border-premium-light/10 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-lg mb-3">Potrzebujesz pomocy z SEO?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Skorzystaj z naszych usług profesjonalnego pozycjonowania stron internetowych
                </p>
                <Button className="bg-premium-gradient hover:bg-premium-purple hover:text-white">
                  Skontaktuj się z nami
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      
      <Footer />
    </div>
  );
};

export default BlogPost;
