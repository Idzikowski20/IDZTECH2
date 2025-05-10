
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Błąd",
          description: error.message || "Wystąpił błąd podczas wysyłania linku resetującego hasło",
          variant: "destructive"
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Link został wysłany",
          description: "Sprawdź swoją skrzynkę e-mail i kliknij link resetujący hasło"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      <div className="container mx-auto pt-32 pb-20">
        <div className="max-w-md mx-auto bg-premium-dark/50 p-8 rounded-xl border border-premium-light/10 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center">
              <KeyRound className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Resetowanie hasła</h1>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <p className="text-premium-light/80">
                Link do resetowania hasła został wysłany na adres <strong>{email}</strong>.
              </p>
              <p className="text-premium-light/80">
                Sprawdź swoją skrzynkę e-mail i kliknij link, aby zresetować hasło.
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                className="mt-4 bg-premium-gradient"
              >
                Powrót do logowania
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="nazwa@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-950"
                />
              </div>
              
              <div className="space-y-4">
                <Button type="submit" className="w-full bg-premium-gradient" disabled={isLoading}>
                  {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Powrót do logowania
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
