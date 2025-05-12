
import React from 'react';
import { Shield, Star, Clock, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

type UserRole = 'admin' | 'moderator' | 'blogger' | 'user';

interface User {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  profilePicture: string | null;
  role: UserRole;
  lastLogin: string | null;
  createdAt: string;
}

interface UserSummaryProps {
  user: User | null;
}

const UserSummary: React.FC<UserSummaryProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-premium-dark/50 border border-premium-light/10 rounded-lg p-6 text-center">
        <p>Brak danych użytkownika</p>
      </div>
    );
  }

  return (
    <div className="bg-premium-dark/50 border border-premium-light/10 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Shield className="text-premium-purple mr-2" size={24} />
        Administrator systemu
      </h3>
      
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20">
          {user.profilePicture ? (
            <AvatarImage src={user.profilePicture} />
          ) : (
            <AvatarFallback className="bg-premium-gradient text-2xl">
              {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h4 className="text-lg font-semibold">{user.name || user.email.split('@')[0]}</h4>
          <p className="text-premium-light/70">{user.role === 'admin' ? 'Administrator' : user.role}</p>
          <div className="flex items-center text-sm text-premium-light/60 mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {user.createdAt 
              ? `Konto od: ${format(new Date(user.createdAt), 'dd.MM.yyyy', { locale: pl })}`
              : 'Data utworzenia niedostępna'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-3 bg-premium-dark border border-premium-light/5 rounded-lg hover:bg-white hover:text-black transition-colors">
          <Star className="h-6 w-6 mb-1 text-amber-500" />
          <span className="text-sm">Rola</span>
          <span className="font-bold">
            {user.role === 'admin' ? 'Administrator' : 
             user.role === 'moderator' ? 'Moderator' :
             user.role === 'blogger' ? 'Bloger' : 'Użytkownik'}
          </span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-premium-dark border border-premium-light/5 rounded-lg hover:bg-white hover:text-black transition-colors">
          <Clock className="h-6 w-6 mb-1 text-blue-500" />
          <span className="text-sm">Ostatnie logowanie</span>
          <span className="font-bold">
            {user.lastLogin
              ? format(new Date(user.lastLogin), 'HH:mm dd.MM.yyyy', { locale: pl })
              : 'Brak danych'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 p-3 border border-premium-light/10 rounded-lg bg-premium-dark/30">
        <h5 className="text-sm font-semibold mb-2">Uprawnienia:</h5>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Pełny dostęp do CMS
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Zarządzanie użytkownikami
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Konfiguracja systemu
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Publikowanie treści
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSummary;
