// src/types/wordSearch.types.ts
export type Direction = 
  | 'horizontal' 
  | 'vertical' 
  | 'diagonal-up' 
  | 'diagonal-down' 
  | 'horizontal-reverse' 
  | 'vertical-reverse' 
  | 'diagonal-up-reverse' 
  | 'diagonal-down-reverse';

export interface WordPlacement {
  word: string;
  row: number;
  col: number;
  direction: Direction;
}

export interface WordClue {
  word: string;
  description: string;
  found?: boolean;
}

export interface GridCell {
  letter: string;
  row: number;
  col: number;
  isPartOfWord?: boolean;
  words?: string[];
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export interface WordSearchGrid {
  grid: GridCell[][];
  size: {
    rows: number;
    cols: number;
  };
  wordPlacements: WordPlacement[];
}

export interface WordSearchGame {
  id: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grid: WordSearchGrid;
  wordClues: WordClue[];
  timeLimit?: number; // en segundos, opcional
  createdBy: string;
  createdAt: string;
  plays: number;
  category?: string;
  isPublic: boolean;
}

export interface GamePlay {
  id: string;
  gameId: string;
  userId: string;
  score: number;
  wordsFound: number;
  totalWords: number;
  timeTaken: number; // en segundos
  playedAt: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesCreated: number;
  wordsFound: number;
  bestScore: number;
  // Se pueden añadir más estadísticas según sea necesario
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  stats: UserStats;
  games?: Record<string, boolean>; // IDs de juegos creados
  favorites?: Record<string, boolean>; // IDs de juegos favoritos
}

// Añadir este nuevo tipo
export interface CreateWordSearchGameInput {
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grid: WordSearchGrid;
  wordClues: WordClue[];
  timeLimit?: number;
  category?: string;
  isPublic: boolean;
}