import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
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
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [randomPage, setRandomPage] = useState(0);
  const POSTS_PER_PAGE = 3;

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
        // Pobierz wszystkie posty (oprócz aktualnego) do losowania i kategorii
        const { data: all, error: allError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image, created_at, categories, users:author_id(first_name, last_name, avatar_url)')
          .neq('slug', slug);
        if (!allError && all) {
          // Kategorie
          const cats = Array.from(new Set(all.flatMap((p: any) => Array.isArray(p.categories) ? p.categories : [p.categories]).filter(Boolean)));
          setAllCategories(cats);
          // Losowe posty na start
          setLatestPosts(drawRandomPosts(all, '', 0));
        }
      } else {
        setPost(null);
      }
      setLoading(false);
    };
    if (slug) fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Funkcja do losowania postów
  function drawRandomPosts(all: any[], category: string, page: number) {
    let filtered = all;
    if (category) {
      filtered = all.filter(p => Array.isArray(p.categories) ? p.categories.includes(category) : p.categories === category);
    }
    // Losuj i paginuj
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);
  }

  // Obsługa zmiany kategorii lub paginacji
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setRandomPage(0);
    setLatestPosts(drawRandomPosts(allPostsRef.current, cat, 0));
  };
  const handleNextRandom = () => {
    const nextPage = randomPage + 1;
    setRandomPage(nextPage);
    setLatestPosts(drawRandomPosts(allPostsRef.current, selectedCategory, nextPage));
  };
  // Przechowuj wszystkie posty w ref, by nie pobierać ponownie
  const allPostsRef = React.useRef<any[]>([]);
  useEffect(() => {
    if (latestPosts.length > 0) {
      allPostsRef.current = latestPosts.concat();
    }
  }, [latestPosts]);

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
                <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('pl-PL') : ''}</span>
              </div>
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
      {/* Sekcja Zobacz również... */}
      {allPostsRef.current.length > 0 && (
        <section className="bg-premium-dark/80 py-12 border-t border-premium-light/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Zobacz również...</h2>
            {/* Kategorie jako filtr */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button onClick={() => handleCategoryChange('')} className={`px-4 py-2 rounded-full border ${selectedCategory === '' ? 'bg-premium-gradient text-white' : 'bg-premium-dark/40 text-premium-light/80'}`}>Wszystkie</button>
                {allCategories.map(cat => (
                  <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-premium-gradient text-white' : 'bg-premium-dark/40 text-premium-light/80'}`}>{cat}</button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((item: any) => (
                <Link to={`/blog/${item.slug}`} key={item.id} className="group block rounded-2xl bg-premium-dark/60 shadow-lg hover:shadow-xl transition overflow-hidden">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <div className="flex gap-2 text-xs text-premium-light/60 mb-1">
                      {item.categories && item.categories.length > 0 && (
                        <span className="font-semibold text-premium-light/80">{Array.isArray(item.categories) ? item.categories[0] : item.categories}</span>
                      )}
                      <span>•</span>
                      <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('pl-PL') : ''}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-premium-light transition-colors line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-7 w-7 border">
                        <AvatarImage src={item.users?.avatar_url || ''} alt={item.users ? `${item.users.first_name} ${item.users.last_name}` : ''} />
                        <AvatarFallback className="bg-premium-gradient text-white">
                          {item.users && item.users.first_name ? item.users.first_name.charAt(0) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-premium-light/80">{item.users ? `${item.users.first_name} ${item.users.last_name}` : 'Autor'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Paginacja losowa */}
            <div className="flex justify-center mt-8">
              <button onClick={handleNextRandom} className="px-6 py-2 rounded-full bg-premium-gradient text-white font-semibold shadow hover:scale-105 transition">Pokaż kolejne propozycje</button>
            </div>
          </div>
        </section>
      )}
      {post && (
        <Helmet>
          <title>{post.meta_title || post.title}</title>
          <meta name="description" content={post.meta_description || post.summary} />
          <meta name="keywords" content={post.meta_keywords || ''} />
          {/* Możesz dodać inne meta, np. Open Graph */}
        </Helmet>
      )}
    </div>
  );
};

export default BlogPost;