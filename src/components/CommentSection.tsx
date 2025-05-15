import React, { useState } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { useBlogStore, BlogComment, CommentReply } from '@/utils/blog';
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
import { Trash2, MessageCircle, CornerDownRight } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';
import { useNotifications } from '@/utils/notifications';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [replyToDelete, setReplyToDelete] = useState<{commentId: string, replyId: string} | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { addComment, deleteComment, getPostComments, addReplyToComment, deleteReplyFromComment } = useBlogStore();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addNotification } = useNotifications();
  
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
      setShowGuestDialog(true);
      return;
    }

    if (user) {
      // Get display name from email or user_metadata if available
      const displayName = user.user_metadata?.name || 
                        (user.email ? user.email.split('@')[0] : 'Anonymous');
      
      const profilePicture = user.user_metadata?.avatar_url || '';
      
      addComment(
        postId, 
        user.id, 
        displayName,
        profilePicture, 
        comment.trim()
      );
      
      toast({
        title: "Sukces",
        description: "Komentarz został dodany"
      });
      
      setComment('');
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Błąd",
        description: "Odpowiedź nie może być pusta",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany, aby odpowiedzieć",
        variant: "destructive"
      });
      return;
    }

    if (user) {
      const displayName = user.user_metadata?.name || 
                       (user.email ? user.email.split('@')[0] : 'Anonymous');
      
      const profilePicture = user.user_metadata?.avatar_url || '';
      
      addReplyToComment(
        postId,
        commentId,
        user.id,
        displayName,
        profilePicture,
        replyContent.trim()
      );
      
      toast({
        title: "Sukces",
        description: "Odpowiedź została dodana"
      });
      
      setReplyContent('');
      setReplyingToId(null);
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
    
    // Send notification to admin for approval
    addNotification(
      'Prośba o dodanie komentarza',
      `Gość "${guestName}" chce dodać komentarz do postu "${post?.title || 'Unknown post'}": "${comment}"`,
      'approval_request',
      postId,
      'comment'
    );
    
    setShowGuestDialog(false);
    setComment('');
    
    toast({
      title: "Dziękujemy!",
      description: "Twój komentarz został wysłany do zatwierdzenia."
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    setReplyToDelete({ commentId, replyId });
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

  const confirmDeleteReply = () => {
    if (replyToDelete) {
      deleteReplyFromComment(postId, replyToDelete.commentId, replyToDelete.replyId);
      toast({
        title: "Sukces",
        description: "Odpowiedź została usunięta"
      });
      setReplyToDelete(null);
    }
  };

  const cancelDeleteComment = () => {
    setCommentToDelete(null);
  };

  const cancelDeleteReply = () => {
    setReplyToDelete(null);
  };

  // Ensure comments is defined before rendering
  const commentsLength = comments ? comments.length : 0;
  
  // Function to count all comments including replies
  const getTotalCommentsCount = () => {
    let total = commentsLength;
    comments.forEach(comment => {
      total += (comment.replies?.length || 0);
    });
    return total;
  };

  return (
    <div className="mt-10 pt-8 border-t border-premium-light/10">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <MessageCircle size={20} className="mr-2 text-premium-light/70" />
        Komentarze ({getTotalCommentsCount()})
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
            className="bg-premium-gradient hover:bg-black hover:text-white"
            disabled={!comment.trim()}
          >
            {isAuthenticated ? "Dodaj komentarz" : "Dodaj komentarz jako gość"}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment: BlogComment) => (
            <div key={comment.id}>
              <div className="p-4 rounded-lg bg-premium-dark/50 border border-premium-light/10">
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
                      className="text-premium-light/50 p-1 h-8 w-8 hover:bg-black hover:text-white"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <p className="text-premium-light/90 whitespace-pre-wrap">{comment.content}</p>
                
                <div className="mt-3 flex justify-end">
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className="text-sm text-premium-light/70 hover:bg-black hover:text-white"
                    >
                      Odpowiedz
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Reply input */}
              {replyingToId === comment.id && (
                <div className="ml-6 mt-2">
                  <div className="p-3 rounded-lg bg-premium-dark/30 border border-premium-light/10">
                    <Textarea 
                      placeholder="Napisz odpowiedź..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="mb-2 h-16 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setReplyingToId(null)}
                        className="hover:bg-black hover:text-white"
                      >
                        Anuluj
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyContent.trim()}
                        className="hover:bg-black hover:text-white"
                      >
                        Odpowiedz
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Replies list */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {comment.replies.map((reply: CommentReply) => (
                    <div 
                      key={reply.id} 
                      className="p-3 rounded-lg bg-premium-dark/30 border border-premium-light/10 relative"
                    >
                      {/* Reply arrow indicator */}
                      <div className="absolute -left-5 top-1/2 -translate-y-1/2">
                        <div className={theme === 'light' ? "text-black" : "text-white"}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={reply.userAvatar} />
                            <AvatarFallback className="bg-premium-gradient text-xs">
                              {reply.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{reply.userName}</p>
                              <CornerDownRight className="h-3 w-3 mx-1 text-premium-light/50" />
                              <p className="text-xs text-premium-light/60">
                                {formatDistanceToNow(new Date(reply.date), { addSuffix: true, locale: pl })}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {user && (user.role === 'admin' || user.role === 'moderator' || user.id === reply.userId) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteReply(comment.id, reply.id)}
                            className="text-premium-light/50 p-1 h-6 w-6 hover:bg-black hover:text-white"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-premium-light/90 whitespace-pre-wrap text-sm pl-8">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
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
              <Button 
                variant="outline" 
                onClick={() => setShowGuestDialog(false)}
                className="hover:bg-black hover:text-white"
              >
                Anuluj
              </Button>
              <Button 
                onClick={handleGuestCommentSubmit}
                className="hover:bg-black hover:text-white"
              >
                Wyślij komentarz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialogs */}
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten komentarz?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Komentarz zostanie trwale usunięty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteComment} className="hover:bg-black hover:text-white">Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteComment} className="bg-red-500 text-white hover:bg-black hover:text-white">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete confirmation dialog for replies */}
      <AlertDialog open={!!replyToDelete} onOpenChange={(open) => !open && setReplyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć tę odpowiedź?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Odpowiedź zostanie trwale usunięta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteReply} className="hover:bg-black hover:text-white">Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteReply} className="bg-red-500 text-white hover:bg-black hover:text-white">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentSection;
