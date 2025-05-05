// src/components/profile/tabs/UserGamesTab.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { getWordSearchGame, deleteWordSearchGame } from '@/services/firebase/database.service';
import GameActionButtons from '@/components/profile/GameActionButtons';
import type { UserProfile, WordSearchGame } from '@/types/wordSearch.types';

interface UserGamesTabProps {
  profile: UserProfile | null;
  profileLoading: boolean;
}

const UserGamesTab: React.FC<UserGamesTabProps> = ({ profile, profileLoading }) => {
  const router = useRouter();
  const [userGames, setUserGames] = useState<WordSearchGame[]>([]);
  const [loadingGames, setLoadingGames] = useState<boolean>(false);
  const [deletingGames, setDeletingGames] = useState<Record<string, boolean>>({});

  // Load user games
  useEffect(() => {
    const loadUserGames = async () => {
      if (!profile?.games) return;
      
      try {
        setLoadingGames(true);
        const gameIds = Object.keys(profile.games);
        console.log("Intentando cargar juegos con IDs:", gameIds);
        
        // Usar Promise.allSettled para manejar errores individuales
        const gamesPromises = gameIds.map(id => getWordSearchGame(id));
        const gamesResults = await Promise.all(gamesPromises);
        
        // Filtrar juegos válidos (eliminar nulls)
        const validGames = gamesResults.filter(game => game !== null) as WordSearchGame[];
        console.log("Juegos válidos cargados:", validGames.length);
        
        setUserGames(validGames);
      } catch (error) {
        console.error('Error al cargar juegos del usuario:', error);
        toast.error('Hubo un problema al cargar tus juegos');
      } finally {
        setLoadingGames(false);
      }
    };

    if (profile?.games) {
      loadUserGames();
    }
  }, [profile]);
  
  // Handle game deletion
  const handleDeleteGame = async (gameId: string) => {
    if (!profile || !window.confirm('¿Estás seguro de que deseas eliminar esta sopa de letras? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setDeletingGames(prev => ({ ...prev, [gameId]: true }));
      await deleteWordSearchGame(gameId, profile.uid);
      setUserGames(prev => prev.filter(game => game.id !== gameId));
      toast.success('Sopa de letras eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar el juego:', error);
      toast.error('Error al eliminar la sopa de letras');
    } finally {
      setDeletingGames(prev => ({ ...prev, [gameId]: false }));
    }
  };

  if (profileLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Cargando juegos...</p>
      </div>
    );
  }

  if (!profile?.games || Object.keys(profile.games).length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No has creado ninguna sopa de letras aún.</p>
        <button
          onClick={() => router.push('/crear')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Crear Mi Primera Sopa
        </button>
      </div>
    );
  }

  if (loadingGames) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Cargando tus juegos...</p>
      </div>
    );
  }

  if (userGames.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No se encontraron juegos válidos. Puede que algunos juegos hayan sido eliminados.</p>
        <button
          onClick={() => router.push('/crear')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Crear Nueva Sopa de Letras
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Sopas de Letras</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userGames.map(game => (
          <div key={game.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{game.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  game.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800' 
                    : game.difficulty === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty === 'easy' ? 'Fácil' : game.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </span>
              </div>
              
              {game.description && (
                <p className="mt-2 text-gray-600 text-sm">
                  {game.description.length > 100 
                    ? `${game.description.substring(0, 100)}...` 
                    : game.description}
                </p>
              )}
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span>{game.wordClues.length} palabras</span>
                  <span className="mx-2">•</span>
                  <span>{game.plays || 0} jugadas</span>
                </div>
                <div>
                  {new Date(game.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-xs text-gray-500">
                ID: {game.id.substring(0, 8)}...
              </span>
              <GameActionButtons game={game} onDelete={handleDeleteGame} isDeleting={deletingGames[game.id]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGamesTab;