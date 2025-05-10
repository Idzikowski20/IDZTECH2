
import React from 'react';
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
import { useAuth } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

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
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    const success = await login(data.email, data.password, data.rememberMe);
    
    if (success) {
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witamy z powrotem!"
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin');
      }
    } else {
      toast({
        title: "Błąd logowania",
        description: "Nieprawidłowy email lub hasło",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {!hideHeader && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Zaloguj się</h1>
          <p className="text-premium-light/70">
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button
              variant="link"
              type="button"
              className="text-premium-light/70"
              onClick={() => navigate('/forgot-password')}
            >
              Nie pamiętasz hasła?
            </Button>
          </div>
          
          <Button type="submit" className="w-full bg-premium-gradient">
            Zaloguj się
          </Button>
          
          <div className="text-center mt-4">
            <span className="text-premium-light/70">Nie masz jeszcze konta? </span>
            <Button
              variant="link"
              type="button"
              className="p-0"
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
