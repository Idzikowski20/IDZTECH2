import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import { ExtendedUserProfile } from '@/utils/AuthProvider';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageProps {
  user: User & ExtendedUserProfile;
  previewImage: string | null;
  setPreviewImage: (value: string | null) => void;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<boolean>;
}

const ProfileImage = ({ user, previewImage, setPreviewImage, updateProfile }: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        
        // Update the profile with the new image
        const success = await updateProfile({
          profilePicture: result
        });

        if (!success) {
          toast({
            title: "Błąd",
            description: "Nie udało się zaktualizować zdjęcia profilowego",
            variant: "destructive"
          });
          setPreviewImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = () => {
    toast({
      title: "Funkcja w przygotowaniu",
      description: "Robienie zdjęć bezpośrednio przez kamerę będzie dostępne wkrótce"
    });
  };

  return (
    <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32 relative group">
          <AvatarImage 
            src={previewImage || user.profilePicture || ''} 
            className="object-cover"
          />
          <AvatarFallback className="text-3xl bg-premium-gradient">
            {user.name?.charAt(0) || 'U'}
          </AvatarFallback>
          
          <div 
            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            onClick={handleImageSelection}
          >
            <Upload size={24} className="text-white" />
          </div>
        </Avatar>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">{user.name || 'Użytkownik'} {user.lastName || ''}</h2>
          <p className="text-premium-light/70">{user.email || ''}</p>
          <p className="text-sm mt-1 bg-premium-light/10 px-3 py-1 rounded-full inline-block">
            {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
          </p>
          {user.jobTitle && <p className="text-sm mt-2">{user.jobTitle}</p>}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImageSelection}
            className="bg-transparent text-white hover:bg-white hover:text-black border-none"
          >
            <Upload className="h-4 w-4 mr-1" />
            Wybierz zdjęcie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCaptureImage}
            className="bg-transparent text-white hover:bg-white hover:text-black border-none"
          >
            <Camera className="h-4 w-4 mr-1" />
            Zrób zdjęcie
          </Button>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProfileImage;
