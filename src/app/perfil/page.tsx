// src/app/perfil/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/services/firebase/database.service';
import type { UserProfile } from '@/types/wordSearch.types';

// Import components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs, { TabType } from '@/components/profile/ProfileTabs';
import PersonalInfoTab from '@/components/profile/tabs/PersonalInfoTab';
import UserGamesTab from '@/components/profile/tabs/UserGamesTab';
import StatsTab from '@/components/profile/tabs/StatsTab';
import LoadingState from '@/components/profile/LoadingState';
import UnauthorizedState from '@/components/profile/UnauthorizedState';

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  
  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    if (user) {
      loadProfile();
    }
  }, [user]);

  // Show loading state while checking authentication
  if (authLoading) {
    return <LoadingState message="Cargando perfil..." />;
  }

  // Show unauthorized state if user is not logged in
  if (!user) {
    return <UnauthorizedState />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-gray-600">
          Gestiona tu información personal y revisa tus estadísticas de juego.
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <ProfileHeader user={user} profile={profile} />
        
        {/* Tabs Navigation */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab user={user} />
          )}
          
          {activeTab === 'games' && (
            <UserGamesTab profile={profile} profileLoading={profileLoading} />
          )}
          
          {activeTab === 'stats' && (
            <StatsTab profile={profile} profileLoading={profileLoading} />
          )}
        </div>
      </div>
    </div>
  );
}