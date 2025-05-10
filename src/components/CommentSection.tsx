
import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { useBlogStore, BlogComment } from '@/utils/blog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Heart, MessageCircle } from 'lucide-react';
import { sendApprovalRequest } from '@/utils/notifications';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { addComment, deleteComment, getPostComments } = useBlogStore();
  const { toast } = useToast();
  
  // Add null check and default to empty array if comments are undefined
  const comments = getPostComments(postId) || [];

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      toast({
        title: "Błąd",
        description: "Komentarz nie może być pusty",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      // For guest users, show dialog to enter name
      setShowGuestDialog(true);
      return;
    }

    if (user) {
      try {
        addComment(
          postId, 
          user.id, 
          `${user.name} ${user.lastName || ''}`.trim(), 
          user.profilePicture, 
          comment.trim()
        );
        
        toast({
          title: "Sukces",
          description: "Komentarz został dodany"
        });
        
        setComment('');
      } catch (error) {
        console.error("Error adding comment:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się dodać komentarza",
          variant: "destructive"
        });
      }
    }
  };

  const handleGuestCommentSubmit = () => {
    if (!guestName.trim()) {
      toast({
        title: "Wymagane imię",
        description: "Proszę podać swoje imię",
        variant: "destructive"
      });
      return;
    }
    
    const post = useBlogStore.getState().posts.find(p => p.id === postId);
    
    try {
      // Send notification to admin for approval
      sendApprovalRequest(
        'guest', // Guest user ID
        guestName, // Guest name
        postId,
        'comment',
        'Prośba o dodanie komentarza',
        `Gość "${guestName}" chce dodać komentarz do postu "${post?.title || 'Unknown post'}": "${comment}".`
      );
      
      setShowGuestDialog(false);
      setComment('');
      
      toast({
        title: "Dziękujemy!",
        description: "Twój komentarz został wysłany do zatwierdzenia."
      });
    } catch (error) {
      console.error("Error submitting guest comment:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas wysyłania komentarza",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      deleteComment(postId, commentToDelete);
      toast({
        title: "Sukces",
        description: "Komentarz został usunięty"
      });
      setCommentToDelete(null);
    }
  };

  const cancelDeleteComment = () => {
    setCommentToDelete(null);
  };

  return (
    <div className="mt-10 pt-8 border-t border-premium-light/10">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <MessageCircle size={20} className="mr-2 text-premium-light/70" />
        Komentarze ({comments.length})
      </h3>

      {/* Add comment form */}
      <div className="mb-8">
        <Textarea 
          placeholder="Dodaj komentarz..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-3 h-24"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleCommentSubmit} 
            className="bg-premium-gradient hover:opacity-90 hover:text-white"
            disabled={!comment.trim()}
          >
            Dodaj komentarz
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment: BlogComment) => (
            <div 
              key={comment.id} 
              className="p-4 rounded-lg bg-premium-dark/50 border border-gray-600"
            >
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={comment.userAvatar} />
                    <AvatarFallback className="bg-premium-gradient text-xs">
                      {comment.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.userName}</p>
                    <p className="text-xs text-premium-light/60">
                      {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: pl })}
                    </p>
                  </div>
                </div>
                
                {user && (user.role === 'admin' || user.role === 'moderator' || user.id === comment.userId) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-premium-light/50 hover:text-red-500 hover:bg-transparent p-1 h-8 w-8"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <p className="text-premium-light/90 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-premium-light/50">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>Bądź pierwszy i dodaj komentarz!</p>
          </div>
        )}
      </div>

      {/* Guest comment dialog */}
      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj komentarz jako gość</DialogTitle>
            <DialogDescription>
              Podaj swoje imię, aby dodać komentarz. Twój komentarz zostanie wysłany do zatwierdzenia.
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
              <Button variant="outline" onClick={() => setShowGuestDialog(false)} className="hover:text-black">
                Anuluj
              </Button>
              <Button onClick={handleGuestCommentSubmit} className="hover:text-white">
                Wyślij komentarz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten komentarz?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Komentarz zostanie trwale usunięty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteComment} className="hover:text-black">Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteComment} className="bg-red-500 text-white hover:bg-red-600 hover:text-white">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentSection;
