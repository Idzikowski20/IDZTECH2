import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, FileText, Plus, Edit, Trash2, Eye, Reply } from 'lucide-react';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { useBlogStore, BlogComment } from '@/utils/blog';
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
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    posts,
    deletePost,
    getPostComments,
    addComment,
    deleteComment
  } = useBlogStore();
  
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
  
  const [recentComments, setRecentComments] = useState<(BlogComment & { postTitle: string })[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isReplying, setIsReplying] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Get all comments from all posts
  useEffect(() => {
    if (!Array.isArray(posts)) {
      return;
    }
    
    const allComments = posts.flatMap(post => 
      Array.isArray(post.comments) 
        ? post.comments.map(comment => ({
            ...comment,
            postTitle: post.title
          }))
        : []
    );
    
    // Sort by date, newest first
    const sortedComments = allComments.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5); // Get only 5 most recent
    
    setRecentComments(sortedComments);
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
  
  const handleReply = (commentId: string) => {
    setIsReplying({
      ...isReplying,
      [commentId]: !isReplying[commentId]
    });
  };
  
  const submitReply = (commentId: string, postId: string) => {
    if (replyText[commentId] && user) {
      addComment(
        postId,
        user.id,
        user.name,
        user.profilePicture,
        `@${recentComments.find(c => c.id === commentId)?.userName}: ${replyText[commentId]}`
      );
      
      // Reset reply state
      setReplyText({
        ...replyText,
        [commentId]: ''
      });
      setIsReplying({
        ...isReplying,
        [commentId]: false
      });
      
      toast({
        title: "Odpowiedź dodana",
        description: "Twoja odpowiedź została pomyślnie dodana."
      });
    }
  };
  
  const handleDeleteComment = (commentId: string, postId: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten komentarz?")) {
      deleteComment(postId, commentId);
      toast({
        title: "Komentarz usunięty",
        description: "Komentarz został pomyślnie usunięty."
      });
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-premium-light/70">
            Witaj, {user?.name}! Oto statystyki Twojej strony.
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

        {/* Recent Comments */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Ostatnie komentarze</h2>
          </div>

          <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden mb-8">
            {!Array.isArray(recentComments) || recentComments.length === 0 ? (
              <div className="p-6 text-center text-premium-light/70">
                Brak komentarzy do wyświetlenia.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Użytkownik</TableHead>
                    <TableHead>Treść</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentComments.map(comment => (
                    <TableRow key={comment.id}>
                      <TableCell className="font-medium">{comment.userName}</TableCell>
                      <TableCell>{comment.content}</TableCell>
                      <TableCell>{comment.postTitle}</TableCell>
                      <TableCell>{new Date(comment.date).toLocaleDateString('pl-PL')}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleReply(comment.id)}
                            className="text-blue-400 hover:text-white hover:bg-blue-500"
                          >
                            <Reply size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteComment(comment.id, comment.postId)}
                            className="text-red-400 hover:text-white hover:bg-red-500"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          {/* Reply boxes */}
          {Array.isArray(recentComments) && recentComments.map(comment => (
            isReplying[comment.id] && (
              <div key={`reply-${comment.id}`} className="mb-6 bg-premium-dark/30 border border-premium-light/10 rounded-lg p-4">
                <p className="mb-2 text-sm">Odpowiadasz na komentarz użytkownika: <strong>{comment.userName}</strong></p>
                <Textarea 
                  value={replyText[comment.id] || ''}
                  onChange={e => setReplyText({...replyText, [comment.id]: e.target.value})}
                  placeholder="Wpisz swoją odpowiedź..."
                  className="mb-3 bg-slate-950"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleReply(comment.id)}
                  >
                    Anuluj
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => submitReply(comment.id, comment.postId)}
                    className="bg-premium-gradient"
                    disabled={!replyText[comment.id]}
                  >
                    Wyślij odpowiedź
                  </Button>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Blog Posts Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Blog</h2>
            <Button onClick={() => navigate('/admin/new-post')} className="bg-premium-gradient hover:scale-105 transition-transform">
              <Plus size={16} className="mr-2" /> Dodaj nowy post
            </Button>
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
                  {!Array.isArray(posts) || posts.length === 0 ? (
                    <tr>
                      <td className="py-4 px-4 text-center text-premium-light/70" colSpan={4}>
                        Brak postów. Dodaj pierwszy post, aby zacząć.
                      </td>
                    </tr>
                  ) : (
                    posts.map(post => (
                      <tr key={post.id}>
                        <td className="py-3 px-4 font-medium">{post.title}</td>
                        <td className="py-3 px-4 text-premium-light/70">
                          {new Date(post.date).toLocaleDateString('pl-PL')}
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
                              onClick={() => deletePost(post.id)}
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
