
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
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
import { useBlogPosts } from '@/hooks/useBlogPosts';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get blog data
  const { posts, getPost } = useBlogPosts();
  const { data: post, isLoading } = getPost(slug || '');
  
  // States for interactions
  const [commentsCount, setCommentsCount] = useState(0);
  
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
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }
  
  if (!post) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <>
      <Helmet>
        <title>{post.title} | IDZ.TECH Blog</title>
        <meta name="description" content={post.excerpt || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.created_at} />
        {post.tags?.map(tag => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="text-premium-light/70 hover:text-white hover:bg-premium-light/10"
          >
            <ArrowLeft size={16} className="mr-2" />
            Wróć do listy postów
          </Button>
        </div>
        
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
          
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-premium-gradient">
                A
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="font-medium">Autor</div>
              <div className="text-sm text-premium-light/70">
                IDZ.TECH
              </div>
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
        
        {/* Post content */}
        <article className="prose prose-invert prose-premium max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Tagi</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-premium-light/5 hover:bg-premium-light/10 hover:text-white">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-8" />
        
        {/* Share buttons */}
        <ShareButtons title={post.title} />
        
        <Separator className="my-8" />
        
        {/* Comments section */}
        <div id="comments-section">
          <CommentSection postId={post.id} />
        </div>
        
        <Separator className="my-8" />
        
        {/* Related posts */}
        <RelatedPosts 
          currentPostId={post.id} 
          categories={post.categories || []} 
          tags={post.tags || []}
        />
      </div>
    </>
  );
};

export default BlogPost;
