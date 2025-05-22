import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, Eye, Search, Bot } from 'lucide-react';
import { useAuth } from '@/utils/firebaseAuth';
import { Button } from '@/components/ui/button';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminLayout from '@/components/AdminLayout';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import AdminAIButton from '@/components/AdminAIButton';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  content: string;
  featured_image: string;
  excerpt: string | null;
  published: boolean;
  published_at: string | null;
  updated_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for blog posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const postsPerPage = 5;
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchPosts();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const postsCollection = collection(db, 'blog_posts');
      const postsSnapshot = await getDocs(postsCollection);
      const postsList = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsList);
    } catch (err) {
      setError('Błąd podczas pobierania postów');
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Filtering posts by title
  useEffect(() => {
    if (!Array.isArray(posts)) {
      setFilteredPosts([]);
      return;
    }
    const filtered = searchTerm
      ? posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : posts;
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);
  
  // Calculate pagination
  const postsStartIndex = (currentPostsPage - 1) * postsPerPage;
  const postsEndIndex = postsStartIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(postsStartIndex, postsEndIndex);
  
  const totalPostsPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const handleDelete = async (postId: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten post?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
      toast({ title: 'Usunięto', description: 'Post został usunięty.' });
    } catch (err) {
      setError('Błąd podczas usuwania postu');
      console.error(err);
      toast({ title: 'Błąd', description: 'Nie udało się usunąć posta.', variant: 'destructive' });
    }
  };

  if (loadingPosts) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-premium-light/70">
            Witaj, {user?.name || (user?.email ? user.email.split('@')[0] : 'Użytkowniku')}! Zarządzaj treściami swojej strony.
          </p>
        </div>

        {/* Blog Posts Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Blog</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light/50" size={16} />
                <Input
                  placeholder="Wyszukaj po tytule..."
                  className="pl-10 bg-premium-dark/30 border-premium-light/10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => navigate('/admin/new-post')} className="bg-premium-gradient hover:scale-105">
                <Plus size={16} className="mr-2" /> Dodaj nowy post
              </Button>
              <AdminAIButton onClick={() => navigate('/admin/ai-post')} />
            </div>
          </div>

          <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-premium-light/10">
                  <tr>
                    <th className="py-3 px-4 text-left">Tytuł</th>
                    <th className="py-3 px-4 text-left">Data</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-premium-light/10">
                  {loadingPosts ? (
                    <tr>
                      <td className="py-4 px-4 text-center text-premium-light/70" colSpan={4}>
                        Ładowanie...
                      </td>
                    </tr>
                  ) : filteredPosts.length === 0 ? (
                    <tr>
                      <td className="py-4 px-4 text-center text-premium-light/70" colSpan={4}>
                        {searchTerm ? 'Brak wyników wyszukiwania' : 'Brak postów. Dodaj pierwszy post, aby zacząć.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedPosts.map(post => (
                      <tr key={post.id}>
                        <td className="py-3 px-4 font-medium">{post.title}</td>
                        <td className="py-3 px-4 text-premium-light/70">
                          {new Date(post.created_at).toLocaleDateString('pl-PL')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {post.published ? 'Opublikowany' : 'Szkic'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/blog/${post.slug}`)} 
                              className="text-blue-400 hover:text-white hover:bg-blue-500 transition-colors"
                            >
                              <Eye size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/admin/edit-post/${post.id}`)} 
                              className="text-green-400 hover:text-white hover:bg-green-500 transition-colors"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-400 hover:text-white hover:bg-red-500 transition-colors" 
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Blog Posts Pagination */}
            {totalPostsPages > 1 && (
              <div className="flex justify-center py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPostsPage(prev => Math.max(prev - 1, 1))} 
                        className={currentPostsPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-white hover:text-black"}
                      />
                    </PaginationItem>
                    
                    {Array.from({length: Math.min(totalPostsPages, 5)}, (_, i) => {
                      // Display logic for page numbers
                      let pageNum;
                      if (totalPostsPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPostsPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPostsPage >= totalPostsPages - 2) {
                        pageNum = totalPostsPages - 4 + i;
                      } else {
                        pageNum = currentPostsPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            onClick={() => setCurrentPostsPage(pageNum)}
                            isActive={currentPostsPage === pageNum}
                            className={currentPostsPage !== pageNum ? "hover:bg-white hover:text-black" : ""}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPostsPage(prev => Math.min(prev + 1, totalPostsPages))} 
                        className={currentPostsPage === totalPostsPages ? "pointer-events-none opacity-50" : "hover:bg-white hover:text-black"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
