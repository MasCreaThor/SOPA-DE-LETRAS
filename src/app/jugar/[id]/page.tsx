// src/app/jugar/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getWordSearchGame, recordGamePlay } from '@/services/firebase/database.service';
import { useWordSearch } from '@/hooks/useWordSearch';
import { WordSearchGrid } from '@/components/game/WordSearchGrid';
import { WordClues } from '@/components/game/WordClues';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameControls } from '@/components/game/GameControls';
import { GameHeader } from '@/components/game/GameHeader';
import { TIME_LIMITS } from '@/utils/constants';
import { shareGame } from '@/utils/shareUtils';
import type { WordSearchGame } from '@/types/wordSearch.types';

export default function JugarIdPage() {
  const params = useParams();
  const gameId = params.id as string;
  const { user } = useAuth();
  
  const [game, setGame] = useState<WordSearchGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  
  // Cargar el juego
  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        const loadedGame = await getWordSearchGame(gameId);
        setGame(loadedGame);
        
        // Verificar si el juego está en favoritos
        if (user && user.profile?.favorites) {
          setIsFavorited(!!user.profile.favorites[gameId]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar el juego:', err);
        setError('Error al cargar el juego. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (gameId) {
      loadGame();
    }
  }, [gameId, user]);
  
  // Hook personalizado para la lógica del juego
  const {
    displayGrid,
    selectedCells,
    foundWords,
    timeRemaining,
    elapsedTime,
    score,
    isGameOver,
    isGameComplete,
    selectCell,
    commitSelection,
    clearSelection,
    startGame,
    resetGame
  } = useWordSearch({
    grid: game?.grid || { grid: [], size: { rows: 0, cols: 0 }, wordPlacements: [] },
    wordClues: game?.wordClues || [],
    timeLimit: game?.timeLimit || TIME_LIMITS[game?.difficulty || 'medium'],
    difficulty: game?.difficulty || 'medium',
    onComplete: async (finalScore, wordsFound) => {
      if (user) {
        try {
          await recordGamePlay(gameId, user.uid, finalScore, wordsFound);
          toast.success('¡Puntuación guardada!');
        } catch (error) {
          console.error('Error al guardar puntuación:', error);
          toast.error('Error al guardar puntuación');
        }
      }
    }
  });
  
  // Manejar inicio del juego
  const handleStartGame = () => {
    setIsGameStarted(true);
    startGame();
  };
  
  // Manejar reinicio del juego
  const handleResetGame = () => {
    setIsGameStarted(false);
    resetGame();
  };
  
  // Manejar compartir juego
  const handleShareGame = () => {
    if (!game) return;
    
    shareGame(
      gameId,
      game.title,
      () => {
        // Fallback: Copiar al portapapeles
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
          .then(() => toast.success('¡Enlace copiado al portapapeles!'))
          .catch(() => toast.error('No se pudo copiar el enlace'));
      }
    );
  };
  
  // Manejar añadir/quitar de favoritos
  const handleToggleFavorite = async () => {
    if (!user || !game) return;
    
    // Aquí implementarías la lógica para añadir/quitar de favoritos
    // Ejemplo simplificado:
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-xl text-gray-600">Cargando juego...</p>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg">{error || 'No se encontró el juego'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GameHeader
        title={game.title}
        description={game.description}
        difficulty={game.difficulty}
        createdBy={game.createdBy}
        createdAt={game.createdAt}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <WordSearchGrid
            grid={displayGrid}
            onCellSelect={selectCell}
            onSelectionSubmit={commitSelection}
            onSelectionClear={clearSelection}
            isGameOver={isGameOver || isGameComplete}
          />
        </div>
        
        <div className="space-y-6">
          <GameControls
            isGameStarted={isGameStarted}
            onStartGame={handleStartGame}
            onShareGame={handleShareGame}
            onFavoriteGame={user ? handleToggleFavorite : undefined}
            isFavorited={isFavorited}
          />
          
          {isGameStarted && (
            <ScoreBoard
              score={score}
              wordsFound={foundWords.length}
              totalWords={game.wordClues.length}
              timeRemaining={timeRemaining}
              timeLimit={game.timeLimit || TIME_LIMITS[game.difficulty]}
              isGameOver={isGameOver}
              isGameComplete={isGameComplete}
              onStartGame={handleStartGame}
              onResetGame={handleResetGame}
            />
          )}
          
          <WordClues
            wordClues={game.wordClues.map(wc => ({
              ...wc,
              found: foundWords.includes(wc.word.toUpperCase())
            }))}
            showWords={isGameOver || isGameComplete}
          />
        </div>
      </div>
    </div>
  );
}