
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabaseClient';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  confirmPassword: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków')
}).refine(data => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Sprawdź, czy użytkownik przybył tu z linku resetującego hasło (hash w URL)
  const [validResetToken, setValidResetToken] = useState(false);
  
  useEffect(() => {
    // Nasłuchuj na zmiany auth state, które mogą być spowodowane tokenem resetującym hasło
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidResetToken(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Jeśli nie mamy ważnego tokenu resetującego, wyświetl komunikat o błędzie
  if (!validResetToken) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <div className="container mx-auto pt-32 pb-20">
          <div className="max-w-md mx-auto bg-premium-dark/50 p-8 rounded-xl border border-premium-light/10 shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-6">Nieprawidłowy link</h1>
            <p className="text-gray-400 mb-6">
              Link do resetowania hasła jest nieprawidłowy lub wygasł.
            </p>
            <Button onClick={() => navigate('/forgot-password')} className="bg-premium-gradient">
              Wyślij nowy link
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.password
      });
      
      if (error) {
        toast({
          title: "Wystąpił błąd",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Hasło zresetowane",
          description: "Możesz się teraz zalogować używając nowego hasła."
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się zresetować hasła. Spróbuj ponownie.",
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
              <Lock className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Ustaw nowe hasło</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField 
                control={form.control} 
                name="password" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nowe hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-gray-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                control={form.control} 
                name="confirmPassword" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potwierdź hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-gray-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <Button type="submit" className="w-full bg-premium-gradient" disabled={isLoading}>
                {isLoading ? "Resetowanie..." : "Ustaw nowe hasło"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
