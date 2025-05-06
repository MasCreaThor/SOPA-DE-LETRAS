// src/services/wordSearch/edit.service.ts
import { getWordSearchGame, updateWordSearchGame } from '@/services/firebase/database.service';
import { generateWordSearch } from '@/services/wordSearch/generator.service';
import type { WordSearchGame, WordClue, CreateWordSearchGameInput } from '@/types/wordSearch.types';

/**
 * Carga un juego para edición
 */
export const loadGameForEditing = async (gameId: string): Promise<WordSearchGame> => {
  try {
    const game = await getWordSearchGame(gameId);
    if (!game) {
      throw new Error('Juego no encontrado');
    }
    return game; // Ahora TypeScript sabe que game no puede ser null
  } catch (error) {
    console.error('Error al cargar el juego para editar:', error);
    throw error;
  }
};

/**
 * Actualiza un juego existente
 */
export const updateGame = async (gameId: string, gameData: Partial<WordSearchGame>): Promise<void> => {
  try {
    await updateWordSearchGame(gameId, gameData);
  } catch (error) {
    console.error('Error al actualizar el juego:', error);
    throw error;
  }
};

/**
 * Regenera la cuadrícula para un juego existente
 */
export const regenerateGrid = (wordClues: WordClue[], difficulty: 'easy' | 'medium' | 'hard') => {
  return generateWordSearch(wordClues, difficulty);
};

/**
 * Valida si el usuario es el propietario del juego
 */
export const validateGameOwnership = (game: WordSearchGame, userId: string): boolean => {
  return game.createdBy === userId;
};

/**
 * Crea un objeto de actualización a partir de datos parciales
 */
export const createUpdateObject = (
  gameData: Partial<CreateWordSearchGameInput>,
  originalGame: WordSearchGame
): Partial<WordSearchGame> => {
  // Solo incluir los campos que han cambiado
  const updateObject: Partial<WordSearchGame> = {};
  
  if (gameData.title !== undefined && gameData.title !== originalGame.title) {
    updateObject.title = gameData.title;
  }
  
  if (gameData.description !== undefined && gameData.description !== originalGame.description) {
    updateObject.description = gameData.description;
  }
  
  if (gameData.difficulty !== undefined && gameData.difficulty !== originalGame.difficulty) {
    updateObject.difficulty = gameData.difficulty;
  }
  
  if (gameData.wordClues !== undefined) {
    updateObject.wordClues = gameData.wordClues;
  }
  
  if (gameData.grid !== undefined) {
    updateObject.grid = gameData.grid;
  }
  
  if (gameData.category !== undefined && gameData.category !== originalGame.category) {
    updateObject.category = gameData.category;
  }
  
  if (gameData.isPublic !== undefined && gameData.isPublic !== originalGame.isPublic) {
    updateObject.isPublic = gameData.isPublic;
  }
  
  return updateObject;
};