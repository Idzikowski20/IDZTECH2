
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUserProfile } from "@/contexts/AuthContext";

export const useProfileManager = (user: (User & ExtendedUserProfile) | null) => {
  const { toast } = useToast();

  const updateProfile = async (profileData: Partial<ExtendedUserProfile>) => {
    if (!user?.id) {
      console.error('Cannot update profile: No user is logged in');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Błąd aktualizacji profilu",
          description: error.message || "Nie udało się zaktualizować profilu",
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Profil zaktualizowany",
        description: "Twoje dane zostały pomyślnie zaktualizowane"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return { updateProfile };
};
