// src/app/editar/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useEditor } from '@/hooks/useEditor';
import { WordForm } from '@/components/creator/WordForm';
import { WordList } from '@/components/creator/WordList';
import { GridEditor } from '@/components/creator/GridEditor';
import { SettingsPanel } from '@/components/creator/SettingsPanel';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export default function EditarPage() {
  const { id } = useParams();
  const gameId = id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Use the editor hook
  const {
    originalGame,
    loading,
    error,
    creatorProps,
    isOwner,
    hasChanges,
    isSaving,
    saveChanges,
    discardChanges
  } = useEditor({
    gameId,
    userId: user?.uid
  });
  
  // Destructure creator props
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
    generatedGrid,
    generateGrid,
    isValid,
    validationMessage
  } = creatorProps;
  
  // Handle discarding changes
  const handleDiscardChanges = () => {
    setIsConfirmModalOpen(false);
    discardChanges();
  };
  
  // Handle saving changes
  const handleSaveChanges = async () => {
    const success = await saveChanges();
    if (success) {
      router.push(`/jugar/${gameId}`);
    }
  };
  
  // Handle regenerating grid
  const handleRegenerateGrid = () => {
    if (wordClues.length === 0) {
      toast.error('Debes añadir al menos una palabra');
      return;
    }
    
    const success = generateGrid();
    
    if (success) {
      toast.success('¡Cuadrícula regenerada correctamente!');
    } else {
      toast.error(validationMessage || 'Error al generar la cuadrícula');
    }
  };
  
  // Verify authorization
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
          <p className="text-lg mb-6">Debes iniciar sesión para editar sopas de letras.</p>
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
  
  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-xl text-gray-600">Cargando sopa de letras...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !originalGame) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg mb-6">{error || 'No se pudo cargar la sopa de letras.'}</p>
          <button
            onClick={() => router.push('/perfil')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver al Perfil
          </button>
        </div>
      </div>
    );
  }
  
  // Show unauthorized state
  if (!isOwner) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-lg mb-6">No tienes permiso para editar esta sopa de letras.</p>
          <button
            onClick={() => router.push('/jugar/' + gameId)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Jugar Sopa de Letras
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Sopa de Letras</h1>
          <p className="mt-2 text-gray-600">
            Modifica tu sopa de letras y guarda los cambios.
          </p>
        </div>
        
        <div className="flex space-x-3">
          {hasChanges && (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={isSaving}
              >
                Descartar Cambios
              </Button>
              
              <Button
                variant="primary"
                onClick={handleSaveChanges}
                isLoading={isSaving}
              >
                Guardar Cambios
              </Button>
            </>
          )}
          
          <Button
            variant="info"
            onClick={() => router.push('/jugar/' + gameId)}
          >
            Cancelar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WordForm
            onAddWord={addWord}
            isDisabled={isSaving}
            validationMessage={validationMessage}
          />
          
          <WordList
            words={wordClues}
            onRemoveWord={removeWord}
            onEditWord={updateWord}
            readonly={isSaving}
          />
          
          <GridEditor
            grid={generatedGrid}
            onRegenerateGrid={handleRegenerateGrid}
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
            onGenerateGrid={handleRegenerateGrid}
            onSaveGame={handleSaveChanges}
            isGenerateDisabled={wordClues.length === 0 || isSaving}
            isSaveDisabled={!generatedGrid || !title || isSaving || !hasChanges}
            readonly={isSaving}
          />
          
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Información Original</h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">ID:</span> {originalGame.id}
              </div>
              <div>
                <span className="font-medium">Fecha de creación:</span> {new Date(originalGame.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Veces jugado:</span> {originalGame.plays}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Discard Changes Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Descartar cambios"
      >
        <div className="text-center">
          <p className="mb-4">
            ¿Estás seguro de que deseas descartar todos los cambios realizados? Esta acción no se puede deshacer.
          </p>
          
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </Button>
            
            <Button
              variant="danger"
              onClick={handleDiscardChanges}
            >
              Descartar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}