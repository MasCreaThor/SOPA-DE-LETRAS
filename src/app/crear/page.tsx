// src/app/crear/page.tsx
"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCreator } from '@/hooks/useCreator';
import { createWordSearchGame } from '@/services/firebase/database.service';
import { WordForm } from '@/components/creator/WordForm';
import { WordList } from '@/components/creator/WordList';
import { GridEditor } from '@/components/creator/GridEditor';
import { SettingsPanel } from '@/components/creator/SettingsPanel';
import { TIME_LIMITS } from '@/utils/constants';

export default function CrearPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  
  // Hook personalizado para la lógica de creación
  const {
    title,
    setTitle,
    description,
    setDescription,
    wordClues,
    addWord,
    updateWord,
    removeWord,
    difficulty,
    setDifficulty,
    customSize,
    setCustomSize,
    generatedGrid,
    generateGrid,
    isValid,
    validationMessage,
    clearAll
  } = useCreator();
  
  // Generar cuadrícula
  const handleGenerateGrid = () => {
    if (wordClues.length === 0) {
      toast.error('Debes añadir al menos una palabra');
      return;
    }
    
    const success = generateGrid();
    
    if (success) {
      toast.success('¡Cuadrícula generada correctamente!');
    } else {
      toast.error(validationMessage || 'Error al generar la cuadrícula');
    }
  };
  
  // Guardar juego
  const handleSaveGame = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar el juego');
      return;
    }
    
    if (!title) {
      toast.error('Debes añadir un título');
      return;
    }
    
    if (!generatedGrid) {
      toast.error('Debes generar la cuadrícula antes de guardar');
      return;
    }
    
    try {
      setSaving(true);
      
      const newGame = {
        title,
        description,
        difficulty,
        grid: generatedGrid,
        wordClues,
        timeLimit: TIME_LIMITS[difficulty],
        isPublic: true,
        category: 'Otro' // Aquí podrías añadir un selector de categorías
      };
      
      const game = await createWordSearchGame(newGame, user.uid);
      
      toast.success('¡Juego guardado correctamente!');
      router.push(`/jugar/${game.id}`);
    } catch (error) {
      console.error('Error al guardar el juego:', error);
      toast.error('Error al guardar el juego');
    } finally {
      setSaving(false);
    }
  };
  
  // Verificar si el usuario está autenticado
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
          <p className="text-lg mb-6">Debes iniciar sesión para crear sopas de letras.</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Sopa de Letras</h1>
        <p className="mt-2 text-gray-600">
          Diseña tu propia sopa de letras personalizada para compartir con otros usuarios.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WordForm
            onAddWord={addWord}
            isDisabled={saving}
            validationMessage={validationMessage}
          />
          
          <WordList
            words={wordClues}
            onRemoveWord={removeWord}
            onEditWord={updateWord}
            readonly={saving}
          />
          
          <GridEditor
            grid={generatedGrid}
            onRegenerateGrid={handleGenerateGrid}
            previewMode={false}
          />
        </div>
        
        <div>
          <SettingsPanel
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onGenerateGrid={handleGenerateGrid}
            onSaveGame={handleSaveGame}
            isGenerateDisabled={wordClues.length === 0 || saving}
            isSaveDisabled={!generatedGrid || !title || saving}
            readonly={saving}
          />
        </div>
      </div>
    </div>
  );
}