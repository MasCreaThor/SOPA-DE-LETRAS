// src/components/profile/ProfileHeader.tsx
import React from 'react';
import { formatDate } from '@/utils/formatting';
import type { User } from '@/types/user.types';
import type { UserProfile } from '@/types/wordSearch.types';

interface ProfileHeaderProps {
  user: User;
  profile: UserProfile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profile }) => {
  return (
    <div className="bg-blue-600 p-6 text-white">
      <div className="flex items-center">
        <div className="h-20 w-20 rounded-full bg-blue-800 flex items-center justify-center text-white text-2xl font-bold">
          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
        </div>
        <div className="ml-6">
          <h2 className="text-2xl font-bold">{user.displayName || 'Usuario'}</h2>
          <p className="text-blue-200">{user.email}</p>
          <p className="text-blue-200 text-sm mt-1">
            {profile ? `Miembro desde ${formatDate(profile.createdAt)}` : 'Cargando...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;