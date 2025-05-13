
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
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
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';

interface BlogPostStatsProps {
  post?: any;
  postId?: string; 
  postTitle?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const BlogPostStats: React.FC<BlogPostStatsProps> = ({ post, postId, postTitle, isOpen, onClose }) => {
  const [postData, setPostData] = useState<any>(post);
  const [open, setOpen] = useState(isOpen || false);

  // Fetch post data if postId is provided but no post object
  useEffect(() => {
    async function fetchPostData() {
      if (postId && !post) {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', postId)
            .single();
            
          if (error) throw error;
          if (data) setPostData(data);
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      }
    }
    
    fetchPostData();
  }, [postId, post]);

  useEffect(() => {
    setOpen(isOpen || false);
  }, [isOpen]);
  
  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (!newOpenState && onClose) {
      onClose();
    }
  };
  
  // If we don't have post data yet, show loading or return null
  if (!postData && !post) {
    if (open) {
      return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Loading post statistics...</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-purple"></div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  }
  
  const displayPost = postData || post;
  const title = displayPost?.title || postTitle || 'Post';
  
  // Calculate stats
  const commentCount = Array.isArray(displayPost?.comments) ? displayPost.comments.length : 0;
  const likesCount = Array.isArray(displayPost?.likes) ? displayPost.likes.length : 0;
  const views = displayPost?.views || 0;
  const dateStr = displayPost?.created_at || displayPost?.date || new Date().toISOString();
  const postDate = new Date(dateStr);
  const viewsPerDay = views / (Math.max(1, Math.ceil((new Date().getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))));
  const engagementRate = views > 0 ? ((commentCount + likesCount) / views) * 100 : 0;
  
  // Format creation date
  const formattedDate = postDate.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate days since publication
  const daysSincePublication = Math.ceil((new Date().getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

  // If this is a button trigger version, return dialog with button trigger
  if (!isOpen && !open) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)} 
        className="bg-transparent text-blue-400 hover:text-white hover:bg-blue-500 transition-colors border-none"
      >
        <BarChart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Statystyki postu: {title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-premium-dark/40 border border-premium-light/10 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-full mr-3">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Wyświetlenia</p>
              <p className="text-xl font-semibold">{views}</p>
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
              {displayPost?.categories && displayPost.categories.map((category: string, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{category}</span>
                  <span className="text-gray-400">#{index + 1}</span>
                </div>
              ))}
              {(!displayPost?.categories || displayPost.categories.length === 0) && (
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
