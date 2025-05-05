// src/components/profile/GameActionButtons.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import type { WordSearchGame } from '@/types/wordSearch.types';

interface GameActionButtonsProps {
  game: WordSearchGame;
  onDelete?: (gameId: string) => void;
  isDeleting?: boolean;
}

const GameActionButtons: React.FC<GameActionButtonsProps> = ({ 
  game, 
  onDelete,
  isDeleting = false
}) => {
  return (
    <div className="flex space-x-2 justify-end">
      <Link href={`/jugar/${game.id}`}>
        <Button variant="primary" size="sm">
          Jugar
        </Button>
      </Link>
      
      <Link href={`/editar/${game.id}`}>
        <Button variant="info" size="sm">
          Editar
        </Button>
      </Link>
      
      {onDelete && (
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => onDelete(game.id)}
          isLoading={isDeleting}
        >
          Eliminar
        </Button>
      )}
    </div>
  );
};

export default GameActionButtons;