import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useBlogStore } from '@/utils/blog';
import { useAuth } from '@/utils/AuthProvider';
import AdminStatReset from '@/components/AdminStatReset';

// Analytics data
const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const currentMonth = new Date().getMonth();

// Chart color scheme
const colors = {
  primary: '#784dff',
  secondary: '#00a0ff',
  tertiary: '#ff4d8c',
  quaternary: '#4de8ff',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6'
};

const AdminStats = () => {
  const { user } = useAuth();
  const getTotalComments = useBlogStore(state => state.getTotalComments);
  const getTotalLikes = useBlogStore(state => state.getTotalLikes);
  const posts = useBlogStore(state => state.posts);
  
  const [totalViews, setTotalViews] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  
  // Weekly stats (for percentage changes)
  const [weeklyStats, setWeeklyStats] = useState({
    previousWeekViews: 0,
    previousWeekComments: 0,
    previousWeekLikes: 0,
    previousWeekPosts: 0
  });
  
  // Monthly data state
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [isMonthlyDataLoading, setIsMonthlyDataLoading] = useState(true);
  
  // User activity data
  const [activityData, setActivityData] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate total views from all posts
    const views = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    setTotalViews(views);
    
    // Get total comments and likes
    setTotalComments(getTotalComments());
    setTotalLikes(getTotalLikes());
    
    // Get posts count
    setPostsCount(posts.length);
    
    // Simulate previous week stats (for demonstration)
    // In a real app, you would fetch this from your database
    setWeeklyStats({
      previousWeekViews: Math.max(0, views - Math.floor(Math.random() * 50)),
      previousWeekComments: Math.max(0, getTotalComments() - Math.floor(Math.random() * 5)),
      previousWeekLikes: Math.max(0, getTotalLikes() - Math.floor(Math.random() * 10)),
      previousWeekPosts: Math.max(0, posts.length - Math.floor(Math.random() * 2))
    });
    
    // Generate empty monthly data
    const emptyMonthlyData = Array(5).fill(0).map((_, i) => ({
      name: months[(currentMonth - 4 + i + 12) % 12],
      views: 0,
      comments: 0,
      likes: 0,
    }));
    
    // Set initial empty data
    setMonthlyData(emptyMonthlyData);
    
    // Simulate loading monthly data
    const timer = setTimeout(() => {
      setIsMonthlyDataLoading(false);
    }, 1500);
    
    // Generate sample activity data
    const sampleActivityData = [
      { name: 'Poniedziałek', visits: 120, comments: 4, likes: 12 },
      { name: 'Wtorek', visits: 145, comments: 8, likes: 19 },
      { name: 'Środa', visits: 132, comments: 6, likes: 15 },
      { name: 'Czwartek', visits: 167, comments: 9, likes: 21 },
      { name: 'Piątek', visits: 182, comments: 11, likes: 25 },
      { name: 'Sobota', visits: 196, comments: 14, likes: 29 },
      { name: 'Niedziela', visits: 178, comments: 12, likes: 24 },
    ];
    
    setActivityData(sampleActivityData);
    
    return () => clearTimeout(timer);
  }, [posts, getTotalComments, getTotalLikes]);
  
  // Calculate trends (percentage change) based on previous week
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0; // If previous was 0, any increase is 100%
    }
    return Math.round(((current - previous) / previous) * 100);
  };
  
  const viewsTrend = calculateTrend(totalViews, weeklyStats.previousWeekViews);
  const commentsTrend = calculateTrend(totalComments, weeklyStats.previousWeekComments);
  const likesTrend = calculateTrend(totalLikes, weeklyStats.previousWeekLikes);
  const postsTrend = calculateTrend(postsCount, weeklyStats.previousWeekPosts);
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Statystyki</h1>
          <AdminStatReset />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Views Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wyświetlenia</CardTitle>
              <span className={`text-xs font-medium ${viewsTrend > 0 ? 'text-green-500' : viewsTrend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {viewsTrend > 0 ? `+${viewsTrend}%` : `${viewsTrend}%`}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">Ostatnie 7 dni</p>
            </CardContent>
          </Card>

          {/* Comments Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Komentarze</CardTitle>
              <span className={`text-xs font-medium ${commentsTrend > 0 ? 'text-green-500' : commentsTrend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {commentsTrend > 0 ? `+${commentsTrend}%` : `${commentsTrend}%`}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComments}</div>
              <p className="text-xs text-muted-foreground">Ostatnie 7 dni</p>
            </CardContent>
          </Card>

          {/* Likes Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Polubienia</CardTitle>
              <span className={`text-xs font-medium ${likesTrend > 0 ? 'text-green-500' : likesTrend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {likesTrend > 0 ? `+${likesTrend}%` : `${likesTrend}%`}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes}</div>
              <p className="text-xs text-muted-foreground">Ostatnie 7 dni</p>
            </CardContent>
          </Card>

          {/* Posts Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Posty</CardTitle>
              <span className={`text-xs font-medium ${postsTrend > 0 ? 'text-green-500' : postsTrend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {postsTrend > 0 ? `+${postsTrend}%` : `${postsTrend}%`}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postsCount}</div>
              <p className="text-xs text-muted-foreground">Ostatnie 7 dni</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Monthly Statistics */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Miesięczne statystyki</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {isMonthlyDataLoading ? (
                <div className="w-full h-72 flex flex-col items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Ładowanie danych miesięcznych...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(17, 17, 17, 0.9)', 
                        borderColor: 'rgba(120, 77, 255, 0.5)',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="views" fill={colors.primary} name="Wyświetlenia" />
                    <Bar dataKey="comments" fill={colors.secondary} name="Komentarze" />
                    <Bar dataKey="likes" fill={colors.tertiary} name="Polubienia" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Charts Tabs */}
          <Tabs defaultValue="performance" className="col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="performance">Wydajność</TabsTrigger>
                <TabsTrigger value="activity">Aktywność</TabsTrigger>
                <TabsTrigger value="engagement">Zaangażowanie</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wydajność strony</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 17, 17, 0.9)', 
                          borderColor: 'rgba(120, 77, 255, 0.5)',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="visits" 
                        stroke={colors.primary} 
                        fillOpacity={1} 
                        fill="url(#colorVisits)" 
                        name="Odwiedziny"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Other tabs */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Aktywność użytkowników</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 17, 17, 0.9)', 
                          borderColor: 'rgba(120, 77, 255, 0.5)',
                          color: '#fff'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="comments" fill={colors.secondary} name="Komentarze" />
                      <Bar dataKey="likes" fill={colors.tertiary} name="Polubienia" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="engagement">
              <Card>
                <CardHeader>
                  <CardTitle>Zaangażowanie</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={colors.secondary} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.tertiary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={colors.tertiary} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 17, 17, 0.9)', 
                          borderColor: 'rgba(120, 77, 255, 0.5)',
                          color: '#fff'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="comments" 
                        stroke={colors.secondary} 
                        fillOpacity={1} 
                        fill="url(#colorComments)"
                        name="Komentarze"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="likes" 
                        stroke={colors.tertiary} 
                        fillOpacity={1} 
                        fill="url(#colorLikes)"
                        name="Polubienia"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;
