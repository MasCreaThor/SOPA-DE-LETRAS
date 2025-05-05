// src/components/creator/WordList.tsx
"use client";
import React from 'react';
import { Button } from '@/components/common/Button';
import type { WordClue } from '@/types/wordSearch.types';

interface WordListProps {
  words: WordClue[];
  onRemoveWord: (index: number) => void;
  onEditWord?: (index: number, word: string, description: string) => boolean;
  readonly?: boolean;
}

export const WordList: React.FC<WordListProps> = ({
  words,
  onRemoveWord,
  onEditWord,
  readonly = false
}) => {
  if (words.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">No hay palabras añadidas aún</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Lista de palabras ({words.length})</h3>
      
      <div className="space-y-2">
        {words.map((wordClue, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
          >
            <div>
              <div className="font-medium">{wordClue.word}</div>
              <div className="text-sm text-gray-600">{wordClue.description}</div>
            </div>
            
            {!readonly && (
              <div className="flex space-x-2">
                {onEditWord && (
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => {
                      // Abrir un prompt para editar (podría mejorarse con un modal)
                      const newWord = prompt("Editar palabra:", wordClue.word);
                      if (newWord) {
                        const newDescription = prompt("Editar descripción:", wordClue.description);
                        if (newDescription) {
                          onEditWord(index, newWord, newDescription);
                        }
                      }
                    }}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemoveWord(index)}
                >
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};