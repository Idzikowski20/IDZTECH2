import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/AuthProvider';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from '@/utils/themeContext';
import { supabase } from '@/utils/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [post, setPost] = useState<any>(null);
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
        setPost({
          ...data,
          featuredImage: data.featured_image,
          excerpt: data.summary,
          categories: data.categories || [],
          tags: data.tags || [],
          author: (data as any).users ? `${(data as any).users.first_name} ${(data as any).users.last_name}` : '',
          authorAvatar: (data as any).users?.avatar_url || null,
        });
      } else {
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

  const authorDisplayName = post.author || "IDZ.TECH";
  const authorInitial = authorDisplayName.charAt(0);
  const authorProfilePicture = post.authorAvatar || null;

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
              {post.tags && post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-premium-light/5 rounded-full text-sm hover:bg-premium-light hover:text-black"
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