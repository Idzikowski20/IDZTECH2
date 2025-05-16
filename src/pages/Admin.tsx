import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, FileText, Plus, Edit, Trash2, Eye, Search, TrendingUp } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { supabase } from '@/utils/supabaseClient';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const postsPerPage = 5;

  // Statystyki (proste liczenie na podstawie postów)
  const [counters, setCounters] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    blogViews: 0
  });
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    blogViews: 0,
    averageSessionTime: '0:00'
  });
  const [topPosts, setTopPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, created_at')
        .order('created_at', { ascending: false });
      if (!error && data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = searchTerm
      ? posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : posts;
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);

  useEffect(() => {
    if (!Array.isArray(posts)) return;
    const totalBlogViews = posts.reduce((total, post) => total + (post.views || 0), 0);
    const estimatedUniqueVisitors = Math.floor(totalBlogViews * 0.7);
    const estimatedTotalVisits = Math.floor(totalBlogViews * 1.5);
    const minutes = Math.floor(totalBlogViews % 500 / 60) + 2;
    const seconds = Math.floor(totalBlogViews % 60);
    const averageTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    setAnalytics({
      totalVisits: estimatedTotalVisits,
      uniqueVisitors: estimatedUniqueVisitors,
      blogViews: totalBlogViews,
      averageSessionTime: averageTime
    });
    setCounters({
      totalVisits: estimatedTotalVisits,
      uniqueVisitors: estimatedUniqueVisitors,
      blogViews: totalBlogViews
    });
    // Top posts by views
    setTopPosts([...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5));
  }, [posts]);

  const postsStartIndex = (currentPostsPage - 1) * postsPerPage;
  const postsEndIndex = postsStartIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(postsStartIndex, postsEndIndex);
  const totalPostsPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten post?')) {
      await supabase.from('blog_posts').delete().eq('id', id);
      setPosts(posts => posts.filter(p => p.id !== id));
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-premium-light/70">
            Witaj, {user?.name || user?.email?.split('@')[0] || 'Użytkowniku'}! O czym dziś piszemy?
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
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center">Ładowanie...</td>
                    </tr>
                  ) : paginatedPosts.length === 0 ? (
                    <tr>
                      <td className="py-4 px-4 text-center text-premium-light/70" colSpan={4}>
                        {searchTerm ? 'Brak wyników wyszukiwania' : 'Brak postów. Dodaj pierwszy post, aby zacząć.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedPosts.map(post => (
                      <tr key={post.id}>
                        <td className="py-3 px-4 font-medium">{post.title}</td>
                        <td className="py-3 px-4 text-premium-light/70">{post.created_at ? new Date(post.created_at).toLocaleDateString('pl-PL') : ''}</td>
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
