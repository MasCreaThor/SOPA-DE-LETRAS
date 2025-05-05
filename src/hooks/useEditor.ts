// src/hooks/useEditor.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCreator } from '@/hooks/useCreator';
import { loadGameForEditing, updateGame, createUpdateObject, validateGameOwnership } from '@/services/wordSearch/edit.service';
import type { WordSearchGame, CreateWordSearchGameInput } from '@/types/wordSearch.types';

interface UseEditorProps {
  gameId: string;
  userId: string | undefined;
}

interface UseEditorReturn {
  originalGame: WordSearchGame | null;
  loading: boolean;
  error: string | null;
  creatorProps: ReturnType<typeof useCreator>;
  isOwner: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
}

export const useEditor = ({ gameId, userId }: UseEditorProps): UseEditorReturn => {
  const router = useRouter();
  const [originalGame, setOriginalGame] = useState<WordSearchGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Use the creator hook for editing functionality
  const creatorProps = useCreator();
  
  // Load the game for editing
  useEffect(() => {
    const loadGame = async () => {
      if (!gameId || !userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const game = await loadGameForEditing(gameId);
        setOriginalGame(game);
        
        // Check ownership
        const ownershipValid = validateGameOwnership(game, userId);
        setIsOwner(ownershipValid);
        
        if (!ownershipValid) {
          setError('No tienes permiso para editar esta sopa de letras');
          return;
        }
        
        // Initialize creator props with game data
        creatorProps.setTitle(game.title);
        creatorProps.setDescription(game.description || '');
        creatorProps.setDifficulty(game.difficulty);
        creatorProps.setWordClues(game.wordClues);
        
        // No need to regenerate grid, just use the existing one
        const { grid } = game;
        // @ts-ignore: Bypass the normal grid generation
        creatorProps.setGeneratedGrid(grid);
        
      } catch (error) {
        console.error('Error al cargar el juego para editar:', error);
        setError('Error al cargar el juego. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    loadGame();
  }, [gameId, userId]);
  
  // Check if there are changes
  const hasChanges = useCallback(() => {
    if (!originalGame) return false;
    
    return (
      creatorProps.title !== originalGame.title ||
      creatorProps.description !== (originalGame.description || '') ||
      creatorProps.difficulty !== originalGame.difficulty ||
      creatorProps.wordClues.length !== originalGame.wordClues.length ||
      creatorProps.generatedGrid !== originalGame.grid
    );
  }, [originalGame, creatorProps]);
  
  // Save changes
  const saveChanges = async (): Promise<boolean> => {
    if (!originalGame || !isOwner) {
      toast.error('No puedes editar esta sopa de letras');
      return false;
    }
    
    try {
      setIsSaving(true);
      
      // Prepare update data
      const updateData: Partial<CreateWordSearchGameInput> = {
        title: creatorProps.title,
        description: creatorProps.description,
        difficulty: creatorProps.difficulty,
        wordClues: creatorProps.wordClues,
      };
      
      // If grid was regenerated, include it
      if (creatorProps.generatedGrid) {
        updateData.grid = creatorProps.generatedGrid;
      }
      
      // Create optimized update object
      const updateObject = createUpdateObject(updateData, originalGame);
      
      // Update the game
      await updateGame(gameId, updateObject);
      
      // Update original game to reflect changes
      setOriginalGame(prev => prev ? { ...prev, ...updateObject } : null);
      
      toast.success('Sopa de letras actualizada correctamente');
      return true;
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar los cambios');
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Discard changes
  const discardChanges = () => {
    if (!originalGame) return;
    
    creatorProps.setTitle(originalGame.title);
    creatorProps.setDescription(originalGame.description || '');
    creatorProps.setDifficulty(originalGame.difficulty);
    creatorProps.setWordClues(originalGame.wordClues);
    
    // @ts-ignore: Bypass the normal grid generation
    creatorProps.setGeneratedGrid(originalGame.grid);
    
    toast.success('Cambios descartados');
  };
  
  return {
    originalGame,
    loading,
    error,
    creatorProps,
    isOwner,
    hasChanges: hasChanges(),
    isSaving,
    saveChanges,
    discardChanges
  };
};