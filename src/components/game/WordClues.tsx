// src/components/game/WordClues.tsx
"use client";
import React from 'react';
import type { WordClue } from '@/types/wordSearch.types';

interface WordCluesProps {
  wordClues: WordClue[];
  showWords?: boolean;
}

export const WordClues: React.FC<WordCluesProps> = ({
  wordClues,
  showWords = false
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">Palabras a encontrar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {wordClues.map((wordClue, index) => (
          <div 
            key={index} 
            className={`
              p-2 rounded-md border 
              ${wordClue.found 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-gray-50 border-gray-200'}
            `}
          >
            <div className="font-medium">
              {showWords ? (
                <span>{wordClue.word}</span>
              ) : (
                <span>
                  {wordClue.found ? wordClue.word : `Palabra ${index + 1}`}
                </span>
              )}
            </div>
            <div className="text-sm mt-1">
              {wordClue.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};