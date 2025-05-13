
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBlogStore } from '@/utils/blog';
import { Skeleton } from '@/components/ui/skeleton';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, incrementView } = useBlogStore();
  const [post, setPost] = useState(slug ? getPostBySlug(slug) : undefined);
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set post from slug
    if (slug) {
      const currentPost = getPostBySlug(slug);
      setPost(currentPost);
      setLoading(!currentPost);
      
      // Increment view count
      if (currentPost) {
        incrementView(currentPost.id);
      }
    }
  }, [slug, getPostBySlug, incrementView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            
            <Skeleton className="h-[400px] w-full mb-8 rounded-lg" />
            
            <div className="space-y-4 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Post nie został znaleziony</h1>
          <p className="mb-8 text-premium-light/70">Przepraszamy, ale post o podanym adresie nie istnieje.</p>
          
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do bloga
            </Button>
          </Link>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <article className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="text-premium-light/70 hover:bg-black hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do listy artykułów
              </Button>
            </Link>
          </div>
          
          {/* Post header */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          {/* Post meta */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-premium-light/60">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.date).toLocaleDateString('pl-PL')}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {post.views} wyświetleń
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              {post.categories.join(', ')}
            </div>
          </div>
          
          {/* Featured image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <AspectRatio ratio={16/9}>
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
          
          {/* Post content */}
          <div 
            className="prose prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-premium-dark/70 border border-premium-light/20 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Like button */}
          <div className="mb-8">
            <LikeButton postId={post.id} />
          </div>
          
          {/* Comments section */}
          <CommentSection postId={post.id} postTitle={post.title} />
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
