// src/components/game/GameHeader.tsx
"use client";
import React from 'react';
import Link from 'next/link';

interface GameHeaderProps {
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy?: string;
  createdAt?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  description,
  difficulty,
  createdBy,
  createdAt
}) => {
  // Mapear dificultad a texto y color
  const difficultyMap = {
    easy: { text: 'Fácil', color: 'bg-green-100 text-green-800' },
    medium: { text: 'Medio', color: 'bg-yellow-100 text-yellow-800' },
    hard: { text: 'Difícil', color: 'bg-red-100 text-red-800' }
  };
  
  const { text, color } = difficultyMap[difficulty];
  
  // Formatear fecha si existe
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString() 
    : undefined;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          
          {description && (
            <p className="mt-1 text-gray-600">{description}</p>
          )}
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            {createdBy && (
              <span className="mr-3">
                Por: {createdBy}
              </span>
            )}
            
            {formattedDate && (
              <span className="mr-3">
                Creado: {formattedDate}
              </span>
            )}
          </div>
        </div>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
          {text}
        </span>
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-200">
        <Link href="/jugar" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          &larr; Volver a la lista de juegos
        </Link>
      </div>
    </div>
  );
};