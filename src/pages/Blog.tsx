
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Trash2, Plus, Search, BarChart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import BlogPostStats from '@/components/BlogPostStats';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statsOpen, setStatsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten post?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setPosts(posts.filter(post => post.id !== id));
        toast({
          title: "Sukces",
          description: "Post został usunięty",
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć postu",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewStats = (post: BlogPost) => {
    setSelectedPost(post);
    setStatsOpen(true);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Wyszukaj po tytule..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate('/admin/new-post')} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Dodaj nowy post
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-900">
            <TableRow>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">TYTUŁ</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">DATA</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">WYŚWIETLENIA</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">AKCJE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700">
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-4 px-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-premium-purple"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="py-4 px-4 text-center bg-red-800/30">
                  <div className="text-red-400 font-semibold">
                    Błąd
                    <p className="text-sm font-normal mt-1">{error}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-gray-800">
                  <TableCell className="py-4 px-4 text-sm text-white">{post.title}</TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-400">{formatDate(post.created_at)}</TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-400">{post.views || 0}</TableCell>
                  <TableCell className="py-4 px-4 text-sm">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewStats(post)}
                        className="hover:bg-white hover:text-black"
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        className="hover:bg-white hover:text-black"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/edit-post/${post.id}`)}
                        className="hover:bg-white hover:text-black"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-4 px-4 text-center text-gray-400">
                  Nie znaleziono postów
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-400">Błąd</h3>
          <p className="text-red-300 mt-1">Nie udało się pobrać postów</p>
        </div>
      )}
      
      {selectedPost && (
        <BlogPostStats 
          postId={selectedPost.id} 
          postTitle={selectedPost.title} 
          isOpen={statsOpen} 
          onClose={() => setStatsOpen(false)}
        />
      )}
    </div>
  );
};

export default Blog;
