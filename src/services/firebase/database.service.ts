// src/services/firebase/database.service.ts
import { ref, set, get, update, remove, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import type { WordSearchGame, UserProfile, CreateWordSearchGameInput } from '@/types/wordSearch.types';

// Operaciones para sopas de letras
export const createWordSearchGame = async (gameInput: CreateWordSearchGameInput, userId: string) => {
  const gameId = uuidv4();
  const gameWithId: WordSearchGame = { 
    ...gameInput, 
    id: gameId,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    plays: 0
  };
  
  try {
    await set(ref(database, `wordSearchGames/${gameId}`), gameWithId);
   
    // Actualizar lista de juegos del usuario
    await set(ref(database, `users/${userId}/games/${gameId}`), true);
    
    // Actualizar estadísticas
    const userStatsRef = ref(database, `users/${userId}/stats`);
    const userStatsSnapshot = await get(userStatsRef);
    const userStats = userStatsSnapshot.val() || {};
    
    await update(userStatsRef, {
      gamesCreated: (userStats.gamesCreated || 0) + 1
    });
    
    return gameWithId;
  } catch (error) {
    console.error('Error al crear sopa de letras:', error);
    throw error;
  }
};

export const getWordSearchGame = async (gameId: string) => {
  try {
    const gameSnapshot = await get(ref(database, `wordSearchGames/${gameId}`));
    if (gameSnapshot.exists()) {
      return gameSnapshot.val() as WordSearchGame;
    } else {
      throw new Error('Juego no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener sopa de letras:', error);
    throw error;
  }
};

export const updateWordSearchGame = async (gameId: string, updates: Partial<WordSearchGame>) => {
  try {
    await update(ref(database, `wordSearchGames/${gameId}`), updates);
  } catch (error) {
    console.error('Error al actualizar sopa de letras:', error);
    throw error;
  }
};

export const deleteWordSearchGame = async (gameId: string, userId: string) => {
  try {
    // Eliminar juego
    await remove(ref(database, `wordSearchGames/${gameId}`));
    
    // Eliminar referencia en el usuario
    await remove(ref(database, `users/${userId}/games/${gameId}`));
  } catch (error) {
    console.error('Error al eliminar sopa de letras:', error);
    throw error;
  }
};

export const getRecentWordSearchGames = async (limit: number = 10) => {
  try {
    const recentGamesQuery = query(
      ref(database, 'wordSearchGames'),
      orderByChild('createdAt'),
      limitToLast(limit)
    );
    
    const snapshot = await get(recentGamesQuery);
    const games: WordSearchGame[] = [];
    
    snapshot.forEach((childSnapshot) => {
      games.push(childSnapshot.val() as WordSearchGame);
    });
    
    return games.reverse(); // Para tener los más recientes primero
  } catch (error) {
    console.error('Error al obtener juegos recientes:', error);
    throw error;
  }
};

export const recordGamePlay = async (gameId: string, userId: string, score: number, wordsFound: number) => {
  try {
    // Actualizar estadísticas del juego
    const gameRef = ref(database, `wordSearchGames/${gameId}`);
    const gameSnapshot = await get(gameRef);
    
    if (gameSnapshot.exists()) {
      const game = gameSnapshot.val();
      await update(gameRef, {
        plays: (game.plays || 0) + 1
      });
    }
    
    // Guardar resultado del juego
    const playId = uuidv4();
    await set(ref(database, `gamePlays/${playId}`), {
      gameId,
      userId,
      score,
      wordsFound,
      playedAt: new Date().toISOString()
    });
    
    // Actualizar estadísticas del usuario
    const userStatsRef = ref(database, `users/${userId}/stats`);
    const userStatsSnapshot = await get(userStatsRef);
    
    if (userStatsSnapshot.exists()) {
      const stats = userStatsSnapshot.val();
      await update(userStatsRef, {
        gamesPlayed: (stats.gamesPlayed || 0) + 1,
        wordsFound: (stats.wordsFound || 0) + wordsFound,
        bestScore: Math.max(stats.bestScore || 0, score)
      });
    }
    
    return playId;
  } catch (error) {
    console.error('Error al registrar partida:', error);
    throw error;
  }
};

// Operaciones para usuarios
export const getUserProfile = async (userId: string) => {
  try {
    const userSnapshot = await get(ref(database, `users/${userId}`));
    
    if (userSnapshot.exists()) {
      return userSnapshot.val() as UserProfile;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

export const updateUserStats = async (userId: string, stats: Partial<UserProfile['stats']>) => {
  try {
    await update(ref(database, `users/${userId}/stats`), stats);
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error);
    throw error;
  }
};