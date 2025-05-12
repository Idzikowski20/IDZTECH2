
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/utils/themeContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/admin';

  // Check auth state once when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle redirect if user is authenticated
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user) {
      console.log("Login page - User is authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, user, isCheckingAuth]);

  // Handle login submission
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
      }
      // Success will be handled by the redirect in useEffect
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

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-premium-dark">
        <Loader2 className="h-12 w-12 animate-spin text-premium-purple" />
      </div>
    );
  }

  return (
    <div className={theme === 'light' ? "min-h-screen bg-white" : "min-h-screen bg-premium-dark"}>
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-md mx-auto ${theme === 'light' ? "bg-white" : "bg-black"} p-6 md:p-8 rounded-xl border ${theme === 'light' ? "border-gray-200" : "border-gray-700"} shadow-lg`}>
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
          </div>
          
          <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'light' ? "text-black" : "text-white"}`}>
            Logowanie
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className={theme === 'light' ? "text-gray-700" : "text-gray-300"}
              >
                Email
              </Label>
              <Input 
                id="email"
                type="email"
                placeholder="nazwa@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={`${theme === 'light' ? "bg-white border-gray-300" : "bg-gray-900 border-gray-700"} h-11`}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label 
                  htmlFor="password" 
                  className={theme === 'light' ? "text-gray-700" : "text-gray-300"}
                >
                  Hasło
                </Label>
                <Button 
                  variant="link" 
                  className={`p-0 h-auto ${theme === 'light' ? "text-premium-purple hover:text-black" : "text-premium-purple hover:text-white"}`}
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  disabled={isLoading}
                >
                  Nie pamiętasz hasła?
                </Button>
              </div>
              
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`${theme === 'light' ? "bg-white border-gray-300" : "bg-gray-900 border-gray-700"} h-11 pr-10`}
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
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <Label 
                htmlFor="rememberMe" 
                className={`text-sm ${theme === 'light' ? "text-gray-700" : "text-gray-300"}`}
              >
                Zapamiętaj mnie na tym urządzeniu
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-premium-gradient hover:bg-premium-purple hover:text-white h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logowanie...
                </span>
              ) : "Zaloguj się"}
            </Button>
            
            <div className="text-center mt-4">
              <span className={`text-sm ${theme === 'light' ? "text-gray-600" : "text-gray-400"}`}>
                Nie masz jeszcze konta?{" "}
              </span>
              <Button
                variant="link"
                type="button"
                className={`p-0 text-sm ${theme === 'light' ? "text-premium-purple hover:text-black" : "text-premium-purple hover:text-white"}`}
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
