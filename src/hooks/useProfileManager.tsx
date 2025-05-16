
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUserProfile } from "@/contexts/AuthContext";

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
      return;
    }

    try {
      console.log('Updating profile data:', profileData);
      
      // Ensure we have the required fields for the profiles table
      const dataToUpdate = {
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Błąd aktualizacji profilu",
          description: error.message || "Nie udało się zaktualizować profilu",
          variant: "destructive"
        });
        return;
      }

      // Also update the user metadata in auth if available
      try {
        await supabase.auth.updateUser({
          data: profileData
        });
      } catch (authError) {
        console.log('Could not update auth metadata:', authError);
        // Non-fatal, continue
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
