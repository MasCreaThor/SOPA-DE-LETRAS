// src/components/profile/tabs/StatsTab.tsx
import React from 'react';
import type { UserProfile } from '@/types/wordSearch.types';

interface StatsTabProps {
  profile: UserProfile | null;
  profileLoading: boolean;
}

const StatsTab: React.FC<StatsTabProps> = ({ profile, profileLoading }) => {
  if (profileLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
      </div>
    );
  }

  if (!profile?.stats) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No hay estadísticas disponibles.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Estadísticas</h3>
      
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
      
      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Historial de Partidas</h3>
      
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">El historial de partidas estará disponible próximamente.</p>
      </div>
    </div>
  );
};

export default StatsTab;