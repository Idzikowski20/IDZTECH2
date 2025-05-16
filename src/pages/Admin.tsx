
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, FileText, Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useAuth } from '@/utils/AuthContext';
import { Button } from '@/components/ui/button';
import { getAllPosts, deletePost, BlogPost } from '@/services/blogService';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const Admin = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user
  } = useAuth();
  
  const { toast } = useToast();
  
  // Stan dla postów
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Statystyki bloga
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    blogViews: 0,
    averageSessionTime: '0:00'
  });
  
  const [counters, setCounters] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    blogViews: 0
  });
  
  // Stan paginacji
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const postsPerPage = 5;
  
  // Stan wyszukiwania
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Sprawdź autentykację i pobierz dane
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się załadować postów",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, navigate, toast]);
  
  // Filtruj posty na podstawie wyszukiwanego hasła
  useEffect(() => {
    const filtered = searchTerm
      ? posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : posts;
      
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);
  
  // Oblicz statystyki bloga
  useEffect(() => {
    if (!posts.length) {
      return;
    }
    
    // Oblicz całkowitą liczbę wyświetleń bloga
    const totalBlogViews = posts.reduce((total, post) => total + post.views, 0);

    // Oszacuj unikalnych użytkowników (w rzeczywistej aplikacji pochodziłoby to z analityki)
    const estimatedUniqueVisitors = Math.floor(totalBlogViews * 0.7);

    // Oszacuj całkowitą liczbę odwiedzin (w rzeczywistej aplikacji pochodziłoby to z analityki)
    const estimatedTotalVisits = Math.floor(totalBlogViews * 1.5);

    // Oblicz średni czas sesji na podstawie wyświetleń (uproszczone dla demo)
    const minutes = Math.floor(totalBlogViews % 500 / 60) + 2;
    const seconds = Math.floor(totalBlogViews % 60);
    const averageTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    setAnalytics({
      totalVisits: estimatedTotalVisits,
      uniqueVisitors: estimatedUniqueVisitors,
      blogViews: totalBlogViews,
      averageSessionTime: averageTime
    });
    
    // Rozpocznij animację liczenia od 0
    const duration = 1500; // czas trwania animacji w ms
    const steps = 30; // liczba kroków w animacji
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        totalVisits: Math.floor(estimatedTotalVisits * progress),
        uniqueVisitors: Math.floor(estimatedUniqueVisitors * progress),
        blogViews: Math.floor(totalBlogViews * progress)
      });
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [posts]);
  
  // Obsługa usuwania posta
  const handleDeletePost = async (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten post?")) {
      try {
        await deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
        toast({
          title: "Post usunięty",
          description: "Post został pomyślnie usunięty."
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć posta",
          variant: "destructive"
        });
      }
    }
  };
  
  // Oblicz paginację
  const postsStartIndex = (currentPostsPage - 1) * postsPerPage;
  const postsEndIndex = postsStartIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(postsStartIndex, postsEndIndex);
  
  const totalPostsPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-premium-light/70">
            Witaj, {user?.name || user?.email?.split('@')[0] || 'Użytkowniku'}! Oto statystyki Twojej strony.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-premium-dark/50 border border-premium-light/10 p-6 rounded-xl hover:bg-premium-light/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BarChart className="text-blue-500" size={24} />
              </div>
              <h3 className="ml-3 font-semibold">Łączne wizyty</h3>
            </div>
            <div className="text-3xl font-bold">{counters.totalVisits}</div>
          </div>
          
          <div className="bg-premium-dark/50 border border-premium-light/10 p-6 rounded-xl hover:bg-premium-light/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <BarChart className="text-purple-500" size={24} />
              </div>
              <h3 className="ml-3 font-semibold">Unikalni użytkownicy</h3>
            </div>
            <div className="text-3xl font-bold">{counters.uniqueVisitors}</div>
          </div>
          
          <div className="bg-premium-dark/50 border border-premium-light/10 p-6 rounded-xl hover:bg-premium-light/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FileText className="text-green-500" size={24} />
              </div>
              <h3 className="ml-3 font-semibold">Wyświetlenia bloga</h3>
            </div>
            <div className="text-3xl font-bold">{counters.blogViews}</div>
          </div>
          
          <div className="bg-premium-dark/50 border border-premium-light/10 p-6 rounded-xl hover:bg-premium-light/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <BarChart className="text-amber-500" size={24} />
              </div>
              <h3 className="ml-3 font-semibold">Średni czas sesji</h3>
            </div>
            <div className="text-3xl font-bold">{analytics.averageSessionTime}</div>
          </div>
        </div>

        {/* Top Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Top Posts by Views */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Eye className="mr-2 text-blue-500" size={18} />
                Top posty - Wyświetlenia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                {posts
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((post, index) => (
                    <li key={post.id} className="flex items-center justify-between border-b border-premium-light/10 pb-2">
                      <div className="flex items-center">
                        <span className={`w-5 font-bold ${index < 3 ? 'text-amber-400' : 'text-premium-light/70'}`}>
                          {index + 1}.
                        </span>
                        <span className="line-clamp-1 ml-2">{post.title}</span>
                      </div>
                      <div className="font-bold text-blue-500">{post.views}</div>
                    </li>
                  ))}
                {posts.length === 0 && (
                  <li className="py-2 text-center text-premium-light/50">Brak postów</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Recent Posts */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-green-500" size={18} />
                Ostatnie posty
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                {posts
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map((post, index) => (
                    <li key={post.id} className="flex items-center justify-between border-b border-premium-light/10 pb-2">
                      <div className="flex-1 mr-4">
                        <div className="line-clamp-1 font-medium">{post.title}</div>
                        <div className="text-xs text-premium-light/60">
                          {new Date(post.created_at).toLocaleDateString('pl-PL')}
                        </div>
                      </div>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mr-1 text-premium-light/70"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-premium-light/70"
                          onClick={() => navigate(`/admin/edit-post/${post.slug}`)}
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                    </li>
                  ))}
                {posts.length === 0 && (
                  <li className="py-2 text-center text-premium-light/50">Brak postów</li>
                )}
              </ul>
            </CardContent>
          </Card>
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
              <Button onClick={() => navigate('/admin/new-post')} className="bg-premium-gradient hover:scale-105 transition-transform">
                <Plus size={16} className="mr-2" /> Dodaj nowy post
              </Button>
            </div>
          </div>

          <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-premium-purple"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tytuł</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Wyświetlenia</TableHead>
                      <TableHead>Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!filteredPosts.length ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-premium-light/70 py-10">
                          {searchTerm ? 'Brak wyników wyszukiwania' : 'Brak postów. Dodaj pierwszy post, aby zacząć.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedPosts.map(post => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell className="text-premium-light/70">
                            {new Date(post.date).toLocaleDateString('pl-PL')}
                          </TableCell>
                          <TableCell>{post.views}</TableCell>
                          <TableCell>
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
                                onClick={() => navigate(`/admin/edit-post/${post.slug}`)} 
                                className="text-green-400 hover:text-white hover:bg-green-500 transition-colors"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-400 hover:text-white hover:bg-red-500 transition-colors" 
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
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
                          // Logika wyświetlania numerów stron
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
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
