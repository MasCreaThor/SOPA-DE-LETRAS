// src/hooks/useWordSearch.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  WordSearchGrid, 
  GridCell, 
  WordClue 
} from '@/types/wordSearch.types';
import { 
  checkWordSelection, 
  validateSelection, 
  calculateScore, 
  isSameWordSelection 
} from '@/services/wordSearch/solver.service';
import { createCleanGrid } from '@/services/wordSearch/generator.service';

interface UseWordSearchProps {
  grid: WordSearchGrid;
  wordClues: WordClue[];
  timeLimit?: number; // Opcional, en segundos
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete?: (score: number, wordsFound: number) => void;
}

interface UseWordSearchReturn {
  displayGrid: GridCell[][];
  selectedCells: GridCell[];
  foundWords: string[];
  timeRemaining: number;
  elapsedTime: number;
  score: number;
  isGameOver: boolean;
  isGameComplete: boolean;
  selectCell: (cell: GridCell) => void;
  commitSelection: () => void;
  clearSelection: () => void;
  startGame: () => void;
  resetGame: () => void;
}

export const useWordSearch = ({
  grid,
  wordClues,
  timeLimit = 300, // 5 minutos por defecto
  difficulty,
  onComplete
}: UseWordSearchProps): UseWordSearchReturn => {
  // Crear una versión de la cuadrícula sin marcas para mostrar
  const [displayGrid, setDisplayGrid] = useState<GridCell[][]>(
    createCleanGrid(grid)
  );
  
  // Estado del juego
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [selectedCells, setSelectedCells] = useState<GridCell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundSelections, setFoundSelections] = useState<GridCell[][]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);
  const [score, setScore] = useState<number>(0);
  
  // Lista de palabras para buscar
  const wordsList = wordClues.map(wc => wc.word.toUpperCase());
  
  // Actualizar el tiempo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGameStarted && !isGameOver && !isGameComplete) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        setTimeRemaining(Math.max(0, timeLimit - elapsed));
        
        // Verificar si se acabó el tiempo
        if (timeLimit - elapsed <= 0) {
          setIsGameOver(true);
          calculateFinalScore();
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameStarted, isGameOver, isGameComplete, startTime, timeLimit]);
  
  // Calcular puntuación final
  const calculateFinalScore = useCallback(() => {
    const finalScore = calculateScore(
      foundWords.length,
      wordsList.length,
      elapsedTime,
      timeLimit,
      difficulty
    );
    
    setScore(finalScore);
    
    if (onComplete) {
      onComplete(finalScore, foundWords.length);
    }
  }, [foundWords.length, wordsList.length, elapsedTime, timeLimit, difficulty, onComplete]);
  
  // Seleccionar una celda
  const selectCell = useCallback((cell: GridCell) => {
    if (isGameOver || isGameComplete || !isGameStarted) return;
    
    // Verificar si es la primera celda o adyacente a la última seleccionada
    if (selectedCells.length === 0) {
      setSelectedCells([cell]);
      
      // Actualizar la cuadrícula para mostrar la selección
      setDisplayGrid(prevGrid => {
        const newGrid = [...prevGrid.map(row => [...row])];
        newGrid[cell.row][cell.col].isSelected = true;
        return newGrid;
      });
      return;
    }
    
    const lastCell = selectedCells[selectedCells.length - 1];
    
    // Si ya está seleccionada y es la última, deseleccionarla
    if (cell.row === lastCell.row && cell.col === lastCell.col) {
      if (selectedCells.length === 1) {
        clearSelection();
        return;
      }
      
      const newSelection = selectedCells.slice(0, -1);
      setSelectedCells(newSelection);
      
      // Actualizar la cuadrícula
      setDisplayGrid(prevGrid => {
        const newGrid = [...prevGrid.map(row => [...row])];
        newGrid[lastCell.row][lastCell.col].isSelected = false;
        return newGrid;
      });
      return;
    }
    
    // Si ya está en la selección, ignorar
    if (selectedCells.some(sc => sc.row === cell.row && sc.col === cell.col)) {
      return;
    }
    
    // Añadir a la selección solo si sigue una dirección válida
    const newSelection = [...selectedCells, cell];
    if (validateSelection(newSelection)) {
      setSelectedCells(newSelection);
      
      // Actualizar la cuadrícula
      setDisplayGrid(prevGrid => {
        const newGrid = [...prevGrid.map(row => [...row])];
        newGrid[cell.row][cell.col].isSelected = true;
        return newGrid;
      });
    }
  }, [selectedCells, isGameOver, isGameComplete, isGameStarted]);
  
  // Confirmar la selección actual
  const commitSelection = useCallback(() => {
    if (selectedCells.length < 3 || isGameOver || isGameComplete || !isGameStarted) {
      return;
    }
    
    const result = checkWordSelection(grid.grid, selectedCells, wordsList);
    
    if (result && result.found) {
      // Verificar si ya se encontró esta palabra
      if (foundWords.includes(result.word)) {
        // Verificar si es la misma selección que ya encontramos
        const alreadyFoundSameSelection = foundSelections.some(selection => 
          isSameWordSelection(selection, selectedCells)
        );
        
        if (alreadyFoundSameSelection) {
          clearSelection();
          return;
        }
      }
      
      // Añadir a palabras encontradas
      setFoundWords(prev => [...prev, result.word]);
      setFoundSelections(prev => [...prev, [...selectedCells]]);
      
      // Actualizar wordClues para marcar la palabra como encontrada
      const updatedWordClues = wordClues.map(wc => 
        wc.word.toUpperCase() === result.word 
          ? { ...wc, found: true } 
          : wc
      );
      
      // Actualizar la cuadrícula para resaltar la palabra encontrada
      setDisplayGrid(prevGrid => {
        const newGrid = [...prevGrid.map(row => [...row])];
        
        for (const cell of selectedCells) {
          newGrid[cell.row][cell.col].isSelected = false;
          newGrid[cell.row][cell.col].isHighlighted = true;
        }
        
        return newGrid;
      });
      
      // Verificar si se han encontrado todas las palabras
      if (foundWords.length + 1 === wordsList.length) {
        setIsGameComplete(true);
        calculateFinalScore();
      }
    } else {
      // No es una palabra válida, limpiar selección
      clearSelection();
    }
  }, [selectedCells, isGameOver, isGameComplete, isGameStarted, grid.grid, wordsList, foundWords, foundSelections, wordClues, calculateFinalScore]);
  
  // Limpiar la selección actual
  const clearSelection = useCallback(() => {
    setSelectedCells([]);
    
    // Actualizar la cuadrícula para quitar la selección
    setDisplayGrid(prevGrid => {
      const newGrid = [...prevGrid.map(row => [...row])];
      
      for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          if (newGrid[row][col].isSelected) {
            newGrid[row][col].isSelected = false;
          }
        }
      }
      
      return newGrid;
    });
  }, []);
  
  // Iniciar el juego
  const startGame = useCallback(() => {
    setIsGameStarted(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    setTimeRemaining(timeLimit);
    setIsGameOver(false);
    setIsGameComplete(false);
    setFoundWords([]);
    setFoundSelections([]);
    setScore(0);
    
    // Reiniciar la cuadrícula
    setDisplayGrid(createCleanGrid(grid));
  }, [grid, timeLimit]);
  
  // Reiniciar el juego
  const resetGame = useCallback(() => {
    clearSelection();
    setIsGameStarted(false);
    setIsGameOver(false);
    setIsGameComplete(false);
    setFoundWords([]);
    setFoundSelections([]);
    setElapsedTime(0);
    setTimeRemaining(timeLimit);
    setScore(0);
    
    // Reiniciar la cuadrícula
    setDisplayGrid(createCleanGrid(grid));
  }, [clearSelection, grid, timeLimit]);
  
  return {
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
  };
};