import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUserProfile } from "@/contexts/AuthContext";

export const useUserManager = (user: (User & ExtendedUserProfile) | null) => {
  const { toast } = useToast();

  const updateUser = async (userData: Partial<ExtendedUserProfile>) => {
    if (!user?.id) {
      console.error('Cannot update user: No user is logged in');
      toast({
        title: "Błąd aktualizacji użytkownika",
        description: "Nie jesteś zalogowany",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Updating user data:', userData);
      
      // Ensure we have the required fields for the users table
      const dataToUpdate = {
        ...userData,
        updated_at: new Date().toISOString()
      };
      
      // Update the user in Supabase
      const { error } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Błąd aktualizacji użytkownika",
          description: error.message || "Nie udało się zaktualizować danych użytkownika",
          variant: "destructive"
        });
        return;
      }

      // Also update the user metadata in auth if available
      try {
        await supabase.auth.updateUser({
          data: userData
        });
      } catch (authError) {
        console.log('Could not update auth metadata:', authError);
        // Non-fatal, continue
      }

      toast({
        title: "Dane użytkownika zaktualizowane",
        description: "Twoje dane zostały pomyślnie zaktualizowane"
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateUser:', error);
      toast({
        title: "Błąd aktualizacji użytkownika",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji danych",
        variant: "destructive"
      });
      return false;
    }
  };

  return { updateUser };
};
