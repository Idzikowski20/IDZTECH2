
import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBlogStore } from '@/utils/blog';
import { useAuth } from '@/utils/auth';
import CommentSection from '@/components/CommentSection';
import LikeButton from '@/components/LikeButton';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getPostBySlug, incrementView } = useBlogStore();
  const { user } = useAuth();
  const viewCountUpdated = useRef(false);
  
  const post = slug ? getPostBySlug(slug) : undefined;
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Increment view count only once per component mount
    if (post?.id && !viewCountUpdated.current) {
      incrementView(post.id);
      viewCountUpdated.current = true;
    }
  }, [post?.id, incrementView]);
  
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

  // Get author details (in a real app this would come from a user database)
  const authorDisplayName = user ? `${user.name} ${user.lastName || ''}`.trim() : post.author;
  const authorInitial = authorDisplayName.charAt(0);

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 hover:bg-premium-light/5">
              <ArrowLeft size={18} className="mr-2" /> Wróć do bloga
            </Button>
          </Link>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center text-sm text-premium-light/60 mb-4">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{new Date(post.date).toLocaleDateString('pl-PL')}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{post.categories.join(', ')}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Eye size={14} className="mr-1" />
                <span>{post.views} wyświetleń</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <MessageCircle size={14} className="mr-1" />
                <span>{post.comments.length} komentarzy</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Heart size={14} className="mr-1" />
                <span>{post.likes.length} polubień</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center mb-4">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={authorDisplayName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">
                  {authorInitial}
                </div>
              )}
              <div className="ml-3">
                <div className="font-medium">{authorDisplayName}</div>
                <div className="text-sm text-premium-light/60">Autor</div>
              </div>
            </div>

            <div className="mb-6">
              <LikeButton postId={post.id} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Image */}
      <div className="container mx-auto px-4 mb-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden">
            <img src={post.featuredImage} alt={post.title} className="w-full h-auto" />
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          <div className="max-w-3xl mx-auto mt-8 pt-6 border-t border-premium-light/10">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-premium-light/5 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments section */}
          <div className="max-w-3xl mx-auto">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
