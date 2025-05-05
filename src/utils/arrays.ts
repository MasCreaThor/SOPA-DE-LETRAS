 // src/utils/arrays.ts
  /**
   * Barajar un array (algoritmo Fisher-Yates)
   */
  export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    return newArray;
  };
  
  /**
   * Dividir un array en trozos (chunks) de tamaño especificado
   */
  export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    
    return chunks;
  };
  
  /**
   * Filtrar valores únicos de un array
   */
  export const uniqueValues = <T>(array: T[]): T[] => {
    return [...new Set(array)];
  };
