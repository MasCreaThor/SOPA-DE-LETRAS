// src/app/jugar/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { getRecentWordSearchGames } from '@/services/firebase/database.service';
import { formatDate, truncateText } from '@/utils/formatting';
import type { WordSearchGame } from '@/types/wordSearch.types';

export default function JugarPage() {
  const [games, setGames] = useState<WordSearchGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');

  // Cargar juegos recientes
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const recentGames = await getRecentWordSearchGames(20);
        setGames(recentGames);
        setError(null);
      } catch (err) {
        console.error('Error al cargar juegos:', err);
        setError('Error al cargar los juegos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // Filtrar juegos por categoría y dificultad
  const filteredGames = games.filter(game => {
    const categoryMatch = activeCategory === 'all' || game.category === activeCategory;
    const difficultyMatch = activeDifficulty === 'all' || game.difficulty === activeDifficulty;
    return categoryMatch && difficultyMatch;
  });

  // Obtener categorías únicas de los juegos disponibles
  const categories = ['all', ...new Set(games.map(game => game.category || 'other'))];

  // Mapear dificultad a texto y color
  const difficultyMap = {
    easy: { text: 'Fácil', color: 'bg-green-100 text-green-800' },
    medium: { text: 'Medio', color: 'bg-yellow-100 text-yellow-800' },
    hard: { text: 'Difícil', color: 'bg-red-100 text-red-800' }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jugar Sopa de Letras</h1>
          <p className="mt-2 text-gray-600">
            Explora las sopas de letras creadas por nuestra comunidad o crea la tuya propia.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-medium mb-2">Filtrar por categoría</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === 'all' ? 'Todas' : category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Filtrar por dificultad</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeDifficulty === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveDifficulty('all')}
                >
                  Todas
                </button>
                {Object.entries(difficultyMap).map(([difficulty, { text }]) => (
                  <button
                    key={difficulty}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeDifficulty === difficulty
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveDifficulty(difficulty)}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Games List */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Sopas de Letras</h2>
            <Link href="/crear">
              <Button variant="primary">
                Crear Nueva
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Cargando juegos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-center">
              {error}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No se encontraron sopas de letras con estos filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.map((game) => {
                const { text: difficultyText, color: difficultyColor } = 
                  difficultyMap[game.difficulty as keyof typeof difficultyMap];
                
                return (
                  <div key={game.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{game.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor}`}>
                          {difficultyText}
                        </span>
                      </div>
                      
                      {game.description && (
                        <p className="mt-2 text-gray-600 text-sm">
                          {truncateText(game.description, 100)}
                        </p>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span>{game.wordClues.length} palabras</span>
                          <span className="mx-2">•</span>
                          <span>{game.plays || 0} jugadas</span>
                        </div>
                        <div>
                          {formatDate(game.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Por: {game.createdBy}
                      </span>
                      <Link href={`/jugar/${game.id}`}>
                        <Button variant="primary" size="sm">
                          Jugar
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}