
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/auth';
import { useBlogStore } from '@/utils/blog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [guestName, setGuestName] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { toggleLike, hasUserLiked, addGuestLike } = useBlogStore();
  const { toast } = useToast();
  
  // Make this safe against undefined values
  const post = useBlogStore.getState().posts.find(p => p.id === postId);

  const handleLikeClick = () => {
    if (isAuthenticated && user) {
      toggleLike(postId, user.id);
      
      // Make this safe by checking hasUserLiked after toggling
      const isLiked = user && hasUserLiked(postId, user.id);
      
      if (isLiked) {
        toast({
          title: "Polubiono post",
          description: "Dziękujemy za Twoją reakcję"
        });
      }
    } else {
      // For guest users, show dialog to enter name
      setShowDialog(true);
    }
  };
  
  const handleGuestLike = () => {
    if (!guestName.trim()) {
      toast({
        title: "Wymagane imię",
        description: "Proszę podać swoje imię",
        variant: "destructive"
      });
      return;
    }
    
    // Add guest like directly without approval
    const guestId = `guest-${Date.now()}`;
    addGuestLike(postId, guestId, guestName);
    setGuestName('');
    setShowDialog(false);
    
    toast({
      title: "Dziękujemy!",
      description: "Twoja reakcja została dodana."
    });
  };

  // Check if the post is liked by current user (or guest) - with null/undefined checks
  const isLiked = user && postId ? hasUserLiked(postId, user.id) : false;

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLikeClick}
        className={cn(
          "flex items-center gap-2 transition-colors",
          isLiked ? "text-red-500 hover:text-black" : "text-premium-light/70 hover:text-black"
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

      {/* Guest like dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Polub jako gość</DialogTitle>
            <DialogDescription>
              Podaj swoje imię, aby polubić ten post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Twoje imię</Label>
              <Input 
                id="name" 
                placeholder="Jan Kowalski" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="hover:text-black">
                Anuluj
              </Button>
              <Button onClick={handleGuestLike} className="hover:text-black">
                Polub
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LikeButton;
