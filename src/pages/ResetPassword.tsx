
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import PageDotAnimation from '@/components/PageDotAnimation';

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

  // Check if user arrived here from a password reset link (hash in URL)
  const [validResetToken, setValidResetToken] = useState(false);
  
  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if we have query params that indicate PKCE flow
        const params = new URLSearchParams(window.location.search);
        if (params.get('type') === 'recovery') {
          setValidResetToken(true);
        }
      }
    };
    
    handleAuthStateChange();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidResetToken(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    } catch (error: any) {
      toast({
        title: "Wystąpił błąd",
        description: error.message || "Nie udało się zresetować hasła. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!validResetToken) {
    return (
      <div className="min-h-screen bg-premium-dark">
        <Navbar />
        <PageDotAnimation />
        <div className="container mx-auto pt-32 pb-20">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-black">Nieprawidłowy link</h1>
            <p className="text-gray-700 mb-6">
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

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      <PageDotAnimation />
      <div className="container mx-auto pt-32 pb-20">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 text-black">Ustaw nowe hasło</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField 
                control={form.control} 
                name="password" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Nowe hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-white border-gray-300 text-black" {...field} />
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
                    <FormLabel className="text-gray-800">Potwierdź hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-white border-gray-300 text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <Button type="submit" className="w-full bg-premium-gradient" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Przetwarzanie...
                  </span>
                ) : "Ustaw nowe hasło"}
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
