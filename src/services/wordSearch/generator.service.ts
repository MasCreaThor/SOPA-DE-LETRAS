// src/services/wordSearch/generator.service.ts
import type { 
    WordSearchGrid, 
    GridCell, 
    WordPlacement, 
    Direction, 
    WordClue 
  } from '@/types/wordSearch.types';
  
  // Todas las posibles direcciones
  const ALL_DIRECTIONS: Direction[] = [
    'horizontal',
    'vertical',
    'diagonal-up',
    'diagonal-down',
    'horizontal-reverse',
    'vertical-reverse',
    'diagonal-up-reverse',
    'diagonal-down-reverse'
  ];
  
  // Mapeado de direcciones a incrementos de coordenadas
  const DIRECTION_INCREMENTS: Record<Direction, [number, number]> = {
    'horizontal': [0, 1],
    'vertical': [1, 0],
    'diagonal-up': [-1, 1],
    'diagonal-down': [1, 1],
    'horizontal-reverse': [0, -1],
    'vertical-reverse': [-1, 0],
    'diagonal-up-reverse': [-1, -1],
    'diagonal-down-reverse': [1, -1]
  };
  
  /**
   * Verifica si una palabra puede ser colocada en la cuadrícula en una posición y dirección específicas
   */
  const canPlaceWord = (
    grid: GridCell[][],
    word: string,
    row: number,
    col: number,
    direction: Direction
  ): boolean => {
    const [rowIncrement, colIncrement] = DIRECTION_INCREMENTS[direction];
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Verificar que la palabra quede dentro de los límites
    const endRow = row + (word.length - 1) * rowIncrement;
    const endCol = col + (word.length - 1) * colIncrement;
    
    if (
      endRow < 0 || endRow >= rows ||
      endCol < 0 || endCol >= cols ||
      row < 0 || row >= rows ||
      col < 0 || col >= cols
    ) {
      return false;
    }
    
    // Verificar que no haya conflictos con otras letras
    for (let i = 0; i < word.length; i++) {
      const currentRow = row + i * rowIncrement;
      const currentCol = col + i * colIncrement;
      const currentCell = grid[currentRow][currentCol];
      
      // Si la celda ya tiene una letra, debe ser la misma que queremos colocar
      if (currentCell.letter !== '' && currentCell.letter !== word[i].toUpperCase()) {
        return false;
      }
    }
    
    return true;
  };
  
  /**
   * Coloca una palabra en la cuadrícula
   */
  const placeWord = (
    grid: GridCell[][],
    word: string,
    row: number,
    col: number,
    direction: Direction
  ): void => {
    const [rowIncrement, colIncrement] = DIRECTION_INCREMENTS[direction];
    
    for (let i = 0; i < word.length; i++) {
      const currentRow = row + i * rowIncrement;
      const currentCol = col + i * colIncrement;
      const currentLetter = word[i].toUpperCase();
      
      // Actualizar la celda
      grid[currentRow][currentCol].letter = currentLetter;
      grid[currentRow][currentCol].isPartOfWord = true;
      
      // Añadir esta palabra a la lista de palabras que contiene esta celda
      if (!grid[currentRow][currentCol].words) {
        grid[currentRow][currentCol].words = [];
      }
      
      if (!grid[currentRow][currentCol].words!.includes(word)) {
        grid[currentRow][currentCol].words!.push(word);
      }
    }
  };
  
  /**
   * Intenta colocar una palabra en la cuadrícula en una posición aleatoria
   */
  const tryPlaceWordRandomly = (
    grid: GridCell[][],
    word: string,
    preferredDirections: Direction[] = ALL_DIRECTIONS,
    maxAttempts: number = 100
  ): WordPlacement | null => {
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [...preferredDirections];
    let attempts = 0;
    
    while (attempts < maxAttempts && directions.length > 0) {
      // Seleccionar una posición y dirección aleatorias
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const directionIndex = Math.floor(Math.random() * directions.length);
      const direction = directions[directionIndex];
      
      if (canPlaceWord(grid, word, row, col, direction)) {
        placeWord(grid, word, row, col, direction);
        return { word, row, col, direction };
      }
      
      attempts++;
      
      // Si hemos hecho muchos intentos con esta dirección, eliminarla
      if (attempts % 20 === 0) {
        directions.splice(directionIndex, 1);
      }
    }
    
    return null; // No se pudo colocar la palabra
  };
  
  /**
   * Llena las celdas vacías de la cuadrícula con letras aleatorias
   */
  const fillEmptyCells = (grid: GridCell[][]): void => {
    const rows = grid.length;
    const cols = grid[0].length;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col].letter === '') {
          const randomIndex = Math.floor(Math.random() * letters.length);
          grid[row][col].letter = letters[randomIndex];
        }
      }
    }
  };
  
  /**
   * Crea una cuadrícula vacía
   */
  const createEmptyGrid = (rows: number, cols: number): GridCell[][] => {
    const grid: GridCell[][] = [];
    
    for (let row = 0; row < rows; row++) {
      grid[row] = [];
      for (let col = 0; col < cols; col++) {
        grid[row][col] = {
          letter: '',
          row,
          col,
          isPartOfWord: false,
          words: [],
          isSelected: false,
          isHighlighted: false
        };
      }
    }
    
    return grid;
  };
  
  /**
   * Determina el tamaño adecuado para la cuadrícula basado en las palabras
   */
  const determineGridSize = (
    words: string[],
    difficultyFactor: number = 1
  ): { rows: number; cols: number } => {
    // Encontrar la palabra más larga
    const maxLength = Math.max(...words.map(word => word.length));
    
    // Calcular un tamaño base
    const totalLetters = words.reduce((sum, word) => sum + word.length, 0);
    const baseSize = Math.ceil(Math.sqrt(totalLetters * 2.5)); // Factor de espacio
    
    // Ajustar según dificultad: más fácil = cuadrícula más pequeña
    const adjustedSize = Math.max(maxLength + 2, baseSize * difficultyFactor);
    
    // Redondear a un número par para mejor simetría
    const size = Math.ceil(adjustedSize / 2) * 2;
    
    return { rows: size, cols: size };
  };
  
  /**
   * Genera una sopa de letras a partir de una lista de palabras y descripciones
   */
  export const generateWordSearch = (
    wordClues: WordClue[],
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    customSize?: { rows: number; cols: number }
  ): WordSearchGrid => {
    // Extraer las palabras
    const words = wordClues.map(wc => wc.word.toUpperCase());
    
    // Determinar dificultad y direcciones
    let difficultyFactor = 1;
    let directions: Direction[] = ['horizontal', 'vertical'];
    
    switch (difficulty) {
      case 'easy':
        difficultyFactor = 0.8;
        directions = ['horizontal', 'vertical'];
        break;
      case 'medium':
        difficultyFactor = 1;
        directions = ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'];
        break;
      case 'hard':
        difficultyFactor = 1.2;
        directions = ALL_DIRECTIONS;
        break;
    }
    
    // Determinar tamaño de la cuadrícula
    const size = customSize || determineGridSize(words, difficultyFactor);
    
    // Crear cuadrícula vacía
    const grid = createEmptyGrid(size.rows, size.cols);
    
    // Ordenar palabras por longitud (las más largas primero)
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    
    // Intentar colocar cada palabra
    const wordPlacements: WordPlacement[] = [];
    
    for (const word of sortedWords) {
      const placement = tryPlaceWordRandomly(grid, word, directions);
      
      if (placement) {
        wordPlacements.push(placement);
      } else {
        console.warn(`No se pudo colocar la palabra: ${word}`);
        // Aquí podrías intentar con un enfoque más agresivo o simplemente omitir la palabra
      }
    }
    
    // Rellenar celdas vacías con letras aleatorias
    fillEmptyCells(grid);
    
    return {
      grid,
      size,
      wordPlacements
    };
  };
  
  /**
   * Crea una versión limpia de la cuadrícula (sin las marcas de las palabras)
   */
  export const createCleanGrid = (wordSearchGrid: WordSearchGrid): GridCell[][] => {
    const { grid } = wordSearchGrid;
    const rows = grid.length;
    const cols = grid[0].length;
    
    const cleanGrid: GridCell[][] = [];
    
    for (let row = 0; row < rows; row++) {
      cleanGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        cleanGrid[row][col] = {
          letter: grid[row][col].letter,
          row,
          col,
          isSelected: false,
          isHighlighted: false
        };
      }
    }
    
    return cleanGrid;
  };
  
  /**
   * Valida si las palabras proporcionadas son adecuadas para una sopa de letras
   */
  export const validateWords = (words: string[]): { valid: boolean; message?: string } => {
    // Verificar que haya palabras
    if (words.length === 0) {
      return { valid: false, message: 'No hay palabras para generar la sopa de letras' };
    }
    
    // Verificar longitud mínima
    const tooShort = words.filter(word => word.length < 3);
    if (tooShort.length > 0) {
      return { 
        valid: false, 
        message: `Las siguientes palabras son demasiado cortas (mínimo 3 letras): ${tooShort.join(', ')}` 
      };
    }
    
    // Verificar caracteres válidos
    const invalidWords = words.filter(word => !/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+$/.test(word));
    if (invalidWords.length > 0) {
      return { 
        valid: false, 
        message: `Las siguientes palabras contienen caracteres no válidos: ${invalidWords.join(', ')}` 
      };
    }
    
    return { valid: true };
  };