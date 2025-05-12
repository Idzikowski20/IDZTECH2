
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, BarChart, FileText, UserIcon } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
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
  bio?: string;
  jobTitle?: string;
  postsCreated?: number;
  totalViews?: number;
}

interface UserProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const userRoles: Record<UserRole, string> = {
  'admin': 'Administrator',
  'moderator': 'Moderator',
  'blogger': 'Bloger',
  'user': 'Użytkownik',
};

const UserProfileDialog = ({ user, open, onOpenChange }: UserProfileDialogProps) => {
  if (!user) return null;

  const joinedDate = user.createdAt ? new Date(user.createdAt) : null;
  const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Profil użytkownika</DialogTitle>
          <DialogDescription>
            Szczegółowe informacje o użytkowniku
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profilePicture || undefined} alt={user.name || ''} />
              <AvatarFallback className="text-xl bg-premium-gradient">
                {user.name ? user.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.name} {user.lastName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-premium-light/70">{userRoles[user.role]}</span>
              </div>
              <p className="mt-2 text-premium-light/70">{user.email}</p>
            </div>
          </div>

          {user.bio && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 text-premium-light/50">BIO</h4>
              <p className="text-premium-light/90">{user.bio}</p>
            </div>
          )}

          {user.jobTitle && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 text-premium-light/50">STANOWISKO</h4>
              <p className="flex items-center">
                <UserIcon size={16} className="mr-2 text-premium-light/70" />
                {user.jobTitle}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-lg p-4 hover:bg-white hover:text-black transition-colors">
              <div className="flex items-center mb-3">
                <FileText size={18} className="text-blue-400 mr-2" />
                <h4 className="font-medium">Posty</h4>
              </div>
              <p className="text-2xl font-bold">{user.postsCreated || 0}</p>
            </div>

            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-lg p-4 hover:bg-white hover:text-black transition-colors">
              <div className="flex items-center mb-3">
                <BarChart size={18} className="text-green-400 mr-2" />
                <h4 className="font-medium">Wyświetlenia</h4>
              </div>
              <p className="text-2xl font-bold">{user.totalViews || 0}</p>
            </div>
          </div>

          <div className="border-t border-premium-light/10 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {joinedDate && (
              <div className="flex items-center">
                <CalendarIcon size={16} className="mr-2 text-premium-light/70" />
                <span className="text-premium-light/70">
                  Dołączył: {formatDistanceToNow(joinedDate, { addSuffix: true, locale: pl })}
                </span>
              </div>
            )}

            {lastLoginDate && (
              <div className="flex items-center">
                <CalendarIcon size={16} className="mr-2 text-premium-light/70" />
                <span className="text-premium-light/70">
                  Ostatnie logowanie: {formatDistanceToNow(lastLoginDate, { addSuffix: true, locale: pl })}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
