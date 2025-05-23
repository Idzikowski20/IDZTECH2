import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, Eye, Search, Bot, ArrowUpDown } from 'lucide-react';
import { useAuth } from '@/utils/firebaseAuth';
import { Button } from '@/components/ui/button';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from '@/utils/themeContext';

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
  const { theme } = useTheme();
  
  // State for blog posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sorting and filtering state
  const [sortField, setSortField] = useState<'title' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Pagination state
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const postsPerPage = 5;
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [sitemapLastUpdate, setSitemapLastUpdate] = useState<string | null>(null);
  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState(false);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data niedostępna';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data niedostępna';
    }
  };

  const handleStatusChange = async (postId: string, newStatus: boolean) => {
    try {
      const postRef = doc(db, 'blog_posts', postId);
      await updateDoc(postRef, {
        published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null
      });
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, published: newStatus, published_at: newStatus ? new Date().toISOString() : null }
          : post
      ));
      
      toast({ 
        title: 'Zaktualizowano', 
        description: `Post został ${newStatus ? 'opublikowany' : 'oznaczony jako szkic'}.`
      });
    } catch (err) {
      console.error(err);
      toast({ 
        title: 'Błąd', 
        description: 'Nie udało się zmienić statusu posta.', 
        variant: 'destructive' 
      });
    }
  };

  // Filtering and sorting posts
  useEffect(() => {
    if (!Array.isArray(posts)) {
      setFilteredPosts([]);
      return;
    }

    let filtered = [...posts];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => 
        statusFilter === 'published' ? post.published : !post.published
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, sortField, sortDirection, statusFilter]);
  
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

  const handleGenerateSitemap = async () => {
    setIsGeneratingSitemap(true);
    try {
      const res = await fetch('/api/generate-sitemap', { method: 'POST' });
      if (!res.ok) throw new Error('Błąd generowania sitemap');
      // Po wygenerowaniu pobierz nową datę
      const updateRes = await fetch('/api/sitemap-last-update');
      const updateData = await updateRes.json();
      setSitemapLastUpdate(updateData.lastUpdate);
      toast({ title: 'Sitemap wygenerowana', description: 'Sitemap została zaktualizowana.' });
    } catch (err) {
      toast({ title: 'Błąd', description: 'Nie udało się wygenerować sitemap.', variant: 'destructive' });
    } finally {
      setIsGeneratingSitemap(false);
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
          <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
            <h2 className="text-xl font-bold">Blog</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="sm" onClick={handleGenerateSitemap} disabled={isGeneratingSitemap} className="bg-premium-gradient hover:scale-105">
                {isGeneratingSitemap ? 'Generowanie...' : 'Generuj sitemapę'}
              </Button>
              <span className="text-xs text-premium-light/60">
                {sitemapLastUpdate
                  ? `Ostatnia aktualizacja sitemap: ${new Date(sitemapLastUpdate).toLocaleString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                  : 'Sitemap jeszcze nie zaktualizowany'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-4">
                <Select
                  value={statusFilter}
                  onValueChange={(value: 'all' | 'published' | 'draft') => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtruj po statusie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="published">Opublikowane</SelectItem>
                    <SelectItem value="draft">Szkice</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light/50" size={16} />
                  <Input
                    placeholder="Wyszukaj po tytule..."
                    className="pl-10 bg-premium-dark/30 border-premium-light/10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
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
                <thead className="border-b border-premium-light/10 sticky top-0 bg-premium-dark/80 z-10">
                  <tr>
                    <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent p-0"
                        onClick={() => {
                          if (sortField === 'title') {
                            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('title');
                            setSortDirection('asc');
                          }
                        }}
                      >
                        Tytuł
                        <ArrowUpDown size={16} className="ml-2" />
                      </Button>
                    </th>
                    <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left whitespace-nowrap hidden xs:table-cell ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent p-0"
                        onClick={() => {
                          if (sortField === 'date') {
                            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('date');
                            setSortDirection('desc');
                          }
                        }}
                      >
                        Data
                        <ArrowUpDown size={16} className="ml-2" />
                      </Button>
                    </th>
                    <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Status</th>
                    <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Akcje</th>
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
                        <td className={`py-2 sm:py-3 px-2 sm:px-4 font-medium break-words max-w-[180px] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{post.title}</td>
                        <td className={`py-2 sm:py-3 px-2 sm:px-4 ${theme === 'dark' ? 'text-premium-light/70' : 'text-gray-600'} hidden xs:table-cell`}>
                          {post.published 
                            ? formatDate(post.published_at || post.created_at)
                            : formatDate(post.created_at)}
                        </td>
                        <td className={`py-2 sm:py-3 px-2 sm:px-4 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          <button
                            onClick={() => handleStatusChange(post.id, !post.published)}
                            className={`${post.published ? 'status-published' : 'status-draft'} cursor-pointer transition-transform hover:scale-105`}
                          >
                            {post.published ? 'Opublikowany' : 'Szkic'}
                          </button>
                        </td>
                        <td className={`py-2 sm:py-3 px-2 sm:px-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
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
                        className={
                          currentPostsPage === 1
                            ? 'pointer-events-none opacity-50'
                            : `${theme === 'dark' ? 'text-white' : 'text-black'} hover:underline`
                        }
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
                            className={
                              currentPostsPage === pageNum
                                ? `${theme === 'dark' ? 'bg-premium-dark text-white border border-premium-light/10' : 'bg-white text-black border border-gray-300'} !shadow-none`
                                : `${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-premium-light/10`
                            }
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPostsPage(prev => Math.min(prev + 1, totalPostsPages))}
                        className={
                          currentPostsPage === totalPostsPages
                            ? 'pointer-events-none opacity-50'
                            : `${theme === 'dark' ? 'text-white' : 'text-black'} hover:underline`
                        }
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
