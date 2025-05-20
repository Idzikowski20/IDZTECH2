import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import PageDotAnimation from '@/components/PageDotAnimation';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { isPasswordCompromised, passwordSchema } from '@/utils/passwordValidation';
import { useAuth } from '@/utils/AuthProvider';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isPassCompromised, setIsPassCompromised] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(user, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: 'user'
      });

      toast({
        title: 'Rejestracja udana',
        description: 'Możesz się teraz zalogować.'
      });

      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
      toast({
        title: 'Błąd rejestracji',
        description: 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Check password against compromised list when it changes
  const passwordCheck = password && password.length >= 4 ? isPasswordCompromised(password) : false;
  
  // Effect to check password security
  if (password && password.length >= 4) {
    const checkPassword = async () => {
      const compromised = await passwordCheck;
      setIsPassCompromised(compromised);
      
      if (compromised) {
        setError('To hasło jest zbyt popularne i znane. Wybierz bezpieczniejsze hasło.');
      }
    };
    
    checkPassword();
  }

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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="sr-only">
                Imię i nazwisko
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Imię i nazwisko"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Adres email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adres email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Hasło
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <PasswordStrengthIndicator password={password} />

            <div>
              <button
                type="submit"
                disabled={loading || isPassCompromised}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-premium-gradient hover:bg-premium-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-purple"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejestracja...
                  </span>
                ) : "Zarejestruj się"}
              </button>
            </div>
          </form>
          
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
}
