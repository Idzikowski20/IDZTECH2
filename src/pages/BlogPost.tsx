
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { Button } from '@/components/ui/button';
import { useBlogStore } from '@/utils/blog';
import LikeButton from '@/components/LikeButton';
import { useAuth } from '@/utils/authStore';

const BlogPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { posts, incrementViews } = useBlogStore();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Find post by slug
  useEffect(() => {
    if (posts && slug) {
      const foundPost = posts.find((p) => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Increment view count only once per session
        const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '{}');
        if (!viewedPosts[foundPost.id]) {
          incrementViews(foundPost.id);
          viewedPosts[foundPost.id] = true;
          sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
        }
      }
    }
    
    setIsLoading(false);
  }, [posts, slug, incrementViews]);

  // Ensure scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [slug]);

  // Handle not found
  if (!isLoading && !post) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Post nie znaleziony</h1>
            <p className="text-premium-light/70 mb-8">
              Przepraszamy, nie znaleźliśmy posta, którego szukasz.
            </p>
            <Button 
              onClick={() => navigate('/blog')} 
              className="bg-premium-gradient"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do bloga
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading || !post) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-premium-light/10 rounded mb-4 w-3/4"></div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-4 bg-premium-light/10 rounded w-24"></div>
                <div className="h-4 bg-premium-light/10 rounded w-24"></div>
              </div>
              <div className="h-64 bg-premium-light/10 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-premium-light/10 rounded w-full"></div>
                <div className="h-4 bg-premium-light/10 rounded w-full"></div>
                <div className="h-4 bg-premium-light/10 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <Link to="/blog">
              <Button 
                variant="ghost" 
                className="mb-8 text-premium-light/70 hover:text-white hover:bg-premium-light/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Powrót do bloga
              </Button>
            </Link>
            
            {/* Post header */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-premium-light/70 mb-8 gap-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(post.date).toLocaleDateString('pl-PL')}</span>
              </div>
              
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{post.author}</span>
              </div>
              
              {/* Display stats with authentication check */}
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                <span>{isAuthenticated ? `${post.views} wyświetleń` : 'Zaloguj się, aby zobaczyć'}</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-2" />
                <span>
                  {isAuthenticated 
                    ? `${post.comments?.length || 0} komentarzy` 
                    : 'Zaloguj się, aby zobaczyć'}
                </span>
              </div>
            </div>
            
            {/* Featured image */}
            {post.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}
            
            {/* Post content */}
            <div 
              className="prose prose-invert max-w-none mb-12 prose-img:rounded-lg prose-headings:font-bold prose-a:text-premium-purple hover:prose-a:text-premium-pink"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-premium-dark/50 text-premium-light/70 text-sm px-3 py-1 rounded-full border border-premium-light/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Like and comment section */}
            <div className="border-t border-premium-light/10 pt-8">
              <div className="flex justify-between items-center">
                <div>
                  {isAuthenticated ? (
                    <LikeButton postId={post.id} />
                  ) : (
                    <Link to="/login" className="inline-flex items-center">
                      <Button variant="outline">
                        Zaloguj się aby polubić
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="text-premium-light/70">
                  {isAuthenticated ? (
                    <span>{post.likes?.length || 0} polubień</span>
                  ) : (
                    <span>Zaloguj się, aby zobaczyć</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      {/* Comments section */}
      <section className="py-12 bg-premium-dark/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {isAuthenticated ? (
              <CommentSection postId={post.id} />
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-4">Komentarze</h3>
                <p className="text-premium-light/70 mb-6">
                  Zaloguj się, aby przeglądać i dodawać komentarze
                </p>
                <Link to="/login">
                  <Button className="bg-premium-gradient">
                    Zaloguj się
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
