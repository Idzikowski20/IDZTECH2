
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUserProfile } from "@/utils/AuthProvider";

export const useProfileManager = (user: (User & ExtendedUserProfile) | null) => {
  const { toast } = useToast();

  const updateProfile = async (profileData: Partial<ExtendedUserProfile>) => {
    if (!user?.id) {
      console.error('Cannot update profile: No user is logged in');
      toast({
        title: "Błąd aktualizacji profilu",
        description: "Nie jesteś zalogowany",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Updating profile data:', profileData);
      
      // Update user metadata in Supabase auth
      const { error } = await supabase.auth.updateUser({
        data: profileData
      });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Błąd aktualizacji profilu",
          description: error.message || "Nie udało się zaktualizować profilu",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Profil zaktualizowany",
        description: "Twoje dane zostały pomyślnie zaktualizowane"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Błąd aktualizacji profilu",
        description: "Wystąpił nieoczekiwany błąd",
        variant: "destructive"
      });
      return false;
    }
  };

  return { updateProfile };
};
