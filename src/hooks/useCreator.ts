// src/hooks/useCreator.ts
import { useState, useCallback, useEffect } from 'react';
import type { WordClue, WordSearchGrid } from '@/types/wordSearch.types';
import { generateWordSearch, validateWords } from '@/services/wordSearch/generator.service';

interface UseCreatorProps {
  initialWordClues?: WordClue[];
  initialTitle?: string;
  initialDescription?: string;
}

interface UseCreatorReturn {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  wordClues: WordClue[];
  setWordClues: (wordClues: WordClue[]) => void; // Añadido para la edición
  addWord: (word: string, description: string) => boolean;
  updateWord: (index: number, word: string, description: string) => boolean;
  removeWord: (index: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  customSize: { rows: number; cols: number } | null;
  setCustomSize: (size: { rows: number; cols: number } | null) => void;
  generatedGrid: WordSearchGrid | null;
  setGeneratedGrid: (grid: WordSearchGrid | null) => void; // Añadido para la edición
  generateGrid: () => boolean;
  isValid: boolean;
  validationMessage: string;
  clearAll: () => void;
}

export const useCreator = ({
  initialWordClues = [],
  initialTitle = '',
  initialDescription = ''
}: UseCreatorProps = {}): UseCreatorReturn => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [description, setDescription] = useState<string>(initialDescription);
  const [wordClues, setWordClues] = useState<WordClue[]>(initialWordClues);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [customSize, setCustomSize] = useState<{ rows: number; cols: number } | null>(null);
  const [generatedGrid, setGeneratedGrid] = useState<WordSearchGrid | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Validar si se puede añadir una palabra
  const validateWord = (word: string): { valid: boolean; message?: string } => {
    // Verificar longitud
    if (word.length < 3) {
      return { 
        valid: false, 
        message: 'La palabra debe tener al menos 3 letras' 
      };
    }
    
    // Verificar caracteres válidos
    if (!/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+$/.test(word)) {
      return { 
        valid: false, 
        message: 'La palabra solo puede contener letras (sin números ni símbolos)' 
      };
    }
    
    // Verificar duplicados
    if (wordClues.some(wc => wc.word.toLowerCase() === word.toLowerCase())) {
      return { 
        valid: false, 
        message: 'Esta palabra ya está en la lista' 
      };
    }
    
    return { valid: true };
  };
  
  // Generar la cuadrícula
  const generateGrid = useCallback((): boolean => {
    if (wordClues.length === 0) {
      setIsValid(false);
      setValidationMessage('Debe añadir al menos una palabra');
      return false;
    }
    
    const words = wordClues.map(wc => wc.word);
    const validation = validateWords(words);
    
    if (!validation.valid) {
      setIsValid(false);
      setValidationMessage(validation.message || 'Palabras no válidas');
      return false;
    }

    try {
      const grid = generateWordSearch(wordClues, difficulty, customSize || undefined);
      setGeneratedGrid(grid);
      setIsValid(true);
      setValidationMessage('');
      return true;
    } catch (error) {
      console.error('Error al generar la cuadrícula:', error);
      setIsValid(false);
      setValidationMessage('Error al generar la sopa de letras. Intente con menos palabras o una cuadrícula más grande.');
      return false;
    }
  }, [wordClues, difficulty, customSize]);
  
  // Generar cuadrícula automáticamente cuando las palabras cambian
  useEffect(() => {
    if (wordClues.length > 0) {
      generateGrid();
    }
  }, [wordClues, difficulty, generateGrid]);
  
  // Añadir una nueva palabra
  const addWord = useCallback((word: string, description: string): boolean => {
    const validation = validateWord(word);
    
    if (!validation.valid) {
      setIsValid(false);
      setValidationMessage(validation.message || 'Palabra no válida');
      return false;
    }
    
    setWordClues(prev => [...prev, { word, description, found: false }]);
    setIsValid(true);
    setValidationMessage('');
    
    return true;
  }, [wordClues]);
  
  // Actualizar una palabra existente
  const updateWord = useCallback((index: number, word: string, description: string): boolean => {
    if (index < 0 || index >= wordClues.length) {
      return false;
    }
    
    // Si la palabra no cambió, solo actualizamos la descripción
    if (wordClues[index].word.toLowerCase() === word.toLowerCase()) {
      setWordClues(prev => {
        const newWordClues = [...prev];
        newWordClues[index] = { ...newWordClues[index], description };
        return newWordClues;
      });
      return true;
    }
    
    // Si la palabra cambió, validar
    const validation = validateWord(word);
    
    if (!validation.valid) {
      setIsValid(false);
      setValidationMessage(validation.message || 'Palabra no válida');
      return false;
    }
    
    setWordClues(prev => {
      const newWordClues = [...prev];
      newWordClues[index] = { word, description, found: false };
      return newWordClues;
    });
    
    setIsValid(true);
    setValidationMessage('');
    
    return true;
  }, [wordClues]);
  
  // Eliminar una palabra
  const removeWord = useCallback((index: number) => {
    if (index < 0 || index >= wordClues.length) {
      return;
    }
    
    setWordClues(prev => {
      const newWordClues = [...prev];
      newWordClues.splice(index, 1);
      return newWordClues;
    });
  }, [wordClues]);
  
  // Limpiar todo
  const clearAll = useCallback(() => {
    setTitle('');
    setDescription('');
    setWordClues([]);
    setDifficulty('medium');
    setCustomSize(null);
    setGeneratedGrid(null);
    setIsValid(true);
    setValidationMessage('');
  }, []);
  
  return {
    title,
    setTitle,
    description,
    setDescription,
    wordClues,
    setWordClues, // Añadido para soportar edición directa
    addWord,
    updateWord,
    removeWord,
    difficulty,
    setDifficulty,
    customSize,
    setCustomSize,
    generatedGrid,
    setGeneratedGrid, // Añadido para soportar edición directa
    generateGrid,
    isValid,
    validationMessage,
    clearAll
  };
};