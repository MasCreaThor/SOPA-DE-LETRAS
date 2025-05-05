// src/components/profile/tabs/PersonalInfoTab.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { updateUserProfile } from '@/services/firebase/auth.service';
import type { User } from '@/types/user.types';

interface PersonalInfoTabProps {
  user: User;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ user }) => {
  const [displayName, setDisplayName] = useState<string>(user.displayName || '');
  const [updating, setUpdating] = useState<boolean>(false);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      await updateUserProfile(user, { displayName });
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Perfil</h3>
      
      <div className="space-y-4">
        <Input
          label="Nombre de usuario"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={updating}
        />
        
        <Input
          label="Correo electrónico"
          value={user.email || ''}
          disabled={true}
          helpText="El correo electrónico no se puede cambiar"
        />
        
        <div className="pt-4">
          <Button
            variant="primary"
            onClick={handleUpdateProfile}
            isLoading={updating}
            disabled={!displayName || displayName === user.displayName}
          >
            Actualizar Perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;