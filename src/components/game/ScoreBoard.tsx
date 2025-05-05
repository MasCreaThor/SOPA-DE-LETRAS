// src/components/game/ScoreBoard.tsx
"use client";
import React from 'react';
import { Button } from '@/components/common/Button';
import { formatTime } from '@/utils/formatting';

interface ScoreBoardProps {
  score: number;
  wordsFound: number;
  totalWords: number;
  timeRemaining: number;
  timeLimit: number;
  isGameOver: boolean;
  isGameComplete: boolean;
  onStartGame: () => void;
  onResetGame: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  wordsFound,
  totalWords,
  timeRemaining,
  timeLimit,
  isGameOver,
  isGameComplete,
  onStartGame,
  onResetGame
}) => {
  // Calcular porcentaje de tiempo restante para la barra de progreso
  const timePercentage = (timeRemaining / timeLimit) * 100;
  
  // Determinar color de la barra de tiempo
  let timeBarColor = 'bg-green-500';
  if (timePercentage < 50) timeBarColor = 'bg-yellow-500';
  if (timePercentage < 20) timeBarColor = 'bg-red-500';
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {!isGameOver && !isGameComplete ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Palabras</h3>
              <p className="text-2xl font-bold">
                {wordsFound} <span className="text-gray-400 text-lg">/ {totalWords}</span>
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-500">Puntuación</h3>
              <p className="text-2xl font-bold">{score}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Tiempo restante</span>
              <span>{formatTime(timeRemaining)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${timeBarColor} h-2.5 rounded-full transition-all duration-1000 ease-linear`}
                style={{ width: `${timePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth 
            onClick={onResetGame}
          >
            Reiniciar Juego
          </Button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">
            {isGameComplete ? '¡Felicidades!' : 'Juego Terminado'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isGameComplete 
              ? 'Has encontrado todas las palabras.' 
              : `Se acabó el tiempo. Has encontrado ${wordsFound} de ${totalWords} palabras.`}
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Palabras Encontradas:</span>
              <span className="text-lg font-bold">{wordsFound}/{totalWords}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Puntuación Final:</span>
              <span className="text-2xl font-bold text-blue-600">{score}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={onResetGame}
            >
              Jugar de Nuevo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};