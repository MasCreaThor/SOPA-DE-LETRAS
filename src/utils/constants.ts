 // src/utils/constants.ts
  /**
   * Constantes para tiempos de juego (en segundos)
   */
  export const TIME_LIMITS = {
    easy: 5 * 60, // 5 minutos
    medium: 4 * 60, // 4 minutos
    hard: 3 * 60 // 3 minutos
  };
  
  /**
   * Tamaños predefinidos de cuadrícula
   */
  export const GRID_SIZES = {
    small: { rows: 10, cols: 10 },
    medium: { rows: 15, cols: 15 },
    large: { rows: 20, cols: 20 }
  };
  
  /**
   * Categorías de sopa de letras
   */
  export const CATEGORIES = [
    'Animales',
    'Países',
    'Deportes',
    'Frutas y Verduras',
    'Profesiones',
    'Ciencia',
    'Tecnología',
    'Historia',
    'Películas',
    'Música',
    'Literatura',
    'Otro'
  ];
  
  /**
   * Constantes para puntuación
   */
  export const SCORING = {
    basePointsPerWord: {
      easy: 10,
      medium: 15,
      hard: 20
    },
    timeBonus: {
      easy: 0.3, // 30% extra por tiempo restante
      medium: 0.4, // 40% extra por tiempo restante
      hard: 0.5 // 50% extra por tiempo restante
    },
    completionBonus: {
      easy: 3, // 3 puntos extra por palabra encontrada
      medium: 5, // 5 puntos extra por palabra encontrada
      hard: 8 // 8 puntos extra por palabra encontrada
    }
  };
  