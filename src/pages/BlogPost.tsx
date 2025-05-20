import React, { useEffect, useState, useRef } from 'react';
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
  const [formattedContent, setFormattedContent] = useState('');
  
  // Extract headings for table of contents
  useEffect(() => {
    if (post?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;

      // Dodaj styl i id do h2 oraz odstępy do p
      tempDiv.querySelectorAll('h2').forEach((h2, i) => {
        h2.classList.add('text-2xl', 'font-bold', 'mt-10', 'mb-4', 'scroll-mt-24');
        if (!h2.id && h2.textContent) {
          h2.id = h2.textContent.toLowerCase().replace(/\s+/g, '-');
        }
      });
      tempDiv.querySelectorAll('p').forEach(p => {
        p.classList.add('mb-6', 'text-base');
      });

      // Spis treści
      const headings = Array.from(tempDiv.querySelectorAll('h2, h3'));
      const toc = headings.map(heading => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
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
      // Ustaw sformatowaną treść
      setFormattedContent(tempDiv.innerHTML);
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
        <div className="mx-auto max-w-3xl px-4 flex flex-col gap-10">
          {/* Article content */}
          <div className="w-full">
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
              <div dangerouslySetInnerHTML={{ __html: formattedContent || post.content }} />
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
                   {/* CTA Box */}
                  <div className="mt-[10px] bg-gradient-to-br from-premium-purple/20 to-indigo-900/20 border border-premium-light/10 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-lg mb-3">Potrzebujesz pomocy z SEO?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Skorzystaj z naszych usług profesjonalnego pozycjonowania stron internetowych
                </p>
                <Button className="bg-premium-gradient hover:bg-premium-purple hover:text-white">
                  Skontaktuj się z nami
                </Button>
              </div>
            </div>
            
            <Separator className="my-12" />
            
          </div>
         
        </div>
        {/* Powiązane artykuły - slider */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16 mx-auto max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-6">Powiązane artykuły</h2>
            <RelatedSlider posts={relatedPosts} />
          </section>
        )}
      </div>
      
      
      <Footer />
    </div>
  );
};

function RelatedSlider({ posts }) {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({ left: dir * (width * 0.8), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-premium-dark/80 hover:bg-premium-purple text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        aria-label="Poprzedni"
        style={{ left: '-20px' }}
      >
        &#8592;
      </button>
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {posts.map((rp) => (
          <a
            key={rp.id}
            href={`/blog/${rp.slug}`}
            className="min-w-[320px] max-w-[320px] w-[320px]  rounded-2xl flex-shrink-0 flex flex-col items-center p-4 transition hover:scale-105 hover:shadow-xl duration-200"
            style={{ scrollSnapAlign: 'start' }}
          >
            {rp.featured_image && (
              <img
                src={rp.featured_image}
                alt={rp.title}
                className="rounded-xl w-full h-32 object-cover mb-3"
              />
            )}
            <div className="font-semibold text-lg text-center mb-2 line-clamp-2">{rp.title}</div>
            <div className="text-sm text-gray-400 text-center mb-2">
              {rp.excerpt && rp.excerpt.length > 100
                ? rp.excerpt.slice(0, 100).replace(/\s+\S*$/, '') + '...'
                : rp.excerpt}
            </div>
          </a>
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-premium-dark/80 hover:bg-premium-purple text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        aria-label="Następny"
        style={{ right: '-20px' }}
      >
        &#8594;
      </button>
    </div>
  );
}

export default BlogPost;
