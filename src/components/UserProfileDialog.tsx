
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}

const UserProfileDialog = ({ open, onOpenChange, user }: UserProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profil użytkownika</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-premium-light/70">
            Szczegóły profilu użytkownika są obecnie wyłączone. Zostaną zaimplementowane z integracją Sanity.io.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
