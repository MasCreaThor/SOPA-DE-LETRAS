// src/utils/shareUtils.ts
/**
 * Generar URL compartible para un juego
 */
export const generateShareableLink = (gameId: string): string => {
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/jugar/` 
      : 'https://yourdomain.com/jugar/';
    
    return `${baseUrl}${gameId}`;
  };
  
  /**
   * Compartir juego a través del API Web Share si está disponible
   */
  export const shareGame = async (
    gameId: string, 
    title: string,
    fallbackCopyToClipboard: () => void
  ): Promise<boolean> => {
    const shareableLink = generateShareableLink(gameId);
    
    // Comprobar si la API Web Share está disponible
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sopa de Letras: ${title}`,
          text: '¡Juega a esta sopa de letras que he encontrado!',
          url: shareableLink
        });
        return true;
      } catch (error) {
        console.error('Error al compartir:', error);
        fallbackCopyToClipboard();
        return false;
      }
    } else {
      fallbackCopyToClipboard();
      return false;
    }
  };