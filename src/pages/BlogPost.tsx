import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/AuthProvider';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from '@/utils/themeContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Update BlogPost interface to match your actual database and include UI fields
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  summary: string | null;
  excerpt: string | null;
  categories: string[] | null;
  tags: string[] | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_tags: string[] | null;
  // UI helper fields
  views?: number;
  authorName?: string;
  authorAvatar?: string | null;
  authorJobTitle?: string;
  // Join with users table
  users?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, users:author_id(first_name, last_name, avatar_url)')
        .eq('slug', slug)
        .single();
        
      if (!error && data) {
        // Create a properly typed post object with computed fields
        const postData: BlogPost = {
          ...data,
          views: 0, // Default view count
          authorName: data.users ? `${data.users.first_name || ''} ${data.users.last_name || ''}`.trim() : 'IDZ.TECH',
          authorAvatar: data.users?.avatar_url || null,
          authorJobTitle: 'Autor'
        };
        
        setPost(postData);
        
        // Increment view count (in a real app you would store this)
        console.log(`Incrementing view count for post ${data.id}`);
      } else {
        console.error('Error fetching blog post:', error);
        setPost(null);
      }
      setLoading(false);
    };
    if (slug) fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-dark flex items-center justify-center">
        <span className="text-premium-light/70 text-lg">Ładowanie posta...</span>
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

  const authorDisplayName = post.authorName || "IDZ.TECH";
  const authorInitial = authorDisplayName.charAt(0);
  const authorProfilePicture = post.authorAvatar || null;

  // Calculate counts for UI
  const commentsCount = 0; // Since you don't have actual comments
  const likesCount = 0; // Since you don't have actual likes

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
                <span>{new Date(post.created_at).toLocaleDateString('pl-PL')}</span>
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
              {/* Używamy avatara z profilem z Supabase */}
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={authorProfilePicture || ''} alt={authorDisplayName} />
                <AvatarFallback className="bg-premium-gradient text-white">
                  {authorInitial}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-medium">{authorDisplayName}</div>
                <div className="text-sm text-premium-light/60">
                  {post.authorJobTitle || "Autor"}
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
          <div className="max-w-3xl mx-auto mt-8 pt-6 border-t border-premium-light/10">
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-premium-light/5 rounded-full text-sm hover:bg-premium-light hover:text-black transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogPost;
