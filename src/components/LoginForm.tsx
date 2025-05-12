
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/utils/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const loginFormSchema = z.object({
  email: z.string().email('Wprowadź poprawny adres email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  hideHeader?: boolean;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ hideHeader = false, onSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(data.email, data.password, data.rememberMe);
      
      if (error) {
        toast({
          title: "Błąd logowania",
          description: error.message || "Nieprawidłowy email lub hasło",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witamy z powrotem!"
      });
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 0);
      }
      // Redirect will be handled by AuthProvider
      
    } catch (error: any) {
      toast({
        title: "Błąd logowania",
        description: "Wystąpił nieoczekiwany błąd",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      {!hideHeader && (
        <div className="mb-6 text-center">
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'light' ? "text-gray-900" : "text-white"}`}>
            Zaloguj się
          </h1>
          <p className={`${theme === 'light' ? "text-gray-600" : "text-gray-300"}`}>
            Wprowadź swoje dane, aby się zalogować
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === 'light' ? "text-gray-700" : "text-gray-300"}>
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="email@example.com" 
                    className={`${theme === 'light' ? "bg-white" : "bg-gray-900"} h-10`}
                    {...field} 
                  />
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
                <FormLabel className={theme === 'light' ? "text-gray-700" : "text-gray-300"}>
                  Hasło
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className={`${theme === 'light' ? "bg-white" : "bg-gray-900"} h-10 pr-10`}
                      {...field} 
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button
              variant="link"
              type="button"
              className={`text-premium-purple p-0 hover:${theme === 'light' ? "text-black" : "text-white"}`}
              onClick={() => navigate('/forgot-password')}
            >
              Nie pamiętasz hasła?
            </Button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-premium-gradient hover:bg-premium-purple hover:text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logowanie...
              </span>
            ) : "Zaloguj się"}
          </Button>
          
          <div className="text-center mt-4">
            <span className={theme === 'light' ? "text-gray-600" : "text-gray-300"}>
              Nie masz jeszcze konta?{" "}
            </span>
            <Button
              variant="link"
              type="button"
              className={`p-0 hover:${theme === 'light' ? "text-black" : "text-white"}`}
              onClick={() => navigate('/register')}
            >
              Zarejestruj się
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
