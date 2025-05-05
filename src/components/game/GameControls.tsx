// src/components/game/GameControls.tsx
"use client";
import React from 'react';
import { Button } from '@/components/common/Button';

interface GameControlsProps {
  isGameStarted: boolean;
  onStartGame: () => void;
  onShareGame?: () => void;
  onFavoriteGame?: () => void;
  isFavorited?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isGameStarted,
  onStartGame,
  onShareGame,
  onFavoriteGame,
  isFavorited = false
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {!isGameStarted ? (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">¿Listo para empezar?</h2>
          <p className="text-gray-600 mb-4">
            Encuentra todas las palabras antes de que se acabe el tiempo.
          </p>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={onStartGame}
            size="lg"
          >
            Comenzar Juego
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {onShareGame && (
            <Button 
              variant="info" 
              fullWidth 
              onClick={onShareGame}
              leftIcon={(
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              )}
            >
              Compartir
            </Button>
          )}
          
          {onFavoriteGame && (
            <Button 
              variant={isFavorited ? 'warning' : 'secondary'} 
              fullWidth 
              onClick={onFavoriteGame}
              leftIcon={(
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            >
              {isFavorited ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};