// src/components/creator/WordForm.tsx
"use client";
import React, { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { WordClue } from '@/types/wordSearch.types';

interface WordFormProps {
  onAddWord: (word: string, description: string) => boolean;
  isDisabled?: boolean;
  validationMessage?: string;
}

export const WordForm: React.FC<WordFormProps> = ({
  onAddWord,
  isDisabled = false,
  validationMessage = ''
}) => {
  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!word.trim()) {
      setError('La palabra es requerida');
      return;
    }
    
    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }
    
    // Intentar añadir la palabra
    const success = onAddWord(word.trim(), description.trim());
    
    if (success) {
      // Limpiar el formulario
      setWord('');
      setDescription('');
      setError('');
    } else {
      // Mostrar mensaje de error enviado por el hook
      setError(validationMessage || 'No se pudo añadir la palabra');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Añadir palabra</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Palabra"
          placeholder="Escribe una palabra"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          disabled={isDisabled}
          helpText="Mínimo 3 letras, sin espacios ni símbolos"
        />
        
        <Input
          label="Descripción o pista"
          placeholder="Escribe una pista o descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isDisabled}
          helpText="Escribe una pista clara que ayude a encontrar la palabra"
        />
      </div>
      
      <Button
        type="submit"
        variant="success"
        fullWidth
        disabled={isDisabled}
      >
        Añadir Palabra
      </Button>
    </form>
  );
};