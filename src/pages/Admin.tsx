
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, FileText, Plus, Edit, Trash2, Eye, Reply, TrendingUp, Heart, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import { Button } from '@/components/ui/button';
import { useBlogStore, BlogComment, BlogPost } from '@/utils/blog';
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
import { useIsMobile } from '@/hooks/use-mobile';
import UserRanking from '@/components/UserRanking';
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
  const isMobile = useIsMobile();
  
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
  const [topPosts, setTopPosts] = useState<{
    byViews: BlogPost[];
    byLikes: BlogPost[];
    byComments: BlogPost[];
  }>({
    byViews: [],
    byLikes: [],
    byComments: []
  });
  
  // Pagination state
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const commentsPerPage = 5;
  const postsPerPage = isMobile ? 3 : 5;
  
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
  
  // Filter posts based on search term
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
  
  // Get all comments from all posts
  useEffect(() => {
    console.log("Processing posts:", posts);
    if (!Array.isArray(posts)) {
      console.log("Posts is not an array");
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
    );
    
    setRecentComments(sortedComments);
    
    // Calculate top posts by views, likes, and comments
    const sortedByViews = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
    
    const sortedByLikes = [...posts].sort((a, b) => 
      (Array.isArray(b.likes) ? b.likes.length : 0) - 
      (Array.isArray(a.likes) ? a.likes.length : 0)
    ).slice(0, 5);
    
    const sortedByComments = [...posts].sort((a, b) => 
      (Array.isArray(b.comments) ? b.comments.length : 0) - 
      (Array.isArray(a.comments) ? a.comments.length : 0)
    ).slice(0, 5);
    
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
        user.name || user.email?.split('@')[0] || 'Użytkownik',
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
      <div className={`${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isMobile ? 'mb-2' : 'mb-2'}`}>Dashboard</h1>
          <p className="text-premium-light/70">
            Witaj, {user?.name || user?.email?.split('@')[0] || 'Użytkowniku'}! Oto statystyki Twojej strony.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'grid-cols-4 gap-6'} mb-6`}>
          <div className="bg-premium-dark/50 border border-premium-light/10 p-4 rounded-xl hover:bg-premium-light/10 transition-all duration-300">
            <div className={`flex items-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart className="text-blue-500" size={isMobile ? 20 : 24} />
              </div>
              <h3 className="ml-2 font-semibold text-sm">Wizyty</h3>
            </div>
            <div className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>{counters.totalVisits}</div>
          </div>
          
          <div className="bg-premium-dark/50 border border-premium-light/10 p-4 rounded-xl hover:bg-premium-light/10 transition-all duration-300">
            <div className={`flex items-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="text-purple-500" size={isMobile ? 20 : 24} />
              </div>
              <h3 className="ml-2 font-semibold text-sm">Użytkownicy</h3>
            </div>
            <div className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>{counters.uniqueVisitors}</div>
          </div>
          
          <div className="bg-premium-dark/50 border border-premium-light/10 p-4 rounded-xl hover:bg-premium-light/10 transition-all duration-300">
            <div className={`flex items-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileText className="text-green-500" size={isMobile ? 20 : 24} />
              </div>
              <h3 className="ml-2 font-semibold text-sm">Blog</h3>
            </div>
            <div className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>{counters.blogViews}</div>
          </div>
          
          <div className="bg-premium-dark/50 border border-premium-light/10 p-4 rounded-xl hover:bg-premium-light/10 transition-all duration-300">
            <div className={`flex items-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <BarChart className="text-amber-500" size={isMobile ? 20 : 24} />
              </div>
              <h3 className="ml-2 font-semibold text-sm">Czas sesji</h3>
            </div>
            <div className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>{analytics.averageSessionTime}</div>
          </div>
        </div>

        {/* Top Posts & User Rankings */}
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'} mb-6`}>
          {/* Top Posts by Views */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 text-blue-500" size={18} />
                Top - Wyświetlenia
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
                Top - Polubienia
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
                Top - Komentarze
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

        {/* User Rankings - Only show on larger screens or stacked on mobile */}
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'md:grid-cols-2 gap-6'} mb-6`}>
          {!isMobile && (
            <>
              <UserRanking showMonthly={false} limit={5} />
              <UserRanking showMonthly={true} limit={5} />
            </>
          )}
          {isMobile && (
            <UserRanking showMonthly={true} limit={5} />
          )}
        </div>
        
        {/* Recent Comments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Ostatnie komentarze</h2>
          </div>

          <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden mb-6">
            {!Array.isArray(recentComments) || recentComments.length === 0 ? (
              <div className="p-6 text-center text-premium-light/70">
                Brak komentarzy do wyświetlenia.
              </div>
            ) : (
              <>
                {isMobile ? (
                  // Mobile comments view
                  <div className="divide-y divide-premium-light/10">
                    {paginatedComments.map(comment => (
                      <div key={comment.id} className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{comment.userName}</div>
                          <div className="text-xs text-premium-light/70">{new Date(comment.date).toLocaleDateString('pl-PL')}</div>
                        </div>
                        <div className="mb-2">{comment.content}</div>
                        <div className="text-xs text-premium-light/70 mb-3">Post: {comment.postTitle}</div>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop comments view - table
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
                      {paginatedComments.map(comment => (
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

                {/* Comments Pagination */}
                {totalCommentsPages > 1 && (
                  <div className="flex justify-center py-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentCommentsPage(prev => Math.max(prev - 1, 1))} 
                            className={currentCommentsPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-white hover:text-black"}
                          />
                        </PaginationItem>
                        
                        {isMobile ? (
                          // Simplified pagination for mobile
                          <PaginationItem>
                            <PaginationLink isActive>{currentCommentsPage} / {totalCommentsPages}</PaginationLink>
                          </PaginationItem>
                        ) : (
                          // Full pagination for desktop
                          Array.from({length: Math.min(totalCommentsPages, 5)}, (_, i) => {
                            // Display logic for page numbers
                            let pageNum;
                            if (totalCommentsPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentCommentsPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentCommentsPage >= totalCommentsPages - 2) {
                              pageNum = totalCommentsPages - 4 + i;
                            } else {
                              pageNum = currentCommentsPage - 2 + i;
                            }
                            
                            return (
                              <PaginationItem key={i}>
                                <PaginationLink 
                                  onClick={() => setCurrentCommentsPage(pageNum)}
                                  isActive={currentCommentsPage === pageNum}
                                  className={currentCommentsPage !== pageNum ? "hover:bg-white hover:text-black" : ""}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentCommentsPage(prev => Math.min(prev + 1, totalCommentsPages))} 
                            className={currentCommentsPage === totalCommentsPages ? "pointer-events-none opacity-50" : "hover:bg-white hover:text-black"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
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
        <div className="mb-6">
          <div className={`flex flex-col ${isMobile ? 'space-y-3' : 'items-center justify-between mb-6'} ${!isMobile && 'flex-row'}`}>
            <h2 className="text-xl font-bold">Blog</h2>
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'gap-4'}`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light/50" size={16} />
                <Input
                  placeholder="Wyszukaj po tytule..."
                  className="pl-10 bg-premium-dark/30 border-premium-light/10 w-full"
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
            {isMobile ? (
              // Mobile card view for posts
              <div className="p-4">
                {!Array.isArray(paginatedPosts) || paginatedPosts.length === 0 ? (
                  <div className="py-4 text-center text-premium-light/70">
                    {searchTerm ? 'Brak wyników wyszukiwania' : 'Brak postów. Dodaj pierwszy post, aby zacząć.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedPosts.map(post => (
                      <div key={post.id} className="border border-premium-light/10 rounded-lg p-4">
                        <h3 className="font-medium mb-2">{post.title}</h3>
                        <div className="text-xs text-premium-light/70 mb-3">
                          {new Date(post.date).toLocaleDateString('pl-PL')} • {post.views} wyświetleń
                        </div>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Desktop table view for posts
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
                    {!Array.isArray(paginatedPosts) || paginatedPosts.length === 0 ? (
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
            )}
            
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
                    
                    {isMobile ? (
                      // Simplified pagination for mobile
                      <PaginationItem>
                        <PaginationLink isActive>{currentPostsPage} / {totalPostsPages}</PaginationLink>
                      </PaginationItem>
                    ) : (
                      // Full pagination for desktop
                      Array.from({length: Math.min(totalPostsPages, 5)}, (_, i) => {
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
                      })
                    )}
                    
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
