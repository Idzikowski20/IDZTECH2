
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  BarChart,
  Eye, 
  MessageSquare, 
  Heart, 
  Calendar, 
  User,
  Clock
} from "lucide-react";
import { BlogPost } from '@/utils/blog';
import { Button } from './ui/button';

interface BlogPostStatsProps {
  post: BlogPost;
}

const BlogPostStats: React.FC<BlogPostStatsProps> = ({ post }) => {
  // Calculate stats
  const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const viewsPerDay = post.views / (Math.max(1, Math.ceil((new Date().getTime() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24))));
  const engagementRate = post.views > 0 ? ((commentCount + likesCount) / post.views) * 100 : 0;
  
  // Format creation date
  const formattedDate = new Date(post.date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate days since publication
  const daysSincePublication = Math.ceil((new Date().getTime() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent text-blue-400 hover:text-white hover:bg-blue-500 transition-colors border-none"
        >
          <BarChart className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Statystyki postu: {post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-full mr-3">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Wyświetlenia</p>
              <p className="text-xl font-semibold">{post.views}</p>
            </div>
          </div>
          
          <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-green-500/20 rounded-full mr-3">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Komentarze</p>
              <p className="text-xl font-semibold">{commentCount}</p>
            </div>
          </div>
          
          <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-red-500/20 rounded-full mr-3">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Polubienia</p>
              <p className="text-xl font-semibold">{likesCount}</p>
            </div>
          </div>
          
          <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-amber-500/20 rounded-full mr-3">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Data publikacji</p>
              <p className="text-sm font-semibold">{formattedDate}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analiza szczegółowa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-2 text-blue-400" />
                <h4 className="text-sm font-medium">Czas od publikacji</h4>
              </div>
              <p className="text-2xl font-bold">{daysSincePublication} dni</p>
            </div>
            
            <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Eye className="h-4 w-4 mr-2 text-green-400" />
                <h4 className="text-sm font-medium">Średnio wyświetlenia / dzień</h4>
              </div>
              <p className="text-2xl font-bold">{viewsPerDay.toFixed(1)}</p>
            </div>
            
            <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 mr-2 text-purple-400" />
                <h4 className="text-sm font-medium">Współczynnik zaangażowania</h4>
              </div>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{engagementRate.toFixed(2)}%</p>
                <p className="text-xs text-gray-400 ml-2">(komentarze + polubienia) / wyświetlenia</p>
              </div>
            </div>
          </div>

          <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-medium mb-3">Statystyki kategorii</h4>
            <div className="space-y-2">
              {post.categories && post.categories.map((category, index) => (
                <div key={index} className="flex justify-between">
                  <span>{category}</span>
                  <span className="text-gray-400">#{index + 1}</span>
                </div>
              ))}
              {(!post.categories || post.categories.length === 0) && (
                <p className="text-gray-400 italic">Brak kategorii</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostStats;
