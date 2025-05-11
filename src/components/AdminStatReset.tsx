
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBlogStore } from '@/utils/blog';
import { useToast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';

const AdminStatReset = () => {
  const resetStats = useBlogStore(state => state.resetStats);
  const { toast } = useToast();
  
  const handleResetStats = () => {
    resetStats();
    
    toast({
      title: "Statystyki zresetowane",
      description: "Wszystkie statystyki zostały wyzerowane"
    });
  };
  
  return (
    <Button
      variant="outline"
      className="ml-auto flex items-center gap-1 border-orange-400/30 text-orange-400 hover:bg-orange-950 hover:text-orange-300"
      onClick={handleResetStats}
    >
      <RefreshCcw size={16} />
      <span>Zresetuj statystyki</span>
    </Button>
  );
};

export default AdminStatReset;
