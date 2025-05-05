// src/services/wordSearch/solver.service.ts
import type { 
    WordSearchGrid, 
    GridCell, 
    Direction,
    WordPlacement 
  } from '@/types/wordSearch.types';
  import { DIRECTION_INCREMENTS } from './generator.service';
  
  /**
   * Verifica si una selección de celdas forma una palabra válida
   */
  export const checkWordSelection = (
    grid: GridCell[][],
    selectedCells: GridCell[],
    wordsList: string[]
  ): { found: boolean; word: string } | null => {
    if (selectedCells.length < 3) {
      return null; // Muy pocas celdas para formar una palabra válida
    }
    
    // Formar la palabra a partir de las celdas seleccionadas
    const selectedWord = selectedCells.map(cell => cell.letter).join('');
    
    // Verificar si la palabra o su reverso están en la lista
    const reversedWord = selectedWord.split('').reverse().join('');
    
    for (const word of wordsList) {
      const normalizedWord = word.toUpperCase();
      if (selectedWord === normalizedWord || reversedWord === normalizedWord) {
        return { found: true, word: normalizedWord };
      }
    }
    
    return { found: false, word: selectedWord };
  };
  
  /**
   * Valida si la selección de celdas es continua y en una dirección válida
   */
  export const validateSelection = (selectedCells: GridCell[]): boolean => {
    if (selectedCells.length <= 1) return true;
    
    // Determinar la dirección basada en las primeras dos celdas
    const first = selectedCells[0];
    const second = selectedCells[1];
    const rowDiff = second.row - first.row;
    const colDiff = second.col - first.col;
    
    // Verificar que todas las celdas sigan la misma dirección
    for (let i = 2; i < selectedCells.length; i++) {
      const prev = selectedCells[i-1];
      const curr = selectedCells[i];
      
      if (
        curr.row - prev.row !== rowDiff ||
        curr.col - prev.col !== colDiff
      ) {
        return false;
      }
    }
    
    return true;
  };
  
  /**
   * Encuentra una palabra específica en la cuadrícula
   */
  export const findWordInGrid = (
    grid: GridCell[][],
    word: string
  ): GridCell[] | null => {
    const rows = grid.length;
    const cols = grid[0].length;
    const normalizedWord = word.toUpperCase();
    
    // Probar todas las posibles posiciones y direcciones
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        for (const direction of Object.keys(DIRECTION_INCREMENTS) as Direction[]) {
          const [rowInc, colInc] = DIRECTION_INCREMENTS[direction];
          
          // Verificar si la palabra cabe en esta dirección
          const endRow = row + (normalizedWord.length - 1) * rowInc;
          const endCol = col + (normalizedWord.length - 1) * colInc;
          
          if (
            endRow < 0 || endRow >= rows ||
            endCol < 0 || endCol >= cols
          ) {
            continue; // La palabra no cabe en esta dirección
          }
          
          // Comprobar si la palabra está presente
          let found = true;
          const foundCells: GridCell[] = [];
          
          for (let i = 0; i < normalizedWord.length; i++) {
            const currentRow = row + i * rowInc;
            const currentCol = col + i * colInc;
            const cell = grid[currentRow][currentCol];
            
            if (cell.letter !== normalizedWord[i]) {
              found = false;
              break;
            }
            
            foundCells.push(cell);
          }
          
          if (found) {
            return foundCells;
          }
        }
      }
    }
    
    return null; // No se encontró la palabra
  };
  
  /**
   * Busca todas las palabras en la cuadrícula y devuelve sus ubicaciones
   */
  export const findAllWords = (
    grid: GridCell[][],
    words: string[]
  ): Record<string, GridCell[]> => {
    const result: Record<string, GridCell[]> = {};
    
    for (const word of words) {
      const foundCells = findWordInGrid(grid, word);
      if (foundCells) {
        result[word.toUpperCase()] = foundCells;
      }
    }
    
    return result;
  };
  
  /**
   * Calcula la puntuación basada en palabras encontradas y tiempo
   */
  export const calculateScore = (
    wordsFound: number,
    totalWords: number,
    timeElapsed: number,
    timeLimit: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): number => {
    // Base de puntos por palabra
    let pointsPerWord = 10;
    
    // Ajustar según dificultad
    switch (difficulty) {
      case 'easy':
        pointsPerWord = 10;
        break;
      case 'medium':
        pointsPerWord = 15;
        break;
      case 'hard':
        pointsPerWord = 20;
        break;
    }
    
    // Puntos base por palabras encontradas
    const basePoints = wordsFound * pointsPerWord;
    
    // Factor de tiempo (más rápido = más puntos)
    const timeBonus = Math.max(0, 1 - (timeElapsed / timeLimit));
    
    // Bonificación por encontrar todas las palabras
    const completionBonus = wordsFound === totalWords ? totalWords * 5 : 0;
    
    // Calcular puntuación final
    const finalScore = Math.round(
      basePoints + (basePoints * timeBonus * 0.5) + completionBonus
    );
    
    return finalScore;
  };
  
  /**
   * Verifica si dos selecciones representan la misma palabra
   */
  export const isSameWordSelection = (
    selection1: GridCell[],
    selection2: GridCell[]
  ): boolean => {
    if (selection1.length !== selection2.length) {
      return false;
    }
    
    // Comprobar si las selecciones son exactamente iguales
    const exactMatch = selection1.every((cell, index) => 
      cell.row === selection2[index].row && cell.col === selection2[index].col
    );
    
    if (exactMatch) {
      return true;
    }
    
    // Comprobar si son inversas (misma palabra pero en dirección opuesta)
    const reverseMatch = selection1.every((cell, index) => 
      cell.row === selection2[selection2.length - 1 - index].row && 
      cell.col === selection2[selection2.length - 1 - index].col
    );
    
    return reverseMatch;
  };