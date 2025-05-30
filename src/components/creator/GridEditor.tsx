// src/components/creator/GridEditor.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { WordSearchGrid } from '@/components/game/WordSearchGrid';
import { Button } from '@/components/common/Button';
import type { GridCell, WordSearchGrid as WordSearchGridType } from '@/types/wordSearch.types';

interface GridEditorProps {
  grid: WordSearchGridType | null;
  onRegenerateGrid: () => void;
  previewMode?: boolean;
  wordClues?: string[]; // Añadido para poder resaltar palabras específicas
}

export const GridEditor: React.FC<GridEditorProps> = ({
  grid,
  onRegenerateGrid,
  previewMode = false,
  wordClues = []
}) => {
  // Estado para manejar la selección de celdas (solo para UI)
  const [selectedCells, setSelectedCells] = useState<GridCell[]>([]);
  const [displayGrid, setDisplayGrid] = useState<GridCell[][]>([]);
  
  // Función para simular la selección de celdas (para vista previa)
  const handleCellSelect = (cell: GridCell) => {
    if (previewMode) return; // No permitir selección en modo vista previa
    
    if (selectedCells.some(c => c.row === cell.row && c.col === cell.col)) {
      // Si ya está seleccionada, deseleccionarla
      setSelectedCells(prev => prev.filter(c => !(c.row === cell.row && c.col === cell.col)));
    } else {
      // Añadir a la selección
      setSelectedCells(prev => [...prev, cell]);
    }
  };
  
  // Función para limpiar selección
  const clearSelection = () => {
    setSelectedCells([]);
  };

  // Crear una versión de la cuadrícula que resalte palabras
  useEffect(() => {
    if (!grid) {
      setDisplayGrid([]);
      return;
    }

    // Clonar la grid original
    const newGrid = grid.grid.map(row => 
      row.map(cell => ({ ...cell, isHighlighted: false }))
    );

    // Resaltar las celdas que son parte de palabras
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        const cell = newGrid[row][col];
        // Si la celda pertenece a una palabra y no estamos en modo preview, resaltarla
        if (cell.isPartOfWord && !previewMode) {
          newGrid[row][col].isHighlighted = true;
        }
      }
    }

    setDisplayGrid(newGrid);
  }, [grid, previewMode]);
  
  // Si no hay cuadrícula, mostrar mensaje
  if (!grid) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-700 mb-4">
          No hay cuadrícula generada
        </h3>
        <p className="text-gray-600 mb-6">
          Añade palabras y descripciones, y se generará automáticamente la sopa de letras.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Vista previa de la cuadrícula</h3>
        {!previewMode && (
          <p className="text-sm text-gray-600 mb-4">
            A continuación se muestra la cuadrícula generada con las palabras resaltadas. Si no estás satisfecho con la disposición, puedes regenerarla.
          </p>
        )}
      </div>
      
      <div className="flex justify-center mb-4">
        <WordSearchGrid 
          grid={displayGrid.length > 0 ? displayGrid : grid.grid} 
          onCellSelect={handleCellSelect}
          onSelectionSubmit={clearSelection}
          onSelectionClear={clearSelection}
          readonly={previewMode}
          highlightWords={!previewMode} // Nuevo prop para indicar si resaltar palabras
        />
      </div>
      
      {!previewMode && (
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            onClick={onRegenerateGrid}
            leftIcon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
          >
            Regenerar Cuadrícula
          </Button>
        </div>
      )}
    </div>
  );
};