// src/components/creator/SettingsPanel.tsx
"use client";
import React from 'react';
import { Button } from '@/components/common/Button';

interface SettingsPanelProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onGenerateGrid: () => void;
  onSaveGame: () => void;
  isGenerateDisabled?: boolean;
  isSaveDisabled?: boolean;
  readonly?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  difficulty,
  setDifficulty,
  onGenerateGrid,
  onSaveGame,
  isGenerateDisabled = false,
  isSaveDisabled = false,
  readonly = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Configuración</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Título de la sopa de letras"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={readonly}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Breve descripción o instrucciones"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={readonly}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dificultad
          </label>
          <div className="flex space-x-2">
            {(['easy', 'medium', 'hard'] as const).map((level) => {
              const isSelected = difficulty === level;
              const labelMap = {
                easy: 'Fácil',
                medium: 'Medio',
                hard: 'Difícil'
              };
              
              const colorMap = {
                easy: isSelected 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200',
                medium: isSelected 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                hard: isSelected 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              };
              
              return (
                <button
                  key={level}
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${colorMap[level]}`}
                  onClick={() => setDifficulty(level)}
                  disabled={readonly}
                >
                  {labelMap[level]}
                </button>
              );
            })}
          </div>
        </div>
        
        {!readonly && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <Button
              variant="primary"
              fullWidth
              onClick={onGenerateGrid}
              disabled={isGenerateDisabled}
            >
              Generar Cuadrícula
            </Button>
            
            <Button
              variant="success"
              fullWidth
              onClick={onSaveGame}
              disabled={isSaveDisabled}
            >
              Guardar Sopa de Letras
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};