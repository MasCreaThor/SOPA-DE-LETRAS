// src/components/game/WordSearchGrid.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import type { GridCell } from '@/types/wordSearch.types';

interface WordSearchGridProps {
  grid: GridCell[][];
  onCellSelect: (cell: GridCell) => void;
  onSelectionSubmit: () => void;
  onSelectionClear: () => void;
  isGameOver?: boolean;
  readonly?: boolean;
  highlightWords?: boolean; // Nueva propiedad para destacar palabras durante la creación
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  grid,
  onCellSelect,
  onSelectionSubmit,
  onSelectionClear,
  isGameOver = false,
  readonly = false,
  highlightWords = false // Por defecto no se destacan
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartCell, setTouchStartCell] = useState<GridCell | null>(null);
  
  // Función para manejar el evento de mouse down
  const handleMouseDown = (cell: GridCell) => {
    if (readonly || isGameOver) return;
    setIsDragging(true);
    onCellSelect(cell);
  };
  
  // Función para manejar el evento de mouse enter durante el arrastre
  const handleMouseEnter = (cell: GridCell) => {
    if (readonly || isGameOver || !isDragging) return;
    onCellSelect(cell);
  };
  
  // Función para manejar el evento de mouse up
  const handleMouseUp = () => {
    if (readonly || isGameOver) return;
    if (isDragging) {
      onSelectionSubmit();
      setIsDragging(false);
    }
  };
  
  // Función para manejar el evento de touch start
  const handleTouchStart = (cell: GridCell) => {
    if (readonly || isGameOver) return;
    setTouchStartCell(cell);
    onCellSelect(cell);
  };
  
  // Función para manejar el evento de touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (readonly || isGameOver || !touchStartCell) return;
    
    // Obtener las coordenadas del touch
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Verificar si el elemento es una celda y obtener sus datos
    if (element && element.hasAttribute('data-cell')) {
      const cellData = element.getAttribute('data-cell');
      if (cellData) {
        const [row, col] = cellData.split('-').map(Number);
        const cell = grid[row][col];
        onCellSelect(cell);
      }
    }
  };
  
  // Función para manejar el evento de touch end
  const handleTouchEnd = () => {
    if (readonly || isGameOver) return;
    if (touchStartCell) {
      onSelectionSubmit();
      setTouchStartCell(null);
    }
  };
  
  // Función para manejar el evento touch cancel
  const handleTouchCancel = () => {
    if (readonly || isGameOver) return;
    onSelectionClear();
    setTouchStartCell(null);
  };
  
  // Efecto para manejar el evento de mouse up en el documento
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        onSelectionSubmit();
        setIsDragging(false);
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, onSelectionSubmit]);
  
  // Determinar el tamaño de las celdas basado en el tamaño de la cuadrícula
  const getCellSize = () => {
    const gridSize = grid.length;
    if (gridSize <= 10) return 'w-10 h-10 text-xl';
    if (gridSize <= 15) return 'w-8 h-8 text-lg';
    return 'w-6 h-6 text-sm';
  };
  
  const cellSize = getCellSize();
  
  return (
    <div 
      className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4"
      onMouseLeave={() => {
        if (isDragging) {
          onSelectionSubmit();
          setIsDragging(false);
        }
      }}
      onTouchCancel={handleTouchCancel}
    >
      <div className="grid gap-1 bg-gray-100 p-2 rounded-lg">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-1">
            {row.map((cell, colIndex) => {
              // Determinar clase según estado de la celda
              let cellClass = `
                ${cellSize} 
                flex items-center justify-center 
                rounded-md font-bold cursor-pointer 
                select-none touch-none
              `;
              
              if (cell.isSelected) {
                cellClass += ' bg-blue-500 text-white';
              } else if (cell.isHighlighted) {
                cellClass += ' bg-green-500 text-white';
              } else if (highlightWords && cell.isPartOfWord) {
                // Si estamos en modo creación y la celda es parte de una palabra, aplicar un color especial
                cellClass += ' bg-yellow-200 text-gray-800';
              } else {
                cellClass += ' bg-white hover:bg-gray-200';
              }
              
              if (readonly) {
                cellClass += ' cursor-default';
              }
              
              if (isGameOver) {
                if (cell.isPartOfWord && !cell.isHighlighted) {
                  cellClass += ' bg-yellow-200'; // Palabras no encontradas
                }
              }
              
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={cellClass}
                  onMouseDown={() => handleMouseDown(cell)}
                  onMouseEnter={() => handleMouseEnter(cell)}
                  onMouseUp={handleMouseUp}
                  onTouchStart={() => handleTouchStart(cell)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  data-cell={`${rowIndex}-${colIndex}`}
                >
                  {cell.letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};