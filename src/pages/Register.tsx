
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import PageDotAnimation from '@/components/PageDotAnimation';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { isPasswordCompromised, passwordSchema } from '@/utils/passwordValidation';
import { useAuth } from '@/utils/AuthProvider';

// Enhanced register schema with custom password validation
const registerSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  email: z.string().email('Wprowadź poprawny adres email'),
  password: passwordSchema
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPassCompromised, setIsPassCompromised] = useState(false);
  const { signUp } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  // Check password against compromised list when it changes
  const password = form.watch('password');
  
  // Effect to check password security
  React.useEffect(() => {
    const checkPassword = async () => {
      if (password && password.length >= 4) {
        const compromised = await isPasswordCompromised(password);
        setIsPassCompromised(compromised);
        
        if (compromised) {
          form.setError('password', { 
            type: 'manual', 
            message: 'To hasło jest zbyt popularne i znane. Wybierz bezpieczniejsze hasło.' 
          });
        }
      }
    };
    
    checkPassword();
  }, [password, form]);

  const onSubmit = async (values: RegisterFormData) => {
    if (isPassCompromised) {
      toast({
        title: "Hasło zagrożone",
        description: "To hasło znajduje się na liście wyciekniętych haseł. Wybierz inne hasło.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Register the user with Supabase through our Auth provider
      const { error } = await signUp(values.email, values.password, {
        name: values.name,
      });
      
      if (error) {
        toast({
          title: "Błąd rejestracji",
          description: error.message || "Wystąpił błąd podczas rejestracji",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Rejestracja udana",
          description: "Teraz możesz się zalogować"
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      <PageDotAnimation />
      <div className="container mx-auto pt-32 pb-20">
        <div className="max-w-md mx-auto bg-premium-dark/50 p-8 rounded-xl border border-premium-light/10 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center">
              <UserPlus className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 text-white">Rejestracja</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField 
                control={form.control} 
                name="name" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan Kowalski" className="bg-slate-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="email" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nazwa@example.com" className="bg-slate-950" {...field} />
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
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="bg-slate-950 pr-10" 
                          {...field} 
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <PasswordStrengthIndicator password={field.value} />
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <Button type="submit" className="w-full bg-premium-gradient hover:bg-premium-purple hover:text-white" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejestracja...
                  </span>
                ) : "Zarejestruj się"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-premium-light/70">
              Masz już konto?{' '}
              <Link to="/login" className="text-premium-purple hover:underline hover:text-white">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
