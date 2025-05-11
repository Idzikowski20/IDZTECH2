
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/AuthProvider';
import { useBlogStore } from '@/utils/blog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const { isAuthenticated, user } = useAuth();
  const { toggleLike, hasUserLiked, addGuestLike, hasDeviceLiked, toggleDeviceLike } = useBlogStore();
  const { toast } = useToast();
  
  // Make this safe against undefined values
  const post = useBlogStore.getState().posts.find(p => p.id === postId);
  const [isLiked, setIsLiked] = useState(false);

  // Check if post is liked on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLiked(hasUserLiked(postId, user.id));
    } else {
      // Check device-based likes for guest users
      setIsLiked(hasDeviceLiked(postId));
    }
  }, [isAuthenticated, user, postId, hasUserLiked, hasDeviceLiked]);

  const handleLikeClick = () => {
    if (isAuthenticated && user) {
      toggleLike(postId, user.id);
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      if (newLikedState) {
        toast({
          title: "Polubiono post",
          description: "Dziękujemy za Twoją reakcję"
        });
      }
    } else {
      // For guest users, use device ID to track likes
      toggleDeviceLike(postId);
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      if (newLikedState) {
        toast({
          title: "Polubiono post",
          description: "Dziękujemy za Twoją reakcję"
        });
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLikeClick}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isLiked ? "text-red-500 hover:text-red-600" : "text-premium-light/70 hover:text-black"
      )}
    >
      <Heart 
        size={20} 
        className={cn(
          "transition-all", 
          isLiked && "fill-red-500",
          isLiked && "scale-110"
        )}
      />
      <span className="text-sm">
        {isLiked ? "Polubiono" : "Polub"}
      </span>
    </Button>
  );
};

export default LikeButton;
