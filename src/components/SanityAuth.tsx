
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanityAuth } from '@/utils/SanityAuthProvider';
import { loginWithSanity, registerUser } from '@/utils/authSanity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register';

const SanityAuth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useSanityAuth(); // Using the correct auth context
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const result = await loginWithSanity(email, password);
        
        if (result.success && result.user && result.token) {
          // Store token in localStorage or secure cookies
          localStorage.setItem('authToken', result.token);
          
          // Update auth context
          login(result.user);
          
          toast({
            title: 'Zalogowano pomyślnie',
            description: `Witaj, ${result.user.name}!`,
          });
          
          navigate('/');
        } else {
          toast({
            title: 'Błąd logowania',
            description: result.error || 'Nieprawidłowe dane logowania',
            variant: 'destructive',
          });
        }
      } else {
        // Register mode
        if (!name || !email || !password) {
          toast({
            title: 'Błąd rejestracji',
            description: 'Wypełnij wszystkie wymagane pola',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        const result = await registerUser({
          name,
          lastName,
          email,
          password
        });
        
        if (result.success && result.user && result.token) {
          // Store token
          localStorage.setItem('authToken', result.token);
          
          // Update auth context
          login(result.user);
          
          toast({
            title: 'Rejestracja udana',
            description: `Witaj, ${result.user.name}!`,
          });
          
          navigate('/');
        } else {
          toast({
            title: 'Błąd rejestracji',
            description: result.error || 'Nie udało się utworzyć konta',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Błąd',
        description: 'Wystąpił problem z autoryzacją. Spróbuj ponownie później.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-premium-dark/50 border border-premium-light/10 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Imię *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-950"
                placeholder="Jan"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Nazwisko
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-slate-950"
                placeholder="Kowalski"
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-950"
            placeholder="email@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Hasło *
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-950"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-premium-gradient hover:bg-white hover:text-black"
          disabled={isLoading}
        >
          {isLoading ? 'Przetwarzanie...' : mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        {mode === 'login' ? (
          <p>
            Nie masz konta?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="text-premium-purple hover:underline"
            >
              Zarejestruj się
            </button>
          </p>
        ) : (
          <p>
            Masz już konto?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-premium-purple hover:underline"
            >
              Zaloguj się
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default SanityAuth;
