// src/utils/formatting.ts
/**
 * Formatea el tiempo en segundos a formato mm:ss
 */
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  /**
   * Formatea una fecha ISO a formato legible
   */
  export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  /**
   * Trunca un texto a una longitud máxima
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.slice(0, maxLength) + '...';
  };