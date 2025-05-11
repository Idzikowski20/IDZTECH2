
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Checkbox } from '@/components/ui/checkbox';
import PageDotAnimation from '@/components/PageDotAnimation';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, isAuthenticated, user } = useAuth();

  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/admin';

  // Log state for debugging
  useEffect(() => {
    console.log("Login page - Auth state:", {
      isAuthenticated,
      from,
      currentPath: location.pathname,
      user: user ? "User exists" : "No user"
    });
    
    // Redirect if already logged in
    if (isAuthenticated && user) {
      console.log("Already authenticated, redirecting to:", from);
      navigate(from);
    }
  }, [isAuthenticated, navigate, from, location.pathname, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Błąd",
        description: "Proszę wypełnić wszystkie pola",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login");
      const { error } = await signIn(email, password, rememberMe);
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Błąd logowania",
          description: error.message || "Niepoprawny email lub hasło",
          variant: "destructive"
        });
        setIsLoading(false);
      } else {
        // Success case - manually redirect
        console.log("Login successful, redirecting to:", from);
        navigate(from);
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Błąd logowania",
        description: error.message || "Wystąpił nieoczekiwany błąd podczas logowania",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      <PageDotAnimation />
      <div className="container mx-auto pt-32 pb-20">
        <div className="max-w-md mx-auto bg-black/80 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Logowanie</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
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
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Hasło</Label>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-premium-purple hover:text-white"
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  disabled={isLoading}
                >
                  Nie pamiętasz hasła?
                </Button>
              </div>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Zapamiętaj mnie na tym urządzeniu (30 dni)
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-premium-gradient hover:bg-white hover:text-black" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie
                </span>
              ) : "Zaloguj się"}
            </Button>
            
            <div className="text-center mt-4">
              <span className="text-premium-light/70">Nie masz jeszcze konta? </span>
              <Button
                variant="link"
                type="button"
                className="p-0 hover:text-white"
                onClick={() => navigate('/register')}
              >
                Zarejestruj się
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
