
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, FileText, Plus, Edit, Trash2, Eye, Reply, TrendingUp, Heart, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';
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

// Define the BlogPost type to fix the TypeScript error
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  views: number;
  created_at: string;
  updated_at: string;
  likes?: string[];
  comments?: any[];
}

const Admin = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user
  } = useAuth();
  
  const { toast } = useToast();
  
  // Stan dla postów bloga
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
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
  
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isReplying, setIsReplying] = useState<Record<string, boolean>>({});
  const [topPosts, setTopPosts] = useState<{
    byViews: any[];
    byLikes: any[];
    byComments: any[];
  }>({
    byViews: [],
    byLikes: [],
    byComments: []
  });
  
  // Pagination state
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const commentsPerPage = 5;
  const postsPerPage = 5;
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Dodajemy logowanie dla diagnostyki
  useEffect(() => {
    console.log("Admin component mounted");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login page");
      navigate('/login');
    }
  }, [isAuthenticated, navigate, user]);
  
  // Pobieranie postów z Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setPosts(data || []);
      setLoadingPosts(false);
    };
    fetchPosts();
  }, []);
  
  // Filtrowanie postów po tytule
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
  
  // Top posty na podstawie pobranych postów
  useEffect(() => {
    if (!Array.isArray(posts)) return;
    const sortedByViews = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    // Jeśli masz polubienia i komentarze jako liczby lub tablice, dostosuj poniżej:
    const sortedByLikes = [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 5);
    const sortedByComments = [...posts].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 5);
    setTopPosts({
      byViews: sortedByViews,
      byLikes: sortedByLikes,
      byComments: sortedByComments
    });
  }, [posts]);

  // Calculate real blog statistics
  useEffect(() => {
    if (!Array.isArray(posts)) {
      return;
    }
    
    // Calculate total blog views
    const totalBlogViews = posts.reduce((total, post) => total + post.views, 0);

    // Estimate unique visitors (in real app this would come from analytics)
    const estimatedUniqueVisitors = Math.floor(totalBlogViews * 0.7);

    // Estimate total visits (in real app this would come from analytics)
    const estimatedTotalVisits = Math.floor(totalBlogViews * 1.5);

    // Calculate average session time based on views (simplified for demo)
    const minutes = Math.floor(totalBlogViews % 500 / 60) + 2;
    const seconds = Math.floor(totalBlogViews % 60);
    const averageTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    setAnalytics({
      totalVisits: estimatedTotalVisits,
      uniqueVisitors: estimatedUniqueVisitors,
      blogViews: totalBlogViews,
      averageSessionTime: averageTime
    });
    
    // Start counting animation from 0
    const duration = 1500; // animation duration in ms
    const steps = 30; // number of steps in the animation
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
  
  // Calculate pagination
  const commentsStartIndex = (currentCommentsPage - 1) * commentsPerPage;
  const commentsEndIndex = commentsStartIndex + commentsPerPage;
  const paginatedComments = recentComments.slice(commentsStartIndex, commentsEndIndex);
  
  const postsStartIndex = (currentPostsPage - 1) * postsPerPage;
  const postsEndIndex = postsStartIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(postsStartIndex, postsEndIndex);
  
  const totalCommentsPages = Math.ceil(recentComments.length / commentsPerPage);
  const totalPostsPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Safety check - render loading or null until authenticated
  if (!isAuthenticated) {
    console.log("Rendering null because user is not authenticated");
    return null;
  }
  
  console.log("Rendering Admin component");
  
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
                <Users className="text-purple-500" size={24} />
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

        {/* Top Posts & User Rankings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Posts by Views */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 text-blue-500" size={18} />
                Top posty - Wyświetlenia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                {topPosts.byViews.map((post, index) => (
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
                {topPosts.byViews.length === 0 && (
                  <li className="py-2 text-center text-premium-light/50">Brak postów</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Top Posts by Likes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Heart className="mr-2 text-red-500" size={18} />
                Top posty - Polubienia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                {topPosts.byLikes.map((post, index) => (
                  <li key={post.id} className="flex items-center justify-between border-b border-premium-light/10 pb-2">
                    <div className="flex items-center">
                      <span className={`w-5 font-bold ${index < 3 ? 'text-amber-400' : 'text-premium-light/70'}`}>
                        {index + 1}.
                      </span>
                      <span className="line-clamp-1 ml-2">{post.title}</span>
                    </div>
                    <div className="font-bold text-red-500">
                      {Array.isArray(post.likes) ? post.likes.length : 0}
                    </div>
                  </li>
                ))}
                {topPosts.byLikes.length === 0 && (
                  <li className="py-2 text-center text-premium-light/50">Brak postów</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Top Posts by Comments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 text-green-500" size={18} />
                Top posty - Komentarze
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                {topPosts.byComments.map((post, index) => (
                  <li key={post.id} className="flex items-center justify-between border-b border-premium-light/10 pb-2">
                    <div className="flex items-center">
                      <span className={`w-5 font-bold ${index < 3 ? 'text-amber-400' : 'text-premium-light/70'}`}>
                        {index + 1}.
                      </span>
                      <span className="line-clamp-1 ml-2">{post.title}</span>
                    </div>
                    <div className="font-bold text-green-500">
                      {Array.isArray(post.comments) ? post.comments.length : 0}
                    </div>
                  </li>
                ))}
                {topPosts.byComments.length === 0 && (
                  <li className="py-2 text-center text-premium-light/50">Brak postów</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>


        {/* Blog Posts Management (DYNAMICZNE API) */}
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-premium-light/10">
                  <tr>
                    <th className="py-3 px-4 text-left">Tytuł</th>
                    <th className="py-3 px-4 text-left">Data</th>
                    <th className="py-3 px-4 text-left">Wyświetlenia</th>
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
                    filteredPosts.map(post => (
                      <tr key={post.id}>
                        <td className="py-3 px-4 font-medium">{post.title}</td>
                        <td className="py-3 px-4 text-premium-light/70">
                          {new Date(post.created_at).toLocaleDateString('pl-PL')}
                        </td>
                        <td className="py-3 px-4">{post.views}</td>
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
                              onClick={async () => {
                                if (window.confirm('Czy na pewno chcesz usunąć ten post?')) {
                                  const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
                                  if (!error) {
                                    setPosts(posts => posts.filter(p => p.id !== post.id));
                                    toast({ title: 'Usunięto', description: 'Post został usunięty.' });
                                  } else {
                                    toast({ title: 'Błąd', description: 'Nie udało się usunąć posta.', variant: 'destructive' });
                                  }
                                }
                              }}
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
