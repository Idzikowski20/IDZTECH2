
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBlogStore } from '@/utils/blog';
import { useAuth } from '@/utils/AuthProvider';
import CommentSection from '@/components/CommentSection';
import LikeButton from '@/components/LikeButton';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from '@/utils/themeContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getPostBySlug, incrementView } = useBlogStore();
  const { user } = useAuth();
  const viewCountUpdated = useRef(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  
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

  // Fetch author profile from Supabase if we have an author ID
  useEffect(() => {
    const fetchAuthorProfile = async () => {
      // Use post.author instead of post.authorId since that's what's available in the BlogPost type
      if (post?.author) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', post.author) // Using name instead of ID
            .single();
            
          if (!error && data) {
            setAuthorProfile(data);
          }
        } catch (error) {
          console.error('Error fetching author profile:', error);
        }
      }
    };
    
    fetchAuthorProfile();
  }, [post?.author]);
  
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

  // Używamy danych autora z profilu lub z posta jako fallback
  const authorDisplayName = authorProfile?.name || post.author || "IDZ.TECH";
  const authorLastName = authorProfile?.lastName || "";
  const authorFullName = authorLastName ? `${authorDisplayName} ${authorLastName}` : authorDisplayName;
  const authorInitial = authorDisplayName.charAt(0);
  const authorProfilePicture = authorProfile?.profilePicture || null;

  // Safely access post properties with fallbacks for undefined values
  const commentsCount = post.comments ? post.comments.length : 0;
  const likesCount = (post.likes ? post.likes.length : 0) + (post.guestLikes ? post.guestLikes.length : 0);

  // Check if user is admin, moderator or blogger (has special permissions)
  const hasSpecialRoles = user && (user.role === 'admin' || user.role === 'moderator' || user.role === 'blogger');
  const isUserLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-premium-dark">
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
              
              {isUserLoggedIn && (
                <>
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
                    <span>{commentsCount} komentarzy</span>
                  </div>
                  
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    <span>{likesCount} polubień</span>
                  </div>
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={authorProfilePicture || ''} alt={authorFullName} />
                <AvatarFallback className="bg-premium-gradient text-white">
                  {authorInitial}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-medium">{authorFullName}</div>
                <div className="text-sm text-premium-light/60">
                  {authorProfile?.jobTitle || "Autor"}
                </div>
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
            {/* Enhanced HTML rendering with proper styling */}
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }} 
              className="blog-content"
            />
          </div>
          
          <div className="max-w-3xl mx-auto mt-8 pt-6 border-t border-premium-light/10">
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-premium-light/5 rounded-full text-sm hover:bg-premium-light hover:text-black"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments section - allow for all but with different flows */}
          <div className="max-w-3xl mx-auto">
            <CommentSection postId={post.id} postTitle={post.title} />
          </div>
          
          {!isUserLoggedIn && (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-premium-light/5 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-4">Zaloguj się, aby zobaczyć wszystkie statystyki</h3>
              <p className="mb-6 text-premium-light/70">Aby zobaczyć pełne statystyki posta, zaloguj się na swoje konto.</p>
              <Button onClick={() => navigate('/login')} className="bg-premium-gradient">
                Zaloguj się
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
