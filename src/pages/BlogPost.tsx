
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getPostBySlug, getAuthorById, BlogPost, BlogAuthor } from '@/services/blogService';
import { useTheme } from '@/utils/themeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<BlogAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);
        
        if (!postData) {
          // Post nie został znaleziony
          setLoading(false);
          return;
        }
        
        setPost(postData);
        
        // Pobierz dane autora
        if (postData.author_id) {
          const authorData = await getAuthorById(postData.author_id);
          setAuthor(authorData);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // Przewiń stronę na górę
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 pb-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 pb-24 text-center">
          <h1 className="text-3xl font-bold mb-6">Post nie został znaleziony</h1>
          <p className="mb-8 text-premium-light/70">Przepraszamy, ale szukany post nie istnieje.</p>
          <Button onClick={() => navigate('/blog')} className="bg-premium-gradient">
            Wróć do bloga
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Dane autora - użyj dostępnych informacji lub fallback
  const authorDisplayName = author?.name || "IDZ.TECH";
  const authorInitial = authorDisplayName.charAt(0);
  const authorProfilePicture = author?.profilePicture || null;

  return (
    <div className="min-h-screen bg-premium-dark">
      <Helmet>
        <title>{post.meta_title || post.title} | IDZ.TECH</title>
        <meta name="description" content={post.meta_description || post.summary} />
        <meta name="keywords" content={post.meta_tags || post.tags?.join(', ')} />
        <link rel="canonical" href={`https://idz.tech/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:url" content={`https://idz.tech/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.summary} />
        <meta name="twitter:image" content={post.featured_image} />
      </Helmet>

      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className={`mb-6 hover:bg-premium-light/5 hover:text-white ${theme === 'light' ? 'text-black hover:text-white' : ''}`}>
              <ArrowLeft size={18} className="mr-2" /> Wróć do bloga
            </Button>
          </Link>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center text-sm text-premium-light/60 mb-4 gap-2">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{new Date(post.date).toLocaleDateString('pl-PL')}</span>
              </div>
              
              {post.categories && post.categories.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.categories.join(', ')}</span>
                </>
              )}
              
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Eye size={14} className="mr-1" />
                <span>{post.views} wyświetleń</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center mb-6">
              {/* Avatar autora */}
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={authorProfilePicture || ''} alt={authorDisplayName} />
                <AvatarFallback className="bg-premium-gradient text-white">
                  {authorInitial}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-medium">{authorDisplayName}</div>
                <div className="text-sm text-premium-light/60">
                  {author?.jobTitle || "Autor"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Image */}
      <div className="container mx-auto px-4 mb-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden">
            <img src={post.featured_image} alt={post.title} className="w-full h-auto" />
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="max-w-3xl mx-auto mt-8 pt-6 border-t border-premium-light/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-premium-light/5 rounded-full text-sm hover:bg-premium-light hover:text-black"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
