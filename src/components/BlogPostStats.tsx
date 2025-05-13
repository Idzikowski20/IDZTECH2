
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartBar, ChartLine, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface BlogPostStatsProps {
  postId: string;
  postTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const mockData = [
  { date: '01/05', views: 4, likes: 1, comments: 0 },
  { date: '02/05', views: 7, likes: 2, comments: 1 },
  { date: '03/05', views: 5, likes: 0, comments: 0 },
  { date: '04/05', views: 12, likes: 3, comments: 2 },
  { date: '05/05', views: 15, likes: 4, comments: 1 },
  { date: '06/05', views: 8, likes: 1, comments: 0 },
  { date: '07/05', views: 10, likes: 2, comments: 1 },
];

const BlogPostStats = ({ postId, postTitle, isOpen, onClose }: BlogPostStatsProps) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'views' | 'engagement'>('overview');
  
  // In a real implementation, we would fetch these stats from the database
  const totalViews = 61;
  const totalLikes = 13;
  const totalComments = 5;
  
  const fetchPostStats = async (postId: string) => {
    // This would be replaced with a real API call to fetch stats from Supabase
    console.log('Fetching stats for post:', postId);
    // For now, we'll use mock data
  };
  
  React.useEffect(() => {
    if (isOpen) {
      fetchPostStats(postId);
    }
  }, [isOpen, postId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>Statystyki postu</DialogTitle>
          <DialogDescription>
            {postTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center space-x-2 mb-6">
          <Button 
            variant={activeTab === 'overview' ? "default" : "outline"}
            onClick={() => setActiveTab('overview')}
            className={`${activeTab === 'overview' ? 'bg-premium-gradient text-white' : 'hover:bg-white hover:text-black'}`}
          >
            <ChartBar className="mr-2 h-4 w-4" /> 
            Przegląd
          </Button>
          <Button 
            variant={activeTab === 'views' ? "default" : "outline"}
            onClick={() => setActiveTab('views')}
            className={`${activeTab === 'views' ? 'bg-premium-gradient text-white' : 'hover:bg-white hover:text-black'}`}
          >
            <Eye className="mr-2 h-4 w-4" /> 
            Wyświetlenia
          </Button>
          <Button 
            variant={activeTab === 'engagement' ? "default" : "outline"}
            onClick={() => setActiveTab('engagement')}
            className={`${activeTab === 'engagement' ? 'bg-premium-gradient text-white' : 'hover:bg-white hover:text-black'}`}
          >
            <ThumbsUp className="mr-2 h-4 w-4" /> 
            Zaangażowanie
          </Button>
        </div>
        
        <div className="mt-4">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <Eye className="mr-2 h-4 w-4" /> Wyświetlenia
                  </div>
                  <div className="text-2xl font-bold">{totalViews}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Polubienia
                  </div>
                  <div className="text-2xl font-bold">{totalLikes}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MessageSquare className="mr-2 h-4 w-4" /> Komentarze
                  </div>
                  <div className="text-2xl font-bold">{totalComments}</div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Aktywność w ostatnich 7 dniach</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="#3b82f6" name="Wyświetlenia" />
                    <Bar dataKey="likes" fill="#ec4899" name="Polubienia" />
                    <Bar dataKey="comments" fill="#10b981" name="Komentarze" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          
          {activeTab === 'views' && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Wyświetlenia w czasie</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-400">
                Średnio {(totalViews / 7).toFixed(1)} wyświetleń dziennie
              </div>
            </div>
          )}
          
          {activeTab === 'engagement' && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Zaangażowanie użytkowników</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Polubienia w czasie</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="likes" stroke="#ec4899" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Komentarze w czasie</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="comments" stroke="#10b981" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Współczynnik zaangażowania: {((totalLikes + totalComments) / totalViews * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostStats;
