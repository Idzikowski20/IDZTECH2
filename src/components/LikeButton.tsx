
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/auth';
import { useBlogStore } from '@/utils/blog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoginForm from '@/components/LoginForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toggleLike, hasUserLiked } = useBlogStore();
  const { toast } = useToast();

  const handleLikeClick = () => {
    if (!isAuthenticated || !user) {
      setShowLoginDialog(true);
      return;
    }

    toggleLike(postId, user.id);
    
    const isLiked = hasUserLiked(postId, user.id);
    
    if (isLiked) {
      toast({
        title: "Polubiono post",
        description: "Dziękujemy za Twoją reakcję"
      });
    }
  };

  const isLiked = user ? hasUserLiked(postId, user.id) : false;

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLikeClick}
        className={cn(
          "flex items-center gap-2 transition-colors",
          isLiked ? "text-red-500 hover:text-red-600" : "text-premium-light/70 hover:text-premium-light"
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

      {/* Login dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zaloguj się, aby polubić post</DialogTitle>
            <DialogDescription>
              Tylko zalogowani użytkownicy mogą polubić posty. Zaloguj się lub utwórz konto.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <LoginForm hideHeader={true} onSuccess={() => setShowLoginDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LikeButton;
