
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  created_at?: string;
  views?: number;
  author_id?: string;
  featured_image?: string;
  categories?: string[];
  tags?: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Nie udało się pobrać postów');
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać postów",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  const getCategory = (post: BlogPost) => {
    if (post.categories && post.categories.length > 0) {
      return post.categories[0];
    }
    return 'SEO';
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Blog SEO</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Najnowsze informacje, porady i trendy z świata SEO i tworzenia stron internetowych
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="bg-transparent border-gray-700 pl-10 py-6 rounded-md w-full"
              placeholder="Szukaj artykułów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <p className="text-xl font-semibold">Błąd</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="bg-transparent border border-gray-800 hover:border-gray-600 transition overflow-hidden"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <AspectRatio ratio={16/9} className="bg-gray-800">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                </AspectRatio>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 text-sm">
                    <span className="text-gray-400">{formatDate(post.created_at)}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-gray-400">{getCategory(post)}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 hover:text-gray-300 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 line-clamp-3">
                    {post.summary || post.content.substring(0, 120)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {filteredPosts.length === 0 && !loading && !error && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">Nie znaleziono postów</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
