// src/app/perfil/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/services/firebase/database.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { updateUserProfile } from '@/services/firebase/auth.service';
import { formatDate } from '@/utils/formatting';
import type { UserProfile, WordSearchGame, GamePlay } from '@/types/wordSearch.types';

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'games' | 'stats'>('personal');
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        setDisplayName(user.displayName || '');
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        toast.error('Error al cargar perfil');
      } finally {
        setProfileLoading(false);
      }
    };
    
    if (user) {
      loadProfile();
    }
  }, [user]);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
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
  
  // Verificar si el usuario está autenticado
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-xl text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
          <p className="text-lg mb-6">Debes iniciar sesión para ver tu perfil.</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
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
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              Información Personal
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'games'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('games')}
            >
              Mis Juegos
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Estadísticas
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && (
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
          )}
          
          {activeTab === 'games' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Sopas de Letras</h3>
              
              {profileLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Cargando juegos...</p>
                </div>
              ) : !profile?.games ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No has creado ninguna sopa de letras aún.</p>
                  <button
                    onClick={() => router.push('/crear')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Crear Mi Primera Sopa
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aquí se mostrarían los juegos del usuario */}
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-gray-600">Aquí se mostrarán tus juegos creados</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Estadísticas</h3>
              
              {profileLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
                </div>
              ) : !profile?.stats ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No hay estadísticas disponibles.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Juegos Jugados</h4>
                    <p className="text-3xl font-bold text-blue-600">{profile.stats.gamesPlayed}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-green-800 mb-1">Juegos Creados</h4>
                    <p className="text-3xl font-bold text-green-600">{profile.stats.gamesCreated}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">Palabras Encontradas</h4>
                    <p className="text-3xl font-bold text-yellow-600">{profile.stats.wordsFound}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-purple-800 mb-1">Mejor Puntuación</h4>
                    <p className="text-3xl font-bold text-purple-600">{profile.stats.bestScore}</p>
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Historial de Partidas</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600">El historial de partidas estará disponible próximamente.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}