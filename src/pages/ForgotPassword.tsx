
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/utils/auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Wprowadź poprawny adres email')
});

const ForgotPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      setEmailSent(true);
      toast({
        title: "Link resetujący hasło wysłany",
        description: "Sprawdź swoją skrzynkę email, aby zresetować hasło"
      });
    } catch (error) {
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się wysłać linku resetującego hasło",
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
              <Mail className="text-white" size={24} />
            </div>
          </div>
          
          {!emailSent ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-6">Zapomniałeś hasła?</h1>
              <p className="text-center text-gray-400 mb-6">
                Podaj adres email, a wyślemy Ci link do zresetowania hasła
              </p>
              
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
                  
                  <Button type="submit" className="w-full bg-premium-gradient" disabled={isLoading}>
                    {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-6">Email wysłany!</h1>
              <p className="text-gray-400 mb-6">
                Na adres email {form.getValues().email} został wysłany link do resetowania hasła. 
                Sprawdź swoją skrzynkę odbiorczą i postępuj zgodnie z instrukcjami.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/login">Powrót do logowania</Link>
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-premium-light/70">
              <Link to="/login" className="text-premium-purple hover:underline">
                Powrót do logowania
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
