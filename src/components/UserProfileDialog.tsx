
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  lastName?: string;
  profilePicture?: string;
  role?: string;
  jobTitle?: string;
  bio?: string;
  created_at?: string;
  last_login?: string;
}

interface UserProfileDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ user, open, onOpenChange }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profil użytkownika</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.name || 'User'} 
              className="h-24 w-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-premium-gradient flex items-center justify-center text-white text-xl font-bold mb-4">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
          )}
          
          <h3 className="text-xl font-semibold">
            {user.name} {user.lastName}
          </h3>
          
          {user.jobTitle && (
            <p className="text-muted-foreground">{user.jobTitle}</p>
          )}
          
          <span className="px-3 py-1 mt-2 bg-green-900 text-green-100 text-xs rounded-full">
            {user.role || 'user'}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-muted-foreground w-32">Email:</span>
            <span>{user.email}</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-muted-foreground w-32">Data utworzenia:</span>
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              {user.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-muted-foreground w-32">Ostatnie logowanie:</span>
            <span>{user.last_login ? new Date(user.last_login).toLocaleDateString('pl-PL') : 'Nigdy'}</span>
          </div>
          
          {user.bio && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
              <p className="text-sm">{user.bio}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
