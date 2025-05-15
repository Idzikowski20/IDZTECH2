
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addGuestCommentRequest } from '@/utils/notifications';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuestCommentFormProps {
  postId: string;
  postTitle: string;
  onSubmit?: () => void;
}

const GuestCommentForm: React.FC<GuestCommentFormProps> = ({ postId, postTitle, onSubmit }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Błąd",
        description: "Imię i komentarz są wymagane",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add a notification for approval request
      addGuestCommentRequest(postId, postTitle, name, comment);
      
      // Clear form
      setName('');
      setComment('');
      
      // Show success message
      toast({
        title: "Komentarz wysłany",
        description: "Twój komentarz został wysłany do moderacji.",
      });
      
      // Trigger callback if provided
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać komentarza",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <Label htmlFor="guest-name">Imię</Label>
        <Input
          id="guest-name"
          placeholder="Wpisz swoje imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="guest-comment">Komentarz</Label>
        <Textarea
          id="guest-comment"
          placeholder="Wpisz swój komentarz"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          className="resize-none"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || !name.trim() || !comment.trim()}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wysyłanie...
          </>
        ) : (
          'Wyślij komentarz'
        )}
      </Button>
      <p className="text-xs text-premium-light/60 text-center">
        Komentarz zostanie wyświetlony po zatwierdzeniu przez administratora
      </p>
    </form>
  );
};

export default GuestCommentForm;
