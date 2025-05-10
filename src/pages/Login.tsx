
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Wprowadź poprawny adres email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków')
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        toast({
          title: "Logowanie udane",
          description: "Przekierowujemy do panelu administratora"
        });
        navigate('/admin');
      } else {
        toast({
          title: "Błąd logowania",
          description: "Niepoprawny email lub hasło",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd logowania",
        description: "Spróbuj ponownie później",
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
              <LogIn className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Logowanie do panelu</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField 
                control={form.control} 
                name="email" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nazwa@example.com" className="bg-gray-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="password" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-slate-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <Button type="submit" className="w-full bg-premium-gradient" disabled={isLoading}>
                {isLoading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-premium-light/70">
              Nie masz jeszcze konta?{' '}
              <Link to="/register" className="text-premium-purple hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
